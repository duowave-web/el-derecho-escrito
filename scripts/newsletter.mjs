/* ==========================================================================
   Crea en Listmonk la campaña de un artículo recién publicado.

   Lo llama .github/workflows/newsletter.yml cuando detecta que un push a main
   ha AÑADIDO una carpeta en contenido/articulos/. También se puede ejecutar a
   mano para ver qué saldría:

     node scripts/newsletter.mjs <slug> --seco      no llama a la API
     node scripts/newsletter.mjs <slug>             crea la campaña

   ⚠️ NO ENVÍA NADA POR SÍ SOLO SI NO SE LE DICE. Crear una campaña la deja en
   borrador —la API de Listmonk no deja crearla en otro estado— y solo pasa a
   «running» si NEWSLETTER_ENVIAR vale «si». Está razonado abajo.
   ========================================================================== */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* ⚠️ `derivar()` ES EL MISMO QUE USA EL BUILD, y por eso se importa en vez de
   recalcular aquí los minutos de lectura, la fecha larga o el texto de la
   categoría. Si el correo los calculara por su cuenta, podría decir «14 min»
   donde la página dice «15» sin que nada avisara: son dos salidas del mismo
   dato y tienen que venir de la misma función.

   Lo único que NO se le pide a `derivar()` es la URL. La suya sale de
   `DOMINIO`, que es el dominio canónico y hoy no sirve la web; aquí hace falta
   `SITIO`, que es donde el artículo se abre de verdad. Está razonado sobre las
   dos constantes, en plantilla.mjs. */
import {
  SITIO, LISTA_ID, AUTOR, escapar, derivar,
} from './lib/plantilla.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ---------------------------------------------------------- ayudas --- */

function salir(mensaje) {
  console.error(`\n✖ ${mensaje}\n`);
  process.exit(1);
}

/* ⚠️ LA ETIQUETA ES LO QUE EVITA LOS DUPLICADOS, y por eso se construye de
   forma determinista a partir del slug. Si el workflow se ejecuta dos veces
   sobre el mismo commit —un reintento, un `re-run` a mano, dos pushes que
   tocan la misma carpeta— la segunda encuentra la campaña ya creada y no
   hace nada.

   Se usa una ETIQUETA y no el nombre porque el filtro por nombre de Listmonk
   es de texto libre —`query` busca por subcadena en nombre y asunto— y un
   titular que contenga a otro daría un falso positivo. Las etiquetas se
   comparan enteras. */
function etiquetaDe(slug) {
  return `auto-${slug}`;
}

/* --------------------------------------------------- el cuerpo HTML --- */

/* Lo que entra por {{ template "content" . }} en la plantilla de campaña.
   La envoltura —logo, mancheta, pie y baja— la pone la plantilla, que vive en
   el panel de Listmonk. Aquí va solo el artículo.

   ⚠️ TABLAS Y ESTILOS EN LÍNEA, SIN <style>. Gmail descarta las hojas de
   estilo del <head> y Outlook usa el motor de Word, que no entiende float ni
   flex. Es la misma regla que ya sigue la plantilla de correo de los
   comentarios, en servidor/artalk/correo.html. */
function cuerpo(art) {
  const url = `${SITIO}/articulos/${art.slug}/`;
  const pdf = `${url}${art.slug}.pdf`;
  const portada = `${url}${art.imagen?.archivo || 'portada.jpg'}`;
  const categoria = art.categoriaTexto;

  /* El `alt` de la portada es el del artículo, escapado. Si el correo no carga
     imágenes —que es el estado por defecto en varios clientes— eso es lo único
     que se lee en su lugar. */
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:26px 0 0;">
      <a href="${url}" style="text-decoration:none;">
        <img src="${portada}" width="540" alt="${escapar(art.imagen?.alt || '')}"
             style="display:block; width:100%; max-width:540px; height:auto; border:0; border-radius:3px;">
      </a>
    </td>
  </tr>

  <tr>
    <td style="padding:22px 0 0;">
      <p style="margin:0; font-family:Helvetica,Arial,sans-serif; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase; color:#2f6e68;">
        ${escapar(categoria)}
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding:10px 0 0;">
      <h1 style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:27px; font-weight:normal; line-height:1.25; color:#1e1e1e;">
        <a href="${url}" style="color:#1e1e1e; text-decoration:none;">${escapar(art.titulo)}</a>
      </h1>
    </td>
  </tr>

  <tr>
    <td style="padding:12px 0 0;">
      <p style="margin:0; font-family:Helvetica,Arial,sans-serif; font-size:12px; letter-spacing:0.04em; color:#66615b;">
        ${escapar(AUTOR.nombre)} &nbsp;&middot;&nbsp; ${escapar(art.fechaLarga)} &nbsp;&middot;&nbsp; ${art.minutos} min de lectura
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding:18px 0 0;">
      <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:16px; line-height:1.7; color:#444140;">
        ${escapar(art.entradilla)}
      </p>
    </td>
  </tr>

  <!-- Los dos botones. Van en una tabla de dos celdas y no uno al lado del
       otro con display:inline-block, porque Outlook no respeta los márgenes
       entre inline-blocks y los pega. -->
  <tr>
    <td style="padding:28px 0 26px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#2f6e68;">
            <a href="${url}" style="display:inline-block; padding:14px 26px; font-family:Helvetica,Arial,sans-serif; font-size:14px; font-weight:bold; color:#ffffff; text-decoration:none;">
              Leer el art&iacute;culo
            </a>
          </td>
          <td style="width:12px; font-size:0; line-height:0;">&nbsp;</td>
          <td style="border:1px solid #2f6e68;">
            <a href="${pdf}" style="display:inline-block; padding:13px 25px; font-family:Helvetica,Arial,sans-serif; font-size:14px; font-weight:bold; color:#2f6e68; text-decoration:none;">
              Descargar el PDF
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}

