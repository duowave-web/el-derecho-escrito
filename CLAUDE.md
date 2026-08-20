# El Derecho Escrito

Blog de análisis y artículos jurídicos. Proyecto de cliente: **Juan Contera Miranda**,
abogado de Derecho Administrativo, Urbanismo y Jurisdicción Contencioso-Administrativa.

Dominio final previsto: `elderechoescrito.es`.

---

## Stack — reglas duras

- **HTML, CSS y JavaScript puro.** Sin frameworks, sin build, sin dependencias, sin npm.
- Nada de generadores de sitios ni preprocesadores. Lo que hay en el repo es lo que se sirve.
- El JS es progresivo: la página debe entenderse y leerse con JavaScript desactivado.
  El contenido va en el HTML; el JS solo enriquece.
- Se despliega con GitHub Pages desde `main`, carpeta raíz. Push a `main` = deploy.

## Rutas — leer antes de tocar enlaces

Ahora mismo el repo se llama `el-derecho-escrito`, así que Pages lo sirve en un
**subdirectorio**: `https://duowave-web.github.io/el-derecho-escrito/`.

Por eso todas las rutas internas son **relativas**, no absolutas:

| Archivo | Prefijo |
|---|---|
| `index.html` | `./` |
| `articulos/index.html`, `sobre/index.html`, `contacto/index.html` | `../` |
| `articulos/<slug>/index.html` | `../../` |
| `css/styles.css` (url de `balanza.svg`) | `../` |

Excepción: `404.html` usa rutas absolutas con el prefijo `/el-derecho-escrito/`,
porque GitHub Pages lo sirve desde cualquier profundidad y una ruta relativa se
rompería.

**Cuando se conecte `elderechoescrito.es`**, la web pasará a servirse en la raíz
del dominio y hay que revertir todo a rutas absolutas (`/css/styles.css`,
`/articulos/`). Es un cambio mecánico pero hay que acordarse.

Las URL absolutas completas (`canonical`, `og:url`, `og:image`, `sitemap.xml`,
`feed.xml`) ya apuntan a `elderechoescrito.es` y **no se tocan**.

## Sin build = mantenimiento manual

Al publicar un artículo nuevo hay que actualizar a mano, siempre:

1. `sitemap.xml` — añadir la URL.
2. `feed.xml` — añadir el `<item>`.
3. `index.html` — añadir la tarjeta al listado de portada (máximo 3).
4. `articulos/index.html` — añadir la entrada al listado completo.

Si no, el artículo existe pero es invisible para buscadores y lectores de RSS.

## Estado actual: no indexar

`robots.txt` está en `Disallow: /` a propósito, porque esto es una demo en
revisión. La versión de producción está comentada dentro del propio archivo.
Al pasar al dominio real: descomentar y borrar el bloque de bloqueo.

Ojo: `robots.txt` solo se lee en la raíz del dominio. Mientras la web viva en un
subdirectorio de `github.io`, ese archivo **no protege nada**. Lo que evita la
indexación es la etiqueta `canonical` de cada página.

---

# Sistema de diseño

Referencias declaradas por el cliente: *The New York Times Magazine*, *Monocle*,
*Kinfolk*. La idea rectora no es "web de despacho" ni "revista": es **el cuaderno
editorial de un jurista**. El texto manda, la imagen acompaña.

## Tipografía

| Uso | Fuente | Tamaño | Peso | Detalle |
|---|---|---|---|---|
| Logotipo `EL DERECHO ESCRITO` | Inter | 18 px | 600 | tracking `+0.35em` |
| Titular principal | Cormorant Garamond | 56 px | — | line-height `1.08` |
| Entradilla / resumen | Source Serif | 22 px | — | color gris, no compite |
| Metadatos (fecha, lectura) | Inter | 13 px | 500 | un nivel por debajo |

La jerarquía debe leerse de un vistazo, sin esfuerzo.

## Color

Acento en gama de ámbares, nunca un naranja único:

```
--ambar-oscuro: #B45F06;
--ambar:        #D97706;
--arena:        #E9C46A;
```

Se usa **con mucha contención**: solo en categorías, enlaces, botones y detalles
finos (flechas, iconos). Cuanto menos aparece, más impacto tiene.

Fondo de contenido blanco limpio. Cabecera en marfil, ligeramente distinta del
cuerpo, y fija al hacer scroll.

## Retícula y composición

Retícula de **12 columnas**. Todo se alinea a ella: la imagen del artículo
destacado debe medir exactamente lo mismo que dos tarjetas de la cuadrícula, con
los mismos márgenes laterales. La portada tiene que respirar como un único
sistema, no como bloques independientes.

Orden de la portada:

```
Cabecera (fina, marfil, fija)
Artículo destacado — texto | imagen, tratado como portada de revista
Últimos artículos — cuadrícula de 4
Newsletter — banda ligera, "una invitación, no una caja"
Sobre el autor
Pie — muy aireado, poco contraste, casi un colofón de libro
```

Los separadores no son todos iguales: finos entre bloques, algo más marcado bajo
la cabecera, y algunas secciones se separan solo con espacio en blanco.

## Fotografía

Blanco y negro, estilo editorial. El retrato del autor no es corporativo: luz
natural, biblioteca o despacho, como una entrevista en *Monocle*. Todas las
miniaturas de la cuadrícula, misma proporción.

## Logotipo

Balanza vectorial (`balanza.svg`) a la izquierda del nombre en mayúsculas. Se
pinta con `mask` desde CSS para que herede `currentColor`, así que cambia de
color solo al pasar el ratón. No duplicar el archivo por color.

---

## Deuda pendiente

Cosas conocidas, sin resolver:

- **La paleta y las tipografías del CSS no coinciden todavía con este sistema.**
  El CSS actual usa granate `#7a1f2b` y Georgia, de una iteración anterior. El
  sistema aprobado por el cliente es el ámbar + Inter/Cormorant/Source Serif de
  arriba. Migración pendiente.
- `sobre/index.html` tiene texto de relleno entre corchetes.
- El formulario de contacto no tiene backend: no envía nada.
- `_headers` y `_redirects` son de Netlify. GitHub Pages los ignora. Se
  mantienen por si se mueve el hosting.

## Convenciones

- Todo el contenido y los comentarios, en español.
- Mensajes de commit en español, en imperativo, describiendo el qué.
- Nombres de clases CSS en español, estilo BEM suave: `.cabecera__interior`,
  `.entrada__titulo`.
- Accesibilidad: enlace de salto, `aria-label` en navegaciones, jerarquía de
  encabezados correcta. No romperlo.
