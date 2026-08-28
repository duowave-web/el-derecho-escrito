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
4. `articulos/index.html` — añadir la entrada al listado completo, **con su
   `data-etiquetas`**.

Si no, el artículo existe pero es invisible para buscadores y lectores de RSS.

> **El paso 4 pesa más que los otros tres, y conviene saberlo.**
> `articulos/index.html` **es el índice del sitio**: el bloque «Continúa
> leyendo» de cada artículo se construye leyendo sus tarjetas por `fetch`. Así
> que saltárselo no solo esconde el artículo del listado — lo deja fuera de los
> relacionados de todos los demás.
>
> Es a propósito que no haya un `articulos.json` aparte: este archivo ya había
> que mantenerlo, y **si se olvida el fallo se ve al instante**, mientras que un
> índice paralelo se desincroniza en silencio. Está razonado más abajo.
>
> **Lo que NO hay que tocar al publicar es el bloque «Continúa leyendo»** de
> ningún artículo. Se rellena solo.

### La categoría de un artículo se repite en 9 sitios

> ⚠️ **Y hay TRES ENTRADAS DE EJEMPLO más en `articulos/index.html`**, marcadas
> con `<!-- PROVISIONAL: entradas de ejemplo, borrar antes de entregar -->` y su
> marca de FIN. Están solo para que el bloque «Continúa leyendo» del artículo
> tenga candidatos y se pueda ver funcionando con un único artículo publicado.
>
> **Sus enlaces dan 404**, y tiene que ser así: si apuntaran al artículo real, la
> exclusión por `pathname` las descartaría a las tres y el bloque volvería a
> quedarse vacío. Tampoco se quedan en los relacionados — **se ven en el listado,
> el contador dice «4 artículos publicados» y entran en el filtro de Fundamento**.
>
> Al borrarlas no hay que tocar nada más: el bloque del artículo se queda sin
> candidatos y **se oculta solo**.

> ⚠️ **El único artículo publicado es un ejemplo provisional.** «El principio de
> legalidad penal» y su categoría **«Fundamento»** están para que la plantilla
> tenga contenido con el que probarse, y **se eliminan al entregar la web**. No
> se deben tomar como referencia editorial: ni el tema, ni la categoría, ni la
> firma —que es la de la maqueta, según la sección de autoría.

Como con la autoría, sin build no hay una sola fuente de verdad. Al cambiar la
categoría de un artículo hay que tocar los nueve:

| # | Dónde | Qué |
|---|---|---|
| 1 | `index.html` | `.etiqueta--plana` de la tarjeta de portada |
| 2 | `articulos/index.html` | `.etiqueta` de la tarjeta del listado |
| 3 | `articulos/index.html` | **`data-categoria`** de la tarjeta — la clave que leen los filtros |
| 4 | `feed.xml` | `<category>` del `<item>` |
| 5 | el artículo | `.etiqueta--plana` de la ficha de cabecera |
| 6 | el artículo | `"articleSection"` del JSON-LD |
| 7 | el artículo | **`<meta property="article:section">`** — el equivalente Open Graph |
| 8 | el artículo | la píldora `.etiqueta--tag` del lateral |
| 9 | portada y artículo | el **`href`** de la etiqueta, `?categoria=…` |

**Cuatro de los nueve no los encuentra un `grep` de la categoría tal cual**, y
son justo los que se escapan:

- El `article:section` no se ve al leer la página.
- La píldora del lateral va sin espacios: `#Fundamento`.
- El `data-categoria` y el `href` van **en minúsculas y sin acentos**, porque
  son claves y no texto: `fundamento`, no «Fundamento».

Esa última es la más traicionera, porque hay **dos formas de la misma palabra
conviviendo en el mismo archivo**: la etiqueta visible y la clave del enlace.

```sh
# Las nueve de una vez, contando las variantes sin espacios y en minusculas
grep -rni 'fundamento' --include='*.html' --include='*.xml' .
```

> **Ya no hay falsos positivos, y antes sí los había.** Aquí decía que
> `index.html` tenía un `<h3>Derecho penal</h3>` dentro de la franja «Áreas del
> derecho» —las materias del despacho, que no se tocan al recategorizar—.
> **Esa franja se eliminó**, y con ella la única lista del sitio que usaba
> palabras parecidas a las categorías sin serlo.
>
> Comprobado ejecutándolo: el `grep` devuelve hoy doce líneas y **las doce son
> reales** —los nueve puntos, el botón del filtro y dos comentarios que avisan
> de las variantes—. Si algún día vuelve una lista de materias, vuelve el aviso.

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

> ⚠️ **En `articulos/` las tarjetas van en orden de fecha, y hay que escribirlas
> así aunque el JS las ordene.** No es redundante: el JS ordena por el
> `datetime` del `<time>`, pero **sin JavaScript se ve el orden del marcado**, y
> ahí no hay quien lo arregle. El sort protege el caso normal; escribirlas en
> orden protege el respaldo.
>
> El listado pagina de **nueve en nueve**. Al publicar el décimo, el más antiguo
> pasa solo a la página 2: no hay nada que mover a mano.

Si algún día se vuelve a cambiar el número de columnas, **hay que recalcular el
punto de corte**: no es un número redondo, sale de medir. Está explicado abajo,
en la sección de puntos de corte.

### Ningún filtro va apagado y la tarjeta de espera no se esconde nunca

