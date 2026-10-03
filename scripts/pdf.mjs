#!/usr/bin/env node
/* ==========================================================================
   npm run pdf  ·  npm run pdf -- <slug> [<slug>…]

   Escribe articulos/<slug>/<slug>.pdf abriendo con Chromium la pagina del
   articulo YA GENERADA y pidiendole un PDF.

   ⚠️ SE EJECUTA DESPUES DE `npm run build`, NUNCA ANTES: lee el HTML del
   disco. `npm run publicar` encadena los dos, y es lo que conviene usar.

   ⚠️ NO HAY PLANTILLA DE PDF. El documento es la propia pagina del articulo
   vista con el medio `print`, revestida por css/imprimir.css. Lo unico que
   este script anade es la PORTADA, que es una pieza que en la web no existe.
   El motivo esta explicado en css/imprimir.css: una plantilla aparte seria un
   segundo sitio donde vive el articulo y se desincronizaria en silencio.
   ========================================================================== */

import { readdir, readFile, writeFile, access, mkdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

/* ⚠️ `AUTOR` SE IMPORTA, NO SE ESCRIBE. El nombre estuvo en dos literales de
   este archivo —la ficha del bloque de titulo y la cabecera corriente— y eso
   hacia que cambiar de autor en plantilla.mjs dejara el PDF firmado por el
   anterior, sin que nada avisara: la web saldria bien y el documento no. */

import { derivar, escapar, DOMINIO, AUTOR } from './lib/plantilla.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENIDO = join(RAIZ, 'contenido', 'articulos');

/* A4 son 210×297mm. Los margenes van AQUI y no en el @page de imprimir.css:
   Chromium ignora el margin de @page cuando se le pasan por la API, asi que
   declararlos en los dos sitios deja uno que miente.

   ⚠️ EL SUPERIOR SUBIO DE 20 A 28mm PARA HACERLE SITIO A LA CABECERA CORRIENTE.
   Chromium dibuja la cabecera DENTRO del margen superior, no sobre el texto, asi
   que sin esos 8mm de mas la linea del titulo abreviado se solapa con el cuerpo.

   ⚠️ Y LA CALIBRACION DE 259mm YA NO EXISTE. Aqui decia que al tocar estos
   numeros habia que cambiar el `height: 259mm` de .pdf-portada, que era
   297 − 20 − 18 y lo que hacia que la portada ocupase una pagina exacta. Sin
   portada aparte no hay nada que calibrar: el bloque de titulo fluye con el
   texto, asi que tampoco puede empujar una pagina en blanco. */

const MARGENES = { top: '28mm', bottom: '18mm', left: '20mm', right: '20mm' };

/* ⚠️ COMO SE ABREVIA EL TITULO DE LA CABECERA, y conviene tenerlo escrito porque
   el corte se ve.

   Se corta a 60 caracteres y SIEMPRE EN UN ESPACIO: se retrocede hasta el ultimo
   blanco antes del limite, de modo que no se parte una palabra por la mitad. Si
   no hubiera ningun espacio en los primeros 60 —un titulo de una sola palabra
   larguisima— se corta en seco, que es el unico caso en que puede partirse.

   Los 60 no aprietan: el de MASC mide 82 y queda en 57 mas la elision. En la
   banda de cabecera, a 7px Helvetica sobre los 170mm utiles menos el nombre del
   autor, caben del orden de 130 caracteres. El limite esta para que la cabecera
   siga siendo una REFERENCIA y no una segunda portada. */

const LIMITE_CABECERA = 60;

function abreviar(titulo) {
  if (titulo.length <= LIMITE_CABECERA) return titulo;
  const corte = titulo.lastIndexOf(' ', LIMITE_CABECERA);
  return titulo.slice(0, corte > 0 ? corte : LIMITE_CABECERA).trimEnd() + '…';
}

async function existe(p) {
  try { await access(p); return true; } catch { return false; }
}

/* --------------------------------------------- bloque de titulo --------- */

/* ⚠️ ESTO ERA UNA PORTADA DE PAGINA ENTERA Y HOY ES UN BLOQUE DE TITULO que
   abre la primera pagina, formato paper. Lo que se fue con ella:

     · el `break-after: page` y el `height: 259mm` — y con ellos la calibracion
     · la FOTO del articulo, que en un paper no pinta nada
     · el parrafo de `descripcion`, porque el resumen pasa a ser la ENTRADILLA
       del cuerpo, que ya estaba ahi: ver mas abajo

   El resultado es que el texto empieza en la pagina 1 y el PDF baja de 9 a 8
   paginas.

   El logo va INCRUSTADO en base64 y no por <img src>. Chromium carga la pagina
   desde file://, y aunque una ruta relativa funcionaria, el PDF se genera
   tambien en CI sobre una copia del repo: una ruta rota ahi no da error, solo
   deja un hueco blanco donde iba la marca. Incrustado no puede fallar. */

/* ⚠️ «ULTIMA ACTUALIZACION» VA EN LA MISMA LINEA, Y EN LA WEB VA EN LA SUYA.
   Parece una incoherencia y no lo es: AQUI CABE Y ALLI NO. Medido con el mes
   mas largo y el dia de dos digitos, que es el peor caso:

     fecha 161,8 + minutos 104,2 + actualizacion 293,5 + dos separadores 37,3
       = 596,8 px = 157,9 mm,  sobre los 170 mm utiles de un A4 con estos
         margenes. Holgura: 12,1 mm.

   La misma fila en la web pide 734,6 px sobre una columna de 720. La
   diferencia no es el ancho —la columna web son 190 mm, mas que estos 170—
   sino el ESTILO: la ficha de la web va en VERSALES, con tracking de 0,06em y
   con un icono por dato; la de aqui va en caja baja, sin iconos y con 0,04em.
   Las versales y los iconos son lo que la desbordan alli.

   Si algun dia se le pusieran versales o iconos a esta ficha, hay que volver a
   medir: se come la holgura de golpe.

   Y si la linea llegara a envolver no pasa nada: el bloque fluye con el texto,
   asi que simplemente ocupa una linea mas. Antes habia que vigilarlo porque el
   `overflow: hidden` de la portada de 259mm recortaba lo que sobrara. */

function bloqueTitulo(art, logoDataUri) {
  return `
<div class="pdf-portada">
  <img class="pdf-portada__logo" src="${logoDataUri}" alt="">
  <p class="pdf-portada__marca">El Derecho Escrito</p>

  <div class="pdf-portada__texto">
    <p class="pdf-portada__categoria">${escapar(art.categoriaTexto)}</p>
    <h1 class="pdf-portada__titulo">${escapar(art.titulo)}</h1>

    <div class="pdf-portada__ficha">
      <strong>${escapar(AUTOR.nombre)}</strong>
      <time datetime="${art.fecha}">${art.fechaLarga}</time>
      <span class="pdf-portada__sep" aria-hidden="true">·</span>
      <span>${art.minutos} min de lectura</span>
      <span class="pdf-portada__sep" aria-hidden="true">·</span>
      <time datetime="${art.actualizado}">Última actualización: ${art.actualizadoLarga}</time>
    </div>
  </div>
</div>`;
}

/* --------------------------------------------------------- pie ---------- */

/* ⚠️ EL PIE SALE TAMBIEN EN LA PORTADA, y no es un descuido: Chromium aplica
   headerTemplate/footerTemplate a TODAS las paginas y no da ninguna forma de
   saltarse la primera. El numero de pagina llega como texto dentro de un
   <span class="pageNumber">, asi que no hay selector que lo distinga.

   Las alternativas eran peores: generar dos PDF y unirlos pide una libreria
   mas y descuadra la numeracion, y renunciar a los numeros de pagina por esto
   seria cambiar algo que se usa por algo que solo se mira una vez.

   ⚠️ La plantilla del pie es un DOCUMENTO APARTE: no hereda ni los estilos de
   la pagina ni los margenes. Por eso repite el padding lateral a mano —para
   alinear con la mancha de texto— y trae sus propias fuentes. */

/* ⚠️ LA CABECERA SE IMPRIME TAMBIEN EN LA PRIMERA PAGINA, Y NO HAY FORMA DE
   EVITARLO. Es la misma limitacion que ya tenia el pie: Chromium aplica estas
   plantillas a TODAS las paginas y no ofrece ningun selector por numero —el
   numero llega como TEXTO dentro de un <span class="pageNumber">—. Tampoco sirve
   `@page :first`, porque los margenes vienen por la API y Chromium ignora los
   del @page.

   Asi que en la pagina 1 la cabecera corriente queda encima del bloque de
   titulo. Se asume: es una linea de 7px en gris claro y funciona como cintillo.
   Evitarlo pediria generar dos PDF y unirlos, que es una libreria mas y
   descuadra la numeracion.

   ⚠️ Y LA CABECERA NO PUEDE IR VACIA, que es lo que estaba antes. Sin plantilla
   —o con una vacia— Chromium pinta LA SUYA, con el titulo de la pagina y LA
   FECHA DEL DIA, y eso rompe el determinismo del PDF. Llenarla es, ademas de
   diseno, lo que mantiene esa puerta cerrada. */

function cabecera(art) {
  return `
<div style="width:100%;padding:0 20mm;font-family:Helvetica,Arial,sans-serif;
            font-size:7px;color:#8a857f;display:flex;justify-content:space-between;
            align-items:baseline;">
  <span>${escapar(abreviar(art.titulo))}</span>
  <span>${escapar(AUTOR.nombre)}</span>
</div>`;
}

function pie(art) {
  return `
<div style="width:100%;padding:0 20mm;font-family:Helvetica,Arial,sans-serif;
            font-size:7px;color:#8a857f;display:flex;justify-content:space-between;
            align-items:baseline;">
  <span>El Derecho Escrito &nbsp;·&nbsp; ${escapar(art.url.replace(/^https:\/\//, ''))}</span>
  <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;
}

/* --------------------------------------------------- fechas del PDF ----- */

/* ⚠️ CHROMIUM ESTAMPA LA HORA DEL RELOJ DENTRO DEL PDF, Y ESO ROMPIA LA
   IDEMPOTENCIA SIN QUE NADA AVISARA. Es el mismo fallo que ya evita el
   headerTemplate vacio, pero un paso mas adentro: alli la fecha se IMPRIME y
   se ve; aqui va en el diccionario /Info, que no se ve al abrir el documento.

   El PDF salia con dos campos distintos en cada pasada:

     /CreationDate (D:20260928181252+00'00')
     /ModDate      (D:20260928181252+00'00')

   Dos bytes de diferencia bastan para que git lo vea modificado. Y el efecto
   no se quedaba en el repositorio: contenido.yml empuja lo generado al PR con
   un PAT, y un push con PAT SI dispara el workflow, asi que cada ejecucion
   generaba un PDF nuevo, lo empujaba y arrancaba la siguiente. El PR #4 tiene
   siete commits del bot seguidos, uno cada ~85 s, y lo corto el merge, no el
   generador.

   El gate de idempotencia no podia verlo porque corria `build` dos veces, y
   `build` no toca el PDF: lo escribe `pdf`. Ahora el gate encadena los dos.

   La hora NO se inventa aqui: son las 09:00 +02:00 de fechaISO(), las mismas
   que ya usan article:published_time, el datePublished del JSON-LD y los
   <time> de las tarjetas. Una sola hora de publicacion en todo el proyecto. */

const HORA_PDF = "090000+02'00'";

/* ⚠️ LA SUSTITUCION TIENE QUE MEDIR LO MISMO EN BYTES, y no es un detalle de
   estilo: la tabla xref del final del PDF son offsets absolutos en bytes desde
   el principio del archivo. Alargar o acortar el diccionario /Info correria
   todo lo que viene detras y dejaria el xref apuntando a mitad de un objeto:
   un PDF que algunos lectores abren y otros declaran corrupto.

   El formato de Chromium es `D:YYYYMMDDHHmmSS+00'00'`, 23 bytes, y el nuestro
   `D:YYYYMMDD` + HORA_PDF mide los mismos 23. Aun asi se COMPRUEBA abajo en
   vez de confiarlo: si Chromium cambia de formato, esto tiene que fallar y no
   escribir un PDF roto. */

const FECHAS = /\/(CreationDate|ModDate)\s*\(D:\d{14}(?:[+-]\d{2}'\d{2}'|Z)?\)/g;

/* ⚠️ LOS DOS CAMPOS YA NO VALEN LO MISMO, Y ANTES SI.

   /CreationDate es cuando se creo el documento —la publicacion— y /ModDate
   cuando se modifico por ultima vez. Mientras no existio el campo
   `actualizado`, los dos salian de `fecha` porque era lo unico que habia; con
   el campo, /ModDate pasa a decir la verdad.

   ⚠️ NO ROMPE EL DETERMINISMO, que es lo unico intocable aqui: la fecha nueva
   sale del JSON igual que la vieja, nunca del reloj.

   ⚠️ Y `art.actualizado` YA NO PUEDE SER NULO. Lo normaliza derivar(), que
   desde el encargo de enseñar siempre la linea le pone la fecha de publicacion
   cuando el JSON no trae el campo. Por eso aqui ya no hace falta el
   `|| art.fecha` que habia: seria codigo muerto que sugiere un caso que no
   existe. Un articulo sin `actualizado` sigue dando /ModDate == /CreationDate,
   igual que antes.

   Las dos marcas miden los mismos 23 bytes: solo cambian los digitos del dia.
   La guarda de longitud de abajo sigue cubriendo las dos. */

function conFechasFijas(pdf, art) {
  const marca = (iso) => `D:${iso.replaceAll('-', '')}${HORA_PDF}`;
  const fechas = {
    CreationDate: marca(art.fecha),
    ModDate: marca(art.actualizado),
  };
  let halladas = 0;

  /* latin1 y no utf8: el PDF es binario y latin1 es el unico round-trip
     byte a byte —cada byte 0-255 es un punto de codigo 0-255—. Con utf8
     cualquier byte alto se reescribiria como U+FFFD y corromperia el archivo. */

  const salida = Buffer.from(
    pdf.toString('latin1').replace(FECHAS, (_, campo) => {
      halladas++;
      return `/${campo} (${fechas[campo]})`;
    }),
    'latin1',
  );

  if (halladas < 2) {
    throw new Error(
      `No se han encontrado /CreationDate y /ModDate en el PDF de ${art.slug} ` +
      `(halladas: ${halladas}). Chromium ha cambiado como escribe el diccionario ` +
      '/Info: hay que revisar la expresion FECHAS de scripts/pdf.mjs.',
    );
  }

  if (salida.length !== pdf.length) {
    throw new Error(
      `La fecha normalizada de ${art.slug} no mide lo mismo que la de Chromium ` +
      `(${pdf.length} → ${salida.length} bytes). Sustituirla correria los offsets ` +
      'de la tabla xref y dejaria el PDF corrupto. Revisa HORA_PDF.',
    );
  }

  return salida;
}

/* El equivalente binario de escribirSiCambia() de build.mjs, que es utf8 y
   sobre un PDF devolveria basura. Mismo motivo que alli: una pasada sin
   novedades no debe mover la marca de tiempo del archivo ni ensuciar el
   `git status`. */

async function escribirSiCambia(ruta, buf) {
  if (await existe(ruta)) {
    if ((await readFile(ruta)).equals(buf)) return false;
  }
  await writeFile(ruta, buf);
  return true;
}

/* --------------------------------------------------------- main --------- */

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error(
      '\n✗ Falta playwright.\n\n' +
      '   cd scripts && npm install && npx playwright install chromium\n'
    );
    process.exit(1);
  }

  const pedidos = process.argv.slice(2).filter((a) => !a.startsWith('-'));

  /* ⚠️ `contenido/articulos/` PUEDE NO EXISTIR, y aquí se daba por hecho.
     `readdir` sobre una ruta ausente lanza ENOENT, así que al retirar el
     último artículo esto moría con un stack trace de Node:

       Error: ENOENT: no such file or directory, scandir '…/contenido/articulos'

     En local se entiende; en CI deja el job en rojo sin decir qué ha pasado, y
     como `npm run publicar` encadena con `&&`, un build correcto acababa
     igualmente en fallo. Un sitio sin artículos no es un error: es un estado
     por el que se pasa cada vez que se retira el último para republicarlo. */

  const carpetas = (await existe(CONTENIDO))
    ? (await readdir(CONTENIDO, { withFileTypes: true }))
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .filter((n) => !pedidos.length || pedidos.includes(n))
        .sort()
    : [];

  /* Pedir un slug que no está SÍ es un error —quien lo pidió se equivocó de
     nombre, o el artículo no existe— pero no encontrar ninguno sin haber pedido
     nada no lo es: no hay PDF que hacer y ya está. */

  if (!carpetas.length) {
    if (pedidos.length) {
      console.error(`✗ No hay ningún artículo que se llame ${pedidos.join(', ')}.`);
      process.exit(1);
    }
    console.log('Sin artículos en contenido/articulos/: ningún PDF que generar.');
    return;
  }

  const logo = await readFile(join(RAIZ, 'img', 'logo.svg'), 'utf8');
  const logoDataUri = 'data:image/svg+xml;base64,' + Buffer.from(logo).toString('base64');

  const navegador = await chromium.launch();
  const ctx = await navegador.newContext();
  const hechos = [];

  for (const slug of carpetas) {
    const art = derivar(JSON.parse(await readFile(join(CONTENIDO, slug, 'articulo.json'), 'utf8')));
    const pagina = join(RAIZ, 'articulos', slug, 'index.html');

    if (!(await existe(pagina))) {
      console.error(`✗ ${slug}: no existe articulos/${slug}/index.html. ¿Has ejecutado «npm run build»?`);
      process.exitCode = 1;
      continue;
    }

    const p = await ctx.newPage();
    await p.goto(pathToFileURL(pagina).href, { waitUntil: 'networkidle' });

    /* Las fuentes llegan por @import de Google Fonts. Sin esta espera el PDF
       sale a veces con la fuente de respaldo, y como no da ningun error solo
       se nota comparando dos ejecuciones. */
    await p.evaluate(() => document.fonts.ready);

    await p.evaluate((html) => {
      const principal = document.querySelector('.articulo__principal');
      principal.insertAdjacentHTML('afterbegin', html);
    }, bloqueTitulo(art, logoDataUri));

    /* ⚠️ AQUI SE ESPERABA A QUE CARGARA LA FOTO DE LA PORTADA, Y YA NO HACE
       FALTA: el bloque de titulo no lleva imagen. La unica que quedaba era la
       portada del articulo y en formato paper no se imprime.

       El logo tampoco necesita espera: va incrustado en base64, que es
       justamente por lo que se eligio asi. */

    /* El JS de la pagina mete cosas que en papel no pintan nada: la barra de
       progreso y los relacionados, que se traen por fetch y aqui ni siquiera
       resolverian. imprimir.css ya los oculta; esto evita ademas que el fetch
       deje la pagina en `networkidle` falso. */
    await p.emulateMedia({ media: 'print' });

    const destino = join(RAIZ, 'articulos', slug, `${slug}.pdf`);
    await mkdir(dirname(destino), { recursive: true });

    /* Sin `path`: p.pdf() devuelve el buffer y se escribe mas abajo, ya con
       las fechas fijadas. Escribiendolo aqui pasaria por disco una version
       con la hora del reloj, que es justo lo que no debe existir. */

    const bytes = await p.pdf({
      format: 'A4',
      margin: MARGENES,
      printBackground: true,
      displayHeaderFooter: true,
      /* Chromium exige los dos: sin headerTemplate pinta el suyo, con el
         titulo de la pagina y la fecha del dia. Lo segundo ademas romperia la
         idempotencia del repositorio, porque cambiaria cada dia.

         ⚠️ ESTO ERA UN <span> VACIO y hoy lleva la cabecera corriente. La razon
         de que no pudiera faltar NO ha cambiado: lo que la mantiene cerrada es
         que haya CONTENIDO, no que este vacia. */
      headerTemplate: cabecera(art),
      footerTemplate: pie(art),
      preferCSSPageSize: false,
    });

    await escribirSiCambia(destino, conFechasFijas(bytes, art));

    await p.close();
    hechos.push(slug);
  }

  await navegador.close();

  console.log(`\n✓ ${hechos.length} PDF\n`);
  for (const s of hechos) console.log(`   articulos/${s}/${s}.pdf`);
  console.log();
}

main().catch((e) => { console.error(e); process.exit(1); });
