# El Derecho Escrito

Blog de análisis y artículos jurídicos. Proyecto de cliente: abogado de Derecho
Administrativo, Urbanismo y Jurisdicción Contencioso-Administrativa.

Dominio final previsto: `elderechoescrito.es`.

---

## Stack — reglas duras

- **HTML, CSS y JavaScript puro.** Sin frameworks, sin build, sin dependencias, sin npm.
- Nada de generadores de sitios ni preprocesadores. Lo que hay en el repo es lo que se sirve.
- El JS es progresivo: la página debe entenderse y leerse con JavaScript desactivado.
  El contenido va en el HTML; el JS solo enriquece.
- Se despliega con GitHub Pages desde `main`, carpeta raíz. Push a `main` = deploy.

## Rutas — leer antes de tocar enlaces

El repo se llama `el-derecho-escrito`, así que Pages lo sirve en un
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

A esa lista se suman las URL absolutas que viven dentro del JSON-LD, que es
donde más fácil se pasan por alto porque no se ven al leer la página:

- `url` e `image` del `author`, en cada artículo firmado.
- `image` del `BlogPosting`.
- Los `@id` de `publisher` e `isPartOf`.

Todas dependen del dominio activo. Si el sitio se sirviera desde otro dominio
sin actualizarlas, seguirían resolviendo contra `elderechoescrito.es`: no darían
error, apuntarían al sitio equivocado en silencio. Ojo con `image` del `author`
en particular: es de lo que Google se sirve para construir la entidad de autor,
así que una URL muerta ahí se traduce en perder la atribución, no en un aviso.

## Sin build = mantenimiento manual

Al publicar un artículo nuevo hay que actualizar a mano, siempre:

1. `sitemap.xml` — añadir la URL.
2. `feed.xml` — añadir el `<item>`.
3. `index.html` — añadir la tarjeta al listado de portada.
4. `articulos/index.html` — añadir la entrada al listado completo.

Si no, el artículo existe pero es invisible para buscadores y lectores de RSS.

## Autoría — se repite en 7 sitios por artículo

> ⚠️ **El nombre y la bio actuales son de la maqueta de referencia, no del
> cliente.** «Juan Contera Miranda» y su bio salen del diseño que se usó para
> montar la plantilla de artículo. **Están pendientes de confirmar.** No se
> deben dar por buenos ni replicar en artículos nuevos sin preguntar antes.

Sin build no hay una sola fuente de verdad: cada artículo repite el nombre, la
bio y el retrato a mano. Al publicar —o al cambiar de autor— hay que tocar los
siete.

**En la cabecera:**

1. `<meta name="author">`.

**En el JSON-LD**, dentro del bloque `author`:

2. `"name"`. **Es el que más importa**: de ahí saca Google la atribución.
3. `"description"` — la bio.
4. `"url"` dentro de `image` — el retrato. Es lo que Google usa para construir
   la entidad de autor; si apunta a un archivo que no existe no da error,
   simplemente se pierde la atribución.

**En la columna lateral**, lo que ve el lector:

5. `.autor__nombre`.
6. `.autor__bio`. **Es literalmente el mismo texto que el punto 3**, duplicado.
   Es la incoherencia más fácil de dejarse.
7. El `<img>` dentro de `.autor__retrato` — y son dos cosas en una: el `src` y
   el `alt`, que también lleva el nombre escrito.

Referencia de cómo queda: `articulos/principio-de-legalidad-penal/index.html`.
Para localizar los siete sin depender de números de línea, que se desactualizan:

```sh
# Cabecera, nombre y bio del HTML visible
grep -rn 'name="author"\|autor__nombre\|autor__bio' articulos/
# El retrato del lateral: la ruta y el alt
grep -rn -A3 'autor__retrato' articulos/
# El bloque author del JSON-LD entero: name, url, image y description
grep -rn -A12 '"author": {' articulos/
```

Dos trampas al buscar:

- `"description"` a secas engancha también la meta description del artículo, que
  no tiene nada que ver con la bio del autor.
- `"url"` aparece dos veces dentro de `author`: la del perfil (`sobre/`) y la
  del retrato, anidada en `image`. No son lo mismo.

Y una que no se ve grepeando: **el nombre está también en el nombre del
archivo** (`img/juanconteramiranda.jpeg`). Al cambiar de autor hay que renombrar
el archivo, y eso arrastra los puntos 4 y 7 a la vez.

Dos cosas que conviene no confundir:

- **`author` y `publisher` son entidades distintas.** El `publisher` apunta por
  `@id` a la `Organization` «El Derecho Escrito», definida **una sola vez** en
  `index.html`. Cambiar de autor no lo toca.
- **`index.html`, `articulos/` y `contacto/` declaran `author: El Derecho
  Escrito`**, y está bien: son páginas del sitio, no artículos firmados. Solo
  los artículos llevan `Person`.

Pendiente relacionado: el JSON-LD del artículo declara `sobre/` como `url` del
autor, pero esa página sigue con texto de relleno entre corchetes y no menciona
a nadie. Hoy Google va de un `Person` con nombre a una página que no lo
confirma. Cerrar las dos cosas a la vez.

## Estado actual: no indexar

`robots.txt` está en `Disallow: /` a propósito, porque esto es una demo en
revisión. La versión de producción está comentada dentro del propio archivo.