Los cuatro botones de categoría de `articulos/` **se pueden pulsar siempre**,
tengan artículos o no. Estuvieron `disabled` los vacíos —hoy Ensayo y
Jurisprudencia— y el motivo de quitarlo es que un botón apagado no puede
explicarse: quien lo ve no distingue una categoría vacía de una rota, y el
único sitio donde cabría la explicación es justo el control que no responde.

**La tarjeta de «Próximamente» tampoco se esconde en ningún caso**: con filtro,
con búsqueda, con resultados, sin ellos y en todas las páginas.

Estuvo condicionada, y merece la pena saber por qué se quitó porque el
razonamiento vuelve cada vez que alguien la mira. Se enseñaba solo en la lista
entera de la página 1 —o respondiendo a una categoría vacía—, con el argumento
de que junto a los resultados de un filtro se leería como un artículo más de
esa categoría. **El cambio de fondo es que ha dejado de ser una respuesta para
ser mobiliario**: lo que cierra la rejilla, como el pie cierra la página. Una
respuesta tiene que aparecer cuando toca; un cierre, siempre.

Va también en **todas las páginas**, no solo en la primera. Se sostuvo que la
primera era su sitio porque ahí está lo más reciente y «próximamente» apunta
hacia delante, mientras que el final de la lista es lo más antiguo. Ese
argumento vale mientras la tarjeta sea contenido y decae en cuanto es
mobiliario: cualquier regla por página reintroduce la condición que el cambio
quita, y **una tarjeta que aparece y desaparece según dónde estés no puede
explicar por qué**.

> ⚠️ **La consecuencia que hay que tener presente: ya no informa de nada.** Al
> verse igual con quince artículos que con ninguno, **no puede seguir haciendo
> de «esta categoría está vacía»**, que es el papel que tuvo. Quien retoque la
> lógica del vacío tiene que contar con eso.

### Categorías y etiquetas son dos ejes, y no se pisan

`articulos/` filtra por **tres criterios que se acumulan**: la búsqueda (`?q=`),
la **categoría** (los cuatro botones, `?categoria=`) y las **etiquetas** (el
desplegable, `?etiquetas=`). Marcar etiquetas no borra la categoría ni al revés.

> **Se llaman «etiquetas» y no «categorías», y lo decidió el sitio, no yo.** El
> lateral del artículo ya tiene un bloque titulado «Etiquetas» y sus píldoras
> llevan **almohadilla**; la categoría va sin ella y en plano. Esa distinción
> visible ya existía y el filtro solo la respeta.
>
> ⚠️ **Queda una colisión sin resolver:** el artículo de ejemplo lleva la
> etiqueta `#Fundamento`, que es **también** el nombre de una categoría, así que
> en la misma pantalla hay un botón `FUNDAMENTO` y una píldora `#Fundamento` que
> filtran cosas distintas. Se deja a propósito —es contenido de un artículo de
> ejemplo que se borra al entregar— pero **conviene que las etiquetas reales del
> cliente no repitan nombres de categoría.**

**La lógica es Y entre criterios y O dentro de las etiquetas.** O sea: búsqueda
Y categoría Y (etiqueta1 O etiqueta2). Es la convención de filtros por facetas y
además lo pide la escala: con Y, marcar dos etiquetas que no coincidan en ningún
artículo daría **cero al instante** y el control parecería roto.

#### `data-etiquetas` guarda el TEXTO VISIBLE, no la clave

Y es lo contrario que `data-categoria`, así que merece explicarse:

| Atributo | Qué guarda | Por qué |
|---|---|---|
| `data-categoria` | `fundamento` | viaja **literal** a `?categoria=` y a `data-filtro`: ahí la clave *es* el dato |
| `data-etiquetas` | `Legalidad,Garantías` | de ahí salen el nombre de la casilla y el de la píldora, y **los acentos no se reconstruyen** desde una clave |

Se normaliza al comparar, que es lo que ya hacía el bloque de relacionados, y
también al escribir la URL —van en clave para no llenarla de `%C3%ADas`—.

**La lista del desplegable no está escrita en ninguna parte**: se recoge de los
`data-etiquetas` de las tarjetas, se deduplica por clave normalizada y se ordena
alfabéticamente. Si dos artículos escriben la misma etiqueta distinto —
«Garantías» y «garantias»— cuentan como una, con la primera grafía que aparezca.

> **Hoy el menú lista siete, y dos son de las entradas provisionales**
> (`Docencia`, `Divulgación`). Al borrarlas se quedará con las del artículo real.
> Si algún día no hay ninguna etiqueta, **el control entero se oculta**: un
> desplegable vacío es peor que ninguno.

#### El desplegable no es un `role="menu"`, y es deliberado

Un menú ARIA **obliga** a navegación por flechas y activación única. Esto es un
grupo de opciones múltiples, así que lleva `<input type="checkbox">` de verdad:
ya son operables por teclado y anuncian su estado sin emular nada.

- El botón lleva `aria-expanded` y `aria-controls`.
- **Cerrado, el panel va con `hidden`**, así sus casillas quedan fuera del orden
  de tabulación sin tocar `tabindex`.
- **Escape cierra y devuelve el foco al botón.** Sin lo segundo el foco se
  quedaría en un panel inexistente y saltaría al principio del documento.
- Salir con el tabulador cierra, mirando `relatedTarget` en `focusout`.
- Las casillas se dejan **nativas**. Rehacerlas con un pseudoelemento obligaría
  a reimplementar foco y alto contraste sin ganar nada.

#### Las píldoras se pulsan para quitarse

