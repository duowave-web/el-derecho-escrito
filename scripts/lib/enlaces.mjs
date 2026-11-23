/* ==========================================================================
   Enlaces dentro del texto de un artículo.

   El HTML de los bloques llega del articulo.json —lo escribe n8n a partir de
   los hipervínculos del Word, o se edita a mano— y aquí se deja listo para
   publicar. Pasa por TODO el HTML del artículo: entradilla, párrafos, citas y
   sus fuentes, listas y referencias.

   Tres cosas:

     1. Las URL escritas a mano en el texto («véase https://www.boe.es/…») se
        convierten en enlaces. Las que ya van dentro de un <a> no se tocan.

     2. Los enlaces al PROPIO SITIO se reescriben como rutas relativas, que es
        la convención de todo el sitio. Da igual con qué dirección los escriba
        el autor: el dominio, la de GitHub Pages o la de una vista previa.

          https://elderechoescrito.es/articulos/<slug>/          ->  ../<slug>/
          https://duowave-web.github.io/el-derecho-escrito/sobre/ ->  ../../sobre/
          …/el-derecho-escrito-previews/pr-12/articulos/<slug>/  ->  ../<slug>/
          https://raw.githack.com/duowave-web/el-derecho-escrito/<sha>/articulos/<slug>/index.html
                                                                ->  ../<slug>/

        Se abren en la misma pestaña.

     3. Los EXTERNOS llevan target="_blank" rel="noopener noreferrer".

   ⚠️ UN ENLACE INTERNO A UN SLUG QUE NO EXISTE ES UN AVISO, NO UN ERROR. El
   artículo se publica igual —el enlace dará 404 hasta que exista el destino—
   y el aviso sale en el log y en el comentario del PR. Es la misma frontera
   que las referencias: lo que rompe el sistema para el build; lo que es una
   decisión del autor, avisa.

   ⚠️ DEL <a> QUE LLEGA SOLO SE CONSERVA EL href. Cualquier otro atributo
   —estilos de Google Docs, un target puesto a mano— se descarta y se vuelve a
   escribir aquí. Así un enlace no puede salir de dos formas según quién lo
   haya escrito.

   ⚠️ SOLO http, https y mailto. Un href con otro esquema —javascript:,
   data:…— se queda en texto: es la única forma segura de tratar HTML que no
   ha escrito un humano de este proyecto.

   Determinista y sin red: no se comprueba que un enlace externo responda.
   ========================================================================== */

/* Prefijos de ruta bajo los que vive el sitio en cada host. El orden importa:
   el de previews va antes porque «el-derecho-escrito» es prefijo suyo. */
