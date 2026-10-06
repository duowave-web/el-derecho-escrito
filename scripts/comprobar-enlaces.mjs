/* ==========================================================================
   Comprueba que TODO enlace de filtro que se genera selecciona algo de verdad.

   O sea: que cada `?etiquetas=…` y cada `?categoria=…` del HTML publicado
   corresponde a una etiqueta o una categoría que el listado conoce, según la
   MISMA función de comparación que usa el navegador.

   ⚠️ ESTO EXISTE POR UN FALLO REAL Y SILENCIOSO. Las etiquetas del lateral
   enlazaban a `?etiquetas=requisito-de-procedibilidad` mientras el listado
   construía sus claves con otra normalización que dejaba
   «requisito de procedibilidad». No casaba ninguna, así que el filtro no
   marcaba nada y se veía la lista entera — como si no se hubiera pulsado.

   No daba ningún error. No lo detectaba el build, ni el gate de idempotencia,
   ni la vista previa: el enlace existía, la página respondía 200 y el listado
   se pintaba. Solo se veía comparando el resultado con lo que uno esperaba.

   Se comprueba contra el HTML GENERADO y no contra los JSON de origen, a
   propósito: lo que puede divergir es lo que se publica, no lo que se escribe.
   ========================================================================== */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { clave, CATEGORIAS } from './lib/plantilla.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Saca los valores de un atributo de todo el documento. Basta una expresión
   regular: el HTML lo escribimos nosotros y estos atributos no llevan comillas
   dentro. Un parser entero seria una dependencia nueva para esto. */
function atributos(html, nombre) {
  const re = new RegExp(`${nombre}="([^"]*)"`, 'g');
  const fuera = [];
  let m;
  while ((m = re.exec(html)) !== null) fuera.push(m[1]);
  return fuera;
}

/* ⚠️ LOS COMENTARIOS HTML SE QUITAN ANTES DE BUSCAR, y no es una comodidad: en
   `index.html` hay una plantilla de tarjeta comentada con marcadores literales
   —`?categoria=CLAVE`, con el texto «CATEGORÍA»— que está ahí a propósito para
   quien tenga que escribir una tarjeta a mano.

   La primera versión de esta comprobación la marcó como enlace roto. Y tenía
   razón en lo literal: esa cadena no corresponde a ninguna categoría. Pero no
   es un enlace —nadie lo puede pulsar— así que marcarlo habría obligado a
   elegir entre romper el build o quitar un comentario útil. */
function sinComentarios(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

/* Los enlaces de filtro, con su parámetro y su valor ya descodificado. */
function enlacesDeFiltro(htmlCrudo) {
  const html = sinComentarios(htmlCrudo);
  const re = /href="[^"]*\?(etiquetas|categoria)=([^"&]*)"/g;
  const fuera = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    let valor;
    try { valor = decodeURIComponent(m[2]); } catch { valor = m[2]; }
    fuera.push({ parametro: m[1], valor, href: m[0].slice(6, -1) });
  }
  return fuera;
}

export async function comprobarEnlaces() {
  const listado = path.join(RAIZ, 'articulos', 'index.html');
  let html;
  try {
    html = await readFile(listado, 'utf8');
  } catch {
    return { revisados: 0, nota: 'No hay articulos/index.html: nada que comprobar.' };
  }

  /* El universo de etiquetas es el mismo del que el navegador construye su
     desplegable: los data-etiquetas de las tarjetas. Si una etiqueta no está
     aquí, el filtro no puede seleccionarla por mucho que el enlace exista. */
  const etiquetas = new Set();
  for (const lista of atributos(html, 'data-etiquetas')) {
    for (const t of lista.split(',')) {
      const k = clave(t);
      if (k) etiquetas.add(k);
    }
  }

  /* Las categorías salen de la tabla, que es de donde salen también los botones
     del filtro. Se añaden las de las tarjetas por si alguna se colara sin estar
     en la tabla: entonces el fallo sería otro y se quiere ver tal cual. */
  const categorias = new Set(Object.keys(CATEGORIAS).map(clave));
  for (const c of atributos(html, 'data-categoria')) {
    const k = clave(c);
    if (k) categorias.add(k);
  }

  /* Qué archivos se revisan: el listado, la portada y cada artículo. Son los
     tres sitios donde la plantilla escribe enlaces de filtro. */
  const archivos = [
    ['articulos/index.html', listado],
    ['index.html', path.join(RAIZ, 'index.html')],
  ];

  let dirs = [];
  try {
    dirs = (await readdir(path.join(RAIZ, 'articulos'), { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch { /* sin artículos */ }

  for (const d of dirs) {
    archivos.push([`articulos/${d}/index.html`, path.join(RAIZ, 'articulos', d, 'index.html')]);
  }

  const fallos = [];
  let revisados = 0;

  for (const [etiqueta, ruta] of archivos) {
    let contenido;
    try { contenido = await readFile(ruta, 'utf8'); } catch { continue; }

    for (const e of enlacesDeFiltro(contenido)) {
      revisados++;
      const universo = e.parametro === 'etiquetas' ? etiquetas : categorias;

      /* El valor puede traer varias separadas por coma: se comprueban todas. */
      for (const bruto of e.valor.split(',')) {
        if (!bruto.trim()) continue;
        const k = clave(bruto);
        if (!universo.has(k)) {
          fallos.push({
            archivo: etiqueta,
            href: e.href,
            parametro: e.parametro,
            valor: bruto,
            esperaba: k,
            conocidas: [...universo].sort(),
          });
        }
      }
    }
  }

  if (fallos.length) {
    const detalle = fallos
      .map(
        (f) =>
          `    ${f.archivo}\n` +
          `      enlace    ${f.href}\n` +
          `      valor     «${f.valor}»\n` +
          `      clave     «${f.esperaba}»  ← no existe en el listado\n` +
          `      conocidas ${f.conocidas.join(', ') || '(ninguna)'}`
      )
      .join('\n\n');

    throw new Error(
      `Hay ${fallos.length} enlace(s) de filtro que no seleccionan nada:\n\n${detalle}\n\n` +
      '  Un enlace así no da error al pulsarlo: el listado se abre entero, como\n' +
      '  si no se hubiera filtrado. Revisa que la etiqueta o la categoría exista\n' +
      '  en articulos/index.html y que las dos partes usen clave().'
    );
  }

  return { revisados, etiquetas: etiquetas.size, categorias: categorias.size };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  comprobarEnlaces()
    .then((r) =>
      console.log(
        r.nota ||
          `✓ ${r.revisados} enlace(s) de filtro, todos válidos ` +
            `(${r.etiquetas} etiqueta(s), ${r.categorias} categoría(s)).`
      )
    )
    .catch((e) => {
      console.error(`\n✖ ${e.message}\n`);
      process.exit(1);
    });
}