No son informativas: cada una es un `<button>` con su aspa y nombre accesible
«Quitar etiqueta X». **Un filtro que ves pero no puedes deshacer sin volver a
abrir un menú es un control a medias** — el mismo motivo por el que ningún botón
de categoría va `disabled`.

Por eso **no reutilizan `.etiqueta--tag`**, que en el artículo es
deliberadamente un `<span>` inerte. Misma familia visual, distinta naturaleza:
`.etiqueta--filtro`.

> ⚠️ **El margen va en `.seleccion`, el envoltorio que se oculta, nunca en las
> píldoras ni en el botón de dentro.** Con `hidden` el envoltorio entra en
> `display:none` y deja de generar caja, margen y aportación al `gap`; si el
> margen estuviera en los hijos, ocultarlos dejaría el hueco del padre.
>
> Verificado midiendo la distancia entre `.filtros` y `.contador`: **22 px sin
> selección, 114,8 con dos etiquetas, y 22 exactos otra vez al borrarlas**. Los
> 22 son el `margin-bottom` de `.filtros` y nada más.

**«Borrar etiquetas» borra solo etiquetas.** No toca la categoría ni la
búsqueda, y el argumento es el nombre del propio botón: si borrara todo tendría
que llamarse «Borrar filtros», y entonces no pintaría nada dentro de un bloque
que solo existe cuando hay etiquetas marcadas.

### El estado vacío lo dice el contador, y solo el contador

No hay ningún mensaje de «no hay artículos» en la página. Hubo uno —`.vacio`,
«No hay ningún artículo que mostrar»— y **se retiró entero**: párrafo, regla CSS
y lógica. Lo que queda en cada caso:

| | Categoría vacía | Búsqueda sin resultados |
|---|---|---|
| Botón pulsado | **«Ensayo»** encendido | «Todos» |
| `.filtro-aviso` | — | **«Resultados para «zzz» · Ver todos»** |
| `.contador` | **«0 resultados»** | **«0 resultados»** |

Se quitó por dos razones, y la segunda es la que decide:

1. **Repetía al contador**, que ya dice cuántos hay en *todos* los estados y no
   solo cuando el número es cero.
2. **Lo repetía peor.** `.contador` lleva `aria-live="polite"`; `.vacio` no
   llevaba ninguna. Con lector de pantalla ese párrafo **aparecía en silencio**,
   así que lo que se oía ya era exactamente lo que se oye ahora. Quitarlo no le
   restó nada a nadie: igualó lo que se ve con lo que ya se escuchaba.

La búsqueda no queda desatendida, que es lo que parece a primera vista.
`mostrarAviso()` se llama **siempre que hay `?q=`**, tenga resultados o no, así
que el estado de búsqueda tiene *más* contexto que el de categoría: nombra la
consulta y ofrece una salida. Y sin artículos publicados, sin consulta y sin
filtro, el contador diría «0 artículos publicados» — tampoco queda ningún estado
sin explicar.

> ⚠️ **Si algún día se quiere un vacío más cálido, la vía es cambiar cómo habla
> el contador cuando el número es cero** —o sea la cadena de
> `actualizarContador()` en `js/main.js`—, **no añadir un párrafo debajo.**
>
> Es la decisión que peor se reinventa: dentro de seis meses «el vacío se ve
> seco» pide a gritos un `<p>` nuevo bajo la rejilla, y eso devuelve el problema
> entero — dos elementos diciendo lo mismo, y el nuevo otra vez el mudo de los
> dos, porque el `aria-live` seguiría estando en el contador.
>
> El contador ya está en el sitio correcto, ya se anuncia y ya existe en todos
> los estados. Lo único que le falta para ser un buen vacío es la redacción.

Lo que **sí** sigue siendo cierto es que no es un resultado: no lleva
`data-categoria`, no entra en el array de entradas y **el contador no la
cuenta**. Verificado con doce artículos sintéticos: la página 1 enseña diez
tarjetas y el contador dice «12 artículos publicados».

Y una consecuencia de mantenimiento: **al publicar el primer Ensayo no hay que
tocar ningún botón.** Antes había que acordarse de quitarle el `disabled`, y
existía además una excepción en el JS que lo reactivaba si la URL pedía esa
categoría. Las dos cosas se han ido: el estado sale del contenido.

#### La altura se iguala por filas, no con un número

`grid-auto-rows: 1fr` en `.tarjetas` iguala **todas** las filas a la más alta, y
está para que la tarjeta de espera mida lo mismo que las de artículo.

Conviene saber cuál era el problema real, porque no es el que parece: **dentro
de una fila ya se igualaban solas**, porque `align-items` vale `stretch` por
defecto. Lo que se descuadraba era la tarjeta que cae en una **fila para ella
sola** — con tres artículos en tres columnas, la de abajo medía 248,8 px contra
573,8 los de arriba.

**No se hace con una altura fija porque no hay ninguna que valga.** Un artículo
mide 573,8 px a 1440, 580,5 a 1000 y 681,6 a 700, y sube a 599,4 en cuanto el
extracto se alarga. Igualando filas el número sale del contenido y no hay nada
que mantener al publicar.

> **En una sola columna se deshace**, dentro del corte de 748. No es un
> capricho: igualar alturas sirve para que no se descuadre lo que está *uno al
> lado del otro*, y ahí cada tarjeta es su propia fila. Manteniéndolo, la de
> espera pasaría de 248,8 px a los 681,6 que mide un artículo a ese ancho —una
> caja casi vacía ocupando la pantalla de un móvil— para arreglar una
> desalineación que nadie puede ver.

