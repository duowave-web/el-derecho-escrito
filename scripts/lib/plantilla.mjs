/* ==========================================================================
   Plantilla del artículo y de las piezas que lo anuncian.

   Reproduce a mano el HTML que hasta ahora se escribía a mano. No hay motor de
   plantillas a propósito: el sitio se publica sin build y estos literales son
   lo más parecido a leer el HTML final.

   ⚠️ SI CAMBIA EL DISEÑO DEL ARTÍCULO, CAMBIA AQUÍ. Cualquier retoque en
   articulos/<slug>/index.html hecho a mano se pierde en el siguiente build.
   ========================================================================== */

import { resolverLlamadas } from './refs.mjs';

export const DOMINIO = 'https://elderechoescrito.es';

/* Las categorías del sitio, con su texto visible. Esta es la lista que pinta
   los botones del filtro, y por eso incluye las que hoy no tienen ningún
   artículo: el CLAUDE.md documenta que ningún filtro va apagado, porque un
   botón deshabilitado no puede explicar por qué lo está.

   Añadir una categoría es añadir una línea aquí. */

export const CATEGORIAS = {
  ensayo: 'Ensayo',
  fundamento: 'Fundamento',
  jurisprudencia: 'Jurisprudencia',
  comentario: 'Comentario',
};

/* ------------------------------------------------------------ autoría --- */

/* ⚠️ LA AUTORÍA SE ESCRIBE AQUÍ UNA VEZ Y SALE EN OCHO SITIOS DEL ARTÍCULO.
   El CLAUDE.md los enumera: meta author, las cuatro del JSON-LD, el nombre, la
   bio y el retrato del lateral, y la firma de la ficha —esa última solo visible
   por debajo de 900px, que es la que más se escapaba—.

   ⚠️ La BIO estuvo escrita dos veces, literalmente la misma cadena: una en
   `.autor__bio` y otra en el `author.description` del JSON-LD. El CLAUDE.md ya
   avisaba de que era «la incoherencia más fácil de dejarse», y con dos
   literales seguía siéndolo: nada comprueba que digan lo mismo y un cambio en
   uno solo no da ningún error, solo deja a Google con una bio y al lector con
   otra. Son una constante justamente por eso.

   Cambiar de autor es cambiar este bloque y regenerar. Lo que NO cubre es
   `sobre/`, que es una página a mano y tiene dos puntos más —el `src` y el
   `alt` de su retrato—. Y ojo: el nombre está también DENTRO del nombre del
   archivo de la foto, así que cambiarlo obliga a renombrarla. */

const AUTOR = {
  nombre: 'Juan Contera Miranda',
  cargo: 'Abogado',
  retrato: 'img/juanconteramiranda.jpeg',
  /* ⚠️ LAS MAYÚSCULAS DE «Derecho Administrativo» Y «Urbanismo» SON
     INTENCIONADAS. Contradicen a propósito la convención del cliente —él
     escribe «Derecho administrativo», con minúscula— igual que el titular del
     hero, y por el mismo encargo. Está registrado en CLAUDE.md, en «Los textos
     visibles son del cliente». NO se corrigen a minúscula.

     La bio anterior era: «Abogado colegiado en Madrid. Ejerce en el
     Departamento de Derecho Procesal de Sterling Abogados: litigación
     contencioso-administrativa, urbanismo y expropiaciones.» Se cambió por
     encargo, no por un ajuste de estilo. */
  bio: 'Abogado procesalista especializado en Derecho Administrativo y Urbanismo',
};

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/* --------------------------------------------------------- utilidades --- */