Ojo: `robots.txt` solo se lee en la raíz del dominio. Mientras la web viva en un
subdirectorio de `github.io`, ese archivo **no protege nada**. Lo que evita la
indexación es la etiqueta `canonical` de cada página.

---

# Sistema de diseño

**Fuente de verdad: la web del cliente en `elderechoescrito.es`.** Estos valores
están medidos directamente sobre esa web, no descritos de memoria. Si algo aquí
contradice una descripción escrita en otro sitio, manda esto.

Referencias declaradas: *The New York Times Magazine*, *Monocle*, *Kinfolk*. La
idea rectora no es "web de despacho" ni "revista": es **el cuaderno editorial de
un jurista**. El texto manda, la imagen acompaña.

## Color

```css
--tinta:        #1E1E1E;  /* texto principal */
--tinta-suave:  #66615B;  /* metadatos, texto secundario */
--nav:          #34312E;  /* enlaces de navegacion */
--acento:       #2F6E68;  /* verdigris: antetitulos, enlaces, activo */
--papel:        #FFFFFF;  /* fondo de contenido */
--pie:          #242424;  /* fondo del pie, texto en blanco */
```

Un solo acento, `#2F6E68`, usado **con mucha contención**: antetítulos de
sección, enlaces "Leer más", elemento activo del menú. Nada más. Cuanto menos
aparece, más pesa.

El fondo es blanco puro, no marfil. La cabecera también.

## Tipografía

Tres familias, cada una con un papel claro:

| Uso | Fuente | Tamaño | Peso | Tracking | Interlineado |
|---|---|---|---|---|---|
| Logotipo (versales) | Cormorant Garamond | 26 px | 600 | normal | 1.75 |
| Titular destacado | Cormorant Garamond | 48 px | 600 | −0.015em | 1.08 |
| Título de tarjeta | Cormorant Garamond | 28 px | 600 | normal | 1.15 |
| Cuerpo y entradillas | Source Serif 4 | 18 px | 400 | normal | 1.6 |
| Navegación | Inter | 14 px | 500 | 0.01em | 1.75 |
| Antetítulo de sección | Inter | 12 px | 600 | 0.08em | 1.3 | versales, color acento |
| Fecha y metadatos | Inter | 12 px | 500 | 0.06em | 1.4 | versales, `--tinta-suave` |

Regla mental: **Cormorant para lo que se mira, Source Serif para lo que se lee,
Inter para lo que se consulta.**

## Retícula y composición

Contenedor máximo **1440 px**. Cabecera de **73 px**, fondo blanco, con un
borde inferior de `--borde` en todas las páginas **salvo el inicio**.

> **Por qué cambió esta regla.** La medición original decía «sin borde inferior
> visible — la separación la hace el espacio, no una línea», y era correcta:
> cuando se midió, **todas las páginas arrancaban en blanco**, y sobre blanco
> una línea habría sido ruido.
>
> La portada con vídeo introdujo un caso que entonces no existía. Sobre el
> vídeo la cabecera se separa sola por contraste, así que ahí la regla original
> sigue vigente y el inicio **no lleva línea**. Pero en el resto —artículo,
> listado, sobre, contacto, 404— la cabecera quedaba flotando sin límite sobre
> fondo blanco.
>
> El borde no contradice el criterio original: lo completa para el supuesto
> nuevo. Si algún día la portada dejara de llevar vídeo, lo coherente sería
> volver a quitarlo de todas.

Detalle de implementación: en el inicio el borde se apaga con
`border-bottom-color: transparent`, no con `border: none`. Así la cabecera mide
lo mismo en las seis páginas, cosa que importa porque ese alto alimenta el
`calc(100svh - var(--alto-cabecera))` de la portada: un solo píxel de
diferencia devolvería el scroll que se quitó.

Orden de la portada, tal como está construida:

```
Cabecera: logotipo a la izquierda, navegacion a la derecha
Articulo destacado: texto a la izquierda | imagen a la derecha
Ultimos articulos: cuadricula de 3 tarjetas (imagen, fecha, titulo, extracto)
Pie: fondo oscuro, solo el copyright
```

Cada tarjeta: imagen arriba, fecha en versales, título en Cormorant, extracto de
tres líneas y enlace "Leer más" en el color de acento.

## Fotografía

Blanco y negro o tonos cálidos apagados, estilo editorial. Todas las miniaturas
de la cuadrícula, misma proporción. El retrato del autor no es corporativo: luz
natural, biblioteca o despacho, como una entrevista en *Monocle*.

## Logotipo

Balanza vectorial (`balanza.svg`) a la izquierda del nombre en versales. Se
pinta con `mask` desde CSS para que herede `currentColor`, así que cambia de
color solo al pasar el ratón. No duplicar el archivo por color.

La tarjeta social `og.png` no se edita a mano: se regenera exportando `og.svg`,
que es su fuente. Al exportar, ojo con la tipografía: Cormorant Garamond no
viene con el sistema y el `@import` que lleva el SVG dentro **solo lo resuelve
un navegador**. Illustrator, Figma o `rsvg-convert` lo ignoran y caen a Georgia,
que es otro serif. O se instala la fuente antes, o se exporta desde el navegador.

---

## Deuda pendiente

- Detalle menor: los trazos de la balanza en `favicon.svg` son marfil
  `#fbfaf7`, no el blanco puro que declara el sistema.
- Faltan bloques que el cliente quiere y aún no existen en ninguna versión:
  banda de newsletter y bloque "Sobre el autor" en portada.
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
