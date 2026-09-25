/* ==========================================================================
   Imagen de portada del artículo.

   ⚠️ NO SE GENERAN VARIANTES NI PROPORCIONES, y conviene saber por qué antes
   de añadirlas: EL SITIO RECORTA POR CSS. La misma foto la sirve `object-fit:
   cover` al 21:9 de la cabecera del artículo, al 3:2 del destacado de portada
   y del listado, y al 16:9 de las tarjetas abiertas. Un juego de recortes por
   proporción sería peso extra para enseñar exactamente lo mismo.

   Lo único que hace falta es que la foto que sube n8n no pese de más, así que
   aquí solo se limita el ancho y se recomprime.
   ========================================================================== */

import { copyFile, stat } from 'node:fs/promises';

const ANCHO_MAX = 1600;   // el mismo que ya tenían las fotos del sitio
const CALIDAD = 82;

/* sharp es opcional a propósito: si no está instalado, la imagen se copia tal
   cual y el build avisa. Así el generador sigue funcionando en un entorno sin
   binarios nativos, que es justo donde sharp da problemas. */

let sharp = null;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  sharp = null;
}

export async function procesarPortada(origen, destino) {
  if (!sharp) {
    await copyFile(origen, destino);
    const { size } = await stat(destino);
    return { optimizada: false, bytes: size, aviso: 'sharp no disponible: imagen copiada sin optimizar' };
  }

  const img = sharp(origen);
  const meta = await img.metadata();
  const redimensiona = meta.width > ANCHO_MAX;

  await img
    .resize(redimensiona ? { width: ANCHO_MAX, withoutEnlargement: true } : undefined)
    .jpeg({ quality: CALIDAD, mozjpeg: true })
    .toFile(destino);

  const { size } = await stat(destino);
  return {
    optimizada: true,
    bytes: size,
    ancho: redimensiona ? ANCHO_MAX : meta.width,
    alto: redimensiona ? Math.round((meta.height * ANCHO_MAX) / meta.width) : meta.height,
  };
}
