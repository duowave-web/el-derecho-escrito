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

   Añadir una categoría es añadir una línea aquí.

   ⚠️ VAN EN PLURAL, Y SON TRES. Estuvieron en singular y eran cuatro:
   `ensayo`, `fundamento`, `jurisprudencia` y `comentario`.

   «Comentario» SE ELIMINÓ porque no es una categoría del cliente, no porque
   sobrara al pluralizar. Quien la eche de menos al ver un artículo que comenta
   una resolución: eso va en `jurisprudencia`.

   ⚠️ «Jurisprudencia» NO PLURALIZA, y no es un descuido. Es incontable en
   español jurídico —«jurisprudencias» no existe— así que su plural es ella
   misma. Los botones del filtro se leen ENSAYOS · FUNDAMENTOS · JURISPRUDENCIA
   y la asimetría está asumida: un lector jurista no la lee como error, y
   forzar «Sentencias» o «Resoluciones» sería renombrar la categoría, no
   pluralizarla.

   La clave y el texto cambian A LA VEZ y tienen que seguir haciéndolo: la
   clave viaja a `data-categoria`, a `?categoria=` y a `data-filtro`, y el
   texto es lo que se ve. Ver el CLAUDE.md, que enumera los nueve sitios.

   Las tres NO comparten eje —«Ensayos» es una forma, «Jurisprudencia» una
   fuente y «Fundamentos» una materia— y eso ya pasaba en singular. Es la
   taxonomía del cliente y no se arregla por iniciativa propia. */

