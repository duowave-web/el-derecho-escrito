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

Y a esa, las URL de los **botones de compartir** del final del artículo. Van
dentro del `href` de cada enlace, **codificadas en porcentaje**, así que un
`grep` de `elderechoescrito.es` a secas **no las encuentra**: ahí dentro la
dirección aparece como `https%3A%2F%2Felderechoescrito.es%2F…`. Se buscan así:

```sh
grep -rn 'elderechoescrito\|elderechoescrito\.es\|%2Felderechoescrito' articulos/
```

En el de WhatsApp y en el de correo la dirección va además **dentro del texto
del mensaje**, no como parámetro propio, que es donde más fácil se queda sin
actualizar.

Todas dependen del dominio activo. Si el sitio se sirviera desde otro dominio
sin actualizarlas, seguirían resolviendo contra `elderechoescrito.es`: no darían
error, apuntarían al sitio equivocado en silencio. Ojo con `image` del `author`
en particular: es de lo que Google se sirve para construir la entidad de autor,
así que una URL muerta ahí se traduce en perder la atribución, no en un aviso.

Y las de compartir tienen un modo de fallar propio: **son las únicas que las
resuelve un tercero**. El resto las lee Google o el navegador del visitante; la
de LinkedIn la pide LinkedIn desde sus servidores. Una dirección que solo
funcione en local no da error al pulsarla — devuelve una tarjeta vacía.

## Sin build = mantenimiento manual

Al publicar un artículo nuevo hay que actualizar a mano, siempre:

1. `sitemap.xml` — añadir la URL.
2. `feed.xml` — añadir el `<item>`.
3. `index.html` — añadir la tarjeta al listado de portada.
4. `articulos/index.html` — añadir la entrada al listado completo.

Si no, el artículo existe pero es invisible para buscadores y lectores de RSS.

### La categoría de un artículo se repite en 7 sitios

> ⚠️ **El único artículo publicado es un ejemplo provisional.** «El principio de
> legalidad penal» y su categoría **«Fundamento»** están para que la plantilla
> tenga contenido con el que probarse, y **se eliminan al entregar la web**. No
> se deben tomar como referencia editorial: ni el tema, ni la categoría, ni la
> firma —que es la de la maqueta, según la sección de autoría.

Como con la autoría, sin build no hay una sola fuente de verdad. Al cambiar la
categoría de un artículo hay que tocar los siete:

| # | Dónde | Qué |
|---|---|---|
| 1 | `index.html` | `.etiqueta--plana` de la tarjeta de portada |
| 2 | `articulos/index.html` | `.etiqueta` de la tarjeta del listado |
| 3 | `feed.xml` | `<category>` del `<item>` |
| 4 | el artículo | `.etiqueta--plana` de la ficha de cabecera |
| 5 | el artículo | `"articleSection"` del JSON-LD |
| 6 | el artículo | **`<meta property="article:section">`** — el equivalente Open Graph |
| 7 | el artículo | la píldora `.etiqueta--tag` del lateral |

Los dos últimos son los que se escapan: el `article:section` no se ve al leer la
página, y la píldora va sin espacios y con otra capitalización
(`#Fundamento`), así que un `grep` de la categoría tal cual **no la encuentra**.

```sh
# Las siete de una vez, contando la variante sin espacios de la etiqueta
grep -rn 'Fundamento' --include='*.html' --include='*.xml' .
```

> **Cuidado con un falso positivo.** `index.html` tiene un `<h3>Derecho penal</h3>`
> dentro de la franja «Áreas del derecho». **No es la categoría de ningún
> artículo**: son las materias del despacho, y no se tocan al recategorizar.
> Que las dos listas usen palabras parecidas es casualidad, no una relación.

### El listado enseña lo que hay, y deja vacío lo que no

Durante un tiempo enseñó cuatro tarjetas: la real y tres marcadores con
titulares y fechas inventados, sin enlace para no dar 404. Funcionaba como
maqueta, pero **prometía un archivo que no existe**, y el visitante no tiene
forma de saber que tres de las cuatro son atrezo.

