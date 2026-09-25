#!/usr/bin/env node
/* ==========================================================================
   node capturas.mjs [<slug>…]

   Deja en scripts/.capturas/ una imagen de página completa a 1440 y a 375 de
   la portada, del listado y de cada artículo.

   Es para el PR: lo que convierte «he generado un artículo» en algo que se
   puede revisar sin descargar la rama. En local sirve para lo mismo.

   ⚠️ NO es una prueba: nadie compara estas imágenes con nada. Si algún día se
   quiere detectar regresiones visuales hay que guardar una referencia y
   comparar, y entonces el ancho y la versión de Chromium pasan a ser parte del
   contrato.
   ========================================================================== */

import { readdir, mkdir, rm } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'scripts', '.capturas');

/* Los dos anchos del encargo. 1440 es el contenedor máximo del sistema y 375
   el móvil de referencia; entre medias están los cortes medidos —1084, 959,
   740— que no se capturan porque lo que se revisa aquí es el contenido, no la
   maqueta. */

const ANCHOS = [1440, 375];

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('\n✗ Falta playwright.\n\n   cd scripts && npm install && npx playwright install chromium\n');
    process.exit(1);
  }

  const pedidos = process.argv.slice(2).filter((a) => !a.startsWith('-'));

  const slugs = (await readdir(join(RAIZ, 'contenido', 'articulos'), { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => !pedidos.length || pedidos.includes(n))
    .sort();

  const paginas = [
    ['portada', join(RAIZ, 'index.html')],
    ['listado', join(RAIZ, 'articulos', 'index.html')],
    ...slugs.map((s) => [s, join(RAIZ, 'articulos', s, 'index.html')]),
  ];

  await rm(SALIDA, { recursive: true, force: true });
  await mkdir(SALIDA, { recursive: true });

  const navegador = await chromium.launch();
  const hechas = [];

  for (const ancho of ANCHOS) {
    const ctx = await navegador.newContext({
      viewport: { width: ancho, height: 900 },
      deviceScaleFactor: 2,
      /* Sin esto, las transiciones y el vídeo del hero salen a mitad de
         camino y dos ejecuciones seguidas dan imágenes distintas. */
      reducedMotion: 'reduce',
    });

    for (const [nombre, ruta] of paginas) {
      const p = await ctx.newPage();
      await p.goto(pathToFileURL(ruta).href, { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      /* El bloque «Continúa leyendo» se rellena por fetch de articulos/. Sobre
         file:// eso no resuelve, así que la sección se queda oculta, que es su
         estado correcto cuando no hay candidatos. No se espera por él. */
      const destino = join(SALIDA, `${nombre}-${ancho}.png`);
      await p.screenshot({ path: destino, fullPage: true });
      await p.close();
      hechas.push(`${nombre}-${ancho}.png`);
    }

    await ctx.close();
  }

  await navegador.close();
  console.log(`\n✓ ${hechas.length} capturas en scripts/.capturas/\n`);
  for (const h of hechas) console.log('   ' + h);
  console.log();
}

main().catch((e) => { console.error(e); process.exit(1); });
