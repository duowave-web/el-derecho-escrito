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

## Sin build = mantenimiento manual

Al publicar un artículo nuevo hay que actualizar a mano, siempre:

1. `sitemap.xml` — añadir la URL.
2. `feed.xml` — añadir el `<item>`.
3. `index.html` — añadir la tarjeta al listado de portada.
4. `articulos/index.html` — añadir la entrada al listado completo.

Si no, el artículo existe pero es invisible para buscadores y lectores de RSS.

## Autoría — se repite en 5 sitios por artículo

> ⚠️ **El nombre y la bio actuales son de la maqueta de referencia, no del
> cliente.** «Juan Contera Miranda» y su bio salen del diseño que se usó para
> montar la plantilla de artículo. **Están pendientes de confirmar.** No se
> deben dar por buenos ni replicar en artículos nuevos sin preguntar antes.

Sin build no hay una sola fuente de verdad: cada artículo repite el nombre y la
bio a mano. Al publicar —o al cambiar de autor— hay que tocar los cinco:

1. `<meta name="author">` en la cabecera del artículo.
2. `"name"` dentro de `author` en el JSON-LD. **Es el que importa**: de ahí
   saca Google la atribución de autoría.
3. `"description"` dentro de ese mismo `author` — la bio.
4. `.autor__nombre` en la columna lateral, lo que ve el lector.
5. `.autor__bio` en la columna lateral. **Es literalmente el mismo texto que
   el punto 3**, duplicado. Es la incoherencia más fácil de dejarse.

Referencia de cómo queda: `articulos/principio-de-legalidad-penal/index.html`.
Para localizar los cinco sin depender de números de línea, que se desactualizan:

```sh
# Los tres del HTML visible y la cabecera
grep -rn 'name="author"\|autor__nombre\|autor__bio' articulos/
# El bloque author del JSON-LD entero, con su name y su description
grep -rn -A6 '"author": {' articulos/
```

Ojo al buscar: `"description"` a secas engancha también la meta description del
artículo, que no tiene nada que ver con la bio del autor.

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

Contenedor máximo **1440 px**. Cabecera de **73 px**, fondo blanco, sin borde
inferior visible — la separación la hace el espacio, no una línea.

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

---

## Deuda pendiente

- **`og.png` sigue con la marca antigua.** Lleva el granate `#7a1f2b`
  incrustado sobre fondo marfil, de una iteración anterior. Es un binario: hay
  que regenerarlo con el verdigrís `#2f6e68`. Mientras no se haga, compartir el
  sitio en redes muestra un color que ya no existe en el código.
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