Hoy hay una tarjeta real y una de espera, `.tarjeta--proxima`, **en una rejilla
de tres columnas**. La tercera celda se queda vacía, en blanco y sin caja: hay
un artículo, viene otro, y el resto todavía no existe.

> **Las celdas vacías no llevan nada dentro, y es deliberado.** Un `<div>`
> vacío para «rellenar» la columna no se ve, pero sí se anuncia: un lector de
> pantalla lo recorre como un elemento más de la lista, y el usuario oye ítems
> fantasma detrás de los reales. En una rejilla CSS las celdas sobrantes existen
> solas, sin marcado. **No hay que rellenarlas.**

Al publicar, en este orden:

- **El segundo artículo** sustituye a la tarjeta de espera.
- **A partir del tercero** se añaden tarjetas sin tocar nada más: la rejilla ya
  tiene las tres columnas y se van ocupando solas.

Si algún día se vuelve a cambiar el número de columnas, **hay que recalcular el
punto de corte**: no es un número redondo, sale de medir. Está explicado abajo,
en la sección de puntos de corte.

### El «continúa leyendo» del artículo está desactivado a propósito

Llevaba los mismos tres marcadores y **está comentado**, no borrado: dentro
queda el esqueleto de una tarjeta, sin titulares ni fechas falsas, listo para
descomentar cuando haya un segundo artículo.

No se le puso la tarjeta de «Próximamente» de la portada, y la diferencia
importa: en la portada la sección es **un inventario** y la tarjeta añade una
promesa, mientras que en el artículo es **navegación** y una promesa no es un
destino. El rótulo dice «Continúa leyendo» y una tarjeta que no se puede pulsar
lo desmiente en la misma línea. Debajo ya está «Volver a todos los artículos»,
que sí lleva a algún sitio.

Consecuencia a tener presente: **`.tarjetas--tres` no la usa nadie ahora
mismo.** Sigue en el CSS porque es la rejilla de ese bloque y vuelve con él. Si
alguien busca dónde se usa, no encontrará nada y parecerá muerta.

### Las migas quedan en dos páginas de cuatro

Se retiraron del **artículo** y del **listado**, donde repetían navegación que
la cabecera ya da en todas las páginas: de los tres niveles del artículo,
«Inicio» y «Artículos» estaban a un clic ahí arriba, y el tercero era el título
de la página en la que ya estás.

**Siguen en `sobre/` y `contacto/`**, y ahí son útiles: son hojas sueltas sin
un listado padre al que volver, así que la miga es su única ruta de contexto.

En el artículo las sustituye `.volver`, un enlace de vuelta al listado. Es el
mismo componente que cierra el artículo abajo: **misma clase, mismo texto y
mismo destino**, y la única diferencia es el modificador `--cierre`, que solo
cambia márgenes. Si hay que tocar el aspecto se toca `.volver` en el CSS, nunca
uno de los dos sitios.

> **Al quitar migas hay que quitar también su `BreadcrumbList`.** Son dos cosas
> en dos sitios —el marcado en el `<body>` y el JSON-LD en el `<head>`— y quitar
> solo el visible no da ningún error: la página simplemente le sigue declarando
> a Google una ruta que ya no enseña.
>
> Comprobación rápida de que van a la par:
>
> ```sh
> for f in sobre/index.html contacto/index.html articulos/index.html \
>          articulos/*/index.html; do
>   echo "$f  migas:$(grep -c 'class=\"miga\"' $f)  json-ld:$(grep -c BreadcrumbList $f)"
> done
> ```

## Autoría — se repite en 8 sitios por artículo

> ⚠️ **El nombre y la bio actuales son de la maqueta de referencia, no del
> cliente.** «Juan Contera Miranda» y su bio salen del diseño que se usó para
> montar la plantilla de artículo. **Están pendientes de confirmar.** No se
> deben dar por buenos ni replicar en artículos nuevos sin preguntar antes.

