/* ==========================================================================
   Llamadas a referencias.

   n8n manda los tokens dentro del HTML de los bloques, en tres formas:

     {{ref:7}}     una sola          ->  [7]
     {{ref:1-2}}   rango             ->  [1–2]
     {{ref:1,6}}   lista suelta      ->  [1, 6]

   ⚠️ EL GUION DEL TOKEN ES CORTO Y EL DE LA SALIDA ES LARGO. En el token se
   escribe `1-2` porque es lo que un generador puede teclear sin pensar; en
   pantalla se compone `1–2` con raya, que es lo tipograficamente correcto para
   un intervalo y es lo que trae el documento original.

   ⚠️ CADA NUMERO ES SU PROPIO ENLACE, no el corchete entero. Con `[1, 6]` la
   referencia 1 y la 6 estan en sitios distintos de la lista, asi que enlazar
   solo la primera dejaria la segunda inalcanzable. El corchete y el separador
   se quedan fuera del <a> para que no parezcan pulsables.
   ========================================================================== */

const TOKEN = /\{\{ref:([0-9]+(?:\s*[-,]\s*[0-9]+)*)\}\}/g;

/* Devuelve los numeros que cita un token, ya expandido el rango. De `1-3` salen
   1, 2 y 3; de `1,6` salen 1 y 6. Sirve para validar contra las referencias
   declaradas sin tener que volver a parsear la cadena. */

export function numerosDe(cuerpo) {
  const fuera = [];
  for (const parte of cuerpo.split(',')) {
    const rango = parte.trim().match(/^(\d+)\s*-\s*(\d+)$/);
    if (rango) {
      const [, a, b] = rango.map(Number);
      for (let n = a; n <= b; n++) fuera.push(n);
    } else {
      fuera.push(Number(parte.trim()));
    }
  }
  return fuera;
}

function enlace(n) {
  return `<a href="#ref-${n}">${n}</a>`;
}

/* Un token -> el <sup> completo. El aria-label da el nombre largo porque
   «[1–2]» leido por un lector de pantalla es «corchete uno raya dos corchete»,
   que no dice nada. */

function pintar(cuerpo) {
  const partes = cuerpo.split(',').map((p) => p.trim());
  const trozos = partes.map((p) => {
    const rango = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rango) return `${enlace(rango[1])}–${enlace(rango[2])}`;
    return enlace(p);
  });
  const nums = numerosDe(cuerpo);
  const etiqueta =
    nums.length === 1
      ? `Referencia ${nums[0]}`
      : `Referencias ${nums.join(', ')}`;
  return `<sup class="llamada" aria-label="${etiqueta}">[${trozos.join(', ')}]</sup>`;
}

/* Sustituye todos los tokens de un fragmento de HTML. */

export function resolverLlamadas(html) {
  return String(html).replace(TOKEN, (_, cuerpo) => pintar(cuerpo));
}

/* Recoge los numeros citados en un texto, para validar. */

export function llamadasDe(html) {
  const vistos = [];
  for (const m of String(html).matchAll(TOKEN)) vistos.push(...numerosDe(m[1]));
  return vistos;
}