/* ------------------------------------------------------- la llamada --- */

async function api(ruta, opciones = {}) {
  const base = process.env.LISTMONK_URL;
  const usuario = process.env.LISTMONK_USUARIO;
  const token = process.env.LISTMONK_TOKEN;
  if (!base || !usuario || !token) {
    salir('Faltan LISTMONK_URL, LISTMONK_USUARIO o LISTMONK_TOKEN.');
  }

  const r = await fetch(`${base.replace(/\/$/, '')}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      /* El formato de la 6.2: «token usuario:clave». No es Bearer. */
      Authorization: `token ${usuario}:${token}`,
      ...(opciones.headers || {}),
    },
  });

  const texto = await r.text();
  let json;
  try { json = JSON.parse(texto); } catch { json = null; }

  if (!r.ok) {
    salir(`Listmonk respondió ${r.status} a ${ruta}: ${json?.message || texto.slice(0, 300)}`);
  }
  return json?.data;
}

/* ----------------------------------------------------------- el plan --- */

async function main() {
  const args = process.argv.slice(2);
  const seco = args.includes('--seco');
  const slug = args.find((a) => !a.startsWith('--'));

  if (!slug) salir('Uso: node scripts/newsletter.mjs <slug> [--seco]');

  const ruta = path.join(RAIZ, 'contenido', 'articulos', slug, 'articulo.json');
  let crudo;
  try {
    crudo = JSON.parse(await readFile(ruta, 'utf8'));
  } catch (e) {
    salir(`No se ha podido leer ${path.relative(RAIZ, ruta)}: ${e.message}`);
  }

  if (crudo.slug !== slug) {
    salir(`El campo slug dice "${crudo.slug}" y la carpeta se llama "${slug}".`);
  }

  /* Deriva lo mismo que el build: minutos, fecha larga y texto de categoría. */
  const art = derivar(crudo);

  const etiqueta = etiquetaDe(slug);
  const campana = {
    name: `${art.slug} — ${art.titulo}`.slice(0, 200),
    subject: art.titulo,
    lists: [LISTA_ID],
    type: 'regular',
    content_type: 'html',
    /* ⚠️ El `template_id` NO se escribe aquí. Si no se manda, Listmonk usa la
       plantilla marcada como predeterminada en el panel, que es justo la que
       se instala con estas instrucciones. Fijar un número aquí ataría el
       repositorio a un id de la base de datos del servidor, que cambia si se
       recrea la plantilla y no se puede comprobar desde aquí. */
    tags: [etiqueta],
    body: cuerpo(art),
  };

  const enviar = process.env.NEWSLETTER_ENVIAR === 'si';

  if (seco) {
    console.log('\n── PRUEBA EN SECO · no se llama a la API ──\n');
    console.log(`  nombre    ${campana.name}`);
    console.log(`  asunto    ${campana.subject}`);
    console.log(`  listas    ${campana.lists.join(', ')}`);
    console.log(`  etiqueta  ${etiqueta}`);
    console.log(`  tras crearla: ${enviar ? 'SE ENVÍA' : 'se queda en BORRADOR'}`);
    console.log(`  artículo  ${SITIO}/articulos/${slug}/`);
    console.log(`\n── cuerpo (${campana.body.length} caracteres) ──\n`);
    console.log(campana.body);
    return;
  }

  /* ⚠️ ANTIDUPLICADOS. Se pregunta ANTES de crear nada. El filtro por etiqueta
     puede devolver coincidencias de más según cómo lo interprete Listmonk, así
     que además se comprueba la etiqueta exacta sobre lo devuelto: la pregunta
     no es «¿hay algo parecido?» sino «¿existe ya esta». */
  const previas = await api(`/api/campaigns?tags=${encodeURIComponent(etiqueta)}&per_page=100`);
  const yaExiste = (previas?.results || []).find(
    (c) => Array.isArray(c.tags) && c.tags.includes(etiqueta),
  );

  if (yaExiste) {
    console.log(`\n✓ La campaña de "${slug}" ya existe (id ${yaExiste.id}, estado ${yaExiste.status}). No se toca.\n`);
    return;
  }

  const creada = await api('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(campana),
  });
  console.log(`\n✓ Campaña creada: id ${creada.id} · ${creada.status}`);

  if (!enviar) {
    console.log('  NEWSLETTER_ENVIAR no vale «si»: se queda en borrador.\n');
    return;
  }

  await api(`/api/campaigns/${creada.id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'running' }),
  });
  console.log('  Enviada.\n');
}

main().catch((e) => salir(e.stack || e.message));