Sin build no hay una sola fuente de verdad: cada artículo repite el nombre, la
bio y el retrato a mano. Al publicar —o al cambiar de autor— hay que tocar los
ocho.

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

**En la ficha de cabecera**, y este es el que se escapa:

8. `.firma`, dentro de `.articulo__ficha`. **Solo se ve por debajo de 900 px**,
   así que en un escritorio no aparece por ninguna parte: quien revise el
   artículo en pantalla grande puede cambiar los otros siete, darlo por hecho y
   dejarse este sin tocar. No es una copia del punto 5: es un `<p>` distinto,
   con su propio enlace a `sobre/`.

> **No hay archivo de plantilla, y es deliberado.** La plantilla de artículo es
> `articulos/principio-de-legalidad-penal/index.html`, anotado con comentarios
> `<!-- PLANTILLA · … -->` en cada bloque que hay que copiar o rellenar. Para
> publicar se duplica esa carpeta y se sustituye el contenido.
>
> Se descartó crear un `post-template.html` aparte. Sería un noveno sitio donde
> se repiten la autoría, la categoría y las URL de compartir, **y nada avisaría
> si se queda atrás**: una plantilla desfasada que aún dijera «Derecho penal» o
> llevara migas engañaría más de lo que ayuda. El artículo real, en cambio, se
> actualiza porque se ve.

Referencia de cómo queda: `articulos/principio-de-legalidad-penal/index.html`.
Para localizar los ocho sin depender de números de línea, que se desactualizan:

```sh
# Cabecera, nombre y bio del HTML visible, mas la firma de movil
grep -rn 'name="author"\|autor__nombre\|autor__bio\|class="firma"' articulos/
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
--papel-alt:    #F7F5F2;  /* superficies apoyadas: cajas, campos, bandas */
--pie:          #242424;  /* fondo del pie, texto en blanco */
--borde:        #E5E1DA;  /* separadores, tarjetas, campos */
--borde-marcado:#D8D2C9;  /* linea de la cabecera */
```

Los dos bordes se diferencian poco a propósito. `--borde` está para separar sin
que se note; `--borde-marcado` es un paso más oscuro —ΔE 16,4 frente a blanco,
contra 11,1 del otro— y solo lo usa la línea de la cabecera, que sí tiene que
leerse como un límite. Ninguno es gris neutro: ambos conservan el
desplazamiento cálido de la paleta.

> **`--papel-alt` no sirve para dibujar una caja él solo, y conviene saberlo
> antes de intentarlo.** Frente al blanco de la página son **ΔE 2,6**, por
> debajo del umbral en el que dos superficies planas se distinguen. Es
> deliberado —está pensado como un apoyo que no se nota—, pero significa que
> una caja rellena con él se lee como si no tuviera contorno.
>
> La solución en las tarjetas de portada fue **un filete de 1 px en `--borde`**,
> no un gris nuevo más oscuro. El canto lo define la línea y el relleno se queda
> como lo que es, un matiz. Se midió la alternativa —una caja a `#F0ECE6`, ΔE
> 4,9, que sí se sostiene sola— y se descartó: obligaba a oscurecer *también* el
> hueco interior, o sea dos tonos nuevos para lo que un filete resuelve con
> ninguno.
>
> El segundo efecto es menos obvio. **`--papel-alt` es a la vez el fondo de la
> caja y el del hueco de imagen vacío** (`.tarjeta__imagen`), así que dentro de
> una caja el hueco desaparecía: mismo token, ΔE 0,0. Por eso, y solo dentro de
> `.tarjeta--caja`, el hueco baja a `--borde` (ΔE 4,7). Afecta únicamente al
> marcador: en cuanto haya un `<img>` dentro, ese fondo no se ve.

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
| Navegación | Inter | 14 px | 500 | 0.06em | 1.75 | versales |
| Antetítulo de sección | Inter | 12 px | 600 | 0.08em | 1.3 | versales, color acento |
| Rótulo de sección de portada | Cormorant Garamond | 20 px | **700** | 0.10em | 1.3 | versales, `--tinta` |
| Fecha y metadatos | Inter | 12 px | 500 | 0.06em | 1.4 | versales, `--tinta-suave` |

