/* ==========================================================================
   Comprueba que las DOS formas de calcular la clave de una URL coinciden.

     clave()     scripts/lib/plantilla.mjs   escribe los enlaces al generar
     claveURL()  js/main.js                  los interpreta en el navegador

   ⚠️ SON DOS COPIAS A LA FUERZA. `plantilla.mjs` es un módulo de Node que no se
   sirve al navegador, y `main.js` es un script clásico que no puede importarlo
   sin convertir el sitio en algo con build. La regla dura del proyecto —HTML,
   CSS y JS puro, sin dependencias— es lo que impide tener una sola.

   Lo que sí se puede es comprobar que dan el mismo resultado, y eso es esto.

   ⚠️ NO SE REESCRIBE LA FUNCIÓN DEL NAVEGADOR AQUÍ: SE EXTRAE DEL ARCHIVO.
   Una copia escrita a mano en esta prueba verificaría la copia, no el código
   que se publica, y pasaría en verde justo el día que alguien tocara `main.js`
   — que es el único día en que esta prueba sirve para algo.

   Se ejecuta desde build.mjs, así que corre en cada build y en el PR.
   ========================================================================== */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { clave } from './lib/plantilla.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Casos que tienen que dar lo mismo en las dos. Los seis primeros son las
   etiquetas REALES del artículo de MASC —las que destaparon el fallo— y el
   resto son los extremos: acentos, barras, signos, mayúsculas, espacios
   repetidos, guiones ya puestos y cadenas que se quedan vacías. */
const CASOS = [
  'MASC',
  'requisito de procedibilidad',
  'subsanación procesal',
  'LO 1/2025',
  'acceso a la jurisdicción',
  'Audiencias Provinciales',

  'Legalidad',
  'Garantías',
  'Derecho administrativo',
  'jurisdicción contencioso-administrativa',
  'Art. 439.1 LEC',
  'STC 163/2016, de 3 de octubre',
  '  espacios   de   sobra  ',
  'ya-viene-con-guiones',
  'MAYÚSCULAS Y ACENTOS ÁÉÍÓÚÜÑ',
  'signos: ¿y? ¡esto! «comillas» —raya—',
  'c++ / c#',
  '100%',
  '   ',
  '---',
  '',
];

/* Saca `claveURL` de js/main.js tal como se publica. Las marcas las pone el
   propio archivo; si alguien las quita, esto falla en vez de colarse. */
async function funcionDelNavegador() {
  const ruta = path.join(RAIZ, 'js', 'main.js');
  const fuente = await readFile(ruta, 'utf8');

  const ini = fuente.indexOf('/* CLAVE-URL:inicio */');
  const fin = fuente.indexOf('/* CLAVE-URL:fin */');
  if (ini === -1 || fin === -1 || fin < ini) {
    throw new Error(
      'No se encuentran las marcas CLAVE-URL:inicio / CLAVE-URL:fin en js/main.js.\n' +
      'Sin ellas no se puede comprobar que las dos copias coinciden. ' +
      'Si la función se ha movido, mueve las marcas con ella.'
    );
  }

  const trozo = fuente.slice(ini + '/* CLAVE-URL:inicio */'.length, fin);
  if (!/function\s+claveURL\s*\(/.test(trozo)) {
    throw new Error('Entre las marcas CLAVE-URL no hay ninguna función claveURL.');
  }

  /* Se evalúa el texto extraído y se devuelve la función. No hay nada del
     navegador aquí dentro —solo String, toLowerCase, normalize y replace— así
     que corre igual en Node. */
  // eslint-disable-next-line no-new-func
  return new Function(`${trozo}; return claveURL;`)();
}

export async function comprobarClaves() {
  const claveURL = await funcionDelNavegador();
  const fallos = [];

  for (const caso of CASOS) {
    const a = clave(caso);
    const b = claveURL(caso);
    if (a !== b) fallos.push({ caso, plantilla: a, navegador: b });
  }

  if (fallos.length) {
    const detalle = fallos
      .map(
        (f) =>
          `    «${f.caso}»\n` +
          `      plantilla.mjs → «${f.plantilla}»\n` +
          `      main.js       → «${f.navegador}»`
      )
      .join('\n');
    throw new Error(
      `clave() y claveURL() NO coinciden en ${fallos.length} caso(s):\n\n${detalle}\n\n` +
      '  Las dos tienen que dar lo mismo: una escribe los enlaces de etiqueta y\n' +
      '  categoría, y la otra los interpreta. Si divergen, el enlace lleva a un\n' +
      '  filtro que no selecciona nada y la página se ve entera, sin dar error.'
    );
  }

  return CASOS.length;
}

/* Se puede lanzar suelto para verlo: node scripts/comprobar-claves.mjs */
if (import.meta.url === `file://${process.argv[1]}`) {
  comprobarClaves()
    .then((n) => console.log(`✓ clave() y claveURL() coinciden en los ${n} casos.`))
    .catch((e) => {
      console.error(`\n✖ ${e.message}\n`);
      process.exit(1);
    });
}