const PROPIOS = [
  { host: /^(www\.)?elderechoescrito\.es$/i, ruta: /^\/?/ },
  { host: /^duowave-web\.github\.io$/i, ruta: /^\/el-derecho-escrito-previews\/pr-\d+\// },
  { host: /^duowave-web\.github\.io$/i, ruta: /^\/el-derecho-escrito\// },
  { host: /^(raw|rawcdn)\.githack\.com$/i, ruta: /^\/duowave-web\/el-derecho-escrito\/[^/]+\// },
];

const decodificarAttr = (s) =>
  String(s).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const escaparAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Devuelve la ruta dentro del sitio («articulos/x/», «sobre/», «») o null si
   la URL no es del sitio. */
function rutaPropia(url) {
  for (const p of PROPIOS) {
    if (!p.host.test(url.hostname)) continue;
    const m = url.pathname.match(p.ruta);
    if (m) return url.pathname.slice(m[0].length).replace(/^\/+/, '');
  }
  return null;
}

/* El artículo vive en /articulos/<slug>/, así que a otro artículo se llega con
   ../<slug>/ y a cualquier otra página con ../../<ruta>. Es el mismo prefijo
   que usa el resto del sitio para esa profundidad. */
function relativa(ruta, resto) {
  const limpia = ruta.replace(/(^|\/)index\.html$/, '$1');
  const m = limpia.match(/^articulos\/([^/]+)(\/.*)?$/);
  if (m) return { href: `../${m[1]}${m[2] || '/'}${resto}`, slug: m[1] };
  return { href: `../../${limpia}${resto}`, slug: null };
}

/* Clasifica un href y devuelve cómo publicarlo. */
function clasificar(hrefBruto) {
  const href = decodificarAttr(hrefBruto).trim();
  if (!href) return null;

  // Ancla dentro del propio artículo, o ruta ya relativa: se respeta tal cual.
  if (href.startsWith('#')) return { href, externo: false, slug: null };
  const rel = href.match(/^\.\.\/([^/#?]+)\/?/);
  if (rel && !href.startsWith('../../')) return { href, externo: false, slug: rel[1] };
  if (href.startsWith('../') || href.startsWith('./')) return { href, externo: false, slug: null };

  if (/^mailto:/i.test(href)) return { href, externo: false, slug: null, correo: true };

  let url;
  try {
    url = new URL(/^www\./i.test(href) ? `https://${href}` : href);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;

  const ruta = rutaPropia(url);
  if (ruta !== null) {
    const { href: interno, slug } = relativa(ruta, url.search + url.hash);
    return { href: interno, externo: false, slug };
  }
  return { href: url.href, externo: true, slug: null };
}

function etiquetaA(c) {
  const extra = c.externo ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${escaparAttr(c.href)}"${extra}>`;
}

/* URL escritas a mano. Se para en espacios, etiquetas, comillas y comillas
   angulares; la puntuación final («…/ley.», «(https://x.es)») se devuelve al
   texto, salvo un paréntesis de cierre que tenga su apertura dentro de la URL
   —las de Wikipedia los llevan—. */
const URL_SUELTA = /(?:https?:\/\/|www\.|(?:www\.)?elderechoescrito\.es\/)[^\s<>"«»“”]+/gi;

function recortarFinal(u) {
  let url = u, cola = '';
  for (;;) {
    const ult = url.slice(-1);
    if (/[.,;:!?'’”»\]]/.test(ult)) { cola = ult + cola; url = url.slice(0, -1); continue; }
    if (ult === ')' && (url.match(/\(/g) || []).length < (url.match(/\)/g) || []).length) {
      cola = ult + cola; url = url.slice(0, -1); continue;
    }
    // Una entidad cortada al final («&amp;» de una frase) tampoco es de la URL.
    const ent = url.match(/&[a-z]+;?$/i);
    if (ent && !/&amp;$/i.test(url)) { cola = ent[0] + cola; url = url.slice(0, -ent[0].length); continue; }
    return [url, cola];
  }
}

function autoenlazar(texto) {
  return texto.replace(URL_SUELTA, (bruto) => {
    const [url, cola] = recortarFinal(bruto);
    const destino = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return `<a href="${escaparAttr(decodificarAttr(destino))}">${url}</a>${cola}`;
  });
}

/* Recorre un fragmento de HTML, enlaza las URL sueltas fuera de los <a> y
   reescribe los <a> que haya. `alAvisar(mensaje)` recibe los avisos. */
export function resolverEnlaces(html, { slugs, alAvisar = () => {} } = {}) {
  if (!html) return html;
  const trozos = String(html).split(/(<[^>]+>)/);

  // 1 · URL sueltas, solo en texto que no esté dentro de un enlace.
  let dentro = 0;
  for (let i = 0; i < trozos.length; i++) {
    const t = trozos[i];
    if (/^<a\b/i.test(t)) dentro++;
    else if (/^<\/a>/i.test(t)) dentro = Math.max(0, dentro - 1);
    else if (!t.startsWith('<') && !dentro && t) trozos[i] = autoenlazar(t);
  }

  // 2 · Cada <a>: se reescribe, o se quita si su href no sirve.
  const salida = trozos.join('').split(/(<[^>]+>)/);
  const abiertos = [];
  for (let i = 0; i < salida.length; i++) {
    const t = salida[i];
    if (/^<a\b/i.test(t)) {
      const m = t.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)')/i);
      const c = m ? clasificar(m[2] ?? m[3]) : null;
      if (!c) {
        alAvisar(`un enlace sin dirección válida (${m ? (m[2] ?? m[3]) : 'sin href'}) se ha dejado como texto`);
        salida[i] = '';
        abiertos.push(false);
        continue;
      }
      if (c.slug && slugs && !slugs.has(c.slug)) {
        const texto = textoHasta(salida, i);
        alAvisar(`el enlace «${texto}» apunta a /articulos/${c.slug}/, que no existe. Dará 404 hasta que se publique`);
      }
      salida[i] = etiquetaA(c);
      abiertos.push(true);
    } else if (/^<\/a>/i.test(t)) {
      salida[i] = abiertos.pop() === false ? '' : t;
    }
  }
  return salida.join('');
}

/* El texto visible de un enlace, para el aviso. */
function textoHasta(trozos, i) {
  let txt = '';
  for (let j = i + 1; j < trozos.length && !/^<\/a>/i.test(trozos[j]); j++) {
    if (!trozos[j].startsWith('<')) txt += trozos[j];
  }
  return txt.replace(/&[a-z]+;/gi, (e) => ({ '&laquo;': '«', '&raquo;': '»', '&amp;': '&' }[e] || e)).trim();
}

/* Aplica resolverEnlaces a todos los campos HTML de un artículo. Devuelve una
   copia: el objeto de entrada no se modifica. */
export function enlazarArticulo(art, opciones) {
  const r = (h) => resolverEnlaces(h, opciones);
  return {
    ...art,
    entradilla: r(art.entradilla),
    secciones: (art.secciones || []).map((s) => ({
      ...s,
      bloques: (s.bloques || []).map((b) => ({
        ...b,
        ...(b.html !== undefined ? { html: r(b.html) } : {}),
        ...(b.fuente_html !== undefined ? { fuente_html: r(b.fuente_html) } : {}),
        ...(b.items ? { items: b.items.map((it) => ({ ...it, html: r(it.html) })) } : {}),
      })),
    })),
    referencias: (art.referencias || []).map((g) => ({
      ...g,
      items: (g.items || []).map((it) => ({ ...it, html: r(it.html) })),
    })),
  };
}