Regla mental: **Cormorant para lo que se mira, Source Serif para lo que se lee,
Inter para lo que se consulta.**

> **Los dos rótulos de sección no son lo mismo, y el criterio no es dónde están
> sino qué hacen.** Si el rótulo **abre una sección** que se sostiene sola, va
> en la variante `--destacado`. Si **acompaña** a algo que ya se está leyendo,
> va en la clase base `.lista__titulo`, que es la etiqueta pequeña de Inter.
>
> Con esa regla, hoy:
>
> | Rótulo | Dónde | Clase |
> |---|---|---|
> | «Últimos artículos» | portada | `--destacado` |
> | «Continúa leyendo» | fin del artículo | `--destacado` |
> | «Autor», «Índice del artículo», «Etiquetas» | lateral | base |
> | «Citas y referencias» | cuerpo del artículo | base |
>
> «Citas y referencias» es el caso que más se presta a duda: está en la columna
> principal, como «Continúa leyendo», pero es una lista pegada al texto que
> acaba de leerse, no una sección nueva. Apoya. Por eso va en la base.
>
> El rótulo destacado tiene que sostenerse frente a una rejilla de cuatro
> columnas; en el lateral, en cambio, compite con el texto y debe ceder.
>
> Encaja con la regla mental: en la portada el rótulo es **algo que se mira**,
> no algo que se consulta. Por eso pasa a Cormorant.
>
> Los 20 px son el hueco entre la categoría de las tarjetas (Inter 12) y sus
> titulares (Cormorant 28): destaca sobre la primera sin competir con los
> segundos. Va en **700**, no en el 600 del resto de Cormorant, porque a 20 px
> en versales el 600 se queda fino y no sostiene la sección.
>
> El tracking sube de 0.08em a **0.10em**: un serif en versales necesita más
> aire que Inter —Cormorant tiene remates y modulación de grosor, y sin
> separación los trazos finos de una letra se confunden con los de la
> siguiente—, pero con el trazo del 700 hace falta algo menos que con el 600,
> al que le sentaba mejor 0.12em.
>
> **Y va en `--tinta`, no en el acento.** Es la otra diferencia con el
> antetítulo de Inter, que sí es verdigrís. Al compartir tono con el titular de
> portada y los titulares de tarjeta, el rótulo se lee como parte de la
> estructura de la página y no como un adorno. De paso el acento queda en esa
> sección solo para las categorías y el enlace «ver todos», lo que es más fiel
> a la regla de usarlo con mucha contención.

**El 700 de Cormorant hay que mantenerlo en el `@import`.** Está declarado
(`wght@500;600;700`) y es el único sitio del proyecto que lo usa. Si alguien
adelgaza esa lista para aligerar la carga, el navegador no dejará de pintar el
rótulo: lo **simulará engordando el 600**, que se ve peor que la cara real y no
avisa por ningún lado. Se comprueba forzando la carga y midiendo — a 600 el
rótulo mide 241,78 px y a 700, 242,98; una simulación no cambiaría las métricas.

> **Por qué la navegación pasó a versales.** La medición original la registraba
> en caja baja con `0.01em`, y encajaba: era el único elemento de Inter que no
> iba en versales, y eso la distinguía de los antetítulos y los metadatos.
>
> Lo que cambió es que la cabecera dejó de ser solo navegación. Al entrar la
> lupa del buscador, los enlaces pasaron a convivir con un control, y en caja
> baja se leían como texto suelto en vez de como una barra de herramientas. Las
> versales los agrupan visualmente con la lupa y los separan del contenido.
>
> Encaja además con la regla mental de arriba: Inter es «lo que se consulta», y
> en este sistema lo que se consulta ya iba en versales en los otros dos casos.
> La navegación era la excepción, no la regla.
>
> El tracking sube de `0.01em` a `0.06em` porque las mayúsculas juntas se leen
> peor: la silueta de una palabra en caja baja viene dada por ascendentes y
> descendentes, y en versales hay que compensar esa pérdida con aire. Es el
> mismo `0.06em` que ya usaban las fechas y los metadatos.
>
> El tamaño se mantiene en 14 px: **medido**, bajarlo a 12 px solo recorta 29 px
> de los 83 que ensanchan las versales —el ancho lo dominan el tracking y las
> mayúsculas, no el cuerpo— y no compensa la pérdida de legibilidad.