**Cuando la tarjeta aparece sola sí lleva `min-height`**, porque sin ningún
artículo a la vista no hay fila con la que igualarse y volvería a sus 248,8 px:
la tarjeta cambiaría de tamaño según la categoría que se pulsara. El suelo es la
altura que tendría el artículo que no está.

Va atado a **`[data-visibles="1"]`**, que es exactamente «se ve ella y nada
más», así que no puede inflar una fila con artículos dentro: con un solo
artículo el atributo ya vale 2.

**Son dos valores, uno por tramo**, porque la altura del artículo depende del
ancho de columna:

| Tramo | Medidas del artículo | Suelo | Desvío peor |
|---|---|---|---|
| **3 col** (≥1085) | 573,9 · 588,3 · 573,8 · 573,8 | **574** | −14 a 1150 |
| **2 col** (749–1084) | 580,2 · 572,8 · 580,5 · 608,5 | **580** | −28 a 1084 |
| **1 col** (≤748) | 560,1 · 614,9 · 713,6 | **ninguno** | — |

No hay un valor exacto para todo un tramo **y no lo puede haber**: lo que mueve
la altura es en cuántas líneas parte el titular, que salta de golpe.

> **En una columna no hay suelo, y es justo donde más varía la altura del
> artículo.** No es un descuido: ahí `grid-auto-rows` vale `auto`, así que la
> tarjeta mide 248,8 px **siempre, acompañada o sola** —verificado a 375 y a
> 700—, y no hay dos estados que igualar. Poner un suelo crearía la incoherencia
> que en los otros tramos se está quitando.

> ⚠️ **El mensaje `.vacio` va ENCIMA de la rejilla, justo bajo el contador, y
> eso depende de este suelo.** Debajo, los 574 px de la tarjeta lo empujaban
> hasta y=979 en una ventana de 1000: **fuera de la pantalla**, justo en la
> página donde es lo único que explica lo que ha pasado.
>
> Encima también se lee mejor: primero se dice que no hay nada y después la
> tarjeta dice que vendrá. Y va centrado, porque ya no cuelga de la rejilla sino
> que vive entre el contador y las tarjetas, los dos centrados.
>
> Si alguien vuelve a bajarlo, tiene que volver a medir dónde cae.

> **El 33 % de llenado de la caja no lo causa el suelo.** Son 190,8 px de
> contenido, y **acompañada da exactamente el mismo 33,2 %** porque ahí también
> mide 573,8. Es como se ve la tarjeta en tres columnas desde siempre.
>
> Se midió si convenía separar más los elementos dentro y **no compensa**: `gap`
> de 28 da 40,6 %, de 40 da 46,8 % y subiendo además la balanza a 72 px se llega
> a 44,9 %. Ninguna se acerca a llenar la caja —el contenido son ~190 px
> intrínsecos— y a partir de `gap: 28` los cuatro elementos dejan de leerse como
> un bloque. La tarjeta tiene que estar callada al lado de un artículo real.

#### El centrado usa dos mecanismos que no se pueden mezclar

`.tarjetas--centrada` centra la fila cuando no se llena, y lo resuelve dos
veces porque hay dos maneras de contar:

- **Sin JavaScript** se cuentan **hijos del DOM**, con `:has(> :nth-child(N))`.
  Es lo único posible sin scripts, y acierta porque ahí se ven todos.
- **Con JavaScript** se cuenta lo que de verdad se ve, que el JS deja en
  **`data-visibles`**. Hace falta porque al filtrar una categoría vacía sigue
  habiendo dos hijos y una sola tarjeta a la vista.

> ⚠️ **No basta con poner las reglas de atributo después.** `:has()` **adopta la
> especificidad de su argumento**, así que la regla de dos columnas pesa
> (0,3,0) frente a los (0,2,0) del atributo: gana por peso y el orden en el
> archivo da igual. Estuvo así y dejaba la tarjeta descolocada en la columna
> izquierda de una rejilla de dos.
>
> Se arregla con `:not([data-visibles])` en las reglas de `:has()`, que las
> vuelve **excluyentes en vez de competidoras**: con JS solo aplican las de
> atributo, sin JS solo las de conteo. Si alguien añade un caso nuevo, tiene
> que añadirlo a los dos lados o a ninguno.

Y **son dos bloques, uno por tramo de columnas**, porque el ancho que se fuerza
tiene que ser el de una columna *de ese tramo*:

| Tramo | Columnas | Casos que centra | Ancho forzado |
|---|---|---|---|
| ≥ 1085 px | 3 | 1 y 2 tarjetas | `(100% − 56px) / 3` |
| 749–1084 px | 2 | **solo 1** tarjeta | `(100% − 28px) / 2` |
| ≤ 748 px | 1 | ninguno | — |

En el tramo de dos, con dos tarjetas la fila ya se llena sola, así que el único
caso incompleto es el de una. Hubo un tiempo en que solo existía el bloque de
tres, con ese mismo argumento —«abajo la fila se llena sola»— que **cubría el
caso de dos y se dejaba el de una**: la tarjeta se quedaba en la columna
izquierda con medio contenedor vacío al lado.

> **El ancho sale de un `100%` de la rejilla, no de `--ancho-amplio`.** El token
> vale 1200 y es un **máximo**, así que solo coincide con el ancho real por
> encima de 1248. Con la fórmula vieja, a 1085 el contenedor mide 1037 y se
> seguían forzando **365,3 px cuando una columna de tres ahí son 327**. Con
> `100%` el número sale de lo que la rejilla mide de verdad y vale en todo el
> tramo.

