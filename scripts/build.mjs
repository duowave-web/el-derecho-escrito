#!/usr/bin/env node
/* ==========================================================================
   npm run build

   Lee contenido/articulos/<slug>/articulo.json y escribe:

     articulos/<slug>/index.html      completo, generado
     articulos/<slug>/<archivo>       la portada, optimizada
     articulos/index.html             regiones GENERADO:filtros y :articulos
     index.html                       regiones GENERADO:destacado y :ultimos
     sitemap.xml                      región GENERADO:articulos
     feed.xml                         región GENERADO:articulos

   ⚠️ SOLO TOCA LO QUE HAY ENTRE MARCAS. Los archivos de arriba están llenos de
   comentarios con decisiones medidas —los 448 px del destacado, el enlace
   extendido, los cortes de cabecera— y de bloques escritos a mano como el hero
   o las tarjetas de ejemplo. Un generador que reescribiera el archivo entero
   se los llevaría por delante.

   ⚠️ ES IDEMPOTENTE: ejecutarlo dos veces da el mismo resultado. Para eso el
   orden es determinista (fecha descendente, y el slug desempata) y ninguna
   fecha sale del reloj: todas vienen del JSON.
   ========================================================================== */

import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  derivar, paginaArticulo, tarjetaListado, tarjetaPortada, bloqueDestacado,
  botonesCategoria, entradaSitemap, entradaFeed, bloqueItemList, clave, CATEGORIAS,
} from './lib/plantilla.mjs';
import { llamadasDe } from './lib/refs.mjs';
import { procesarPortada } from './lib/imagen.mjs';
import { comprobarClaves } from './comprobar-claves.mjs';
import { comprobarEnlaces } from './comprobar-enlaces.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENIDO = join(RAIZ, 'contenido', 'articulos');

const avisos = [];
const errores = [];

/* --------------------------------------------------------- regiones ----- */

/* Sustituye lo que hay entre <!-- GENERADO:nombre inicio --> y su fin.
   Si las marcas no están, es un error y no un aviso: significa que alguien las
   ha borrado y el build dejaría de actualizar ese sitio en silencio. */

function reemplazarRegion(texto, nombre, contenido, archivo) {
  const ini = `<!-- GENERADO:${nombre} inicio`;
  const fin = `<!-- GENERADO:${nombre} fin -->`;
  const a = texto.indexOf(ini);
  const b = texto.indexOf(fin);
  if (a === -1 || b === -1) {
    errores.push(`Faltan las marcas GENERADO:${nombre} en ${archivo}`);
    return texto;
  }
  const finLinea = texto.indexOf('-->', a) + 3;
  /* La marca de cierre conserva su sangrado: se corta desde el principio de su
     línea, no desde el `<`. Si no, cada build la dejaba pegada al margen. */
  const inicioLineaFin = texto.lastIndexOf('\n', b) + 1;
  const sangria = texto.slice(inicioLineaFin, b);
  return texto.slice(0, finLinea) + '\n' + contenido + '\n' + sangria + texto.slice(b);
}

/* --------------------------------------------------------- validación --- */

const CAMPOS = ['slug', 'titulo', 'descripcion', 'entradilla', 'categoria', 'fecha', 'secciones', 'imagen'];

/* ⚠️ COMPRUEBA QUE LA FECHA EXISTE, NO SOLO QUE TIENE LA FORMA, y el segundo
   control es el que faltaba.

   La validación era un `/^\d{4}-\d{2}-\d{2}$/` a secas, así que «2026-13-45»
   pasaba. Y lo que publicaba era esto, sin un solo error:

     ficha            →  «45 de undefined de 2026»
     <time datetime>  →  2026-13-45T09:00:00+02:00
     dateModified     →  2026-13-45T09:00:00+02:00
     <lastmod>        →  2026-13-45

   El «undefined» sale de `MESES[12]`, que no existe. Lo ve cualquiera que mire
   la página; los otros tres no los ve nadie hasta que un buscador los descarta.

   El día se comprueba contra el mes de verdad —`Date.UTC(a, m, 0)` da el
   último día del mes `m`, bisiestos incluidos— y no contra un 31 fijo.

   ⚠️ SE APLICA TAMBIÉN A `fecha`, QUE TENÍA EL MISMO AGUJERO. No es un
   añadido de esta tarea: es que dejar `actualizado` estricto y `fecha` laxo
   habría sido una incoherencia peor que cualquiera de las dos. */