## Retícula y composición

Contenedor máximo **1440 px**. Cabecera de **73 px**, fondo blanco, con un
borde inferior de **2 px** en `--borde-marcado`. En las cinco páginas
interiores está siempre; **en el inicio aparece al pasar la franja de portada**.

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
>
> Después se afinó una vez más: en el inicio la línea no está ausente, está
> **esperando**. Aparece en cuanto la cabecera deja de tener la imagen detrás,
> que es el momento exacto en que la regla original deja de aplicar.

Detalle de implementación, y hay que respetarlo: **el borde existe siempre, a
2 px, y lo único que cambia es su color.** Nunca se usa `border: none`. Así la
cabecera mide lo mismo en las seis páginas y, sobre todo, no pega un salto de
2 px cuando la línea aparece en el inicio: el espacio ya estaba ocupado.

El disparo lo hace `lineaDeCabecera()` en `js/main.js` con un
`IntersectionObserver` sobre la franja, recortando la zona de observación por
arriba justo el alto de la cabecera. **Ese alto se mide del DOM, no se escribe**:
va de 73 px a 109 px según el tramo, y el observador se rehace si cambia. Un
número fijo ahí se desincronizaría igual que lo haría un umbral de scroll.

Sin JavaScript el inicio no muestra la línea nunca, y es lo coherente: sin JS
tampoco se carga el vídeo, pero sí el póster, así que la cabecera sigue
teniendo una imagen detrás y la premisa que justifica ocultarla se mantiene.

### La portada es una franja de 520 px, no una pantalla completa

`min-height: 520px`, no `height`. Los 520 están medidos contra lo que asoma
debajo: a 1440×900 se ve el rótulo «ÚLTIMOS ARTÍCULOS», la imagen de la primera
tarjeta entera y 35 px de su titular. Con 560 la imagen se cortaba 5 px antes de
acabar, que es el peor corte posible.

> **Por qué dejó de ser pantalla completa.** Estuvo un tiempo en
> `calc(100svh - var(--alto-cabecera))`. En un monitor de 27" eso son ~1370 px:
> el texto quedaba perdido en el vacío y no asomaba nada de la sección
> siguiente, así que nada invitaba a bajar.
>
> El cambio se llevó por delante una fuente de fragilidad entera. Mientras la
> portada restaba el alto de la cabecera, ese alto había que mantenerlo a mano
> en una variable, por tramos, sincronizado con una medida real fraccionaria
> (72,195 / 108,195 / 103,398 px). Se rompió dos veces en silencio: al añadir el
> borde inferior y al añadir la lupa del buscador. Ahora la portada no depende
> de la cabecera, y la variable `--alto-cabecera` ya no existe.

`min-height` y no `height` porque en móvil el contenido crece —a 360 px el
titular ocupa 3 líneas y la entradilla 5— y en una franja fija se cortaría. Así
mide 520 exactos en escritorio y se estira sola donde hace falta, sin necesidad
de un caso aparte para móvil.

### La cabecera tiene sus propios puntos de corte

Tres, y **no coinciden con el de 600 px** que usan las tarjetas y el cuerpo del
texto. La cabecera se rompe por sus propias medidas, así que tiene los suyos.
Los tres están **medidos**, no elegidos:

| Corte | Qué pasa | Por qué ahí |
|---|---|---|
| **966 px** | se oculta el campo del buscador | es lo que necesita la fila para la marca en una línea (319) + hueco (24) + navegación desplegada (574) + padding (48) |
| **748 px** | la cabecera pasa a dos filas | lo mismo con el buscador cerrado, con la navegación en 356 |
| **400 px** | la navegación baja a 12 px y menos tracking | en versales ocupa 330 px y por debajo de 379 se parte en dos líneas |

> **El de 748 dejó de ser solo de la cabecera.** Ahí también caen a una columna
> las tarjetas en caja de la portada, y es la única excepción a la regla de
> arriba.
>
> No es que las dos cosas dependan de lo mismo: la cabecera se rompe por el
> ancho de su fila y las tarjetas por el padding de 28 px, que se come 58 px de
> cada columna. Es que el valor medido para las tarjetas cae dentro de la banda
> que ya cubría ese corte. Medido: el titular del artículo pasa de 3 líneas a 4
> entre 740 y 700 px, y de 4 a 6 por debajo de 540. A 748 el interior mide
> 278 px y el titular ocupa 3 líneas, exactamente lo que rinde en una sola
> columna a 380 px, que es el rendimiento que ya damos por bueno en móvil.
>
> Se reutilizó en vez de añadir un corte ocho píxeles más abajo, que habría
> sido ruido. **Si algún día se mueve el de la cabecera, hay que comprobar que
> las tarjetas siguen entrando**, o separarlos entonces.

### La rejilla de tarjetas tiene el suyo, en 1084 px

Es aparte de los tres de la cabecera y **está medido, no elegido**. Con el
contenedor de 1200 y hueco de 28, las columnas salen así:

| Columnas | Ancho de columna | Interior de la caja |
|---|---|---|
| 4 | 267 px | 209 px |
| **3 — la actual** | **365,33 px** | **307,33 px** |
| 2 | 562 px | 504 px |

**Lo que fija el corte ha cambiado, y conviene saberlo antes de tocarlo.**

Cuando la rejilla era de cuatro columnas mandaba el `min-content` de la tarjeta
de espera: **218,9 px**, o sea los 160,9 que mide «Próximamente» en Cormorant a
28 px más los 56 del padding y los 2 del filete. Cuatro columnas de ese ancho
pedían 1008 px de ventana, y ahí estaba el corte.

Con tres columnas ese suelo cae a **761 px**, que son trece píxeles por encima
del corte de una sola columna que ya hay en 748. **Deja de apretar.** Ahora
manda la tipografía, y el número sale de medir: el titular del artículo aguanta
en 3 líneas hasta **1085 px** de ventana, con la columna en 327, y salta a 4 en
1080, con 325,3. El corte va en **1084** para quedarse con el último ancho que
rinde igual que el escritorio.

Cruzarlo no degrada nada, al revés: a 1084 pasa a dos columnas de 504 y el
titular baja a 2 líneas. Y con dos tarjetas y dos columnas **no sobra ninguna
celda**, así que la fila se llena entera en vez de arrastrar una columna vacía
cada vez más estrecha.

> **`minmax(0, 1fr)` se queda aunque el min-content ya no apriete.** Es la red
> por debajo, y sigue habiendo una diferencia que importa en cómo falla la
> rejilla si algún día vuelve a apretar:
>
> - **Con `1fr`**, la columna que no puede encoger deja de ceder y aplasta a las
>   vecinas. Las columnas dejan de ser iguales sin que nada se salga.
> - **Con `minmax(0, 1fr)`**, todas ceden por igual y es el titular el que se
>   sale de su caja.
>
> Lo segundo es peor a la vista pero mucho mejor de mantener, porque **se ve**.
> Lo primero estuvo semanas ahí sin que nadie lo notara.

Si cambia el número de columnas, el cuerpo del rótulo de la tarjeta de espera o
su padding, **este número hay que volver a medirlo**. No se deduce.