export function escapar(t) {
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* Clave de URL: minúsculas, sin tildes, con guiones. Es la misma convención
   que usan data-categoria y ?etiquetas=, y la trampa que el CLAUDE.md ya
   documenta: el texto visible y la clave conviven en la misma línea. */

export function clave(t) {
  return String(t)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function fechaLarga(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export function fechaCorta(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES[m - 1]} ${a}`;
}

/* Las 09:00 +02:00 son las que ya usaba el artículo escrito a mano. Se fija una
   hora en vez de dejar solo la fecha porque article:published_time y el
   datePublished del JSON-LD piden fecha y hora completas. */

export function fechaISO(iso) {
  return `${iso}T09:00:00+02:00`;
}

/* 200 palabras por minuto.

   ⚠️ ESTE NÚMERO ES NUEVO, no reproduce nada. El artículo escrito a mano decía
   «7 min de lectura» y declaraba wordCount 950, pero tiene 639 palabras
   reales: el ritmo implícito era de 91 ppm, que no es una medida de nada. Eran
   cifras de maqueta. */

export function minutosDe(palabras) {
  return Math.max(1, Math.ceil(palabras / 200));
}

/* Cuenta palabras del texto visible: se quitan las etiquetas y los tokens de
   referencia, que no se leen. */

export function contarPalabras(art) {
  const trozos = [art.entradilla];
  for (const s of art.secciones) {
    trozos.push(s.titulo);
    for (const b of s.bloques) {
      if (b.tipo === 'parrafo' || b.tipo === 'cita') trozos.push(b.html);
      else if (b.tipo === 'subtitulo') trozos.push(b.texto);
      else if (b.tipo === 'lista') for (const it of b.items) trozos.push(it.html);
    }
  }
  const texto = trozos
    .join(' ')
    .replace(/\{\{ref:[^}]*\}\}/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return texto.split(/\s+/).filter(Boolean).length;
}

/* --------------------------------------------------------- derivados ---- */

export function derivar(art) {
  const palabras = contarPalabras(art);
  return {
    ...art,
    palabras,
    minutos: minutosDe(palabras),
    url: `${DOMINIO}/articulos/${art.slug}/`,
    categoriaTexto: CATEGORIAS[art.categoria] || art.categoria,
    fechaLarga: fechaLarga(art.fecha),
    fechaCorta: fechaCorta(art.fecha),
    fechaISO: fechaISO(art.fecha),
  };
}

/* --------------------------------------------------------- bloques ------ */

function pintarBloque(b) {
  if (b.tipo === 'parrafo') {
    return `            <p>${resolverLlamadas(b.html)}</p>`;
  }
  if (b.tipo === 'subtitulo') {
    return `            <h3>${escapar(b.texto)}</h3>`;
  }
  if (b.tipo === 'cita') {
    const cita = `            <blockquote class="cita--destacada">${resolverLlamadas(b.html)}</blockquote>`;
    if (!b.fuente_html) return cita;
    return `${cita}\n            <p class="cita__fuente">${resolverLlamadas(b.fuente_html)}</p>`;
  }
  if (b.tipo === 'lista') {
    const etiqueta = b.ordenada ? 'ol' : 'ul';
    /* Los marcadores tipo «1.º» no los puede poner un <ol> nativo, así que
       cuando vienen se apaga la numeración automática y se escriben. La clase
       lo declara para que el CSS quite el list-style. */
    const conMarcador = b.items.some((i) => i.marcador);
    const clase = conMarcador ? ' class="lista--marcada"' : '';
    const items = b.items
      .map((i) => {
        const marca = i.marcador
          ? `<span class="lista__marca">${escapar(i.marcador)}</span> `
          : '';
        return `              <li>${marca}${resolverLlamadas(i.html)}</li>`;
      })
      .join('\n');
    return `            <${etiqueta}${clase}>\n${items}\n            </${etiqueta}>`;
  }
  throw new Error(`Tipo de bloque desconocido: ${b.tipo}`);
}

function pintarSeccion(s, conNumero) {
  const num = conNumero && s.numero_original ? `${escapar(s.numero_original)}. ` : '';
  const cuerpo = s.bloques.map(pintarBloque).join('\n\n');
  return `            <h2 id="${escapar(s.id)}">${num}${escapar(s.titulo)}</h2>\n\n${cuerpo}`;
}

/* La marca del índice va FUERA del <a>, igual que el `::before` al que
   sustituye. Así el nombre accesible del enlace sigue siendo solo el título
   —«Subsanabilidad del requisito», no «III. Subsanabilidad del requisito»—,
   que es lo que ya hacía la versión con contador, y el número conserva su
   columna y su color de acento. */

function pintarIndice(secciones, conNumero) {
  return secciones
    .map((s) => {
      const marca =
        conNumero && s.numero_original
          ? `<span class="indice__marca">${escapar(s.numero_original)}.</span>`
          : '';
      return `              <li>${marca}<a href="#${escapar(s.id)}">${escapar(s.titulo)}</a></li>`;
    })
    .join('\n');
}

function pintarReferencias(art) {
  if (!art.referencias || !art.referencias.length) return '';
  const grupos = art.referencias
    .map((g) => {
      const items = g.items
        .map((it) => {
          /* El id solo existe si hay número: es el ancla a la que apuntan las
             llamadas. Una referencia sin número —las hay— no se puede citar,
             así que tampoco necesita ancla. */
          const id = it.numero ? ` id="ref-${it.numero}"` : '';
          const marca = it.numero
            ? `<span class="ref__numero">[${it.numero}]</span> `
            : '';
          return `                <li${id}>${marca}${it.html}</li>`;
        })
        .join('\n');
      const titulo = g.grupo
        ? `              <h3 class="referencias__grupo">${escapar(g.grupo)}</h3>\n`
        : '';
      return `${titulo}              <ul>\n${items}\n              </ul>`;
    })
    .join('\n\n');
  const titulo = art.referencias_titulo || 'Citas y referencias';
  return `
          <aside class="referencias" aria-labelledby="referencias-titulo">
            <h2 id="referencias-titulo" class="lista__titulo">${escapar(titulo)}</h2>
${grupos}
          </aside>
`;
}

function pintarEtiquetas(art) {
  if (!art.etiquetas || !art.etiquetas.length) return '';
  const items = art.etiquetas
    .map(
      (e) =>
        `              <li><a class="etiqueta etiqueta--tag" href="../../articulos/?etiquetas=${clave(e)}"><span class="oculto">Ver artículos con la etiqueta </span>#${escapar(e)}</a></li>`
    )
    .join('\n');
  return `
          <div class="lateral__bloque">
            <h2 class="lista__titulo">Etiquetas</h2>
            <ul class="etiquetas">
${items}
            </ul>
          </div>
`;
}

/* --------------------------------------------------------- JSON-LD ------ */

function jsonLd(art) {
  const g = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${art.url}#article`,
        headline: art.titulo,
        description: art.descripcion,
        url: art.url,
        mainEntityOfPage: { '@id': `${art.url}#webpage` },
        datePublished: art.fechaISO,
        dateModified: art.fechaISO,
        inLanguage: 'es-ES',
        articleSection: art.categoriaTexto,
        keywords: (art.keywords || []).join(', '),
        wordCount: art.palabras,
        image: {
          '@type': 'ImageObject',
          url: `${DOMINIO}/articulos/${art.slug}/${art.imagen.archivo}`,
        },
        author: {
          '@type': 'Person',
          name: AUTOR.nombre,
          url: `${DOMINIO}/sobre/`,
          image: {
            '@type': 'ImageObject',
            url: `${DOMINIO}/${AUTOR.retrato}`,
            width: 400,
            height: 400,
          },
          jobTitle: AUTOR.cargo,
          description: AUTOR.bio,
        },
        publisher: { '@id': `${DOMINIO}/#publisher` },
        isPartOf: { '@id': `${DOMINIO}/#blog` },
      },
      {
        '@type': 'WebPage',
        '@id': `${art.url}#webpage`,
        url: art.url,
        name: art.titulo_seo || art.titulo,
        isPartOf: { '@id': `${DOMINIO}/#website` },
        inLanguage: 'es-ES',
      },
    ],
  };
  return JSON.stringify(g, null, 2);
}