function fechaValida(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [a, m, d] = s.split('-').map(Number);
  if (m < 1 || m > 12) return false;
  return d >= 1 && d <= new Date(Date.UTC(a, m, 0)).getUTCDate();
}

function validar(art, ruta) {
  for (const c of CAMPOS) {
    if (art[c] === undefined) errores.push(`${ruta}: falta el campo «${c}»`);
  }
  if (art.categoria && !CATEGORIAS[art.categoria]) {
    errores.push(
      `${ruta}: categoría «${art.categoria}» desconocida. Las del sitio son: ${Object.keys(CATEGORIAS).join(', ')}`
    );
  }
  if (art.fecha && !fechaValida(art.fecha)) {
    errores.push(`${ruta}: la fecha debe ser YYYY-MM-DD y existir en el calendario, y es «${art.fecha}»`);
  }

  /* ⚠️ UNA ETIQUETA CON COMA ROMPE EL LISTADO, Y NO SE VE AL MIRAR LA PÁGINA.
     Las etiquetas viajan al listado en `data-etiquetas`, que es una lista
     SEPARADA POR COMAS, así que «STC 163/2016, de 3 de octubre» se parte en
     dos —«STC 163/2016» y «de 3 de octubre»— y el desplegable enseña dos
     etiquetas donde había una. El enlace del lateral, que sí lleva la etiqueta
     entera, deja entonces de corresponder con ninguna.

     Lo descubrió la comprobación de enlaces al probar con símbolos. Es error y
     no aviso: se publica roto, y el único momento en que se puede arreglar sin
     dolor es antes de publicar.

     ⚠️ La salida NO es escapar la coma ni cambiar el separador: `data-etiquetas`
     lo lee el navegador con un `split(",")` y cualquiera de las dos cosas
     obligaría a tocar las dos puntas por una etiqueta que, además, se lee peor.
     Se parte en dos etiquetas y listo. */
  if (Array.isArray(art.etiquetas)) {
    for (const e of art.etiquetas) {
      if (String(e).includes(',')) {
        errores.push(
          `${ruta}: la etiqueta «${e}» lleva una coma, y las etiquetas viajan ` +
          'al listado separadas por comas: se partiría en dos. Divídela o quita la coma.'
        );
      }
    }

    /* Dos etiquetas distintas que produzcan la misma clave se funden en una
       sola en el desplegable, y gana la primera grafía. Es AVISO y no error:
       la página funciona —el filtro selecciona— pero el autor escribió dos
       cosas y verá una. */
    const porClave = new Map();
    for (const e of art.etiquetas) {
      const k = clave(e);
      if (!k) continue;
      if (porClave.has(k) && porClave.get(k) !== e) {
        avisos.push(
          `${art.slug || ruta}: las etiquetas «${porClave.get(k)}» y «${e}» dan la misma ` +
          `clave de URL («${k}»), así que el listado las tratará como una sola.`
        );
      } else {
        porClave.set(k, e);
      }
    }
  }

  /* `actualizado` sigue siendo OPCIONAL EN EL JSON, pero ya no es opcional en
     la página: sin él se enseña la fecha de publicación. Lo que se valida aquí
     es solo lo que el cliente escribe, y si viene tiene que ser usable.

     ⚠️ ES ERROR Y NO AVISO, al revés que el slug largo o los `id` derivados.
     La diferencia es la de siempre en este archivo: aquellos publican bien y
     solo son mejorables, mientras que una fecha mal formada aquí **se
     publicaría rota**. Va a `datetime` del <time>, a `dateModified` del
     JSON-LD, a `article:modified_time` y al `lastmod` del sitemap: cuatro
     sitios donde una cadena que no es una fecha es un dato inválido que
     ningún buscador puede leer, y ninguno de los cuatro da error al servirse.

     Y una anterior a la publicación no es un error de formato sino de sentido
     —un artículo no se actualiza antes de existir—, con el mismo destino: se
     declararía un `dateModified` previo al `datePublished`. */

  if (art.actualizado !== undefined && art.actualizado !== null) {
    if (!fechaValida(art.actualizado)) {
      errores.push(
        `${ruta}: «actualizado» debe ser una fecha YYYY-MM-DD que exista en el ` +
        `calendario, como «fecha», y es «${art.actualizado}»`
      );
    } else if (art.fecha && fechaValida(art.fecha)) {
      /* Comparación de cadenas y no de Date: en formato ISO el orden
         alfabético ES el cronológico, y así no se arrastra la zona horaria
         que `new Date('2026-09-28')` interpreta como UTC. */
      if (art.actualizado < art.fecha) {
        errores.push(
          `${ruta}: «actualizado» (${art.actualizado}) es anterior a «fecha» ` +
          `(${art.fecha}). Un artículo no puede actualizarse antes de publicarse.`
        );
      }

      /* ⚠️ AQUÍ HABÍA UN AVISO PARA `actualizado === fecha` Y SE HA RETIRADO,
         porque lo que decía ha dejado de ser verdad. Decía que esa fecha «NO se
         va a mostrar: diría dos veces lo mismo», y era cierto mientras
         derivar() la descartaba.

         Desde que la línea se enseña SIEMPRE —encargo del cliente, razonado en
         derivar()— escribir `actualizado` igual a `fecha` da exactamente el
         mismo resultado que no escribirlo. Ya no hay nada de lo que avisar: no
         se pierde un dato ni se esconde nada.

         Lo que NO decae es el error de arriba. Que sea ANTERIOR a la
         publicación sigue siendo un problema de sentido —un artículo no se
         actualiza antes de existir— y publicaría un `dateModified` previo al
         `datePublished`. */
    }
  }

  /* ⚠️ AVISO Y NO ERROR, Y AQUÍ LA DIFERENCIA IMPORTA MÁS QUE EN NINGÚN OTRO
     SITIO: el slug es lo único de este archivo que NO se puede corregir
     después. Al publicarse queda fijado en la URL, y cambiarlo rompe cualquier
     enlace que alguien haya compartido.

     Aun así no puede ser un error. Un slug largo publica perfectamente y solo
     es feo; bloquear por eso una publicación legítima sería peor. Lo que hace
     falta es que se LEA a tiempo, y por eso el texto va dirigido al cliente y
     dice explícitamente que después ya no tiene arreglo.

     ⚠️ EL UMBRAL ES 40 PORQUE ES EL OBJETIVO, no porque sea el punto donde algo
     se rompe. La regla que aplica n8n al derivar el slug del título es cortar a
     ~40 en un guion, así que el aviso salta exactamente cuando esa regla no se
     ha cumplido. Aviso y objetivo miden lo mismo, que es lo que hace que el
     aviso signifique algo.

     Estuvo en 45 y era demasiado justo: el slug del PR #1
     —«falta-de-masc-como-requisito-de-procedibilidad»— mide 46, o sea que lo
     cazaba por UN carácter. Uno de 45 se habría colado en silencio siendo el
     mismo problema. Con 40 hay seis de holgura sobre el caso conocido.

     Referencias: el de n8n, 46. El escrito a mano, «masc-requisito-
     procedibilidad», 29. */
  if (art.slug && art.slug.length > 40) {
    avisos.push(
      `La dirección de este artículo en la web va a ser muy larga: ` +
      `«${art.slug}» (${art.slug.length} caracteres). Publica bien igualmente, ` +
      `pero conviene saber que ESTO NO SE PUEDE CAMBIAR DESPUÉS sin romper los ` +
      `enlaces que se hayan compartido. Si prefieres una más corta, dilo antes ` +
      `de publicar.`
    );
  }

  /* ⚠️ AVISO PARA DEJAR CONSTANCIA, no para frenar nada. La portada se ve en la
     vista previa, así que no puede colarse una imagen sin que nadie la mire: lo
     que esto añade es que quede ESCRITO en el PR que la puso la IA y no el
     cliente, para que no se dé por suya más adelante.

     El build no usa `origen` ni `prompt` para nada más: solo lee `archivo` y
     `alt`. Son documentación dentro del JSON, y este aviso es lo único que los
     mira. */
  if (art.imagen && art.imagen.origen && art.imagen.origen !== 'cliente') {
    avisos.push(
      `La imagen de portada de este artículo NO la has aportado tú: la ha ` +
      `generado la inteligencia artificial. Mírala en la vista previa y, si ` +
      `prefieres otra, súbela a la carpeta de Drive antes de publicar.`
    );
  }

  const ids = new Set();
  for (const s of art.secciones || []) {
    if (!s.id) errores.push(`${ruta}: una sección sin id`);
    if (ids.has(s.id)) errores.push(`${ruta}: id de sección repetido «${s.id}»`);
    ids.add(s.id);

    /* ⚠️ ES UN AVISO Y NO UN ERROR, Y LA DIFERENCIA ESTÁ PENSADA. Un `id`
       derivado del título funciona: el índice enlaza y el ancla resuelve. Lo
       que tiene es una fragilidad futura —al retocar una palabra del epígrafe
       cambia el ancla y se rompen los enlaces compartidos— y por eso el
       proyecto los escribe cortos y a mano.

       Es una heurística, así que puede equivocarse: un epígrafe de una sola
       palabra da legítimamente un `id` igual a su título normalizado. Si esto
       fuera un error, un falso positivo bloquearía una publicación correcta
       del cliente, que es peor que un `id` largo. Como aviso sale en el
       comentario del PR y lo ve quien revisa antes de mergear. */
    if (s.id && s.titulo && s.id === clave(s.titulo) && s.id.length > 24) {
      avisos.push(
        `${art.slug}: el id «${s.id}» parece derivado del título. ` +
        'Conviene uno corto y estable: al retocar el epígrafe cambiaría el ancla.'
      );
    }
  }

  /* Integridad de las referencias. Citar un número que no existe ES un error:
     el enlace llevaría a ninguna parte. Declarar una referencia y no citarla
     es solo un aviso, porque es una errata del texto y no del sistema —y de
     hecho el artículo de MASC tiene tres. */

  const declaradas = new Set();
  for (const g of art.referencias || []) {
    for (const it of g.items || []) if (it.numero) declaradas.add(Number(it.numero));
  }
  const citadas = new Set();
  const recoger = (h) => llamadasDe(h || '').forEach((n) => citadas.add(n));
  recoger(art.entradilla);
  for (const s of art.secciones || []) {
    for (const b of s.bloques || []) {
      recoger(b.html);
      recoger(b.fuente_html);
      for (const it of b.items || []) recoger(it.html);
    }
  }
  for (const n of citadas) {
    if (!declaradas.has(n)) errores.push(`${ruta}: se cita [${n}] y no hay referencia con ese número`);
  }
  const huerfanas = [...declaradas].filter((n) => !citadas.has(n)).sort((a, b) => a - b);
  if (huerfanas.length) {
    avisos.push(`${art.slug}: referencias declaradas y nunca citadas: ${huerfanas.map((n) => `[${n}]`).join(', ')}`);
  }
}