Siguen haciendo falta: evitan que la marca se parta en dos líneas y que la
navegación en versales no quepa, y eso pasa exista o no la portada. Lo que ya
**no** hay que mantener es un alto de cabecera en píxeles sincronizado con
ellos: son ajustes de maqueta y nada más.

Orden de la portada, tal como está construida:

```
Cabecera:           logotipo a la izquierda, navegacion y lupa a la derecha
Portada:            franja de 520 px, texto a la izquierda | estatua a la derecha
Ultimos articulos:  rotulo + "ver todos", rejilla de tarjetas, banda de newsletter
Areas del derecho:  franja con las materias que se tratan
Pie:                fondo oscuro
```

Cada tarjeta va **dentro de una caja** con fondo `--papel-alt`, filete de 1 px
en `--borde` y 28 px de padding: imagen arriba en 3:2, categoría en versales de
Inter y color acento, título en Cormorant, extracto y, anclados al fondo, fecha
y minutos de lectura con sus iconos.

Dos cosas que esta descripción tuvo mal durante un tiempo, por si suenan de
algo: **no hay enlace «Leer más»** —el enlace es el propio titular— y **la
cuadrícula no es de tres**. Fueron cuatro y hoy son dos, según lo publicado.

## Botones — son tres variantes de uno, no tres componentes

`.boton` es la base y hay **tres** formas de usarlo. Antes de inventar una
cuarta conviene mirar esta tabla, porque las que hay ya cubren casi todo:

| Clase | Reposo | Hover | Para qué |
|---|---|---|---|
| `.boton` | filete `--borde`, fondo `--papel`, texto `--tinta` | filete y texto a `--acento` | acción secundaria |
| `.boton--principal` | relleno `--acento`, texto blanco | relleno `--acento-oscuro` | acción principal |
| `.boton--contorno` | filete y texto `--acento`, **sin fondo** | relleno `--acento`, texto `--papel` | enlace de sección que quiere peso de botón |

Las tres comparten el `border-radius` de 4 px de `.boton`. **Ninguna declara el
suyo**, y conviene que siga así: el canto es de la familia, no de la variante.
`--contorno` estuvo un tiempo en pastilla y se rectificó por eso.

> **`--contorno` no salió de la nada.** Su reposo es casi exactamente
> `.boton:hover` y su hover es casi exactamente `.boton--principal`: interpola
> entre dos estados que el componente ya tenía. Por eso es un modificador y no
> una clase suelta — así hereda la familia, el cursor, la estructura y, sobre
> todo, las reglas de `:disabled`.

Dos cosas que hay que respetar al tocarlo:

- **`.boton--contorno:hover` tiene que ir después de `.boton:hover` en el
  archivo.** Misma especificidad, así que el orden es lo único que decide. Si
  alguien reordena el bloque, el hover deja de rellenar sin más aviso.
- **La transición va declarada por propiedades, no con el `all` de `.boton`.**
  El relleno y el texto van a 160 ms y la flecha lleva la suya, más larga, en su
  propia regla. Con `all` las dos quedarían atadas al mismo tiempo, que es justo
  lo que se quería evitar.

El anillo de foco de `--contorno` va en **`--tinta`**, y no en el `--acento` que
usan el buscador y la lupa. No es una incoherencia: ahí el control es neutro y
el acento resalta, pero aquí el botón *ya es* de acento —filete en reposo,
relleno en hover— y un anillo del mismo color quedaría pegado a su propio borde.
Cae fuera del botón, sobre el blanco de la página, donde `--tinta` da 16,67:1.

Se distingue del hover **por naturaleza y no por color**: el hover rellena, el
foco dibuja un anillo por fuera. Pueden darse a la vez sin taparse.

## Fotografía

Blanco y negro o tonos cálidos apagados, estilo editorial. Todas las miniaturas
de la cuadrícula, misma proporción. El retrato del autor no es corporativo: luz
natural, biblioteca o despacho, como una entrevista en *Monocle*.

### Texto sobre imagen: hay que medir dónde cae, no la media