### El «continúa leyendo» se construye solo, leyendo el listado

**No se rellena a mano y no hay que tocarlo al publicar.** Las tarjetas las monta
`articulosRelacionados()` en `js/main.js` haciendo `fetch` de `articulos/`, que
es el índice del sitio, y eligiendo por **etiquetas compartidas**; los que no
comparten ninguna entran por **fecha**.

> ⚠️ **`articulos/index.html` ha dejado de ser solo una página: es una
> dependencia de todos los artículos.** Quien le cambie la estructura de las
> tarjetas —clases, `time`, el `<a>` del titular— rompe este bloque en todos los
> artículos a la vez, y ahí no se ve.

Se descartaron las otras dos vías **por su modo de fallo**, no por cuántos
sitios tocan:

| Vía | Si se olvida | Cómo te enteras |
|---|---|---|
| Tarjetas a mano | los artículos viejos nunca enlazan a los nuevos | **nunca** — no hay error, solo enlaces que envejecen |
| `articulos.json` | el índice y el sitio discrepan | **nunca** — falla en silencio |
| **Leer el listado** | el artículo no aparece en `articulos/` | **al instante**, es el paso 4 de publicar |

O sea que esto **no añade un décimo punto de mantenimiento**: reutiliza uno que
ya era obligatorio y cuyo despiste ya se nota a gritos. Y las tarjetas a mano
tenían un defecto propio: son la única variante que **empeora sola con el
tiempo**, porque para que el artículo 1 enlace al 7 hay que volver a editar el 1.

Lo único nuevo es **`data-etiquetas`** en la tarjeta del listado. Su fallo es
benigno: sin él, ese artículo puntúa cero en afinidad y entra por fecha, que es
el respaldo previsto. **Las del artículo que se está leyendo no se duplican**: se
leen de sus propias píldoras `#Etiqueta` del lateral.

**Son DOS tarjetas, no tres, y las tres se probaron antes de decidirlo.** Aquí
la rejilla no vive en la retícula de 1200 sino dentro de `.articulo__cuerpo`,
que son **720 px**.

> **La razón no es la que parecía, y merece quedar escrita porque el argumento
> intuitivo era mío y estaba mal.** Predije que a tres columnas la tarjeta
> rompería por `min-content` —221,3 px contra el suelo de 218,9—. **No rompe**:
> no desborda nada, la palabra más larga mide 122,4 px y cabe de sobra.

Lo que descarta las tres es la **imagen**. Medido en las dos variantes:

| Rejilla | Tarjeta | Hueco de imagen | Superficie | Líneas del titular |
|---|---|---|---|---|
| 3 columnas | 221,3 px | 221×148 | 32.656 px² | 3–4 |
| **2 columnas** | **346 px** | **346×231** | **79.810 px² (×2,4)** | **2** |

**Menos de la mitad de superficie.** A 221×148 la balanza de la foto deja de
distinguirse, y en un sistema cuya regla es que *«el texto manda, la imagen
acompaña»*, acompañar a ese tamaño es casi no estar. De paso, los titulares a
3–4 líneas dejan las fechas descuadradas entre tarjetas, porque van ancladas
abajo.

> **Salvedad de la prueba:** los tres titulares de ejemplo comparten las cuatro
> primeras palabras, lo que exagera el número de líneas. Con titulares reales y
> distintos, tres columnas aguantarían mejor de lo que se vio. **Lo que no
> mejora con titulares reales es el tamaño de la imagen**, y ese es el argumento
> que decide.

> **`.tarjetas--tres` ya no existe.** Era la rejilla de este bloque cuando se
> rellenaba a mano. Se borró por dos motivos: no cabe, y declaraba
> `repeat(3, 1fr)` **sin el `minmax(0, ...)`** que impide que una columna deje de
> ceder y aplaste a las vecinas. Era justo el sitio donde ese fallo habría
> mordido. La sustituye `.tarjetas--par`.

**Con cero relacionados se oculta la sección entera**, y hoy es el caso: con un
solo artículo publicado el único candidato es él mismo. El bloque ya está en el
HTML pero sale con `hidden`, así que **no se ve nada hasta que exista el segundo
artículo, y entonces aparece solo.**

No se le puso la tarjeta de «Próximamente» de la portada, y la diferencia
importa: en la portada la sección es **un inventario** y la tarjeta añade una
promesa, mientras que aquí es **navegación** y una promesa no es un destino. El
rótulo dice «Continúa leyendo» y una tarjeta que no se puede pulsar lo desmiente
en la misma línea.

**Sin JavaScript tampoco aparece**, y se asume: el artículo se lee entero sin
esto y la salida real —`.volver`— ya está puesta dos veces. Mismo criterio que
con los filtros y la paginación del listado.

Un detalle que se escapa: al clonar, **el titular baja de `<h2>` a `<h3>`**. En
el listado cuelga del `<h1>` de la página; aquí cuelga del `<h2>` «Continúa
leyendo», así que un `<h2>` saltaría el nivel. Verificado con siete artículos
sintéticos: **cero saltos de jerarquía** en toda la página.

### Ya no quedan migas en ninguna página

Se retiraron por tandas y siempre por el mismo motivo: **repetían navegación que
la cabecera ya da en todas las páginas.** Primero las del artículo y el listado
—de los tres niveles del artículo, «Inicio» y «Artículos» estaban a un clic ahí
arriba, y el tercero era el título de la página en la que ya estás—, y después
las de `sobre/` y `contacto/`.