/* --------------------------------------------------------- lectura ------ */

async function existe(p) {
  try { await access(p); return true; } catch { return false; }
}

async function leerArticulos() {
  if (!(await existe(CONTENIDO))) return [];
  const carpetas = (await readdir(CONTENIDO, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const fuera = [];
  for (const carpeta of carpetas) {
    const ruta = join(CONTENIDO, carpeta, 'articulo.json');
    if (!(await existe(ruta))) { avisos.push(`${carpeta}: sin articulo.json, se salta`); continue; }
    let art;
    try {
      art = JSON.parse(await readFile(ruta, 'utf8'));
    } catch (e) {
      errores.push(`${carpeta}/articulo.json: JSON inválido — ${e.message}`);
      continue;
    }
    if (art.slug !== carpeta) {
      errores.push(`${carpeta}: el slug del JSON es «${art.slug}» y no coincide con la carpeta`);
    }
    validar(art, `${carpeta}/articulo.json`);
    for (const a of art.avisos || []) avisos.push(`${art.slug}: ${a}`);
    fuera.push({ ...derivar(art), _carpeta: join(CONTENIDO, carpeta) });
  }

  /* Orden determinista: fecha descendente y el slug desempata. Sin el
     desempate, dos artículos del mismo día podrían salir en distinto orden
     según el sistema de archivos y el build dejaría de ser idempotente. */

  fuera.sort((a, b) => (a.fecha === b.fecha ? a.slug.localeCompare(b.slug) : b.fecha.localeCompare(a.fecha)));
  return fuera;
}

/* --------------------------------------------------------- escritura --- */

async function escribirSiCambia(ruta, contenido) {
  if (await existe(ruta)) {
    const actual = await readFile(ruta, 'utf8');
    if (actual === contenido) return false;
  }
  await writeFile(ruta, contenido, 'utf8');
  return true;
}

async function main() {
  const arts = await leerArticulos();

  if (errores.length) {
    console.error('\n✗ El build no puede continuar:\n');
    for (const e of errores) console.error('   ' + e);
    process.exit(1);
  }

  /* ⚠️ UN SITIO SIN ARTÍCULOS ES UN ESTADO LEGÍTIMO Y HAY QUE GENERARLO.
     AQUÍ HABÍA UN `return` Y ERA UN FALLO SERIO.

     Decía «No hay artículos. Nada que generar» y se salía sin tocar nada, que
     es justo lo contrario de lo que hace falta: al retirar el último artículo,
     las regiones GENERADO: se quedaban con la tarjeta, la URL del sitemap, el
     <item> del feed y el ItemList del artículo que ya no existe. O sea que el
     sitio anunciaba en cuatro sitios algo que da 404, y el build no escribía
     nada — ni siquiera avisaba.

     Se descubrió al retirar el artículo de MASC para republicarlo por el
     circuito automático. El síntoma era desconcertante: el build decía que
     todo iba bien y `git status` salía limpio, mientras la portada seguía
     enseñando el artículo borrado.

     Ahora sigue adelante con la lista vacía: las regiones se reescriben
     vacías, que es la representación correcta de «no hay artículos». */

  if (!arts.length) {
    console.log('Sin artículos en contenido/articulos/: se vacían las regiones.');
  }

  let escritos = 0;

  /* 1 · páginas de artículo + portadas */
  for (const [i, art] of arts.entries()) {
    const dir = join(RAIZ, 'articulos', art.slug);
    await mkdir(dir, { recursive: true });

    const origen = join(art._carpeta, art.imagen.archivo);
    if (await existe(origen)) {
      const r = await procesarPortada(origen, join(dir, art.imagen.archivo));
      if (r.aviso) avisos.push(`${art.slug}: ${r.aviso}`);
    } else {
      errores.push(`${art.slug}: no existe la imagen ${art.imagen.archivo}`);
    }

    /* ⚠️ `arts` VA DE MÁS NUEVO A MÁS VIEJO, así que el de índice MENOR es el
       publicado después. Es al revés de lo que sugiere el array y es el error
       fácil de cometer aquí.

       El orden es el mismo que usa todo lo demás —fecha descendente, slug de
       desempate— y por eso se pasa resuelto en vez de recalcularlo en la
       plantilla: un segundo criterio podría divergir sin que nada avisara.

       ⚠️ ESTO HACE QUE PUBLICAR UN ARTÍCULO REESCRIBA TAMBIÉN EL HTML DEL
       ANTERIOR, para añadirle su «Leer siguiente». Es esperado y está
       documentado en CLAUDE.md: un PR de publicación toca ahora dos páginas de
       artículo, no una. No rompe la idempotencia —dos pasadas seguidas dan lo
       mismo— ni el PDF, que no imprime esta navegación. */

    const vecinos = { siguiente: arts[i - 1], anterior: arts[i + 1] };

    if (await escribirSiCambia(join(dir, 'index.html'), paginaArticulo(art, vecinos))) escritos++;
  }

  /* 2 · listado */
  const listado = join(RAIZ, 'articulos', 'index.html');
  let html = await readFile(listado, 'utf8');
  html = reemplazarRegion(html, 'filtros', botonesCategoria(), 'articulos/index.html');
  html = reemplazarRegion(html, 'articulos', arts.map(tarjetaListado).join('\n\n'), 'articulos/index.html');
  /* El ItemList del <head>. Era el único sitio donde un artículo se escribía a
     mano, y su despiste no daba error: declaraba a Google una URL muerta. */
  html = reemplazarRegion(html, 'itemlist', bloqueItemList(arts), 'articulos/index.html');
  if (await escribirSiCambia(listado, html)) escritos++;

  /* 3 · portada: destacado + los OTROS en «Últimos artículos».

     El destacado es el más reciente salvo que un JSON pida `"destacado": true`.
     La lista de abajo enseña los que NO son el destacado, nunca el destacado:
     así no puede darse la duplicación que el CLAUDE.md documentaba. */

  const marcado = arts.find((a) => a.destacado === true);
  const destacado = marcado || arts[0];
  if (arts.filter((a) => a.destacado === true).length > 1) {
    avisos.push('Hay más de un artículo con "destacado": true; manda el más reciente de ellos');
  }

  /* ⚠️ SIN ARTÍCULOS NO HAY DESTACADO, y `arts[0]` es undefined: leer
     `destacado.slug` reventaba con un TypeError. Era lo único que impedía que
     el build funcionara con la lista vacía.

     La región se queda vacía, no con un bloque a medias. Lo que NO puede hacer
     el build es esconder la <section>: la región vive dentro de ella, así que
     la sección sigue pintando su rótulo «Lectura recomendada» sobre un hueco.
     Es feo y transitorio —dura lo que tarde en publicarse un artículo— y
     esconderla pediría mover las marcas fuera de la <section>, que es un
     cambio de maqueta y no de generador. Está anotado en el CLAUDE.md. */

  const bloqueDest = destacado
    ? bloqueDestacado(destacado)
    : '      <!-- Sin artículos publicados: no hay lectura recomendada. -->';
  const resto = destacado ? arts.filter((a) => a.slug !== destacado.slug).slice(0, 3) : [];

  const portada = join(RAIZ, 'index.html');
  let ph = await readFile(portada, 'utf8');
  ph = reemplazarRegion(ph, 'destacado', bloqueDest, 'index.html');
  ph = reemplazarRegion(ph, 'ultimos', resto.map(tarjetaPortada).join('\n\n'), 'index.html');
  if (await escribirSiCambia(portada, ph)) escritos++;

  /* 4 · sitemap y feed */
  const sm = join(RAIZ, 'sitemap.xml');
  let smx = await readFile(sm, 'utf8');
  smx = reemplazarRegion(smx, 'articulos', arts.map(entradaSitemap).join('\n\n'), 'sitemap.xml');
  if (await escribirSiCambia(sm, smx)) escritos++;

  const fd = join(RAIZ, 'feed.xml');
  let fdx = await readFile(fd, 'utf8');
  fdx = reemplazarRegion(fdx, 'articulos', arts.map(entradaFeed).join('\n\n'), 'feed.xml');
  if (await escribirSiCambia(fd, fdx)) escritos++;

  if (errores.length) {
    console.error('\n✗ Errores:\n');
    for (const e of errores) console.error('   ' + e);
    process.exit(1);
  }

  /* ⚠️ LAS DOS COMPROBACIONES VAN AQUÍ, DESPUÉS DE ESCRIBIR, Y ES DELIBERADO.
     La segunda lee el HTML generado, así que tiene que correr con los archivos
     ya en disco: comprobar los JSON de origen no habría cazado este fallo,
     porque lo que divergía era lo publicado.

     Son ERRORES y no avisos. Un enlace de filtro que no selecciona nada no da
     ningún error al pulsarlo —el listado se abre entero, como si no se hubiera
     filtrado— así que si esto no para el build, no lo para nada. */
  try {
    const casos = await comprobarClaves();
    const r = await comprobarEnlaces();
    console.log(
      `\n✓ Claves: ${casos} caso(s) coinciden entre plantilla.mjs y main.js.` +
      (r.nota ? `\n  ${r.nota}` : `\n✓ Enlaces de filtro: ${r.revisados} revisado(s), todos válidos.`)
    );
  } catch (e) {
    console.error(`\n✗ ${e.message}\n`);
    process.exit(1);
  }

  console.log(`\n✓ ${arts.length} artículo(s) · ${escritos} archivo(s) modificado(s)\n`);
  for (const a of arts) {
    const marca = a.slug === destacado.slug ? ' ← destacado' : '';
    console.log(`   ${a.fecha}  ${String(a.minutos).padStart(2)} min  ${a.palabras.toString().padStart(5)} pal  ${a.slug}${marca}`);
  }
  if (avisos.length) {
    console.log('\n⚠ Avisos:\n');
    for (const a of avisos) console.log('   ' + a);
  }
  console.log();

  /* Los avisos se dejan en un archivo para que el workflow del PR los pueda
     comentar sin volver a parsear la salida. */
  await writeFile(join(RAIZ, 'scripts', '.avisos.json'), JSON.stringify(avisos, null, 2), 'utf8');
}

main().catch((e) => { console.error(e); process.exit(1); });