export const CATEGORIAS = {
  ensayos: 'Ensayos',
  fundamentos: 'Fundamentos',
  jurisprudencia: 'Jurisprudencia',
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
   archivo de la foto, así que cambiarlo obliga a renombrarla.

   ⚠️ HAY DOS ARCHIVOS DE RETRATO Y NO ES UNA DUPLICACIÓN DESPISTADA. Son el
   mismo encuadre 3:4 a dos tamaños, y cada uno sirve a una caja distinta:

     retrato       264×352, 16 KB  → el círculo de 132px de ESTE lateral
     retratoGrande 600×800, 61 KB  → el rectángulo de 300×400 de `sobre/`,
                                     y el `author.image` del JSON-LD

   El lateral sale en TODAS las páginas de artículo, así que servirle ahí los
   600×800 costaría 45 KB por página para enseñar 132px. El JSON-LD lleva la
   grande porque es la que ve Google, no el lector.

   Los dos son el doble de su caja, que es lo que pide una pantalla densa. Si
   alguna de las dos cajas cambia de tamaño en el CSS, hay que regenerar su
   archivo: el procedimiento está en CLAUDE.md, en «Fotografía».

   ⚠️ SE EXPORTA PORQUE `pdf.mjs` TAMBIÉN ESCRIBE EL NOMBRE, en dos sitios: la
   ficha del bloque de título y la cabecera corriente de cada página. Estuvo
   ahí en literales, así que cambiar de autor dejaba el PDF firmado por el
   anterior —y eso **no se ve en pantalla**, solo abriendo el documento—.
   Importarlo de aquí es lo que hace que «cambiar de autor es tocar este bloque
   y regenerar» siga siendo verdad. */

export const AUTOR = {
  nombre: 'Juan Contera Miranda',
  cargo: 'Abogado',
  retrato: 'img/juanconteramiranda-264x352.jpg',
  retratoGrande: 'img/juanconteramiranda-600x800.jpg',
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

/* ⚠️ `actualizado` SIEMPRE TIENE VALOR AQUÍ, Y ANTES PODÍA SER `null`. Si el
   JSON no trae el campo, vale la fecha de publicación. Es un encargo del
   cliente: quiere ver la línea «Última actualización» en todos los artículos,
   y echaba en falta que el de MASC no la enseñara.

   ⚠️ ESTO REVIERTE UNA DECISIÓN QUE ESTABA RAZONADA AQUÍ MISMO, y conviene
   saberlo antes de «arreglarlo» de vuelta. El comentario anterior decía que una
   actualización igual a la publicación se descartaba porque la ficha leería

       28 DE SEPTIEMBRE DE 2026 · ÚLTIMA ACTUALIZACIÓN: 28 DE SEPTIEMBRE DE 2026

   o sea «un dato que ocupa sitio y no dice nada, y que además parece un fallo
   del generador más que una decisión del autor».

   **Ese efecto es real y es exactamente lo que se ve hoy en el artículo de
   MASC**, que no trae el campo. No es un descuido: es lo pedido. Quien lo vea y
   piense que el generador está repitiendo la fecha por error, que lea esto
   antes de tocar nada.

   Lo que el cambio NO toca: el `<pubDate>` del feed, que sigue saliendo de
   `fecha`. En RSS 2.0 `pubDate` es la fecha de publicación y no hay campo de
   modificación por `<item>`; meter ahí la revisión reanunciaría el artículo
   como nuevo en todos los lectores.

   Con esto desaparece el caso «el campo existe pero no se ve», así que
   `validar()` ya no tiene nada que avisar cuando `actualizado === fecha`:
   escribirlo da el mismo resultado que omitirlo. Lo que SÍ sigue siendo error
   es que sea ANTERIOR a `fecha`, que es un problema de sentido y no de
   presentación. */

export function derivar(art) {
  const palabras = contarPalabras(art);
  const actualizado = art.actualizado || art.fecha;

  return {
    ...art,
    palabras,
    minutos: minutosDe(palabras),
    url: `${DOMINIO}/articulos/${art.slug}/`,
    categoriaTexto: CATEGORIAS[art.categoria] || art.categoria,
    fechaLarga: fechaLarga(art.fecha),
    fechaCorta: fechaCorta(art.fecha),
    fechaISO: fechaISO(art.fecha),

    /* Sustituye a lo que venga en el JSON: el spread de arriba habría dejado
       `undefined` en los artículos que no traen el campo. */
    actualizado,
    actualizadoLarga: fechaLarga(actualizado),
    actualizadoISO: fechaISO(actualizado),

    /* Lo que leen los buscadores. Son los mismos valores que `actualizado`
       desde que este no puede ser nulo; se conservan con nombre propio porque
       es el vocabulario del JSON-LD y del sitemap, no el de la ficha. */
    modificadoISO: fechaISO(actualizado),
    modificadoFecha: actualizado,
  };
}

/* --------------------------------------------------------- bloques ------ */

/* ------------------------------------------------- citas: dos estilos --- */

/* ⚠️ EL ESTILO DE UNA CITA LO ELIGE EL GENERADOR, NO EL CLIENTE. No hay nada que
   marcar en el Word: se decide aquí, una vez, a partir del propio texto.

   Son dos cosas distintas que compartían estilo:

     cita--destacada   una frase que se MIRA. Tipografía de display, grande,
                       con su comilla de apertura. Es un reclamo.
     cita--extracto    un pasaje que se LEE. Sentencias y acuerdos citados
                       literalmente, a veces de varios párrafos.

   Con el estilo de display, los extractos reales de MASC se convertían en un
   muro. Medido a 375 px antes de este cambio:

     cita   palabras   alto     lineas   % del documento
       1        113     968 px     28         2,6 %
       2         37     415 px     12         1,1 %
       3        174    1590 px     46         4,2 %
       4        579    5529 px    160        14,7 %   <- 6,8 pantallas
       5        115    1071 px     31         2,8 %
                      ------------------------------
                       9572 px               25,5 %

   O sea que una cuarta parte del artículo eran citas en cuerpo de titular.

   ⚠️ EL CRITERIO ES «MÁS DE 40 PALABRAS O CUALQUIER SALTO DE LÍNEA», y las dos
   mitades hacen falta:

     · Por LARGO, porque una cita de 113 palabras no es un reclamo aunque vaya
       en un solo párrafo —son 28 líneas en un móvil—.
     · Por SALTO DE LÍNEA, porque una cita de dos puntos separados por <br> es
       un documento por estructura, no por tamaño. Es el caso de la cita 2, que
       con 37 palabras se escaparía del umbral y no es un reclamo.

   ⚠️ EL 40 NO ES UN NÚMERO FRÁGIL, Y CONVIENE SABERLO ANTES DE AFINARLO. Las
   citas reales se reparten en 37 (con <br>), 113, 115, 174 y 579: no hay
   ninguna entre 40 y 112. Cualquier umbral entre 38 y 112 clasifica el artículo
   EXACTAMENTE IGUAL, así que el resultado no depende de haber acertado el
   número. Lo que lo fija en 40 es el otro extremo: es lo que ocupa una frase
   larga de una sola oración, que es lo que un reclamo puede llegar a ser.

   Se cuenta en PALABRAS y no en caracteres porque es la unidad que el build ya
   usa para los minutos de lectura. Con caracteres —246, 669, 727, 1049, 3686—
   el reparto sale idéntico.

   Determinista y sin reloj: depende solo del texto del JSON. */

const PALABRAS_EXTRACTO = 40;

export function claseDeCita(html) {
  const salto = /<br\b|<\/p>/i.test(html);
  const texto = html
    .replace(/\{\{ref:[^}]*\}\}/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  return salto || palabras > PALABRAS_EXTRACTO ? 'cita--extracto' : 'cita--destacada';
}

function pintarBloque(b) {
  if (b.tipo === 'parrafo') {
    return `            <p>${resolverLlamadas(b.html)}</p>`;
  }
  if (b.tipo === 'subtitulo') {
    return `            <h3>${escapar(b.texto)}</h3>`;
  }
  if (b.tipo === 'cita') {
    const cita = `            <blockquote class="${claseDeCita(b.html)}">${resolverLlamadas(b.html)}</blockquote>`;
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
        /* Sin campo `actualizado` vale lo mismo que datePublished, que es lo
           que este sitio ha declarado siempre. */
        dateModified: art.modificadoISO,
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
          /* La GRANDE, no la del lateral: esto lo lee Google para construir la
             entidad de autor y ahí conviene la mejor resolución que haya. */
          image: {
            '@type': 'ImageObject',
            url: `${DOMINIO}/${AUTOR.retratoGrande}`,
            width: 600,
            height: 800,
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

/* Navegación entre artículos contiguos, al final del artículo.

   ⚠️ EL ORDEN NO SE CALCULA AQUÍ: llega resuelto desde build.mjs, que ya ordena
   por fecha descendente con el slug de desempate. Volver a ordenar aquí sería
   un segundo criterio que podría divergir del primero sin que nada avisara.

   Como la lista va de más nuevo a más viejo, el vecino de ÍNDICE MENOR es el
   publicado DESPUÉS —o sea «siguiente»— y el de índice mayor, «anterior». Es
   al revés de lo que sugiere el array, y es el error fácil de cometer.

   Sin vecinos devuelve cadena vacía, no un contenedor con nada dentro: con un
   solo artículo publicado no debe quedar ni el <nav>. */

/* ------------------------------------------------------ comentarios ----- */

/* ⚠️ VA DETRÁS DE «Compartir» Y DELANTE DEL AVISO LEGAL. El orden del final del
   artículo queda así:

     cuerpo → referencias → Volver → Descargar PDF → Compartir
     → COMENTARIOS → aviso legal → Leer anterior/siguiente → Continúa leyendo

   La lectura del bloque entero es: primero el artículo, después lo que puedes
   HACER con él —volver, llevártelo, compartirlo—, después lo que puedes DECIR
   sobre él, y al final la letra pequeña y las salidas a otros artículos.

   ⚠️ ESTA ES LA TERCERA POSICIÓN Y LAS DOS ANTERIORES TENÍAN SU PROPIO
   ARGUMENTO ESCRITO AQUÍ. Conviene saberlo antes de volver a moverla:

     1ª  detrás del aviso legal, delante de `.paso`
         «el aviso CIERRA el texto: primero se acaba de leer, después se
          responde»
     2ª  justo detrás de las referencias, delante de «Volver»
         «un comentario es la continuación de la lectura, así que va pegado a
          lo que se acaba de leer»
     3ª  **la de ahora**, detrás de «Compartir»

   Las tres son defendibles y las tres se pidieron. Lo que NO hay que hacer es
   moverla «porque el comentario de arriba dice otra cosa»: el comentario se
   actualiza con el encargo, no al revés.

   ⚠️ LO QUE SÍ ES ESTRUCTURAL, Y NO UNA PREFERENCIA: va delante de `.paso` y de
   `.continua`. Esos dos son las salidas hacia OTROS artículos, y pedir un
   comentario después de haber ofrecido la puerta llega tarde. Hoy no se ven
   —con un solo artículo publicado `.paso` no emite ni un byte y `.continua`
   sale con `hidden`— pero aparecen solos con el segundo.

   ⚠️ Y HAY UN MARGEN QUE DEPENDE DE ESTA POSICIÓN. El aviso legal es un <p> y
   le cae `.articulo p`, con `margin-top: 0`: la separación la tiene que poner
   el `margin-bottom` de `.comentarios`. Está razonado sobre esa regla, en
   styles.css.

   ⚠️ LA CAJA SE QUEDA VACÍA EN EL HTML, Y ESO ES LO QUE LA HACE SEGURA. Aquí no
   se escribe ni un campo: lo monta Artalk en el navegador cuando el lector se
   acerca. Si el servidor no responde, o si no hay JavaScript, lo único que hay
   es un <section> con su título y un párrafo — el artículo no se rompe.

   ⚠️ EL `pageKey` SE ESCRIBE AQUÍ Y NO SE DEDUCE EN EL NAVEGADOR. Es la ruta
   limpia del artículo, SIN el prefijo de GitHub Pages:

     hoy      duowave-web.github.io/el-derecho-escrito/articulos/<slug>/
     mañana   elderechoescrito.es/articulos/<slug>/
     pageKey  /articulos/<slug>/            <- igual en los dos

   Artalk, por defecto, usa `location.pathname`, que HOY incluye
   `/el-derecho-escrito/` y mañana no: los comentarios de cada artículo
   quedarían huérfanos al mudar el dominio, sin dar ningún error —simplemente
   aparecería una caja vacía—. Al escribirlo el generador, la clave es la misma
   antes y después de la mudanza y no depende de dónde esté servida la página.

   ⚠️ NO HAY QUE CAMBIARLO NUNCA para un artículo ya publicado: la clave es lo
   que ata cada comentario a su artículo. Cambiarla los esconde todos. */

export function bloqueComentarios(art) {
  return `

          <section class="comentarios" aria-labelledby="comentarios-titulo">
            <h2 id="comentarios-titulo" class="lista__titulo">Comentarios</h2>

            <div class="comentarios__caja"
                 data-artalk
                 data-pagekey="/articulos/${art.slug}/"
                 data-pagetitle="${escapar(art.titulo)}"></div>

            <p class="comentarios__nota" data-nota-comentarios>
              Tu correo <strong>no se publica</strong>: solo sirve para avisarte si
              alguien responde a tu comentario y para que el autor pueda
              contestarte. Puedes consultar la
              <a href="../../privacidad/">política de privacidad</a>.
            </p>

            <noscript>
              <p class="comentarios__nota">
                Los comentarios necesitan JavaScript para cargarse. El artículo se
                lee entero sin ellos; si quieres comentar, actívalo o escribe a
                través de la <a href="../../contacto/">página de contacto</a>.
              </p>
            </noscript>
          </section>`;
}

export function bloquePaso({ anterior, siguiente } = {}) {
  if (!anterior && !siguiente) return '';

  /* El rótulo y el título van en dos <span> dentro del MISMO <a>: así el
     nombre accesible del enlace es «Leer anterior, <título>», que dice a la vez
     qué hace y adónde lleva. Dos enlaces hermanos obligarían a tabular dos
     veces para el mismo destino. */

  const enlace = (art, mod, rotulo, flecha) => `
            <a class="paso__enlace paso__enlace--${mod}" href="../${art.slug}/">
              <span class="paso__rotulo">${flecha === 'izq' ? '<span class="paso__flecha" aria-hidden="true">&larr;</span>' : ''}${rotulo}${flecha === 'der' ? '<span class="paso__flecha" aria-hidden="true">&rarr;</span>' : ''}</span>
              <span class="paso__titulo">${escapar(art.titulo)}</span>
            </a>`;

  /* ⚠️ EL SALTO DE LÍNEA VA DELANTE Y NO DETRÁS, y la plantilla lo interpola
     PEGADO al `</p>` del aviso. Con el `${…}` en su propia línea, el caso
     vacío dejaba una línea en blanco de más en el HTML de todo artículo sin
     vecinos —comprobado: el de MASC cambiaba en una línea sin que hubiera nada
     que enseñar—. Así, cuando no hay vecinos no se añade ni un byte. */

  return `

          <nav class="paso" aria-label="Más artículos">${
            anterior ? enlace(anterior, 'anterior', 'Leer anterior', 'izq') : ''
          }${
            siguiente ? enlace(siguiente, 'siguiente', 'Leer siguiente', 'der') : ''
          }
          </nav>`;
}

export function paginaArticulo(art, vecinos) {
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
<meta property="article:modified_time" content="${art.modificadoISO}">
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

          <figure class="articulo__portada">
            <img src="./${art.imagen.archivo}"
                 alt="${escapar(art.imagen.alt)}"
                 width="1600" height="1066">
          </figure>

          <p class="etiqueta etiqueta--plana">
            <a href="../../articulos/?categoria=${clave(art.categoria)}"><span class="oculto">Ver artículos de </span>${escapar(art.categoriaTexto)}</a>
          </p>

          <h1 class="articulo__titular">${escapar(art.titulo)}</h1>

          <div class="entrada__meta articulo__ficha">
            <span class="firma">Por <a href="../../sobre/">${escapar(AUTOR.nombre)}</a></span>
            <time datetime="${art.fechaISO}">${art.fechaLarga}</time>
            <span class="lectura">${art.minutos} min de lectura</span>
            <time class="actualizado" datetime="${art.actualizadoISO}">Última actualización: ${art.actualizadoLarga}</time>
          </div>

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

          <!-- ⚠️ ERA EL CUARTO ELEMENTO DE «COMPARTIR» Y SALE DE LA LISTA.
               Alli se veia igual que LinkedIn, WhatsApp y Correo —misma pildora
               gris— asi que se leia como un destino mas al que mandar el
               articulo, y no lo es: los otros tres LO ENVIAN A OTRO SITIO y
               este TE LO DA A TI. Son dos acciones distintas y ahora se
               distinguen.

               Pasa a .boton--contorno, el mismo tratamiento que «Descargar CV»
               de sobre/: las dos descargas del sitio se ven igual.

               ⚠️ Decia «en sobre/ y en el lateral», y el del lateral YA NO
               EXISTE: se retiro por encargo y el CV solo se descarga desde
               sobre/. Siguen siendo las dos unicas descargas del sitio, pero ya
               no comparten pagina.

               ⚠️ VA ANTES DE «COMPARTIR», no despues, y es deliberado: llevarse
               el articulo es para uno mismo y compartirlo es para terceros. El
               orden va de lo propio a lo ajeno, que es tambien el orden en que
               se decide.

               UNA SOLA UBICACION, no dos. Arriba, junto a la ficha, competiria
               con el arranque de la lectura y empujaria el texto: esa columna
               ya tiene volver, foto, categoria, titular, ficha, entradilla e
               indice. Y el momento de descargar es DESPUES de decidir que el
               articulo interesa, que es justo donde esta. Dos puntos de
               descarga ademas serian dos sitios que mantener.

               El icono se queda: es un <span aria-hidden> con mask, no entra en
               el arbol de accesibilidad y aqui distingue «descargar» de un
               enlace cualquiera. -->
          <p class="descarga">
            <a class="boton boton--contorno" href="./${art.slug}.pdf" download>
              <span class="compartir__icono compartir__icono--pdf" aria-hidden="true"></span>
              Descargar PDF
            </a>
          </p>

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
            </ul>
          </aside>${bloqueComentarios(art)}

          <p class="aviso"><em>Este artículo tiene carácter informativo y divulgativo y no constituye asesoramiento jurídico. La valoración de un asunto concreto requiere analizar sus circunstancias particulares. Si deseas plantear una consulta relacionada con su contenido o con las materias que aborda, puedes hacerlo a través de la <a href="../../contacto/">página de contacto</a>.</em></p>${bloquePaso(vecinos)}

          <section class="continua" id="continua" aria-labelledby="continua-titulo" hidden>
            <h2 id="continua-titulo" class="lista__titulo lista__titulo--destacado">Continúa leyendo</h2>
            <div class="tarjetas tarjetas--par" id="relacionados"></div>
          </section>

        </div>

        <aside class="articulo__lateral">
${/* ⚠️ DEBAJO DE «Ver perfil →» IBA UN BOTÓN «Descargar CV» Y SE RETIRÓ POR
      ENCARGO: el cliente lo quiere SOLO en sobre/.

      Con él se fue `.autor__cv` de styles.css, que era su única portadora, y el
      CV pasa de dos puntos de descarga a uno. La salida de este bloque vuelve a
      ser «Ver perfil →», que lleva justo a la página donde sigue el botón.

      NO se toca el de `sobre/`: vive en un <p> sin clase y nunca dependió de
      aquella regla. Y el peso en bytes, que estaba escrito a mano en los dos
      sitios, ahora solo está ahí — una copia menos que mantener.

      ⚠️ ESTE COMENTARIO VA EN JS Y NO EN HTML A PROPÓSITO. Un `<!-- -->` dentro
      de la plantilla VIAJA AL HTML PUBLICADO de todos los artículos, y explicar
      una retirada le sirve a quien edita este archivo, no a quien lee la página.
      Los `<!-- -->` que sí quedan describen lo que hay, no lo que hubo. */ ''}
          <div class="lateral__bloque autor">
            <h2 class="lista__titulo">Autor</h2>

            <div class="autor__retrato">
              <img src="../../${AUTOR.retrato}"
                   alt="Retrato de ${escapar(AUTOR.nombre)}"
                   width="264" height="352" loading="lazy" decoding="async">
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

/* ⚠️ EL ItemList VA EN SU PROPIO <script>, Y NO ES UNA MANIA: es lo que
   permite que sea una region generada.

   Estuvo dentro del mismo <script type="application/ld+json"> que el
   CollectionPage, compartiendo un @graph, y ahi NO se podia marcar: las marcas
   de region son comentarios HTML, y un <!-- --> dentro de un bloque ld+json
   rompe el JSON. El bloque entero deja de parsear y Google se queda sin los
   datos estructurados de la pagina, sin dar ningun error visible.

   Partirlo en dos <script> lo arregla y es estandar: varios bloques ld+json en
   la misma pagina son validos y el buscador los fusiona. El CollectionPage se
   queda escrito a mano —es descripcion de la pagina, no una lista de
   articulos— y este se genera.

   Antes se mantenia A MANO y ya mordio una vez: al borrar un articulo, el
   ItemList se quedo declarando una URL que pasaba a dar 404 mientras el resto
   del sitio se corregia solo. Ahora sale de los mismos datos que las tarjetas,
   asi que no se puede desincronizar.

   `numberOfItems` se cuenta, no se escribe: era el campo que mas facil se
   quedaba atras. */

export function bloqueItemList(arts) {
  const items = arts
    .map((a, i) => `    {
      "@type": "ListItem",
      "position": ${i + 1},
      "url": "${a.url}",
      "name": ${JSON.stringify(a.titulo)}
    }`)
    .join(',\n');

  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListOrder": "https://schema.org/ItemListOrderDescending",
  "numberOfItems": ${arts.length},
  "itemListElement": [
${items}
  ]
}
</script>`;
}

export function entradaSitemap(art) {
  return `  <url>
    <loc>${art.url}</loc>
    <lastmod>${art.modificadoFecha}</lastmod>
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
