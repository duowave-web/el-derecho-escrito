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
  botonesCategoria, entradaSitemap, entradaFeed, CATEGORIAS,
} from './lib/plantilla.mjs';
import { llamadasDe } from './lib/refs.mjs';
import { procesarPortada } from './lib/imagen.mjs';

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

function validar(art, ruta) {
  for (const c of CAMPOS) {
    if (art[c] === undefined) errores.push(`${ruta}: falta el campo «${c}»`);
  }
  if (art.categoria && !CATEGORIAS[art.categoria]) {
    errores.push(
      `${ruta}: categoría «${art.categoria}» desconocida. Las del sitio son: ${Object.keys(CATEGORIAS).join(', ')}`
    );
  }
  if (art.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(art.fecha)) {
    errores.push(`${ruta}: la fecha debe ser YYYY-MM-DD, y es «${art.fecha}»`);
  }
  const ids = new Set();
  for (const s of art.secciones || []) {
    if (!s.id) errores.push(`${ruta}: una sección sin id`);
    if (ids.has(s.id)) errores.push(`${ruta}: id de sección repetido «${s.id}»`);
    ids.add(s.id);
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

  if (!arts.length) {
    console.log('No hay artículos en contenido/articulos/. Nada que generar.');
    return;
  }

  let escritos = 0;

  /* 1 · páginas de artículo + portadas */
  for (const art of arts) {
    const dir = join(RAIZ, 'articulos', art.slug);
    await mkdir(dir, { recursive: true });

    const origen = join(art._carpeta, art.imagen.archivo);
    if (await existe(origen)) {
      const r = await procesarPortada(origen, join(dir, art.imagen.archivo));
      if (r.aviso) avisos.push(`${art.slug}: ${r.aviso}`);
    } else {
      errores.push(`${art.slug}: no existe la imagen ${art.imagen.archivo}`);
    }

    if (await escribirSiCambia(join(dir, 'index.html'), paginaArticulo(art))) escritos++;
  }

  /* 2 · listado */
  const listado = join(RAIZ, 'articulos', 'index.html');
  let html = await readFile(listado, 'utf8');
  html = reemplazarRegion(html, 'filtros', botonesCategoria(), 'articulos/index.html');
  html = reemplazarRegion(html, 'articulos', arts.map(tarjetaListado).join('\n\n'), 'articulos/index.html');
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
  const resto = arts.filter((a) => a.slug !== destacado.slug).slice(0, 3);

  const portada = join(RAIZ, 'index.html');
  let ph = await readFile(portada, 'utf8');
  ph = reemplazarRegion(ph, 'destacado', bloqueDestacado(destacado), 'index.html');
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