Esas dos se mantuvieron un tiempo con el argumento de que son hojas sueltas sin
listado padre al que volver. Dejó de sostenerse cuando las tres páginas de
sección pasaron a abrir con la misma banda a sangre: el título de la banda ya
dice dónde estás, y la cabecera dice cómo salir.

En el artículo las sustituye `.volver`, un enlace de vuelta al listado. Es el
mismo componente que cierra el artículo abajo: **misma clase, mismo texto y
mismo destino**, y la única diferencia es el modificador `--cierre`, que solo
cambia márgenes. Si hay que tocar el aspecto se toca `.volver` en el CSS, nunca
uno de los dos sitios.

**`.miga` ya no existe en el CSS.** Se retiró con el último uso, con sus cuatro
reglas.

> **Si alguna vez vuelven, son DOS cosas y no una:** el marcado en el `<body>` y
> el `BreadcrumbList` en el JSON-LD del `<head>`. Y al revés también: quitar solo
> el visible no da ningún error, la página simplemente le sigue declarando a
> Google una ruta que ya no enseña. Es la mitad que se olvida.
>
> Comprobación de que no queda ninguna descuadrada:
>
> ```sh
> grep -rn 'class="miga"\|BreadcrumbList' --include='*.html' .
> ```
>
> Hoy no devuelve nada.

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
--papel-alt:    #F6F5F7;  /* superficies apoyadas: cajas, campos, bandas */
--pie:          #242424;  /* fondo del pie, texto en blanco */
--borde:        #E5E1DA;  /* separadores, tarjetas, campos */
--borde-marcado:#D8D2C9;  /* linea de la cabecera */
```

Los dos bordes se diferencian poco a propósito. `--borde` está para separar sin
que se note; `--borde-marcado` es un paso más oscuro —ΔE 16,4 frente a blanco,
contra 11,1 del otro— y solo lo usa la línea de la cabecera, que sí tiene que
leerse como un límite. Ninguno es gris neutro: ambos conservan el
desplazamiento cálido de la paleta.

> **`--papel-alt` es el único token frío, y eso es a propósito desde que lo
> pidió el cliente.** Estuvo en `#F7F5F2`, un marfil cálido, y pasó a `#F6F5F7`,
> un blanco mármol. En el eje b\* de Lab la paleta queda así: `--borde-marcado`
> +5,2, `--tinta-suave` +4,1, `--borde` +3,9, `--nav` +2,4, `--papel` y
> `--tinta` en 0, **`--papel-alt` −0,9** y `--acento` −2,8.
>
> Es decir: el fondo de contraste ya no acompaña a los grises, sino al
> verdigrís, que **también es frío** y hasta ahora era el único elemento que no
> encajaba en la temperatura del sistema. Quien lo revise pensando «esto
> desentona con la paleta cálida» debería mirar antes el b\* del acento.
>
> El precio está en los grises cálidos: `--borde` sobre el fondo nuevo sube de
> ΔE 4,7 a **6,2**, y `--borde-marcado` de 8,2 a **9,4**. Las líneas se ven
> algo más, lo que en este caso ayuda —ver el punto siguiente—, pero una
> superficie plana grande en `--borde` sobre `--papel-alt` se leería como beige
> dentro de una caja fría. Hoy no hay ninguna: se comprobó que **los cinco
> huecos de imagen del sitio tienen todos su `<img>`**, así que ese fondo no
> llega a verse. Si alguna vez vuelve a haber un marcador vacío grande, hay que
> volver a mirarlo.

> **`--papel-alt` no sirve para dibujar una caja él solo, y conviene saberlo
> antes de intentarlo.** Frente al blanco de la página son **ΔE 2,3**, por
> debajo del umbral en el que dos superficies planas se distinguen. Es
> deliberado —está pensado como un apoyo que no se nota—, pero significa que
> una caja rellena con él se lee como si no tuviera contorno.
>
> Con el tono cálido anterior eran 2,6, así que el cambio a frío **aleja un poco
> más la caja del umbral**, no la acerca. Es la única regresión medible del
> cambio, y la compensa que los filetes ganan definición.
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
| **Epígrafe `h2` del artículo** | **Source Serif 4** | **32 px** | **600** | normal | 1.2 |
| **Epígrafe `h3` del artículo** | **Source Serif 4** | **24 px** | **600** | normal | 1.25 |
| Navegación | Inter | 12 px | 500 | 0.07em | 1.75 | versales |
| Antetítulo de sección | Inter | 12 px | 600 | 0.08em | 1.3 | versales, color acento |
| Rótulo de sección de portada | Cormorant Garamond | 20 px | **700** | 0.10em | 1.3 | versales, `--tinta` |
| Fecha y metadatos | Inter | 12 px | 500 | 0.06em | 1.4 | versales, `--tinta-suave` |

Regla mental: **Cormorant para lo que se mira, Source Serif para lo que se lee,
Inter para lo que se consulta.**