/* --------------------------------------------------------- artículo ----- */

export function paginaArticulo(art) {
  const conNumero = art.secciones.some((s) => s.numero_original);
  const titulo = art.titulo_seo || art.titulo;
  const enc = encodeURIComponent;
  const urlEnc = enc(art.url);
  const tituloEnc = enc(art.titulo);

  const etiquetasMeta = (art.keywords || [])
    .map((k) => `<meta property="article:tag" content="${escapar(k)}">`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- ══════════════════════════════════════════════════════════════════════
     ARCHIVO GENERADO — NO EDITAR A MANO

     Lo escribe scripts/build.mjs a partir de
     contenido/articulos/${art.slug}/articulo.json

     Cualquier cambio hecho aquí se pierde en el siguiente «npm run build».
     Para cambiar el texto, se edita el JSON; para cambiar el diseño,
     scripts/lib/plantilla.mjs.
     ══════════════════════════════════════════════════════════════════════ -->

<title>${escapar(titulo)}</title>
<meta name="description" content="${escapar(art.descripcion)}">
<link rel="canonical" href="${art.url}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="author" content="${escapar(AUTOR.nombre)}">
<meta name="theme-color" content="#2f6e68">

<meta property="og:type" content="article">
<meta property="og:site_name" content="El Derecho Escrito">
<meta property="og:locale" content="es_ES">
<meta property="og:url" content="${art.url}">
<meta property="og:title" content="${escapar(titulo)}">
<meta property="og:description" content="${escapar(art.descripcion)}">
<meta property="og:image" content="${DOMINIO}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="article:published_time" content="${art.fechaISO}">
<meta property="article:modified_time" content="${art.fechaISO}">
<meta property="article:section" content="${escapar(art.categoriaTexto)}">
${etiquetasMeta}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapar(titulo)}">
<meta name="twitter:description" content="${escapar(art.descripcion)}">
<meta name="twitter:image" content="${DOMINIO}/og.png">

<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="icon" href="../../favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="../../favicon-16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="../../apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="El Derecho Escrito — artículos" href="../../feed.xml">
<link rel="stylesheet" href="../../css/styles.css">
<link rel="stylesheet" href="../../css/imprimir.css" media="print">

<script type="application/ld+json">
${jsonLd(art)}
</script>
</head>
<body>

<a class="saltar" href="#contenido">Saltar al contenido</a>

<div class="progreso" role="progressbar" aria-label="Progreso de lectura"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
  <div class="progreso__barra"></div>
  <p class="progreso__rotulo">Lectura en curso <span aria-hidden="true">—</span> <span class="progreso__cifra">0%</span></p>
</div>

<header class="cabecera">
  <div class="cabecera__interior">
    <a class="marca" href="../../">El Derecho Escrito</a>
    <nav class="nav" aria-label="Navegación principal">
      <a href="../../articulos/">Artículos</a>
      <a href="../../sobre/">Acerca de</a>
      <a href="../../contacto/">Contacto</a>

      <form class="busca" role="search" method="get" action="../../articulos/">
        <label class="oculto" for="busca-cabecera">Buscar artículos</label>
        <input class="busca__campo" id="busca-cabecera" type="search" name="q"
               placeholder="Buscar artículos…" autocomplete="off">
        <a class="busca__lupa" href="../../articulos/" aria-label="Buscar artículos">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-3.6-3.6"></path>
          </svg>
        </a>
      </form>
    </nav>
  </div>
</header>

<main id="contenido">
  <article class="articulo">
    <div class="contenedor contenedor--amplio">
      <div class="articulo__disposicion">

        <div class="articulo__principal">

          <a class="volver" href="../../articulos/">
            <span class="volver__flecha" aria-hidden="true">&larr;</span>Volver a los artículos
          </a>

          <p class="etiqueta etiqueta--plana">
            <a href="../../articulos/?categoria=${clave(art.categoria)}"><span class="oculto">Ver artículos de </span>${escapar(art.categoriaTexto)}</a>
          </p>

          <h1 class="articulo__titular">${escapar(art.titulo)}</h1>

          <div class="entrada__meta articulo__ficha">
            <span class="firma">Por <a href="../../sobre/">${escapar(AUTOR.nombre)}</a></span>
            <time datetime="${art.fechaISO}">${art.fechaLarga}</time>
            <span class="lectura">${art.minutos} min de lectura</span>
          </div>

          <figure class="articulo__portada">
            <img src="./${art.imagen.archivo}"
                 alt="${escapar(art.imagen.alt)}"
                 width="1600" height="1066">
          </figure>

          <p class="entradilla">${resolverLlamadas(art.entradilla)}</p>

          <nav class="indice${conNumero ? ' indice--sin-contador' : ''}" aria-labelledby="indice-titulo">
            <h2 id="indice-titulo">Índice del artículo</h2>
            <ol role="list">
${pintarIndice(art.secciones, conNumero)}
            </ol>
          </nav>

          <div class="articulo__cuerpo${conNumero ? ' articulo__cuerpo--sin-contador' : ''}">

${art.secciones.map((s) => pintarSeccion(s, conNumero)).join('\n\n')}

          </div>
${pintarReferencias(art)}
          <a class="volver volver--cierre" href="../../articulos/">
            <span class="volver__flecha" aria-hidden="true">&larr;</span>Volver a los artículos
          </a>

          <aside class="compartir" aria-labelledby="compartir-titulo">
            <h2 id="compartir-titulo" class="lista__titulo">Compartir</h2>
            <ul class="compartir__lista">
              <li>
                <a class="compartir__enlace" rel="noopener noreferrer" target="_blank"
                   href="https://www.linkedin.com/sharing/share-offsite/?url=${urlEnc}">
                  <span class="compartir__icono compartir__icono--linkedin" aria-hidden="true"></span>
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a class="compartir__enlace" rel="noopener noreferrer" target="_blank"
                   href="https://api.whatsapp.com/send?text=${tituloEnc}%20${urlEnc}">
                  <span class="compartir__icono compartir__icono--whatsapp" aria-hidden="true"></span>
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a class="compartir__enlace"
                   href="mailto:?subject=${tituloEnc}&amp;body=Te%20paso%20este%20art%C3%ADculo%3A%20${urlEnc}">
                  <span class="compartir__icono compartir__icono--correo" aria-hidden="true"></span>
                  <span>Correo</span>
                </a>
              </li>
              <li>
                <a class="compartir__enlace compartir__enlace--pdf" href="./${art.slug}.pdf" download>
                  <span class="compartir__icono compartir__icono--pdf" aria-hidden="true"></span>
                  <span>Descargar PDF</span>
                </a>
              </li>
            </ul>
          </aside>

          <p class="aviso"><em>Este artículo tiene carácter informativo y divulgativo y no constituye asesoramiento jurídico. La valoración de un asunto concreto requiere analizar sus circunstancias particulares. Si deseas plantear una consulta relacionada con su contenido o con las materias que aborda, puedes hacerlo a través de la <a href="../../contacto/">página de contacto</a>.</em></p>

          <section class="continua" id="continua" aria-labelledby="continua-titulo" hidden>
            <h2 id="continua-titulo" class="lista__titulo lista__titulo--destacado">Continúa leyendo</h2>
            <div class="tarjetas tarjetas--par" id="relacionados"></div>
          </section>

        </div>

        <aside class="articulo__lateral">

          <div class="lateral__bloque autor">
            <h2 class="lista__titulo">Autor</h2>

            <div class="autor__retrato">
              <img src="../../${AUTOR.retrato}"
                   alt="Retrato de ${escapar(AUTOR.nombre)}"
                   width="400" height="400" loading="lazy" decoding="async">
            </div>
            <p class="autor__nombre">${escapar(AUTOR.nombre)}</p>
            <p class="autor__bio">${escapar(AUTOR.bio)}</p>
            <a class="autor__enlace" href="../../sobre/">Ver perfil &rarr;</a>
          </div>
${pintarEtiquetas(art)}
          <div class="lateral__bloque suscripcion">
            <svg class="suscripcion__icono" width="30" height="30" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.4" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <path d="m2 7 10 6 10-6"></path>
            </svg>

            <p class="suscripcion__reclamo">Sigue <em>El Derecho Escrito</em></p>
            <p class="suscripcion__apoyo">Suscríbete para recibir los nuevos artículos sobre Derecho administrativo, urbanismo y jurisdicción contencioso-administrativa.</p>
            <label class="oculto" for="correo">Correo electrónico</label>
            <input type="email" id="correo" placeholder="Correo electrónico" disabled>
            <button class="boton boton--principal" type="button" disabled>Suscribirme</button>
            <p class="suscripcion__nota">Un correo con cada nueva publicación. Puedes darte de baja en cualquier momento.</p>
          </div>

        </aside>

      </div>
    </div>
  </article>
</main>

<footer class="pie">
  <div class="contenedor">
    <nav class="pie__nav" aria-label="Navegación del pie">
      <a href="../../articulos/">Artículos</a>
      <a href="../../sobre/">Acerca de</a>
      <a href="../../contacto/">Contacto</a>
      <a href="../../feed.xml">RSS</a>
    </nav>
    <p>El Derecho Escrito &middot; &copy; <span id="anio">2026</span></p>
    <p>Contenido divulgativo. No constituye asesoramiento jurídico.</p>
  </div>
</footer>

<script src="../../js/main.js" defer></script>
</body>
</html>
`;
}

/* --------------------------------------------------------- piezas ------- */

/* Tarjeta del listado. data-categoria y data-etiquetas son lo que leen los
   filtros y el bloque «Continúa leyendo»: la primera en clave, la segunda con
   el TEXTO VISIBLE, que es la asimetría que el CLAUDE.md ya documenta. */

export function tarjetaListado(art) {
  return `        <article class="tarjeta tarjeta--caja" data-categoria="${clave(art.categoria)}"
                 data-etiquetas="${escapar((art.etiquetas || []).join(','))}">
          <div class="tarjeta__imagen">
            <img src="./${art.slug}/${art.imagen.archivo}"
                 alt="${escapar(art.imagen.alt)}"
                 width="1600" height="1066" loading="lazy" decoding="async">
          </div>
          <p class="etiqueta etiqueta--plana">${escapar(art.categoriaTexto)}</p>
          <h2 class="entrada__titulo">
            <a href="./${art.slug}/">${escapar(art.titulo)}</a>
          </h2>
          <p class="entrada__extracto">${escapar(art.descripcion)}</p>
          <div class="entrada__meta">
            <time datetime="${art.fecha}">${art.fechaCorta}</time>
            <span class="lectura">${art.minutos} min</span>
          </div>
        </article>`;
}

/* Tarjeta abierta de la portada. Sin caja, con enlace extendido: el ::after del
   titular cubre la tarjeta y la categoría sube con z-index. */

export function tarjetaPortada(art) {
  return `        <article class="tarjeta tarjeta--abierta">
          <div class="tarjeta__imagen">
            <img src="./articulos/${art.slug}/${art.imagen.archivo}"
                 alt="${escapar(art.imagen.alt)}"
                 width="1600" height="1066" loading="lazy" decoding="async">
          </div>
          <p class="etiqueta etiqueta--plana">
            <a href="./articulos/?categoria=${clave(art.categoria)}"><span class="oculto">Ver artículos de </span>${escapar(art.categoriaTexto)}</a>
          </p>
          <h3 class="entrada__titulo">
            <a href="./articulos/${art.slug}/">${escapar(art.titulo)}</a>
          </h3>
          <p class="entrada__extracto">${escapar(art.descripcion)}</p>
          <div class="entrada__meta">
            <time datetime="${art.fecha}">${art.fechaCorta}</time>
            <span class="lectura">${art.minutos} min</span>
          </div>
        </article>`;
}

/* El destacado de portada. El texto va PRIMERO en el marcado y la imagen
   después: el orden de lectura coincide con el visual en escritorio, y el
   apilado de móvil lo resuelve `order: -1` en el CSS. */

export function bloqueDestacado(art) {
  return `      <div class="destacado__pieza">

        <div class="destacado__texto">

          <p class="destacado__antetitulo">
            <span>Artículo destacado</span>
            <span class="destacado__antetitulo-sep" aria-hidden="true">·</span>
            <a href="./articulos/?categoria=${clave(art.categoria)}"><span class="oculto">Ver artículos de </span>${escapar(art.categoriaTexto)}</a>
          </p>

          <h3 class="destacado__titulo">
            <a href="./articulos/${art.slug}/">${escapar(art.titulo)}</a>
          </h3>

          <p class="destacado__entradilla">${escapar(art.descripcion)}</p>

          <div class="entrada__meta">
            <time datetime="${art.fecha}">${art.fechaCorta}</time>
            <span class="lectura">${art.minutos} min de lectura</span>
            <a class="destacado__leer" href="./articulos/${art.slug}/">Leer artículo <span class="destacado__flecha" aria-hidden="true">&rarr;</span></a>
          </div>
        </div>

        <a class="destacado__imagen" href="./articulos/${art.slug}/"
           aria-hidden="true" tabindex="-1">
          <img src="./articulos/${art.slug}/${art.imagen.archivo}" alt=""
               width="1600" height="1066" loading="lazy" decoding="async">
        </a>

      </div>`;
}

/* Botones del filtro de categoría. Se pintan TODAS las del sitio, tengan
   artículos o no: un botón apagado no puede explicar por qué lo está. */

export function botonesCategoria() {
  const botones = Object.entries(CATEGORIAS)
    .map(
      ([k, texto]) =>
        `        <button type="button" class="boton boton--contorno boton--filtro"\n                data-filtro="${k}" aria-pressed="false">${escapar(texto)}</button>`
    )
    .join('\n');
  return `        <button type="button" class="boton boton--contorno boton--filtro"
                data-filtro="todos" aria-pressed="true">Todos</button>
${botones}`;
}

export function entradaSitemap(art) {
  return `  <url>
    <loc>${art.url}</loc>
    <lastmod>${art.fecha}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
}

/* RFC-822 para el feed. Se calcula de la fecha del artículo, nunca de la hora
   de build: si no, cada ejecución cambiaría el archivo y se perdería la
   idempotencia. */

const DIAS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MESES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fechaRFC(iso) {
  const d = new Date(`${iso}T09:00:00+02:00`);
  const dia = DIAS[d.getUTCDay()];
  const mes = MESES_EN[d.getUTCMonth()];
  return `${dia}, ${String(d.getUTCDate()).padStart(2, '0')} ${mes} ${d.getUTCFullYear()} 09:00:00 +0200`;
}

export function entradaFeed(art) {
  return `    <item>
      <title>${escapar(art.titulo)}</title>
      <link>${art.url}</link>
      <guid isPermaLink="true">${art.url}</guid>
      <pubDate>${fechaRFC(art.fecha)}</pubDate>
      <category>${escapar(art.categoriaTexto)}</category>
      <description>${escapar(art.descripcion)}</description>
    </item>`;
}