La mancheta de `articulos/` es una **banda a sangre** con
`img/fondo-articulos.jpg` de fondo y un **velo blanco al 45 %** por delante. El
fondo cruza toda la ventana; el texto se queda en la rejilla de 1200 gracias al
`.contenedor` que lleva dentro.

El velo no es un gusto, es el mínimo medido: sin él el titular queda en
**1,68:1** y la entradilla en **1,02**. Y el sangrado, que se descartó una vez
por otro motivo, **mejora el contraste**: al empujar los manchones oscuros fuera
del área de texto, el mínimo global pasa de 5,43 a 12,85 según el ancho.

La trampa está en que la imagen es clara *de media*. Sus manchones oscuros
están en los bordes izquierdo y derecho, que es exactamente donde la mancheta
pone el titular y la entradilla. **Una media de luminancia habría dicho que no
hacía falta velo.** Lo que sirve es muestrear el recorte real bajo cada caja de
texto, en cada ancho, porque `cover` cambia el encuadre con la proporción de la
caja.

Se probó y se descartó encuadrar solo el centro claro con un zoom del 220 %:
contrasta de sobra —12,7 y 4,7— pero deja la banda casi blanca, sin veteado, ni
libro, ni balanza. **Pasaba la métrica y fallaba el objetivo.** Cuando una
solución de contraste borra aquello que se quería enseñar, la solución es otra.

Por eso también la entradilla está en `--tinta` y no en `--tinta-suave`: el gris
no llega ni con velos que borrarían la imagen.

> **Para una línea o una superficie plana, el ratio de contraste no es la
> métrica.** El filete de la mancheta da **1,00:1** sobre el fondo, que suena a
> invisible, y sin embargo se ve: su **ΔE es 4,5**, por encima del umbral de
> percepción. El ratio de contraste modela legibilidad de texto —glifos finos
> sobre un fondo—, no la diferencia entre dos superficies.
>
> Usa **contraste para texto y ΔE2000 para superficies**. Confundirlos lleva a
> «arreglar» cosas que no están rotas, que es lo que estuvo a punto de pasar
> aquí. Aun así el filete subió a `--borde-marcado` (ΔE 7,2), su segundo uso en
> el sitio, porque el canto de la banda contra el blanco baja a ΔE 1,5 en las
> zonas pálidas y ahí la línea es lo único que cierra.

**El fondo se declara dentro de un `@media (min-width: 901px)`**, la única media
query por min-width del archivo, que va por max-width. La diferencia no es de
estilo: anularlo con `background-image: none` en un corte de max-width se vería
igual, pero **el móvil se bajaría los 130 KB de todas formas**. Declarándolo
solo donde se usa, no se pide nunca.

Y no se pide por dos razones: el peso, y que al apilarse la caja pasa de 8:1 a
casi cuadrada, con lo que `cover` recorta una tira central y la composición se
pierde. Sería peso para no enseñar la imagen.

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
- Falta el bloque «Sobre el autor» en portada, que el cliente quiere y aún no
  existe en ninguna versión. La banda de newsletter ya está.
- `sobre/index.html` tiene texto de relleno entre corchetes.
- **Ninguna de las dos suscripciones envía nada**, ni la banda de la portada ni
  la del lateral del artículo: comparten componente y las dos van sin `<form>`
  y con los controles deshabilitados, a propósito, para que no se pueda enviar
  por accidente. Al conectar backend hay que tocar las dos.
- El formulario de contacto tampoco tiene backend: no envía nada.
- `_headers` y `_redirects` son de Netlify. GitHub Pages los ignora. Se
  mantienen por si se mueve el hosting.

## Convenciones

- Todo el contenido y los comentarios, en español.
- Mensajes de commit en español, en imperativo, describiendo el qué.
- Nombres de clases CSS en español, estilo BEM suave: `.cabecera__interior`,
  `.entrada__titulo`.
- Accesibilidad: enlace de salto, `aria-label` en navegaciones, jerarquía de
  encabezados correcta. No romperlo.