> **Los epígrafes del artículo no van en Cormorant, y el titular sí.** Es el
> único sitio del proyecto donde un `h1` y sus `h2` no comparten familia, así
> que va a llamar la atención de quien lo lea. Tres cosas antes de «arreglarlo»:
>
> **Los dos son serif.** El cambio fue de un serif de *display* a uno de
> *texto*, no de serif a sans. Quien lea «los epígrafes ya no van en Cormorant»
> puede suponer que saltan a Inter, y no: van a la misma familia que el párrafo
> que tienen debajo.
>
> **Encaja con la regla de arriba.** Los epígrafes se leen dentro de la columna
> y en secuencia con el texto —son «lo que se lee»—, mientras que el titular se
> mira, arriba, con su ficha y su foto. Antes eran lo único de esa columna que
> no estaba en la familia de lectura.
>
> **Ópticamente no se comparan nunca.** Entre el `h1` y el primer `h2` hay
> **621 px medidos**, con la foto 21:9 de 309 px y la entradilla de 163 en
> medio. No existe un momento de la lectura en que los dos estén a la vista.

> **Los tamaños no bajan aunque Source Serif pese más, y es deliberado.** El
> mismo texto pasa de **504,17 a 618,27 px de ancho, un +22,6 %**, y en pantalla
> se lee bastante más cargado de lo que se leía en Cormorant.
>
> Igualar la mancha obligaría a bajar el `h2` a unos **26 px**, y entonces el
> `h3` caería a **~19,6 — a un pelo de los 18 del cuerpo**, aplastando la
> escalera `h2`/`h3`/párrafo. Se prefiere el peso al aplastamiento.

> ⚠️ **Y la palanca contra ese peso NO puede ser un 500.** El `@import` carga de
> Source Serif 4 solo **400 y 600**, y nada entre medias.
>
> Pedir un peso que no está **no da ningún error**: el navegador coge el más
> cercano, aquí el 400, y el epígrafe se queda **exactamente al peso del
> cuerpo**. Deja de distinguirse y nada avisa.
>
> Es el mismo fallo silencioso que el **700 de Cormorant** —documentado unas
> líneas más abajo—, solo que del revés: allí quitarlo del `@import` hace que el
> navegador **engorde el 600** y simule una cara que no existe. En los dos casos
> la página se pinta sin quejarse y el problema solo aparece midiendo.
>
> **Para tocar un peso hay que añadirlo antes al `@import`.**

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
> El tracking sube de `0.01em` porque las mayúsculas juntas se leen peor: la
> silueta de una palabra en caja baja viene dada por ascendentes y descendentes,
> y en versales hay que compensar esa pérdida con aire.
>
> **El cuerpo bajó después de 14 px a 12, a petición del cliente.** Esta sección
> decía antes que 14 se mantenía porque bajar a 12 «solo recorta 29 px y no
> compensa la pérdida de legibilidad». Medido de nuevo al hacerlo, el ahorro
> real es de **32,2 px**, y la legibilidad aguanta: 12 px en versales es el
> cuerpo que ya usan las fechas, los metadatos y el antetítulo de sección, así
> que la navegación no estrena nada.
>
> **El tracking pasó de `0.06em` a `0.07em` en el mismo cambio**, y no es un
> retoque estético. El tracking en `em` escala con el cuerpo, así que mantener
> `0.06` habría encogido la separación real de 0,84 px a 0,72 justo al hacer las
> letras más pequeñas, que es cuando más falta hace. Con `0.07` la separación
> absoluta se queda en **0,84 px**, la misma que tenía a 14: cambia el cuerpo,
> no el aire.
>
> Queda entre los dos valores que el sistema ya usa a 12 px en versales: `0.06`
> en fecha y metadatos, que van en 500 como esto, y `0.08` en el antetítulo, que
> va en 600 y por eso necesita más.

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
| **934 px** | se oculta el campo del buscador | hasta ahí cabe la fila con el campo desplegado; por debajo, abrirlo partiría la marca en dos líneas |
| **716 px** | la cabecera pasa a dos filas | lo mismo con el buscador cerrado, con la navegación en 322,2 |
| **400 px** | el hueco entre enlaces baja a 10 px | con hueco de 28 la navegación se parte por debajo de 371, y eso alcanza a 360 |

> **Los tres bajaron al pasar la navegación de 14 px a 12.** La fila entera se
> estrechó 32,2 px, así que aguanta 32 px más de ventana antes de romperse:
> 966 → 934 y 748 → 716. El de 400 se queda donde estaba pero cambia lo que
> hace, porque ya no tiene que bajar el cuerpo —la base ya es 12— ni apretar el
> tracking.
>
> **Se miden barriendo anchos, no calculando.** El método se validó antes de
> fiarse de él: forzando la navegación a 14 px, el mismo barrido devuelve 746 y
> 964, es decir los 748 y 966 anteriores menos los 2 px de margen que usó la
> medición original.

> ⚠️ **El 934 está repetido en `js/main.js`**, en la función `estrecha()` de
> `buscadorDeCabecera`, que decide si la lupa despliega el campo o vuelve a ser
> un enlace al listado. Los dos números tienen que ir a la par: si el CSS oculta
> el campo y el JS cree que aún cabe, la lupa intenta desplegar algo invisible.

> **El de 748 dejó de compartirse con las tarjetas… y ahora sí están
> separados.** Compartirlo fue una comodidad mientras los dos números
> coincidían, y quedó anotado que al mover uno habría que comprobar el otro.
>
> Comprobado, y no entran: si las tarjetas hubieran seguido a la cabecera hasta
> 716, entre 717 y 720 el interior de la caja se queda en **263 px** y el
> titular salta a **4 líneas**. En una sola columna a 380 el interior es 274 y
> el titular ocupa 3, que es el rendimiento aceptado — o sea que seguir a la
> cabecera empeoraría justo lo que el corte protege.
>
> Así que **las tarjetas se quedan en 748** con su propia media query. El motivo
> de fondo es que nunca dependieron de lo mismo: la cabecera se rompe por el
> ancho de su fila, que acaba de encoger, y las tarjetas por el padding de
> 28 px, que se come 58 de cada columna y no ha cambiado.

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
Pie:                fondo oscuro
```

> **Detrás de «Últimos artículos» iba una franja de «Áreas del derecho»** con
> las cuatro materias del despacho, y se eliminó con su CSS —`.franja`,
> `.areas` y las dos reglas de `.area`, que no las usaba nadie más—.
>
> No hizo falta tocar ningún espaciado. `.lista` pasó a ser el último hijo del
> `<main>` y recogió sola el cierre de 80 px de `main > .lista:last-child`, que
> existe justo para eso. Medido antes y después: de 24 px hasta el pie a **80**,
> el mismo que el listado.
>
> Se llevó por delante el falso positivo del `grep` de categorías —era su
> `<h3>Derecho penal</h3>`— y **la única banda a sangre rellena de
> `--papel-alt`**, o sea el único sitio donde ese tono cubría el ancho entero de
> la ventana. El token no se queda huérfano: lo siguen usando once reglas más.

El bloque de la portada es **titular, entradilla y dos botones**, sin antetítulo
encima. Llevó uno —«BLOG JURÍDICO»— y se retiró.

> **`.portada__antetitulo` sigue en el CSS y no está muerta.** La usa
> `404.html` para el rótulo «Error 404», que es el único caso que queda. Quien
> la busque desde la portada no la encontrará y pensará que sobra.
>
> Lo que sí se retiró con el elemento es `.portada--video .portada__antetitulo`,
> que lo oscurecía a `--acento-oscuro` porque sobre el vídeo el acento se
> quedaba en 2,50:1. Ese modificador solo lo lleva la portada del inicio, así
> que sin antetítulo ahí no le quedaba ningún caso. En el 404 no hace falta: va
> sobre blanco, donde `--acento` da 5,91:1.

El bloque se centra solo: `.portada` es flex con `align-items: center`, así que
al quitar el antetítulo el texto se recolocó sin tocar nada. Verificado que la
franja sigue en 520 px —lo garantiza el `min-height`— y que el desvío respecto
al reparto del padding es 0 en 1440, 900, 600 y 375.

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

La mancheta es una **banda a sangre de 170 px** con `img/fondo-cabecera.jpg` de
fondo y **sin velo**. Abre las tres páginas de sección —`articulos/`, `sobre/` y
`contacto/`— con el título centrado y nada más. El fondo cruza toda la ventana;
el título se queda en la rejilla de 1200 gracias al `.contenedor` que lleva
dentro.

**Dónde cae el texto importa más que cómo de clara sea la imagen**, y esta banda
lo demuestra en las dos direcciones.

Los manchones oscuros de la imagen están en los **bordes izquierdo y derecho**.
Mientras la mancheta llevaba el título a la izquierda y una entradilla a la
derecha, el texto caía justo encima: **1,68:1** y **1,02:1**, ilegible. Hizo
falta un velo blanco al 45 % para salvarlo, y aun así lavaba la imagen.

Con el título **centrado**, cae sobre la franja clara del medio y da **14,03:1
sin velo ninguno** — idéntico en los seis anchos medidos, porque esa zona es
uniforme. El velo se retiró: protegía a un texto que ya no está ahí, y sin él la
imagen recupera el veteado y la balanza.

Una media de luminancia habría dicho las dos veces que no hacía falta velo,
porque la imagen es clara *de media*. **Lo que sirve es muestrear el recorte
real bajo cada caja de texto**, en cada ancho, porque `cover` cambia el encuadre
con la proporción de la caja.

> ⚠️ **Guarda: el 14,03 vale para los títulos de ahora**, que miden entre 151 y
> 157 px —«Artículos», «Sobre mí», «Contacto»—. Medido, hay sitio hasta unos
> **450 px** de título (12,71). A partir de ahí el texto empieza a invadir los
> bordes oscuros:
>
> | Ancho del título | Contraste sin velo |
> |---|---|
> | 160 px | 15,61 |
> | 300 px | 13,29 |
> | 450 px | **12,71** |
> | 600 px | 5,79 |
> | 800 px | **2,86** ✗ |
>
> Un título de sección más largo que 450 px obliga a volver a medir, o a
> devolver el velo.

Se probó y se descartó encuadrar solo el centro claro con un zoom del 220 %:
contrasta de sobra pero deja la banda casi blanca, sin veteado, ni libro, ni
balanza. **Pasaba la métrica y fallaba el objetivo.** Cuando una solución de
contraste borra aquello que se quería enseñar, la solución es otra.

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

### Al ampliar un comentario de CSS, reescríbelo entero

Los comentarios de `styles.css` son largos y se amplían a menudo. **No añadas un
párrafo detrás de un bloque ya cerrado**: si el `*/` anterior se queda puesto, el
texto nuevo queda fuera del comentario, el parser lo trata como CSS inválido y
**se traga la regla siguiente entera, sin dar ningún error**. La regla desaparece
y la página se ve mal en otro sitio.

Ha pasado seis veces. Se detecta en un segundo, así que merece la pena
comprobarlo después de tocar el archivo:

```sh
# Cierres de comentario huérfanos. Debe salir 0.
python3 -c "
import re,sys
t=open('css/styles.css',encoding='utf-8').read()
sin=re.sub(r'/\*.*?\*/','',t,flags=re.S)
print('cierres sueltos:', sin.count('*/'))
"
```
