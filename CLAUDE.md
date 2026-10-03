# El Derecho Escrito

Blog de análisis y artículos jurídicos. Proyecto de cliente: abogado de Derecho
Administrativo, Urbanismo y Jurisdicción Contencioso-Administrativa.

Dominio final previsto: `elderechoescrito.es`.

---

## Los textos visibles son del cliente — no se reescriben

La banda de suscripción, `sobre/`, `contacto/`, el aviso de cierre del artículo
y el bloque de suscripción del lateral llevan **textos definitivos entregados
por el cliente**. Se copiaron literalmente.

**No se reescriben, no se acortan y no se les corrige el estilo**, ni siquiera
para ajustar una línea que rompe mal. Si un texto no cabe, se cambia el diseño
—como se hizo con la columna del hero, que pasó de 556 a 620 px— o se pregunta.
Si hay una errata, se avisa; no se corrige por iniciativa propia.

> ⚠️ **EL HERO SALIÓ DE ESA LISTA, Y ESTA SECCIÓN LO INCLUÍA.** Sus textos eran
> del cliente y se sustituyeron **por encargo**. Los de ahora son los oficiales
> y quedan registrados aquí para que ninguna pasada futura los «devuelva» a la
> versión del cliente creyendo que corrige un descuido.
>
> El hero es hoy lo único de esta lista que **no** procede de su documento. Todo
> lo demás sigue igual y la regla de arriba se les aplica entera.

**El texto oficial del hero**, tal como está en `index.html`:

> **h1** — Blog jurídico especializado en Derecho Administrativo y Urbanismo
>
> **entradilla** — Un espacio de análisis para comprender los fundamentos, la
> jurisprudencia y la práctica del Derecho Público, tanto en vía administrativa
> como ante los tribunales.

Y dos decisiones del hero que **no son descuidos** y no hay que revertir:

> ⚠️ **1. «Derecho Administrativo» y «Derecho Público» van en MAYÚSCULA, y es
> intencionado.** Contradice a propósito la convención del cliente que está en
> la lista de abajo —él escribe «Derecho administrativo»—, y la contradice
> **solo en el hero**.
>
> Es exactamente la clase de cosa que una revisión de estilo «arregla» de camino
> a otra tarea, porque desde dentro del archivo parece una inconsistencia. No lo
> es: el titular del hero es el único texto del sitio que no sigue esa
> convención, y se quiere así.

> ⚠️ **2. El antetítulo del hero —la línea de áreas— se eliminó, y fue
> deliberado.** Decía «Derecho administrativo · Urbanismo · Jurisdicción
> contencioso-administrativa» y ocupaba un `<p class="portada__antetitulo">`
> encima del `<h1>`. **No hay que reponerlo.**
>
> Con él se retiró su regla de contraste, `.portada--video .portada__antetitulo`,
> que existía únicamente por ese caso. Las dos cosas van juntas: **reponer una
> sin la otra publica el rótulo ilegible y nada avisa** —sobre el vídeo,
> `--acento` se queda en 2,50:1—. Está razonado en su propia sección, más abajo.
>
> **La clase base `.portada__antetitulo` SE CONSERVA y no es código muerto**: la
> usa `404.html` para el rótulo «Error 404», que va sobre blanco y nunca
> necesitó la regla de contraste. Quien la vea sin usos en la portada y la borre
> por limpieza, rompe el 404.

Dos convenciones del cliente que conviene no «arreglar»:

- **«El Derecho Escrito» va en cursiva cuando aparece dentro de un texto** y sin
  ella en los títulos de página. Así que `sobre/` se titula «Sobre El Derecho
  Escrito» en redonda, y el nombre va en `<em>` en la banda de suscripción, en
  la apertura de `sobre/`, en `contacto/` y en el lateral del artículo.
- **Escribe «Derecho administrativo» y «jurisdicción contencioso-administrativa»**,
  con minúscula tras «Derecho». La cabecera de este archivo las capitaliza; el
  criterio del cliente manda en los textos.

  ⚠️ **Con una excepción, el hero**, que va en mayúscula por encargo y está
  arriba. La regla sigue valiendo en todo lo demás.

**Lo que NO venía en su documento y sigue como estaba**: las etiquetas de
sección de la portada, el 404 y las etiquetas del formulario de contacto. Está
listado en la sección de deuda pendiente. *(El artículo de ejemplo también
estaba en esta lista y ya no: se eliminó.)*

Lo demás se ha ido resolviendo en pasadas posteriores: los `<title>`, las meta
descriptions, Open Graph, Twitter y el JSON-LD se reescribieron para las
materias reales; el menú y el pie pasaron de «Sobre mí» a **«Acerca de»**; y el
aviso de `sobre/` adoptó la fórmula del artículo.

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
| `css/styles.css` (url de `img/logo.svg`) | `../` |

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

## Publicar: lo hace el generador, no la mano

> ⚠️ **ESTA SECCIÓN DECÍA LO CONTRARIO Y ERA UNA LISTA DE CINCO PASOS MANUALES.**
> Se titulaba «Sin build = mantenimiento manual» y enumeraba lo que había que
> tocar a mano al publicar: `sitemap.xml`, `feed.xml`, la portada, el listado y
> el índice del artículo.
>
> **Ya no se toca ninguno de los cinco.** Los escribe `scripts/build.mjs` a
> partir de un solo archivo, `contenido/articulos/<slug>/articulo.json`. Está
> explicado entero en **«El generador de artículos»**, al final de este archivo.
>
> **Lo que NO ha cambiado es la regla dura del proyecto**: la web publicada
> sigue siendo HTML, CSS y JS puro, sin dependencias y sin build en el
> servidor. El generador se ejecuta antes de publicar y deja HTML en el repo;
> GitHub Pages sigue sirviendo archivos, no compilando nada. Quien lea «hay un
> build» y deduzca que ya se puede meter un framework, ha leído mal.

Al publicar un artículo nuevo se escribe **un** archivo y se ejecuta **un**
comando:

```sh
contenido/articulos/<slug>/articulo.json   # el texto
contenido/articulos/<slug>/portada.jpg     # la imagen

cd scripts && npm run publicar             # build + PDF
```

De ahí salen, siempre a la vez:

1. `articulos/<slug>/index.html` — la página entera, índice incluido.
2. `articulos/<slug>/portada.jpg` — la imagen optimizada.
3. `articulos/<slug>/<slug>.pdf` — el PDF descargable.
4. `sitemap.xml` y `feed.xml` — la URL y el `<item>`.
5. `index.html` — el destacado y las tarjetas de «Últimos artículos».
6. `articulos/index.html` — la tarjeta del listado, con su `data-etiquetas`, y
   los botones de categoría.

**Nada de esto se edita a mano.** Los archivos generados llevan un aviso en su
cabecera y lo que se escriba dentro se pierde en el siguiente build.

> **El razonamiento de por qué `articulos/index.html` es especial sigue
> valiendo, y ahora vale más.** Se conserva justo debajo.

> **El paso 4 pesaba más que los otros tres, y conviene saberlo.**
> `articulos/index.html` **es el índice del sitio**: el bloque «Continúa
> leyendo» de cada artículo se construye leyendo sus tarjetas por `fetch`. Así
> que saltárselo no solo esconde el artículo del listado — lo deja fuera de los
> relacionados de todos los demás.
>
> Es a propósito que no haya un `articulos.json` aparte: este archivo ya había
> que mantenerlo, y **si se olvida el fallo se ve al instante**, mientras que un
> índice paralelo se desincroniza en silencio. Está razonado más abajo.
>
> ⚠️ **Y con el generador esto se vuelve una regla de diseño, no una
> comodidad.** Ahora sí existe un origen de datos aparte —los `articulo.json`—,
> así que la tentación evidente es que «Continúa leyendo» lea de ahí y se acabe
> el `fetch`. **No se hace, y el motivo es que los JSON no se publican**: viven
> en `contenido/`, que no se sirve. El navegador del lector no puede verlos.
>
> Lo que sí ha cambiado es de quién es la culpa si se desincroniza: antes era
> de quien se olvidaba del paso 4, y ahora es del generador, que escribe la
> tarjeta y la página del artículo en la misma pasada. No puede fallar una sin
> la otra.
>
> **Lo que NO hay que tocar al publicar es el bloque «Continúa leyendo»** de
> ningún artículo. Se rellena solo.

#### TODO artículo lleva índice, y lo escribe el generador

> ⚠️ **ESTA SECCIÓN DECÍA «Y SE ESCRIBE A MANO».** Lo fue durante un tiempo, y
> antes de eso lo generaba JavaScript en el navegador. Ahora lo escribe
> `scripts/build.mjs`, que **es otra cosa**: el índice sigue estando en el HTML
> publicado —un buscador lo ve, y sin JavaScript también— y lo único que cambia
> es quién teclea los `<li>`.
>
> **La regla dura del proyecto no se toca**: el contenido va en el HTML. Lo que
> se retiró en su día, `indiceDelArticulo()` en `js/main.js`, generaba el índice
> **en el navegador del lector**, y eso sí lo dejaba fuera del HTML. No hay que
> reintroducirlo.
>
> Todo lo que sigue describe **lo que el generador produce**, y hay que leerlo
> si se toca `pintarIndice()` en `scripts/lib/plantilla.mjs`.

#### El orden de la columna del artículo

Lo monta `paginaArticulo()` en `scripts/lib/plantilla.mjs`, y es este:

```
.volver              ← Volver a los artículos
.articulo__portada   la foto, 21:9
.etiqueta--plana     la categoría, enlazada al filtro
h1.articulo__titular el titular, con su filete en ::after
.articulo__ficha     firma, fecha y minutos
.entradilla
nav.indice
.articulo__cuerpo
```

> ⚠️ **LA FOTO ESTABA EN CUARTO LUGAR, DESPUÉS DE LA FICHA, Y SUBIÓ AL SEGUNDO.**
> El orden era categoría → titular → ficha → **foto** → entradilla. Se cambió
> por encargo, para que la página abra con la imagen.
>
> **Se movió en el marcado, no con `order` de CSS**, y eso no es un detalle de
> gusto: el orden del DOM es el que oyen los lectores de pantalla y el que usa
> el PDF. Un `order` los habría dejado leyendo el orden viejo mientras la
> pantalla enseñaba el nuevo.

> **El PDF no se entera, y conviene saber por qué antes de tocar nada aquí.**
> `imprimir.css` oculta los cuatro bloques de cabecera —`.articulo__portada`,
> `.articulo__principal > .etiqueta--plana`, `.articulo__titular` y
> `.articulo__ficha`— porque **todos ellos se repiten en la portada del PDF**,
> que inyecta `pdf.mjs`. Estén en el orden que estén, en papel no se ven.
>
> Verificado generando el PDF antes y después del reorden: **byte a byte
> idéntico**. Ahora esa comprobación significa algo, porque el PDF dejó de
> llevar la hora del reloj dentro.
>
> La consecuencia para el futuro: **el orden de la portada del PDF es
> independiente del de la web** y vive en `portada()`, en `pdf.mjs`. Cambiar uno
> no cambia el otro, y no hay nada que los mantenga sincronizados.

> **Ningún espaciado hubo que tocarlo**, y es porque todos los huecos los ponen
> márgenes propios de cada bloque, no selectores de hermano. Comprobado: no hay
> ni un `+` ni un `~` en el CSS de esta columna. Medido después del cambio, en
> 1280 y en 375, idéntico en los dos:
>
> | Hueco | px |
> |---|---|
> | `.volver` → foto | 24 |
> | foto → categoría | 32 |
> | categoría → `h1` | 6 |
> | `h1` → ficha | 22 |
> | ficha → entradilla | 28 |
> | entradilla → índice | 36 |
>
> Los 32 de debajo de la foto y los 28 de debajo de la ficha ya existían: antes
> separaban la foto de la entradilla y la ficha de la foto. Al intercambiarse
> los bloques cada margen se encontró un vecino distinto y el ritmo salió solo.

El índice va en la **columna del artículo**, entre la entradilla y el primer
apartado, y lo lleva todo artículo. La estructura es esta:

```html
<nav class="indice" aria-labelledby="indice-titulo">
  <h2 id="indice-titulo">Índice del artículo</h2>
  <ol role="list">
    <li><a href="#origen">De dónde viene el principio de legalidad</a></li>
    <li><a href="#exigencias">Las cuatro exigencias</a></li>
  </ol>
</nav>
```

La receta, en cuatro puntos:

1. **Un `<li>` por cada `<h2>` del cuerpo, en orden y con el mismo texto.** Solo
   los `<h2>`: los `<h3>` no entran, o el índice acaba siendo tan largo como el
   artículo. Sale solo: en el JSON los `<h2>` **son** las secciones, y los
   `<h3>` son bloques de tipo `subtitulo` dentro de una.
2. **Cada `<h2>` necesita un `id`**: minúsculas, sin tildes, con guiones
   (`prohibicion-de-analogia`). Es el campo `id` de la sección. **No se genera a
   partir del título, y eso es deliberado**: un `id` derivado del texto cambia
   en cuanto se retoca una palabra del epígrafe, y ahí se rompen a la vez el
   índice, las anclas externas y cualquier enlace compartido. Escribiéndolo, el
   título se puede corregir sin mover el ancla.
3. **Los números no se escriben… salvo que el texto traiga los suyos.** Ver el
   punto siguiente, que es la excepción y tiene su propia trampa.
4. **No se toca el CSS.** Todo el aspecto vive en `.indice`, en `styles.css`.

> ⚠️ **SI EL AUTOR NUMERA SUS APARTADOS —«I.», «II.»— HAY QUE APAGAR DOS
> CONTADORES, NO UNO, Y SI SE APAGA SOLO UNO NADA DA ERROR.**
>
> El sitio numera los apartados con contadores CSS en dos sitios distintos: el
> epígrafe (`.articulo__cuerpo h2::before`) y el índice (`.indice li::before`).
> Son independientes. Si el texto ya dice «III. Subsanabilidad», sin apagarlos
> se lee «3. III. Subsanabilidad», y apagando solo el del epígrafe el índice
> diría «1.» al lado de un apartado que dice «III.».
>
> Lo resuelve el campo **`numero_original`** de cada sección del JSON. Si alguna
> sección lo trae, la plantilla pone a la vez `.articulo__cuerpo--sin-contador`
> y `.indice--sin-contador`, y escribe la marca en `.indice__marca`, que replica
> exactamente lo que ponía el `::before`. **Las dos clases las pone la misma
> línea de código**, así que no se pueden desincronizar desde el JSON.
>
> No basta con quitar el `::before`: hay que soltar también el
> `counter-increment`. Dejarlo puesto no se ve, pero el contador es del
> documento y sigue avanzando.
>
> El artículo de MASC es el caso real, con sus cinco apartados de I a V.

> ⚠️ **Tres reglas del componente van prefijadas con `.articulo` y hay que
> dejarlas así**: `.articulo .indice ol`, `.articulo .indice li` y su
> `:last-child`. Sin el prefijo, las listas del cuerpo —`.articulo ul,
> .articulo ol` y `.articulo li`, que están **más abajo en el archivo y con la
> misma especificidad (0,1,1)**— ganan por orden.
>
> El destrozo es silencioso y no evidente: la lista se mete 24 px hacia dentro y
> deja de alinear con el rótulo, y cada fila suma 9 px por debajo de su filete,
> con lo que las divisorias dejan de repartir el espacio. Se ve raro sin que
> nada apunte a la causa.
>
> `.indice--lateral` no lo sufría **por casualidad**: vivía al final del archivo
> y ganaba el empate por orden. Al subir el componente, el empate se pierde. Es
> el mismo caso que `.boton--contorno:hover`, documentado más abajo.
>
> Se arregló con especificidad y **no moviendo el bloque de sitio**, para que
> aguante si alguien reordena el archivo.

> ⚠️ **El `<nav>` va FUERA de `.articulo__cuerpo`, y esto es lo único de aquí
> que rompe algo si se hace mal.** Dentro, su `<h2>` entraría en el
> `counter-increment: seccion` del cuerpo y **se llevaría el número 1**,
> corriendo la numeración de todos los apartados: el primero pasaría a ser el 2.
>
> No da ningún error ni descoloca nada. Solo se ven mal los números, y hay que
> estar mirándolos para darse cuenta.

> **No lo genera el navegador, y esa es la distinción que hay que conservar.**
> Lo hizo `indiceDelArticulo()` en `js/main.js`, que leía los `<h2>` y hasta les
> ponía `id` al vuelo. Esa función ya no existe, ni sus dos ayudantes
> —`crearId()` e `idLibre()`—, que no usaba nadie más. **No hay que
> reintroducirlas ahora que existe un generador**: son dos cosas distintas.
>
> El motivo es la regla dura del proyecto: **el contenido va en el HTML y el JS
> solo enriquece.** Un índice montado en el navegador no existe sin JavaScript y
> no lo ve un buscador, y un índice es justo de las cosas que un buscador usa
> para entender la estructura de la página. Uno escrito por el build, en cambio,
> está en el archivo servido: cumple la regla igual que si lo hubiera tecleado
> alguien.
>
> La prueba de que la distinción es la correcta: `scripts/build.mjs` **no se
> ejecuta en el navegador de nadie** y su salida está en el repositorio.
>
> El desplazamiento suave **no se pierde**: lo da `scroll-behavior: smooth` en
> `html`, que es CSS y funciona sin scripts. Y con `prefers-reduced-motion` pasa
> a salto seco, como el resto del sitio.

> **Y se mudó del lateral a la columna, que es el cambio que más cuesta
> reinventar.** Estaba en `.articulo__lateral`, y el lateral **no se oculta en
> pantalla estrecha: baja debajo del artículo.** Así que por debajo de 932 px el
> índice aparecía *después* de todo el texto que venía a resumir. Un índice que
> llega al final no es un índice.
>
> Por eso `.indice--lateral` ya no existe: sus filas con filete son las que hoy
> lleva `.indice` de serie.

**El salto tiene que dejar el epígrafe por debajo de lo que hay fijo arriba**, y
en un artículo son dos cosas apiladas: la banda de progreso (30 px, `fixed`) y
la cabecera pegajosa, que se apoya en ella. Lo resuelve `scroll-margin-top` en
`.articulo__cuerpo h2`, con **un escalón en 716 px** porque ahí la cabecera pasa
de una fila a dos. Medido:

| Ancho | Cabecera | Obstrucción | `scroll-margin-top` | Aire |
|---|---|---|---|---|
| 1440 | 80 | 110 | 126 | 15,8 |
| 717 | 72,2 | 102,2 | 118 | 16,0 |
| 700 | **108,2** | 138,2 | **154** | 15,7 |
| 375 | 103,4 | 133,4 | **154** | 20,4 |

> **Esto no reabre el problema de la vieja `--alto-cabecera`**, que se retiró
> porque la portada la **restaba** y cualquier desvío descuadraba la franja en
> silencio. Aquí es una **holgura, no un ajuste exacto**: pasarse unos píxeles
> no se nota —de ahí los 20,4 de la última fila, y nadie los ve— y quedarse
> corto tapa el titular al instante. El modo de fallar es el bueno.

#### El aviso de cierre del artículo tiene una fórmula fija

**Es texto del cliente.** Se copia **tal cual** al publicar: no se reescribe con
otras palabras, no se acorta y no se corrige el estilo.

> *Este artículo tiene carácter informativo y divulgativo y no constituye
> asesoramiento jurídico. La valoración de un asunto concreto requiere analizar
> sus circunstancias particulares. Si deseas plantear una consulta relacionada
> con su contenido o con las materias que aborda, puedes hacerlo a través de la
> [página de contacto](../../contacto/).*

Dos cosas del marcado que no son decorativas:

1. **Va entero en `<em>`, el enlace incluido.** La cursiva es lo que lo separa
   del cuerpo; sin ella se lee como un párrafo más y deja de funcionar como
   aviso.
2. **El enlace es relativo, `../../contacto/`.** El documento del cliente lo
   traía como URL absoluta a `duowave-web.github.io`; copiarla habría atado el
   enlace al dominio de pruebas y se rompería al conectar `elderechoescrito.es`.

> ⚠️ **Esta sección decía lo contrario y hay que saberlo.** La fórmula anterior
> era «Este artículo es divulgación, no asesoramiento… Si tienes uno entre
> manos, **escríbeme**», y aquí se argumentaba que la salida tenía que ser **una
> sola palabra enlazada** para que el aviso no se convirtiera en reclamo: «nada
> de puedo ayudarte, ni ventajas, ni una segunda frase».
>
> El texto nuevo del cliente **tiene tres frases y enlaza «página de contacto»**,
> así que esa regla ya no describe lo que hay. Lo que sí se conserva es el
> fondo del argumento: sigue siendo un aviso en cursiva al pie, no una llamada a
> contratar. Quien lo amplíe con ventajas o con un «puedo ayudarte» sí rompería
> el criterio.
>
> Y decae también la frontera que se explicaba aquí —«no está en quién atiende
> sino en el marco»—: el texto nuevo no habla de encargos, solo dice que valorar
> un asunto concreto requiere ver sus circunstancias.

**El de `sobre/` vuelve a ser el mismo, con una variante de texto y una de
ruta.** Estuvo un tiempo descolgado —conservaba la fórmula vieja, «Todo lo que
se publica en este blog es divulgación…»— y ya está igualado:

> *Los contenidos de El Derecho Escrito tienen carácter informativo y divulgativo
> y no sustituyen el análisis jurídico de un asunto concreto. Si deseas plantear
> una consulta, puedes hacerlo a través de la [página de contacto](../contacto/).*

Dos diferencias con el del artículo, las dos necesarias:

1. **La ruta es `../contacto/`, un solo nivel.** `sobre/` está a un nivel de la
   raíz y el artículo a dos.
2. **La segunda frase es más corta** —no repite «relacionada con su contenido o
   con las materias que aborda»—, porque aquí no hay un artículo al que
   referirse. Es el texto que dio el cliente.

> ⚠️ **«El Derecho Escrito» va en `<em>` DENTRO de un `<em>`, y eso necesita una
> regla de CSS para verse.** El aviso entero va en cursiva, y el nombre también
> debe ir en cursiva por la convención del sitio. Los navegadores **no alternan
> solos**: verificado, un `<em>` dentro de otro se queda en `italic`, así que el
> nombre quedaba marcado en el HTML y sin distinguirse en pantalla.
>
> Lo resuelve `em em, i em, em i { font-style: normal }`, que es además la
> convención tipográfica: dentro de un texto en cursiva, lo que se destaca se
> compone en **redonda**. Verificado que el nombre sale en redonda y el resto en
> cursiva.
>
> La regla va sin prefijo porque vale en cualquier sitio donde pase lo mismo.
> Hoy hay un solo caso.

> **Y hay tres enlaces a `contacto/` en esa pantalla**: este aviso, el botón
> «Contacto» de debajo y el del menú. Se acepta porque uno es una frase legal al
> pie y otro una acción, pero si alguna vez molesta, el que sobra es el del
> aviso — que es justo el que antes no estaba.

### El destacado de la portada: por defecto el más reciente, o `"destacado": true`

`index.html` abre con una sección **«Lectura recomendada»**, entre el hero y
«Últimos artículos», con un solo artículo. **Es una decisión editorial**, y por
eso tiene una salida para cuando el más reciente no es el que se quiere
recomendar.

**No dice «el más leído» ni nada parecido, y no puede decirlo:** no hay
analítica en el proyecto, así que afirmar popularidad sería inventarse un dato.
El rótulo nombra a quien recomienda, no a cuánta gente ha leído.

La regla que aplica `scripts/build.mjs`:

| En los JSON | Qué se destaca |
|---|---|
| ninguno con `"destacado": true` | **el más reciente** |
| uno con `"destacado": true` | **ese** |
| varios con `"destacado": true` | el más reciente de ellos, **y sale un aviso** |

> **El defecto es el más reciente y no «el marcado», y esa es la decisión de
> fondo.** Si hubiera que marcar uno siempre, el día que se publicara un
> artículo nuevo y nadie tocara la marca, la portada recomendaría el anterior:
> un olvido que **no da ningún error** y que además empeora solo con el tiempo.
> Con el defecto al revés, no hacer nada da el comportamiento razonable y la
> marca es lo excepcional.
>
> El precio es simétrico y conviene saberlo: **un `"destacado": true` olvidado
> en un artículo viejo congela la portada**. Por eso lo del aviso cuando hay más
> de uno — es lo único que puede avisar de que alguien está marcando sin mirar.

> ⚠️ **ESTE APARTADO DECÍA «NO se genera solo» Y LISTABA OCHO DATOS QUE HABÍA
> QUE COPIAR A MANO**: titular, entradilla, categoría en sus dos formas, fecha
> en sus dos formas, minutos, `src` de la imagen y los dos `href` de destino. Se
> avisaba de que ninguno daba error al quedarse desfasado.
>
> **Ya no hay nada que copiar.** El bloque entero lo escribe `bloqueDestacado()`
> en `scripts/lib/plantilla.mjs`, dentro de la región `GENERADO:destacado`, a
> partir del mismo JSON del que sale la página del artículo. Los ocho datos
> salen de una sola fuente, así que no pueden discrepar.
>
> El comentario que había en `index.html` con la lista de los ocho ya no está:
> describía un mantenimiento que ya no existe.

> ⚠️ **EL ANTETÍTULO DEL DESTACADO DECÍA «ARTÍCULO DESTACADO · JURISPRUDENCIA» Y
> AHORA DICE SOLO LA CATEGORÍA.** El rótulo fijo iba delante, en un `<span>` sin
> clase, separado por un `·` en `.destacado__antetitulo-sep`.
>
> **Se quitó porque repetía al rótulo de la sección**: «LECTURA RECOMENDADA»
> está justo encima y ya dice que la pieza es la recomendada. Lo que queda es
> la categoría real, enlazada al filtro, **con el mismo texto, el mismo `href` y
> el mismo `<span class="oculto">Ver artículos de </span>` que las tarjetas** —
> sale de `art.categoriaTexto` y `clave(art.categoria)`, igual que en
> `tarjetaPortada()`.
>
> **No hay que reponerlo** creyendo que al destacado le falta un rótulo: el de
> la sección hace ese trabajo.
>
> ✅ **Con él se quedó sin uso `.destacado__antetitulo-sep`, y ESA REGLA YA SE
> HA BORRADO** en la limpieza del lote. Aquí decía «no se ha borrado».
>
> Y decae lo que razonaba el comentario de esa regla —que el rótulo y la
> categoría iban los dos en `--acento` y que solo la segunda se subrayaba al
> pasar, «una es texto y la otra es un destino»—. Ya no hay dos cosas que
> distinguir. El comentario del CSS está reescrito.

> ⚠️ **El destacado NO se repite en «Últimos artículos», y esa es la regla que
> evita el problema.** Estuvo descrito aquí como un riesgo a esquivar —«no
> conviene destacar el artículo más reciente», porque el mismo titular y la
> misma foto salían **dos veces separados por 590 px** y en 1440×900 **caben los
> dos en la misma pantalla**—. Ya no es un consejo: la lista de abajo enseña los
> **otros** artículos, nunca el destacado, así que la duplicación no puede
> darse.
>
> Con eso, el criterio editorial se libera: **se puede destacar el más reciente
> si es el que se quiere recomendar.** La sección ya no tiene que «rescatar algo
> que no está arriba del todo» para ganarse el sitio.
>
> Y decae lo que decía este archivo de que con un solo artículo **cualquier
> elección duplica**. Hoy no duplica nada: las tarjetas que hay debajo son de
> ejemplo y ninguna repite el destacado.

**Para quitar el destacado se borra la `<section>` entera.** No queda hueco
porque no queda elemento — verificado, 0 px. Y **si el artículo no tiene
imagen** se borra solo el `<a class="destacado__imagen">`: el bloque es flex y
el texto ocupa el ancho entero sin ninguna regla extra.

### El atrezo — SIN etiquetas, SIN enlaces y BORRAR ANTES DE ENTREGAR

> ⚠️ **HAY CINCO TARJETAS EN EL SITIO QUE NO SON ARTÍCULOS**, y con un solo
> artículo real son mayoría. Están para que el cliente no vea un blog vacío.
> **Se borran antes de entregar.** Si se entregan sin borrar, la web enseñará
> artículos inventados junto al de verdad y **nada dará error**: se ve leyendo,
> no probando.

**Dónde están, y las cinco llevan `.tarjeta--ejemplo`:**

| Dónde | Cuántas | Titulares |
|---|---|---|
| `index.html`, «Últimos artículos» | **3** | «La discrecionalidad técnica…», «El interés legítimo…», «El control judicial de los planes parciales…» |
| `articulos/index.html`, tras la región generada | **2** | «El principio de legalidad penal: las cuatro exigencias» y «…por qué importa fuera del aula» |

**Todas viven FUERA de las regiones `GENERADO:`**, así que el build ni las toca
ni las cuenta — por eso hay que borrarlas a mano. Se localizan de una vez:

```sh
grep -rn 'tarjeta--ejemplo' index.html articulos/index.html
```

Al borrarlas hay que retirar **dos reglas de `styles.css`**, que se quedan sin
uso: `.tarjeta--ejemplo:hover .tarjeta__imagen img` —el apagado del zoom— y la
que explica el punto siguiente.

#### Las cuatro decisiones del atrezo, y ninguna es cosmética

**1. No llevan etiqueta de categoría.** Se les quitó por encargo: las únicas
etiquetas visibles del sitio tienen que ser las reales del artículo de MASC.

> ⚠️ **Quitarla descuadra los titulares, y por eso existe una regla de CSS.**
> `.etiqueta--plana` ocupa **23,2 px** —19,2 de alto más sus 4 de
> `margin-bottom`—, así que sin ella el titular sube eso y deja de alinear con
> el de una tarjeta real en la misma fila. Lo repone:
>
> ```css
> .tarjeta--caja.tarjeta--ejemplo .entrada__titulo { margin-top: 23.2px }
> ```
>
> **Va solo en `.tarjeta--caja`, o sea el listado**, que es la única rejilla
> donde el atrezo convive con una tarjeta real. En la portada, «Últimos
> artículos» enseña los artículos que **no** son el destacado, así que con un
> único artículo real no hay ninguna tarjeta con etiqueta al lado y el hueco
> sería aire muerto.
>
> **Se reponen con margen y no con un `<p>` vacío**: un elemento sin contenido
> no se ve, pero un lector de pantalla lo recorre igual. Es el mismo criterio
> que el de las celdas sobrantes de la rejilla.
>
> **SE RETIRA CON EL ATREZO.** Cuando desaparezcan las tarjetas, esa regla se
> queda sin uso. Y si algún día se toca el cuerpo o el margen de
> `.etiqueta--plana`, **los 23,2 hay que volver a medirlos**: salen de ella y
> nada los ata.

**2. No llevan enlace, ni en la portada ni en el listado.** En la portada nunca
lo tuvieron —está razonado justo abajo—. En el listado sí, y apuntaban a rutas
inventadas que **daban 404**. Se quitaron: un 404 en una demo al cliente es peor
que una tarjeta quieta.

> ⚠️ **ESO OCULTA «CONTINÚA LEYENDO», Y ES EL COMPORTAMIENTO QUERIDO.** Las
> entradas del listado existían precisamente para alimentar ese bloque, que
> descarta toda tarjeta sin `<a>` en el titular:
>
> ```js
> const a = art.querySelector(".entrada__titulo a");
> if (!a) return false;
> ```
>
> Sin enlaces no son candidatas, así que con un solo artículo real el bloque se
> queda sin ninguna y **se oculta solo**. No es un fallo y **no hay que
> devolverles el enlace para «arreglarlo»**: con un artículo publicado, no
> recomendar nada es lo honesto. El bloque volverá solo en cuanto haya un
> segundo artículo de verdad.
>
> `articulosRelacionados()` **no se toca**: ocultarse cuando no hay candidatos
> ya era su comportamiento previsto.

**3. No llevan `data-etiquetas`, y el atrezo futuro tampoco debe llevarlo.**

> ⚠️ **Ese atributo alimenta el desplegable de etiquetas del listado**, que se
> construye leyendo los `data-etiquetas` de las tarjetas. El atrezo llevaba
> `Docencia` y `Divulgación`, y eso metía **etiquetas falsas en un control
> visible** — justo lo que el encargo quería evitar. Se le quitaron.
>
> Es la trampa menos evidente de las cuatro: se puede quitar la etiqueta de
> categoría, que se ve, y dejar el atributo, que no — y seguir teniendo
> etiquetas inventadas en pantalla.

**4. Sí conservan `data-categoria`**, así que cuentan en el contador y entran en
el filtro de Fundamentos. Con dos de atrezo y un artículo real, el contador dice
**«3 artículos publicados»**. Es lo esperado, no un fallo.

> ⚠️ **Si al borrarlas no queda ninguna tarjeta, hay que devolver el `hidden` a
> la `<section>`.** Una sección con rótulo, filete y «Ver todos» sobre una
> rejilla vacía es peor que no tenerla. Es el estado en el que estuvo la
> portada antes del ejemplo, y está razonado justo abajo.

**Qué NO hay que deshacer al borrarlas:** no están en `sitemap.xml`, ni en
`feed.xml`, ni en `articulos/index.html`, ni en el buscador, ni en los datos
estructurados — y es correcto que no estén, porque no son contenido.
Verificado buscando sus titulares en los cuatro sitios: **cero apariciones**.

#### Por qué no llevan ningún enlace

Ni el titular ni la categoría. **No es un olvido**: un enlace daría 404 y uno
que apuntara al artículo real mentiría sobre lo que abre.

Sin `<a>` casi todo se resuelve solo: no hay cursor de mano, ni subrayado, ni
foco de teclado, y los colores no cambian, porque el `--tinta` del titular lo
pone `.entrada__titulo` y el `--acento` de la categoría lo pone `.etiqueta`, no
sus enlaces. También queda muerta la capa del enlace extendido, que cuelga de
`.entrada__titulo a::after`.

**Lo único que hay que apagar a mano es el zoom de la imagen**, porque cuelga
del `:hover` de la tarjeta y no de ningún enlace. Y hay que apagarlo: una
tarjeta que reacciona al ratón promete que lleva a algún sitio. La quietud es la
señal de que no.

Comprobado con hit-testing sobre una malla de 80 puntos por tarjeta: **240 de
240 puntos sin ningún enlace**, cursor `auto` y `transform: none` en las tres.

> **Al sustituirlas por tarjetas reales no basta con cambiar los textos.** Hay
> que envolver el titular y la categoría en sus `<a>` y quitar
> `.tarjeta--ejemplo`. La plantilla de una tarjeta real está en un comentario
> ahí mismo, con sus cuatro avisos.

> **Las tres llevan la MISMA imagen, `damajusticia.jpg`, y es deliberado.** No
> tiene relación con los titulares inventados: se reutiliza lo que ya había en
> `img/` y no se ha añadido ningún archivo.
>
> Se probaron las otras combinaciones y ninguna funciona, porque en `img/` solo
> hay **dos** fotos usables —`damajusticia.jpg` y `portada-poster.jpg`; la
> tercera que se probó, `fondo-cabecera.jpg`, era un lavado casi blanco que en un
> hueco de 365×205 se leía como una imagen que no ha cargado, y la cuarta es el
> retrato del autor—. Con dos fotos para tres tarjetas, **cualquier reparto deja
> una desparejada o dos gemelas contiguas**:
>
> ⚠️ **`fondo-cabecera.jpg` ya ni existe**: se borró en la limpieza del lote, al
> quedarse sin uso cuando la mancheta pasó a `fondo-paginas.jpg`. Así que hoy no
> hay ni siquiera una tercera foto que probar — el recuento de «dos usables»
> sigue siendo el bueno, por otro motivo.
>
> | Reparto | Problema |
> |---|---|
> | poster · dama · dama | gemelas pegadas, y la primera desparejada |
> | poster · dama · poster | sin gemelas pegadas, pero el centro pesa más |
> | dama · poster · dama | el centro pesa menos — el defecto que se quiso quitar |
> | **dama · dama · dama** | **ninguno: las tres pesan igual** |
>
> La última es la única que cumple el objetivo, que era que la fila se lea
> pareja para poder juzgar la maqueta. Y que se vean tres veces la misma foto
> **no es un defecto aquí**: dice a la cara que son marcadores. Al poner
> artículos reales, cada uno trae la suya y el problema desaparece.

> **Los tres `alt` son idénticos, y se deja así a propósito.** Un lector de
> pantalla oye la misma descripción tres veces, que es ruido — pero es el
> reflejo fiel de lo que se ve, y ponerles `alt=""` enseñaría el patrón
> equivocado para cuando haya imágenes reales, que sí tendrán que describirse
> una por una. El ruido se va con los marcadores.

### Cuándo apagar «Últimos artículos» del todo

**La regla de fondo: la sección lista los artículos que NO son el destacado.**
Hoy no hay ninguno —solo existe el destacado—, así que lo que se ve es el
ejemplo de arriba. Con artículos reales:

| Artículos publicados | Destacado | «Últimos artículos» | Tarjetas reales |
|---|---|---|---|
| 1 | el único | **`hidden`**, salvo con ejemplo | — |
| 2 | uno de los dos | se ve | **1** |
| 3 | el recomendado | se ve | **2** |
| 4 o más | el recomendado | se ve | **3** (una fila) |

A partir del cuarto no se sigue añadiendo: la rejilla es de tres columnas y una
fila es lo que enseña la portada. Los demás viven en `articulos/`, que es a
donde lleva «Ver todos los artículos».

**No hay que tocar nada más.** Ni espaciados ni la banda de suscripción: están
medidos para los dos estados. Verificado en 1440, 1000 y 375 —con 1, 2, 3 y 4
tarjetas— que el hueco contra la banda y contra el pie no se mueve.

> ⚠️ **La rejilla NO se rellena con marcadores.** Con una o dos tarjetas las
> celdas que sobran se quedan vacías, y así tiene que ser: `grid-template-columns`
> declara **tres columnas siempre**, existan o no las tarjetas, así que una sola
> mide los mismos 365,3 px que mediría acompañada y se queda **alineada a la
> izquierda**. No se estira. Medido:
>
> | Ancho | Columnas | Tarjeta | Posiciones con 3 |
> |---|---|---|---|
> | 1440 | 3 | **365,3 px** | 0 · 393,3 · 786,7 |
> | 1000 | 2 | **462 px** | 0 · 490 |
> | 375 | 1 | **327 px** | apiladas |
>
> Nada de `<div>` de relleno para cuadrar la fila: **una celda vacía de una
> rejilla CSS no existe** —no hay elemento y no se anuncia—, mientras que un
> `<div>` vacío sí lo recorre un lector de pantalla como un elemento más de la
> lista. Es el mismo criterio que ya rige en `articulos/`.

> ⚠️ **Y la portada ya no lleva tarjeta de «Próximamente».** Tenía una,
> `.tarjeta--proxima`, para cerrar la fila mientras solo había un artículo. Se
> retiró con el apagado de la sección: una promesa no cierra una fila que no se
> está enseñando.
>
> **No hay que reponerla ahora que la sección se ve otra vez.** La fila la
> cierran las tres tarjetas de ejemplo, y cuando se borren volverá a haber
> celdas vacías, que es justo lo que este bloque dice que no se rellena.
>
> **El CSS de `.tarjeta--proxima` se queda**, y no es código muerto: lo sigue
> usando `articulos/index.html`, donde la tarjeta es mobiliario y **no se
> esconde en ningún caso** —está razonado en su propia sección—. Son dos
> decisiones distintas sobre el mismo componente, en dos páginas distintas.

> ⚠️ **La banda de suscripción se sacó a su propia `<section>`, y hay que
> dejarla así.** Vivía dentro de «Últimos artículos», así que al apagar esa
> sección **se apagaba con ella**: la portada perdía su única captación de
> correo por un motivo que no tiene nada que ver con la banda.
>
> Separadas, cada una responde a lo suyo: la lista aparece cuando hay algo que
> listar, y la banda está siempre porque cierra la página.
>
> **Tiene que seguir siendo el último hijo del `<main>`**: de ahí saca los 80 px
> de cierre contra el pie, por `main > .lista:last-child`. Si alguien mete una
> sección detrás, esos 80 se van con ella y la banda queda pegada al pie sin que
> nada avise.
>
> Lleva `.lista--cierre`, que suelta el relleno de arriba para que el hueco lo
> ponga el `margin-top: 56px` de la propia banda —el que ya la separaba de las
> tarjetas cuando vivían juntas—. Sin ese 0 se sumarían los 48 de `.lista` y la
> portada abriría **104 px** justo donde hoy no hay nada que separar.
>
> Efecto lateral que conviene saber: **los 24 px de `padding-bottom` de `.lista`
> vuelven a usarse.** Este archivo decía que no los usaba nadie desde que se
> retiró la franja de «Áreas del derecho». Ahora «Últimos artículos» tiene otra
> sección detrás, que es exactamente el caso para el que existen.

Medido en los dos estados, a 1440, 1000 y 375:

| | Destacado → rótulo | Destacado → banda | Rejilla → banda | Banda → pie |
|---|---|---|---|---|
| Con «Últimos» visible (hoy) | **80** (74 a 375) | — | **80** | **80** |
| Con `[hidden]` | — | **56** | — | **80** |

Los espaciados del estado visible cambiaron al retirar el filete de sección que
separaba el destacado de «Últimos artículos»; está razonado más abajo, en la
sección de los filetes de la portada.

### La categoría se escribe UNA vez y sale en 9 sitios

> ⚠️ **LAS CATEGORÍAS VAN EN PLURAL Y SON TRES. ANTES ERAN CUATRO Y EN
> SINGULAR**, así que cualquier ejemplo de este archivo que diga `fundamento` o
> `comentario` está desfasado y no describe lo que hay.
>
> | Antes | Hoy |
> |---|---|
> | `ensayo` · Ensayo | **`ensayos` · Ensayos** |
> | `fundamento` · Fundamento | **`fundamentos` · Fundamentos** |
> | `jurisprudencia` · Jurisprudencia | **`jurisprudencia` · Jurisprudencia** |
> | `comentario` · Comentario | **eliminada** |
>
> **«Comentario» se quitó porque no es una categoría del cliente**, no porque
> sobrara al pluralizar. Un artículo que comenta una resolución va en
> `jurisprudencia` — es lo que se hizo con el de MASC, que estaba en
> «Comentario» y pasó a «Jurisprudencia»: su núcleo es la divergencia entre la
> AAP de Alicante y la de Barcelona sobre si el defecto es subsanable.
>
> ⚠️ **«Jurisprudencia» no pluraliza, y es correcto.** Es incontable en español
> jurídico. Los botones se leen ENSAYOS · FUNDAMENTOS · JURISPRUDENCIA y la
> asimetría **está asumida**: no hay que «arreglarla» inventando «Sentencias»,
> que sería renombrar la categoría y no pluralizarla.
>
> **Qué NO rompió el cambio:** ninguna URL de artículo —el slug no contiene la
> categoría— así que cero 404. Lo que sí decae son los enlaces viejos con
> `?categoria=comentario`: el JS **descarta** una clave desconocida y enseña la
> lista entera, o sea que degrada a «sin filtrar» en vez de romperse.
>
> **Y no hizo falta tocar `js/main.js`**: las claves válidas las lee del
> `data-filtro` de los botones, que salen de `CATEGORIAS`. Tampoco el CSS, que
> no tiene ni un selector por categoría.

> ⚠️ **Y hay DOS ENTRADAS DE ATREZO más en `articulos/index.html`**, marcadas
> con `<!-- PROVISIONAL: entradas de ejemplo, borrar antes de entregar -->` y su
> marca de FIN. Están descritas enteras en **«El atrezo»**, más arriba: van sin
> etiqueta, sin enlace y sin `data-etiquetas`, y se borran antes de entregar.
>
> Aquí importan por una sola cosa: **conservan `data-categoria="fundamentos"`**,
> así que entran en el filtro de esa categoría y en el contador, que dice
> **«3 artículos publicados»**.

> ⚠️ **ESTE AVISO DECÍA QUE EL ÚNICO ARTÍCULO PUBLICADO ERA UN EJEMPLO, Y YA NO
> LO ES.** «El principio de legalidad penal», su carpeta en `articulos/` y su
> fuente en `contenido/` **se han eliminado**, que era lo que este archivo
> llevaba pidiendo desde el principio.
>
> **El único artículo real es hoy el de MASC**, categoría «Jurisprudencia». Ya no
> hay ningún artículo de maqueta del que haya que desconfiar como referencia
> editorial; lo que queda de atrezo son las cinco tarjetas, que no son
> artículos y están documentadas arriba.

> ⚠️ **ESTA SECCIÓN DECÍA «se repite en 9 sitios» Y «al cambiarla hay que tocar
> los nueve».** Ya no: se escribe **una vez**, en el campo `categoria` del
> `articulo.json`, y de ahí salen los nueve. Cambiarla es cambiar esa línea y
> volver a ejecutar `npm run build`.
>
> **La lista de abajo se conserva entera y sigue haciendo falta**, por dos
> motivos: es lo que hay que revisar si algún día se toca `plantilla.mjs`, y es
> la única explicación de por qué la misma palabra aparece en el HTML en dos
> formas distintas.

Los nueve puntos, que hoy escribe el generador a partir de una sola línea:

| # | Dónde | Qué |
|---|---|---|
| 1 | `index.html` | la categoría del **destacado**, dentro de `.destacado__antetitulo` |
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
- La píldora del lateral va sin espacios: `#Garantías`.
- El `data-categoria` y el `href` van **en minúsculas y sin acentos**, porque
  son claves y no texto: `jurisprudencia`, no «Jurisprudencia».

Esa última es la más traicionera, porque hay **dos formas de la misma palabra
conviviendo en el mismo archivo**: la etiqueta visible y la clave del enlace.

> **Y es justo la asimetría que el JSON conserva.** `categoria` se escribe en
> **clave** —`"jurisprudencia"`— y de ahí salen las dos formas: la clave viaja
> literal a `data-categoria` y a los `href`, y el texto visible sale de la tabla
> `CATEGORIAS` de `scripts/lib/plantilla.mjs`. Escribir `"Jurisprudencia"` hace
> fallar el build, que es el modo de fallar bueno.
>
> ⚠️ **Añadir una categoría es añadir una línea a esa tabla, y hay que saber que
> la tabla también pinta los botones del filtro.** No hay lista de categorías en
> ningún otro sitio: la región `GENERADO:filtros` de `articulos/index.html` se
> escribe leyéndola. Así se cumple sola la regla de que **ningún filtro va
> apagado**, tenga artículos o no.
>
> ⚠️ **Y quitar una es quitar esa línea.** Así salió **«Comentario»**, que
> estuvo aquí y **no era una categoría del cliente**: se retiró junto con el
> paso a plural. Un artículo que comenta una resolución va en `jurisprudencia`.

```sh
# Las nueve de una vez, contando las variantes sin espacios y en minusculas
grep -rni 'jurisprudencia' --include='*.html' --include='*.xml' .
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
tengan artículos o no. Estuvieron `disabled` los vacíos —hoy Ensayos y
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
> ✅ **Aquí se avisaba de una colisión y ya no existe.** El artículo de ejemplo
> llevaba la etiqueta `#Fundamento`, que es **también** el nombre de una
> categoría, así que en la misma pantalla convivían un botón `FUNDAMENTO` y una
> píldora `#Fundamento` que filtraban cosas distintas. Se fue con el artículo.
>
> **El aviso sigue valiendo para el futuro**: conviene que las etiquetas reales
> del cliente no repitan nombres de categoría. Las de MASC no lo hacen.

**La lógica es Y entre criterios y O dentro de las etiquetas.** O sea: búsqueda
Y categoría Y (etiqueta1 O etiqueta2). Es la convención de filtros por facetas y
además lo pide la escala: con Y, marcar dos etiquetas que no coincidan en ningún
artículo daría **cero al instante** y el control parecería roto.

#### `data-etiquetas` guarda el TEXTO VISIBLE, no la clave

Y es lo contrario que `data-categoria`, así que merece explicarse:

| Atributo | Qué guarda | Por qué |
|---|---|---|
| `data-categoria` | `jurisprudencia` | viaja **literal** a `?categoria=` y a `data-filtro`: ahí la clave *es* el dato |
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

#### Cada etiqueta se escribe en 3 sitios y en DOS FORMAS

Desde que las píldoras del lateral son enlaces, una etiqueta vive aquí:

| # | Dónde | Qué forma |
|---|---|---|
| 1 | `articulos/index.html` | `data-etiquetas` — **texto visible** |
| 2 | el artículo, píldora del lateral | **texto visible**, `#Garantías` |
| 3 | el artículo, `href` de esa píldora | **clave**, `?etiquetas=garantias` |

**Los puntos 2 y 3 están en el mismo elemento**, que es exactamente la trampa
que ya documenta la categoría: dos formas de la misma palabra conviviendo en la
misma línea. Un `grep` de «Garantías» no encuentra el `href`, y uno de
`garantias` no encuentra el texto.

```sh
# Las dos formas de una etiqueta, en los tres sitios
grep -rni 'garantias\|garantías' --include='*.html' articulos/
```

**Si el texto y la clave no coinciden, no da ningún error**: el enlace lleva a
un filtro que no selecciona nada y se ve la lista entera, como si no se hubiera
pulsado. Y si `data-etiquetas` del listado no coincide con la píldora del
artículo, esa etiqueta simplemente no aparece en el desplegable.

> ⚠️ **ESO YA NO PUEDE PASAR, Y ES EL FALLO QUE MÁS BARATO SALÍA DE EVITAR.**
> Las tres salen del mismo array `etiquetas` del `articulo.json`, en **texto
> visible**; la clave la deriva `clave()` al escribir el `href`. Las dos formas
> no pueden discrepar porque solo se escribe una.
>
> **Se guarda el texto y no la clave**, al revés que `categoria`. El motivo está
> arriba y sigue valiendo: de la clave no se reconstruyen los acentos —de
> `garantias` no sale «Garantías»— y de ahí salen el nombre de la casilla del
> desplegable y el de la píldora.

> **Balance por artículo, actualizado.** Este archivo decía que la categoría se
> repite en **9** puntos, la autoría en **8** y cada etiqueta en **3**, y que
> las etiquetas eran «las más baratas de las tres».
>
> Hoy la cuenta de lo que hay que **escribir** es otra:
>
> | | Se escribe | Sale en |
> |---|---|---|
> | Categoría | **1** vez, en `categoria` | 9 sitios |
> | Etiqueta | **1** vez, en `etiquetas` | 3 sitios |
> | Autoría | **0** veces por artículo | 8 sitios |
>
> La autoría es el cambio más grande y tiene su propio aviso en su sección: ya
> no se escribe en el artículo, está en `plantilla.mjs`.
>
> Lo que **sigue siendo cierto** es el modo de fallar: si alguien rompe la
> plantilla, el despiste de una etiqueta degrada en silencio a «no filtra»,
> mientras que el de la categoría se ve. Eso no lo cambia el generador; lo que
> cambia es que ahora se rompe una vez para todos los artículos, no uno a uno.

> ⚠️ **Y hay DOS listas más con forma de etiqueta que NO son estas**, en la
> cabecera del artículo. Es la confusión más fácil de cometer:
>
> | Campo | Contenido hoy | ¿Alimenta el filtro? |
> |---|---|---|
> | píldoras `.etiqueta--tag` | Legalidad, Fundamento, Garantías, Taxatividad, Irretroactividad | **sí** |
> | `data-etiquetas` del listado | las mismas | **sí** |
> | `<meta property="article:tag">` ×3 | «principio de legalidad», «derecho penal», «garantías penales» | no |
> | `"keywords"` del JSON-LD | seis frases largas de cola | no |
>
> Las dos de abajo son **vocabulario de buscador**, frases naturales largas, no
> el vocabulario de navegación del sitio. Que no coincidan es correcto y
> deliberado: sirven a lectores distintos. Pero **nada en el archivo lo dice**,
> así que quien vea cuatro listas de etiquetas puede intentar «unificarlas» y
> romper el filtro o empobrecer el marcado. Al añadir una etiqueta nueva hay que
> tocar solo las dos de arriba.

#### Las píldoras del lateral son enlaces, y no llevan subrayado

Estuvieron en `<span>` con el argumento de que no existen páginas de etiqueta.
Sigue siendo cierto —y siguen sin existir—, pero el destino no es una página
nueva: es **el filtro del listado**, `?etiquetas=clave`, el mismo parámetro que
usa el desplegable.

Con esto son **tres usos de la misma familia** y conviene no confundirlos:

| Clase | Qué es | Etiqueta | Qué hace |
|---|---|---|---|
| `.etiqueta--plana` | categoría | `<a>` | **aplica** un filtro, texto plano |
| `.etiqueta--tag` | etiqueta del artículo | `<a>` | **aplica** un filtro, píldora |
| `.etiqueta--filtro` | etiqueta marcada | `<button>` | **quita** un filtro, píldora con aspa |

Las dos píldoras **nunca conviven** —una vive en el artículo y otra en el
listado— y el aspa distingue la que quita.

> **`.etiqueta--tag` no se subraya al pasar el ratón y `.etiqueta--plana` sí**,
> y la diferencia no es un descuido. La categoría es **texto plano**, sin borde
> ni relleno, y ahí el subrayado es lo que dice que es un enlace. La etiqueta es
> **una caja**, y un subrayado dentro de una caja con borde se lee como un fallo
> de maquetación. Mismo criterio que se aplicó a `.volver`.
>
> La señal la da el tono: borde y texto pasan al acento. **No rellena**, que es
> lo que hace `.etiqueta--filtro`, así las dos píldoras se distinguen también
> por cómo responden y no solo por el aspa.

**Una etiqueta que no comparte ningún otro artículo lleva a un listado con un
solo resultado: el que acabas de leer.** Es correcto y está comprobado —
`#Taxatividad` da «1 resultado»—: el filtro se aplicó y el contador y la píldora
dicen cuál es. No es un callejón sin salida, porque la píldora se puede quitar
ahí mismo.

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
- **El panel lleva `mousedown` con `preventDefault()`**, y sin eso el
  desplegable no funciona con ratón. Ver abajo.

> ⚠️ **`preventDefault()` en el `mousedown` del panel no es opcional, y su
> ausencia daba un fallo desconcertante: solo se podía marcar dando justo en el
> cuadradito.**
>
> Al abrir, el foco se queda en el botón. Un `mousedown` sobre algo **no
> focusable** —el nombre de la etiqueta, que es un `<span>`, o el hueco de la
> fila— tira el foco a `<body>`, así que `focusout` salta con
> **`relatedTarget: null`**, el manejador lo lee como «se ha ido fuera» y cierra
> el panel **entre el `mousedown` y el `mouseup`**. El `click` no llega a
> completarse sobre algo que ya está en `display:none`, el `<label>` no se
> activa y la casilla no cambia.
>
> Dar en el cuadradito sí funcionaba, y esa asimetría es la pista: el `<input>`
> **es** focusable, así que ahí `relatedTarget` es el propio input, que está
> dentro de la caja, y el panel sobrevive.
>
> `preventDefault` en `mousedown` impide el desplazamiento del foco pero **no**
> la activación del `<label>`, que ocurre en el `click`. Se prefiere a relajar
> el `focusout` a `if (e.relatedTarget && …)`, que también arreglaba el ratón
> pero **perdía el cierre al tabular hacia la barra del navegador**, donde
> `relatedTarget` viene igualmente `null`.
>
> Va en el panel y **no** en el botón: el botón sí debe poder recibir el foco.

> **Esto no se detecta con `.click()`, y por eso se coló.** Un `.click()`
> programático no dispara `mousedown` ni mueve el foco, así que `focusout` nunca
> llega a ejecutarse y todas las pruebas pasaban. Hay que **pulsar de verdad**,
> con la herramienta de clic del preview, sobre los cuatro puntos de la fila:
> la palabra, el cuadradito y los huecos a ambos lados.
>
> Es la misma lección que ya dejó el `[hidden]`: medir el atributo o simular el
> evento no es medir lo que hace el navegador.
- Las casillas se dejan **nativas**. Rehacerlas con un pseudoelemento obligaría
  a reimplementar foco y alto contraste sin ganar nada.

> **La fila ES el `<label>`, con la casilla dentro, y esto se midió.** Pulsar el
> *nombre* de la etiqueta ya funcionaba con un `<label for>` normal —es nativo—,
> pero el resto de la fila no: **93 px de los 202, casi la mitad, caían en el
> `<div>` contenedor y no hacían nada**. Una fila con la casilla a la izquierda
> y hueco a la derecha se espera pulsable entera.
>
> Envolviendo se arregla sin una línea de JavaScript y entra también el padding.
> Se conserva el `for=` aunque la casilla vaya dentro: es redundante para el
> navegador, pero deja la asociación explícita.
>
> Comprobado que **no alterna dos veces** al pulsar la casilla directamente, que
> es el fallo clásico de anidarla: marca a la primera y desmarca a la segunda.

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

#### El aviso de búsqueda es una frase, no una píldora

`.filtro-aviso` dice «Resultados para «aula»» con el término en una caja que
lleva una **×** para quitarlo. Los tres ejes tienen así su propia salida y cada
una borra **solo la suya**.

> **Era un enlace y se llevaba por delante los otros dos.** El «Ver todos»
> anterior era un `<a href="location.pathname">`: navegaba al listado desnudo,
> así que borraba también la categoría y las etiquetas. Ahora es un `<button>`
> que cambia el estado en vivo, y por eso `parametrosActuales()` tuvo que
> aprender a borrar `q` — antes lo arrastraba de la URL tal cual, porque no
> había forma de quitarlo sin recargar.
>
> Y el cambio de `<a>` a `<button>` arregla de paso el historial: el enlace
> **empujaba entrada**, mientras que la categoría y las etiquetas usan
> `replaceState`. Verificado que ahora los tres se comportan igual —
> `history.length` no se mueve con ninguno.

**No es una píldora, y la distinción es deliberada** porque puede convivir con
las de etiqueta activa, que cumplen la misma función. Se separan por tres cosas
a la vez:

| | Aviso de búsqueda | `.etiqueta--filtro` |
|---|---|---|
| Radio | **0** | 3 px |
| Caja | **baja, la del usuario** | versales |
| Color del texto | `--tinta` | `--acento` |

La segunda no es estética: **el término conserva las mayúsculas que escribió el
visitante**. Ponerlo en versales, como van las píldoras por sistema, sería
tergiversar su consulta. Y la frase hace algo que una píldora suelta no puede:
nombra *qué* está filtrado — un chip con «aula» a secas se confundiría con una
etiqueta que se llamara así.

> ⚠️ **El aire de arriba va en `padding` y no en `margin`.** Estuvo en
> `margin-top: 28px` y no separaba lo que se creía: al ser el primer hijo del
> contenedor, ese margen **colapsa** y empuja al contenedor entero. El total
> medido salía igual —48 de `.lista` más 28— pero por un camino que se rompe en
> cuanto alguien le ponga un borde o un padding al contenedor.
>
> Abajo iba a **cero**, y de ahí que se leyera pegado a los botones, como si
> fuera parte de ellos. Ahora lleva los **22** que ya usan `.filtros` y
> `.seleccion`.

> ⚠️ **La × lleva `flex: none`, y sin eso se encoge justo cuando más falta
> hace.** Con un término largo la caja llega al ancho del contenedor y el flex
> reparte la falta de sitio: medido en un móvil de 375 con una consulta de cinco
> palabras, el botón bajaba de 32 px a **29**. Son 32×32 para un aspa de 8,
> porque el glifo solo daría una diana de unos 12.

### El estado vacío lo dice el contador, y solo el contador

No hay ningún mensaje de «no hay artículos» en la página. Hubo uno —`.vacio`,
«No hay ningún artículo que mostrar»— y **se retiró entero**: párrafo, regla CSS
y lógica. Lo que queda en cada caso:

| | Categoría vacía | Búsqueda sin resultados |
|---|---|---|
| Botón pulsado | **«Ensayos»** encendido | «Todos» |
| `.filtro-aviso` | — | **«Resultados para «zzz»» con una × que la quita** |
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

#### La palabra la decide el filtro, no el número

`actualizarContador()` dice **«artículos publicados»** solo con la lista sin
tocar, y **«resultados»** en cuanto hay búsqueda, categoría o etiquetas — los
haya todos, algunos o ninguno.

Comparaba el número con el total, y con tres ejes combinables eso **miente cada
vez que un filtro deja pasar a todos**: dos etiquetas que entre las dos cubran
el archivo daban «4 artículos publicados» y se leía como si no hubiera filtro
puesto. Con un solo eje casi no pasaba; con tres pasa a menudo.

Medido antes y después, con las cuatro entradas de hoy:

| Estado | Antes | Ahora |
|---|---|---|
| Sin filtro | 4 artículos publicados | **4 artículos publicados** |
| `?categoria=fundamentos` (4 de 4) | 4 artículos publicados ✗ | **4 resultados** |
| `?etiquetas=legalidad,docencia` (4 de 4) | 4 artículos publicados ✗ | **4 resultados** |
| `?q=principio` (4 de 4) | 4 artículos publicados ✗ | **4 resultados** |
| `?etiquetas=docencia` (1) | 1 resultado | 1 resultado |
| Categoría vacía | 0 resultados | 0 resultados |

La prueba que lo cierra es una transición: con etiquetas **y** categoría puestas
y luego «Borrar etiquetas», quedan los cuatro artículos y el contador sigue
diciendo **«4 resultados»**, porque la categoría continúa activa. Al pulsar
«Todos» vuelve a «4 artículos publicados».

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

Y una consecuencia de mantenimiento: **al publicar el primer Ensayos no hay que
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

> ⚠️ **ESTO ES LO QUE EL CLIENTE ECHÓ EN FALTA, Y CONVIENE TENERLO DATADO PARA NO
> VOLVER A INVESTIGARLO.** Dijo que «ha desaparecido lo de Seguir leyendo de las
> entradas de blog». No se borró nada: **se quedó sin candidatos**.
>
> Pasó en **`aae4a57`, el 28 de septiembre de 2026** («Publica el artículo de
> MASC y retira el artículo de ejemplo»). Hasta ese día el listado tenía tres
> entradas de ejemplo **con enlace en el titular** —`ejemplo-cuatro-exigencias/`
> y compañía— y el bloque se llenaba con ellas. Ese commit les quitó el `<a>`,
> porque apuntaban a rutas inventadas que daban 404.
>
> Y `articulosRelacionados()` descarta toda tarjeta sin enlace:
>
> ```js
> const a = art.querySelector(".entrada__titulo a");
> if (!a) return false;
> ```
>
> Con un único artículo real —que nunca se recomienda a sí mismo— quedan cero
> candidatos y la sección se oculta. **Es el comportamiento querido**, está
> razonado en «El atrezo», y **se arregla solo al publicar el segundo artículo**.
>
> ⚠️ **El mismo día desapareció una segunda cosa, y es fácil confundirlas**:
> «Leer anterior / Leer siguiente». Con un solo artículo `bloquePaso()` no emite
> **ni un byte** —ni el `<nav>`—, así que ahí no hay nada que inspeccionar.
>
> **Dos candidatos que hay que descartar**, porque aparecen al buscar en el
> historial y despistan:
>
> | Qué | Dónde está | Por qué NO es |
> |---|---|---|
> | `aria-label="Seguir leyendo"` | `a61d99a` → `8ac24f5`, 20–26 ago 2026 | era la **etiqueta accesible** de un `<nav>` que solo contenía «Volver a todos los artículos». **Nunca fue texto visible** |
> | enlace «Leer más» por tarjeta | solo en la prosa de este archivo, `6ee5ab8` | describe **la web de referencia del cliente**, no esta. Aquí el enlace es el titular y nunca hubo un «Leer más» |
>
> El segundo es el que más puede confundir, porque explicaría «de las entradas de
> blog»: su web antigua **sí** llevaba un «Leer más» bajo el extracto de cada
> tarjeta. Esta no lo reproduce, y es una decisión de diseño documentada —está
> en «Qué enseña cada tarjeta»—, no una pérdida.

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

#### Qué enseña cada tarjeta, y el efecto lateral del `<h3>`

Los cinco elementos de una tarjeta de la portada, en el mismo orden:

```
imagen → categoría → título → entradilla → metadatos
```

> ⚠️ **AQUÍ SE BORRABA LA ENTRADILLA, Y YA NO.** `adaptarTarjeta()` la quitaba
> con el argumento de que «son 346 px de ancho y lo que hace falta aquí es
> reconocer el artículo, no resumirlo». **Se cambió por encargo**, y con ella se
> recortó el aire de dentro de la tarjeta para compensar el alto que suma. No
> hay que volver a quitarla.

> ⚠️ **LA CATEGORÍA ES UN ENLACE AQUÍ Y NO LO ES EN EL LISTADO, de donde se
> clona.** El listado la escribe en texto plano —es el punto 2 de los «9
> sitios», y el `href` solo lo documentan la portada y el artículo—, así que el
> enlace lo monta `adaptarTarjeta()`.
>
> **No se inventa la clave**: sale de `data-categoria` de la tarjeta clonada,
> que es la misma que usa el `href` de la portada. Por eso se lee **antes** de
> quitar el atributo, unas líneas más abajo en la misma función.
>
> **El listado no se tocó.** Hacerlo habría sido más corto —el clon heredaría el
> enlace— pero cambia una página que no entraba en el encargo.

> ⚠️ **EL TITULAR SE ESTABA PINTANDO COMO UN EPÍGRAFE DEL CUERPO, Y NO SE VEÍA
> VENIR.** Es el efecto lateral del `<h2>` → `<h3>` de arriba: al pasar a `h3`,
> el titular casa con **`.articulo h3`**, que pesa (0,1,1) frente a los (0,1,0)
> de `.entrada__titulo`. **Gana por especificidad, no por orden**, así que
> declararlo después no arreglaba nada.
>
> Lo que se veía, medido: **Source Serif en vez de Cormorant, 24 px en vez de
> 28 y un `margin-top: 32px`** que no lleva ningún titular de tarjeta del sitio.
> Ese margen era el 90 % del hueco de **37 px** que había entre la categoría y
> el titular.
>
> Lo arregla `.continua .entrada__titulo`, con (0,2,0): gana sin depender del
> orden del archivo.

**El aire de dentro, recortado por encargo:**

| Hueco | Antes | Ahora |
|---|---|---|
| imagen → categoría | 18 | **12** |
| categoría → titular | 4 (+32 del `h3` ajeno = 37) | **4** |
| titular → entradilla | 10 | **8** |
| entradilla → metadatos | 16 | **12** |

> ⚠️ **TODO VA PREFIJADO CON `.continua`, Y SIN ESO SE COLA EN DOS SITIOS MÁS.**
> Las tarjetas de la portada y las del listado comparten estas mismas clases
> —`.tarjeta__imagen`, `.entrada__titulo`, `.entrada__meta`—, así que el recorte
> sin prefijo las habría cambiado también. Verificado tras el cambio: la portada
> sigue en 18 · 4 · 10 · 16.

> **Los metadatos siguen anclados abajo**, por el `margin: auto 0 0` de
> `.tarjeta .entrada__meta`. Con tarjetas de contenido muy desigual eso deja un
> hueco grande en la más corta —medido, 168 px contra 22 en la larga— y es el
> comportamiento de siempre de las tarjetas, no algo que introduzca la
> entradilla: lo que iguala las alturas es la rejilla.

> **`actualizado` no sale aquí, y no hay que hacer nada para que no salga.**
> `tarjetaListado()` nunca lo escribió —solo `<time>` y `.lectura`— así que el
> clon no puede traerlo.

> **Para verlo hacen falta DOS artículos más**, porque con uno solo la sección
> se oculta entera. Se prueba creando carpetas temporales en
> `contenido/articulos/` y **borrándolas después de `contenido/` Y de
> `articulos/`**, que el build no borra. Al regenerar no queda rastro en el
> listado, la portada, el sitemap ni el feed.

### «Leer anterior» / «Leer siguiente»: lo escribe el BUILD, no el navegador

Va **después del aviso legal y antes de «Continúa leyendo»**, que es donde la
página pasa de «este artículo» a «otros artículos». Lo pinta `bloquePaso()` en
`plantilla.mjs`, y es la diferencia que más conviene tener clara con el bloque
que tiene justo debajo:

| | «Leer anterior / siguiente» | «Continúa leyendo» |
|---|---|---|
| Quién lo monta | **el build** | el navegador, por `fetch` |
| Criterio | **fecha**, todos los artículos | etiquetas compartidas |
| Sin JavaScript | **se ve** | no se ve |
| Cuántos | 1 o 2 | 2 |

**El orden se conoce al generar**, así que no hay motivo para pedírselo a un
`fetch`: funciona con JavaScript desactivado, al revés que el bloque de abajo.

> ⚠️ **EL ORDEN LLEGA RESUELTO DESDE `build.mjs`, Y LA PLANTILLA NO LO
> RECALCULA.** Es el mismo de siempre —**fecha descendente, `slug` de
> desempate**— y por eso se pasa hecho: un segundo criterio aquí podría
> divergir del primero sin que nada avisara.
>
> ⚠️ **Y `arts` VA DE MÁS NUEVO A MÁS VIEJO**, así que el vecino de índice
> **menor** es el publicado **después**, o sea «siguiente». Es al revés de lo
> que sugiere el array y es el error fácil de cometer al tocar esto:
>
> ```js
> const vecinos = { siguiente: arts[i - 1], anterior: arts[i + 1] };
> ```

> ⚠️ **PUBLICAR UN ARTÍCULO REESCRIBE TAMBIÉN EL HTML DEL ANTERIOR**, para
> añadirle su «Leer siguiente». **Es esperado, no un fallo**: a partir de ahora
> un PR de publicación toca **dos** páginas de artículo, no una, y el diff del
> PR lo enseñará. Quien lo vea por primera vez puede pensar que el generador se
> ha desbocado.
>
> **No rompe la idempotencia** —verificado con cuatro artículos: dos pasadas
> seguidas dan el mismo hash— **ni cambia el PDF del artículo anterior**, que es
> lo que de verdad podría escocer. Verificado byte a byte: el PDF de MASC es
> idéntico antes y después de que le apareciera la navegación, porque
> `imprimir.css` oculta `.paso` junto a `.volver`, `.compartir` y `.continua`.

**Los casos de los extremos**, que son la mitad de lo que hay que probar:

| Artículo | Qué sale |
|---|---|
| el más antiguo | **solo «siguiente»**, pegado a la derecha |
| uno del medio | los dos |
| el más reciente | **solo «anterior»**, a la izquierda |
| con un solo artículo | **nada, ni el `<nav>`** |

> ⚠️ **CON UN SOLO ARTÍCULO NO SE EMITE NI UN BYTE, y eso costó un ajuste.**
> `bloquePaso()` devuelve cadena vacía, pero con el `${…}` en su propia línea de
> la plantilla el caso vacío **dejaba una línea en blanco de más** en el HTML de
> todo artículo sin vecinos. Se vio porque el de MASC cambiaba en una línea sin
> tener nada que enseñar.
>
> Se arregla interpolando **pegado al `</p>` del aviso** y metiendo el salto de
> línea **dentro** del valor devuelto. Verificado: con solo MASC el HTML
> generado es byte a byte idéntico al de antes del cambio.

> ⚠️ **`margin-left: auto` en `.paso__enlace--siguiente`, y no basta con
> `justify-content: space-between`.** Con los dos enlaces, `space-between` ya
> los separa; **con uno solo** —el artículo más antiguo no tiene «anterior»—
> dejaría el «siguiente» pegado a la izquierda, donde se lee como si fuera el
> «anterior». El margen automático lo manda a su lado pase lo que pase.

> **El rótulo y el título van en el MISMO `<a>`**, en dos `<span>`. Así el
> nombre accesible es «Leer anterior, *título*»: dice a la vez qué hace y adónde
> lleva. Dos enlaces hermanos obligarían a tabular dos veces para el mismo
> destino.

> **El estilo no estrena nada**: el rótulo es Inter en versales y acento, como
> `.volver` y `.lista__enlace`; la flecha va en su `<span>` propio para tener
> algo que animar, y el anillo de foco es **el mismo** que esos dos —`--acento`,
> `outline-offset: 3px`, `border-radius: 2px`—. Son los tres enlaces de texto
> con flecha del sitio.
>
> El título de destino sí se separa: va en Cormorant y en `--tinta`, para que no
> se confunda con el rótulo y se lea como lo que es, un titular.

> **Apilados por debajo de 600**, un corte que ya existía. En una columna el
> `max-width: 48%` dejaría cada enlace a media columna con la mitad vacía, y el
> `text-align: right` del siguiente lo leería como si apuntara a otro sitio: los
> dos se sueltan a la vez. Medido a 375: apilados, 327 px cada uno, sin
> desbordar ni provocar scroll horizontal, y los dos por encima de los 44 px de
> área de pulsación.

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

## Autoría — 8 sitios por artículo, más 2 en `sobre/`

> ✅ **El nombre YA ESTÁ CONFIRMADO por el cliente, y esta sección decía lo
> contrario.** Aquí se avisaba de que «Juan Contera Miranda» y su bio venían de
> la maqueta de referencia y estaban pendientes de confirmar. Los textos
> definitivos del cliente traen el nombre y una biografía propia —colegio,
> despacho, formación—, así que el nombre es real.
>
> ⚠️ **ESTE AVISO DABA POR APROBADA UNA BIO QUE YA NO ES LA QUE SE PUBLICA.**
> Decía, y citaba textualmente:
>
> > ~~Abogado colegiado en Madrid. Ejerce en el Departamento de Derecho Procesal
> > de Sterling Abogados: litigación contencioso-administrativa, urbanismo y
> > expropiaciones.~~
>
> **La que hay hoy en `AUTOR.bio` es más corta y no menciona ni el colegio ni el
> despacho:**
>
> > Abogado procesalista especializado en Derecho Administrativo y Urbanismo
>
> Es el texto que sale en los dos sitios —`.autor__bio` del lateral y el
> `author.description` del JSON-LD—, así que **lo que manda es la constante, no
> esta cita**. Si vuelven a divergir, la de aquí es la que está mal.
>
> ⚠️ **Y las mayúsculas de «Derecho Administrativo» y «Urbanismo» son
> intencionadas**, igual que en el hero y por el mismo encargo. Está anotado
> sobre la propia constante. **No se corrigen a minúscula.**
>
> Vive en la constante `AUTOR` de `scripts/lib/plantilla.mjs`, con el nombre, el
> cargo y las rutas de los dos retratos. **No hay ninguna copia**: estuvo escrita
> dos veces —`.autor__bio` y el `author.description` del JSON-LD— y se extrajo,
> porque era exactamente «la incoherencia más fácil de dejarse» que esta sección
> lleva avisando desde el principio. Comprobado que la salida no cambió ni un
> byte al hacerlo.
>
> ⚠️ **Y desde la limpieza del lote, `AUTOR` SE EXPORTA**, porque `pdf.mjs`
> también escribía el nombre a mano. Está en los puntos de abajo.
>
> La de `sobre/` es la larga, de tres párrafos, y esa es a mano.

> ⚠️ **ESTA SECCIÓN DECÍA «cada artículo repite el nombre, la bio y el retrato a
> mano» Y QUE AL PUBLICAR HABÍA QUE TOCAR LOS OCHO.** Los ocho siguen ahí, pero
> **no se escriben en el artículo**: están en `scripts/lib/plantilla.mjs`, en
> literales, y el generador los pone en los ocho sitios a la vez.
>
> **Al publicar no hay que tocar ninguno.** Y hay un efecto de fondo: el punto 6
> —la bio del lateral, que era «literalmente el mismo texto que el punto 3,
> duplicado» y «la incoherencia más fácil de dejarse»— **ya no se puede
> desincronizar**, porque las dos salen de `AUTOR.bio`.
>
> ⚠️ **Lo que sigue vivo es el punto 8, `.firma`, por otra razón.** Solo se ve
> por debajo de 900 px, así que quien revise en escritorio no lo verá nunca. Ya
> no se puede olvidar de escribirlo —lo escribe la plantilla— pero sí se puede
> romper sin enterarse al tocar el CSS.
>
> **Cambiar de autor ya no es tocar ocho sitios por artículo: es tocar
> `plantilla.mjs` y regenerar.** El workflow `regenerar.yml` existe justamente
> para eso.
>
> **Los dos de `sobre/` NO están cubiertos**: esa página es a mano y el
> generador no la toca. Siguen siendo los puntos 9 y 10 y se editan a mano.

La lista de los ocho, que hoy escribe la plantilla y hay que revisar si se toca:

> ⚠️ **Y desde que `sobre/` tiene retrato, la cuenta ya no acaba en el
> artículo.** Esa página añade **dos** puntos más: el `src` del `<img>` dentro
> de `.sobre__retrato` y su `alt`, que también lleva el nombre escrito. Son los
> puntos 9 y 10, y no salen en los `grep` de abajo porque esos buscan dentro de
> `articulos/`.
>
> ⚠️ **AQUÍ DECÍA QUE LOS DOS RETRATOS REUTILIZAN EL MISMO ARCHIVO, Y YA NO.**
> Comparten la clase `.autor__retrato` y el encuadre, pero son **dos archivos**:
>
> | Archivo | Tamaño | Peso | Quién lo usa |
> |---|---|---|---|
> | `img/juanconteramiranda-264x352.jpg` | 264 × 352 | **16,2 KB** | el círculo de 132 px del lateral del artículo |
> | `img/juanconteramiranda-600x800.jpg` | 600 × 800 | **60,8 KB** | el rectángulo de 300 × 400 de `sobre/`, y el `author.image` del JSON-LD |
>
> **Son dos y no uno por peso, no por encuadre.** El lateral sale en **todas**
> las páginas de artículo, así que servirle ahí los 600 × 800 costaría **45 KB
> por página** para enseñar 132 px. Al revés —servir la pequeña en `sobre/`—
> daría 0,88× en una caja de 300 × 400, que es justo la blandura que este
> archivo llevaba pidiendo arreglar.
>
> Cada uno es **2× su caja**, que es lo que pide una pantalla densa. Si alguna
> de las dos cajas cambia de tamaño en el CSS, hay que regenerar su archivo.
>
> Así que el nombre del autor está dentro del nombre de **los dos** archivos y
> cambiarlo obliga a renombrar los dos y a tocar los dos `src`. Para
> encontrarlos:
>
> ```sh
> grep -rn 'juanconteramiranda' --include='*.html' --include='*.mjs' .
> ```
>
> ⚠️ **El `--include='*.mjs'` no es opcional**: el `src` del lateral no está en
> ningún HTML escrito a mano, sale de `AUTOR.retrato` en `plantilla.mjs`. Un
> `grep` solo en HTML encuentra el de `sobre/` y el del artículo **generado**, y
> quien corrija ese último a mano verá cómo el siguiente build se lo deshace.
>
> **Se regeneran con `sips`, sin dependencias.** El original del cliente es
> `foto_juan.jpeg`, 1792 × 2400 y 2,3 MB, **3:4 de origen**, así que no hay que
> decidir ningún recorte: solo se iguala la proporción al píxel y se reduce.
>
> ```sh
> # 1792 / 0,75 = 2389,33 -> recorte centrado a 3:4 exacto
> sips -c 2389 1792 foto_juan.jpeg --out base.jpg
> sips -Z 800 -s format jpeg -s formatOptions 75 base.jpg --out img/juanconteramiranda-600x800.jpg
> sips -Z 352 -s format jpeg -s formatOptions 75 base.jpg --out img/juanconteramiranda-264x352.jpg
> ```
>
> **La calidad 75 está medida, no elegida de memoria.** Es el primer escalón que
> cumple los dos techos con holgura y sin artefactos visibles en la piel, que es
> lo que peor aguanta un JPEG:
>
> | Calidad | 600 × 800 | 264 × 352 |
> |---|---|---|
> | 60 | 41,0 KB | 12,6 KB |
> | 70 | 55,9 KB | 16,3 KB |
> | **75** | **60,8 KB** | **16,2 KB** |
> | 80 | 64,6 KB | 18,6 KB |
>
> ⚠️ **El recorte a 2389 va ANTES de reducir, y el orden importa.** Al revés,
> `-Z` sobre el original da **597 × 800**, no 600: 1792/2400 es 0,74667 y no
> 0,75. Los tres píxeles no se ven, pero dejan los atributos `width`/`height`
> mintiendo y la caja de `sobre/` recortando un pelo donde hoy no recorta nada.

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

**En el PDF**, que no está en el HTML y por eso se escapaba del todo:

9. La **ficha del bloque de título**, en `bloqueTitulo()` de `scripts/pdf.mjs`.
10. La **cabecera corriente** de cada página, en `cabecera()` del mismo archivo.

> ⚠️ **LOS DOS ESTUVIERON EN LITERALES Y YA NO.** Esta lista decía «ocho sitios»
> y eran diez: `pdf.mjs` escribía «Juan Contera Miranda» a mano, así que cambiar
> de autor en `plantilla.mjs` y regenerar dejaba **el PDF firmado por el
> anterior**. No lo veía nadie: la web salía bien y el documento no, y hay que
> abrirlo para enterarse.
>
> Hoy `AUTOR` **se exporta** de `plantilla.mjs` y `pdf.mjs` lo importa, así que
> los diez salen de la misma constante. Verificado que el PDF no cambió ni un
> byte al hacerlo.
>
> **Esos dos NO salen en los `grep` de abajo**, que buscan dentro de
> `articulos/`. Para los diez a la vez:
>
> ```sh
> grep -rn 'AUTOR\.nombre\|Juan Contera Miranda' scripts/ articulos/ sobre/
> ```

> ⚠️ **AHORA SÍ HAY UN ARCHIVO DE PLANTILLA, Y ESTA SECCIÓN DECÍA QUE NO LO
> HABÍA.** Es `scripts/lib/plantilla.mjs`. Aquí se argumentaba que un
> `post-template.html` aparte sería «un noveno sitio donde se repiten la
> autoría, la categoría y las URL de compartir», y que **nada avisaría si se
> quedaba atrás**: una plantilla desfasada que aún dijera «Derecho penal»
> engañaría más de lo que ayuda.
>
> **El argumento era correcto para una plantilla que se copia a mano, y no se
> aplica a una que se ejecuta.** La diferencia es toda:
>
> | | `post-template.html` (descartado) | `plantilla.mjs` (hoy) |
> |---|---|---|
> | Al publicar | se **copia** y se rellena | se **ejecuta** |
> | Si se queda atrás | los artículos nuevos nacen viejos | **ningún artículo la usa a medias** |
> | Cómo te enteras | **nunca** | regenerando: el diff lo enseña |
>
> Una plantilla que se copia diverge del original en cuanto alguien arregla algo
> en un artículo y no en ella. Una que se ejecuta no puede divergir: no hay dos
> copias.
>
> Y el riesgo que sí queda —que la plantilla se desfase respecto a lo que se
> quiere— se paga en un sitio, no en N: se arregla y se regenera todo.
>
> **La plantilla anotada que había en el artículo de ejemplo ya no existe.** Sus
> comentarios `<!-- PLANTILLA · … -->` desaparecieron al generarlo, y es
> correcto: describían un procedimiento —duplicar la carpeta y sustituir el
> contenido— que ya no se hace.

Para localizar los ocho en `plantilla.mjs`, sin depender de números de línea:

```sh
grep -n 'Juan Contera Miranda\|juanconteramiranda\|Abogado colegiado' scripts/lib/plantilla.mjs
```

Y para comprobar que el HTML generado los lleva los ocho:

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

Y una que no se ve grepeando: **el nombre está también en el nombre de los dos
archivos de foto** (`img/juanconteramiranda-600x800.jpg` y `-264x352.jpg`). Al
cambiar de autor hay que renombrar los dos, y eso arrastra los puntos 4 y 7 a la
vez —pero **a archivos distintos**: el punto 4, que es el JSON-LD, lleva la
grande, y el punto 7, el `<img>` del lateral, la pequeña.

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

> **Cuándo va el texto en `--tinta-suave` y cuándo en `--tinta`.** La regla que
> sigue el sitio: **`--tinta` para lo que se lee y `--tinta-suave` para lo que
> acompaña**. En gris van los metadatos y el tiempo de lectura, los extractos y
> entradillas de tarjeta, los contadores y avisos de filtro, los avisos legales,
> las etiquetas del formulario, las fuentes de cita, y **el texto de las cajas
> de apoyo**: `.autor__bio`, `.suscripcion__apoyo`, `.suscripcion__nota` y los
> párrafos de `.contacto__aparte`. Los encabezados de esas cajas sí van en
> `--tinta`: son lo que da la jerarquía dentro de ellas.
>
> ⚠️ **Y ESO SE ROMPIÓ UNA VEZ DE UNA FORMA QUE CONVIENE CONOCER.** La regla de
> `contacto/` era `.contacto__aparte h2 + p`, escrita cuando cada `<h2>` de esa
> caja tenía **un** párrafo debajo. «Antes de escribir» pasó a tener dos, y el
> segundo se quedó fuera del selector: salía en `--tinta` al lado de uno gris,
> y además sin su `line-height` ni su margen.
>
> **No dio ningún error y el selector seguía siendo válido**; lo que pasó es que
> dejó de describir el contenido. Hoy es `.contacto__aparte p`, que cubre los
> que haya. **Un selector de hermano adyacente ata el CSS al número de
> elementos**, y ese número lo cambia quien edita el texto, no quien edita la
> hoja.
>
> Contrastes medidos tras unificarlo, todos AA: `--tinta-suave` sobre
> `--papel-alt` **5,64:1**, sobre blanco **6,13:1**, y el `--acento` del enlace
> de correo sobre `--papel-alt` **5,44:1**.

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
> ⚠️ **AQUÍ HABÍA UN TERCER ARGUMENTO Y LA MEDICIÓN YA NO LO SOSTIENE.** Decía:
> «**Ópticamente no se comparan nunca.** Entre el `h1` y el primer `h2` hay
> **621 px medidos**, con la foto 21:9 de 309 px y la entradilla de 163 en
> medio. No existe un momento de la lectura en que los dos estén a la vista.»
>
> **La foto ya no está en medio**: subió por encima del `h1` al reordenar la
> cabecera. Con ella se fueron 341 px —309 de foto más sus 32 de margen—, así
> que la distancia bajó de **1141 px a 800**. Medido a 1280 de ancho sobre el
> artículo de MASC; los 621 de antes eran del artículo de ejemplo, que ya no
> existe.
>
> Y 800 px **sí caben en una pantalla**: con el `h1` arriba del todo, el primer
> `h2` cae justo en el borde de un viewport de 900. O sea que ahora **se pueden
> ver los dos a la vez**, que es exactamente lo que este párrafo negaba.
>
> **Los otros dos argumentos siguen en pie** —los dos son serif, y los epígrafes
> son «lo que se lee»— y son los que sostienen la decisión. Este se retira en
> vez de corregirle el número, porque el número nuevo dice lo contrario que el
> viejo. Si alguien quiere reabrir la elección de familia, que lo haga por los
> dos primeros, no por este.

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
> | «Autor», «Etiquetas» | lateral | base |
> | «Citas y referencias» | cuerpo del artículo | base |
> | «Índice del artículo» | cuerpo del artículo | **ninguna** — lo pinta `.indice h2` |
>
> Los dos del cuerpo son además **la misma caja**: `.indice` y `.referencias`
> comparten relleno `--papel-alt`, filete de 1 px en `--borde`, radio 4 y
> padding 26/30. Son los únicos dos paneles de esa columna y se leen uno
> detrás de otro, así que cualquier diferencia se ve como un descuido y no como
> una distinción. **Si se toca uno, se toca el otro.**
>
> «Citas y referencias» es el caso que más se presta a duda: está en la columna
> principal, como «Continúa leyendo», pero es una lista pegada al texto que
> acaba de leerse, no una sección nueva. Apoya. Por eso va en la base.
>
> El índice es el único que no lleva `.lista__titulo`, y no es un descuido: su
> `<h2>` lo viste `.indice h2`, que da exactamente el mismo resultado —Inter 12,
> 600, versales, `0.08em`, acento— porque el componente se dibuja entero desde
> su propia clase. Ponerle además `.lista__titulo` no cambiaría nada hoy y
> dejaría dos reglas peleándose por el mismo texto mañana.
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

Contenedor máximo **1440 px**. Cabecera de **72 px**, fondo blanco, con un
borde inferior de **1 px** en `--borde-marcado`. En las cinco páginas
interiores está siempre; **en el inicio aparece al pasar la franja de portada**.

> **El filete bajó de 2 px a 1 px para que se percibiera más fino**, y el orden
> de esa decisión importa: **primero se mide cuánto tiene**. A 1 px ya no se
> puede adelgazar sin trucos —opacidad, o un *hairline* de 0,5 px que en
> pantallas no Retina se ve igual o desaparece— y entonces lo que toca es bajar
> el contraste, porque menos contraste se percibe como más fino en todas. Aquí
> había 2, así que sí se podía.
>
> Y convenía por sistema: esos 2 px eran, junto al filete de la mancheta, **los
> únicos del sitio**. Todo lo demás —caja de tarjeta, panel de etiquetas, campos
> del formulario, píldoras— va a 1 px.
>
> **El color no se tocó.** `--borde-marcado` está elegido para esta línea porque
> tiene que leerse como un límite: ΔE 16,4 frente al blanco, contra 11,1 de
> `--borde`. Adelgazar y aclarar a la vez son dos reducciones sobre lo mismo.
> Aclarar sigue disponible como segundo paso si aún se ve pesada.
>
> ⚠️ **La mancheta sigue en 2 px** y no se tocó: cierra una banda con imagen
> contra el blanco, no separa una barra fija de un texto. Si algún día se
> igualan, hay que releer antes por qué subió a `--borde-marcado`.

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
1 px, y lo único que cambia es su color.** Nunca se usa `border: none`. Así la
cabecera mide lo mismo en las seis páginas y, sobre todo, no pega ningún salto
cuando la línea aparece en el inicio: el espacio ya estaba ocupado.

> **Que ahora el salto evitado sea de 1 px y no de 2 no lo hace prescindible.**
> Un píxel en una barra **fija** se ve perfectamente, porque no se mueve ella
> sola: arrastra consigo todo el contenido de debajo. Verificado desplazando de
> verdad en la portada: el alto se queda en 72,2 px en los seis puntos de
> medición, antes y después del disparo.

> **Y con `prefers-reduced-motion` la línea aparece de golpe en vez de
> fundirse.** El `transition` de 220 ms se anula. No se pierde nada: lo que
> informa es que esté o no esté, no cómo llega.

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
| **959 px** | se oculta el campo del buscador | hasta ahí cabe la fila con el campo desplegado; por debajo, abrirlo partiría la marca en dos líneas |
| **740 px** | la cabecera pasa a dos filas | lo mismo con el buscador cerrado. Ahí ya no hay nada que ocultar y la única salida es apilar |
| **400 px** | el hueco entre enlaces baja a 10 px | con hueco de 28 la navegación se parte por debajo de 371, y eso alcanza a 360 |

> **Han cambiado dos veces, y las dos por el texto del menú.** Primero bajaron
> al pasar la navegación de 14 px a 12 —la fila se estrechó 32,2 px—: 966 → 934
> y 748 → 716. Después **volvieron a subir al cambiar «Sobre mí» por «Acerca
> de»**, que es 11,6 px más ancho: **934 → 944** y **716 → 724**.
>
> El de 400 no se ha movido en ninguno de los dos cambios.
>
> **Se miden barriendo anchos, no calculando.** El método se validó antes de
> fiarse de él: forzando la navegación a 14 px, el mismo barrido devuelve 746 y
> 964, es decir los 748 y 966 anteriores menos los 2 px de margen que usó la
> medición original.

> ⚠️ **CAMBIAR EL TEXTO DE UN ENLACE DEL MENÚ MUEVE ESTOS DOS CORTES, y el fallo
> es silencioso.** Es la lección que ya ha costado dos veces, así que conviene
> tenerla escrita con el destrozo medido.
>
> Al poner «Acerca de» sin rebarrer, entre 717 y 724 px la marca «El Derecho
> Escrito» **se partía en dos líneas** y la cabecera pasaba de 72,2 a **103,4
> px**. Lo mismo con el campo del buscador desplegado entre 935 y 944. No da
> ningún error: solo crece la barra y arrastra la página entera.
>
> Barrido de verificación tras el cambio: rompe a 724 y aguanta a 725; con el
> campo abierto rompe a 944 y aguanta a 945.

> ⚠️ **El 944 está repetido en `js/main.js`**, en la función `estrecha()` de
> `buscadorDeCabecera`, que decide si la lupa despliega el campo o vuelve a ser
> un enlace al listado. Los dos números tienen que ir a la par: si el CSS oculta
> el campo y el JS cree que aún cabe, la lupa intenta desplegar algo invisible.
> Verificado a 944: el campo está oculto y la lupa ya no intenta abrirlo.

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
Lectura recomendada: un articulo, horizontal, TEXTO | imagen  (45% / 55%)
Ultimos articulos:  rotulo + "ver todos" + rejilla     ← 3 TARJETAS DE EJEMPLO
Suscripcion:        banda de newsletter, seccion propia
Pie:                fondo oscuro
```

Ojo con esas dos últimas: la banda de newsletter **estuvo dentro de «Últimos
artículos»** y hoy es una sección aparte, justamente para que no se apague con
ella. Está razonado arriba, en la sección del apagado.

### El rediseño de portada va prefijado con `.inicio`, y no es cosmética

`index.html` lleva `<body class="inicio">`. **Es un gancho de alcance, no un
estilo**: no pinta nada por sí mismo. Todas las reglas del rediseño cuelgan de
él porque **tres de los componentes que retoca los comparten otras páginas**:

| Componente | Quién más lo usa |
|---|---|
| `.lista__titulo--destacado` | «Continúa leyendo» de cada artículo |
| `.entrada__meta` | tarjetas de `articulos/` y ficha de cabecera del artículo |
| `.suscripcion--banda` | lateral del artículo |

Sin el prefijo, cada retoque de la portada se colaba en `articulos/` y en las
páginas de artículo a la vez. Verificado tras el rediseño: el `<body>` de esas
páginas **no lleva clase**, su «Continúa leyendo» sigue sin filete, su
`.entrada__meta` sigue sin barras y `.tarjeta--caja` conserva su fondo, su
filete de 1 px, sus 28 px de relleno y su radio de 3 — con «Próximamente» en los
**573,8 px** documentados.

**Lo que aquel rediseño NO tocó, por encargo expreso:** `--papel`, `--papel-alt`,
`--ancho-amplio`, los textos que el hero tenía **entonces** y su altura de
520 px. El fondo sigue siendo **blanco puro** y la banda de suscripción sigue en
`--papel-alt` frío, que es una petición del cliente. Si algún día se pide el
fondo crema de la maqueta, hay que releer antes la sección del color.

> ⚠️ **Esto es el inventario de UNA pasada, no una regla en vigor**, y la
> diferencia importa porque los cinco elementos no han envejecido igual. Los
> tres tokens y los 520 px siguen vigentes y se pueden seguir leyendo como
> límites. **Los textos del hero no**: se sustituyeron después, por encargo.
>
> El texto oficial de hoy está en **«Los textos visibles son del cliente — no se
> reescriben»**, al principio de este archivo, junto con las dos decisiones que
> no hay que revertir.

#### Las tarjetas de la portada son `--abierta`; las del listado, `--caja`

Dos modificadores del mismo componente, a propósito:

| | `.tarjeta--caja` (listado) | `.tarjeta--abierta` (portada) |
|---|---|---|
| Fondo y filete | `--papel-alt` + 1 px | **ninguno** |
| Relleno | 28 px | **0** |
| Imagen | 3:2, radio 3 px | **16:9, radio 0** |
| Hover | — | **título a acento + `scale(1.03)`** |
| Superficie pulsable | el titular | **la tarjeta entera** |

**No se unificaron porque el listado tiene medidas atadas a su caja**: el
`min-height` de «Próximamente» (574/580) sale de la altura de una tarjeta con
relleno, y el corte de 1084 sale de esos 28 px de padding. Un rediseño en la
clase base las invalidaba las dos.

> **La imagen es 16:9 y no el 3:1 de la maqueta.** En una columna de 365 px,
> 3:1 deja una tira de 122 px de alto, y a esa altura la escultura de la única
> foto que hay no se distingue. Cuando existan fotos anchas de verdad, subirlo
> es cambiar un número.

> ⚠️ **El enlace extendido tiene DOS trampas, y ninguna se ve mirando.**
>
> La tarjeta entera se pulsa con un `::after` del titular estirado por encima.
> Se prefiere a envolverla en un `<a>` porque así no se anida con el enlace de
> la categoría y el nombre accesible sigue siendo solo el titular, no toda la
> tarjeta leída del tirón.
>
> **Trampa 1: el `z-index` de la categoría va en el `<a>`, no en el `<p
> class="etiqueta">`.** Puesto en el `<p>` —que es de ancho completo— subía
> también su hueco vacío, y la franja a la derecha de «FUNDAMENTO» —unos 270 de
> los 365 px— **dejaba de abrir el artículo**. Un agujero muerto en mitad de una
> tarjeta que se anuncia como pulsable entera.
>
> **Trampa 2: los dos `z-index` son explícitos** —1 la capa, 2 la categoría—.
> Sin ellos la capa funcionaba en casi toda la tarjeta y fallaba en una franja de
> ~8 px sobre la fila de metadatos, donde ganaba el `<time>`: `.entrada__meta`
> es un contenedor flex y sus hijos se pintan como unidades atómicas aunque no
> estén posicionados.
>
> **Las dos se encontraron con hit-testing, no leyendo ni mirando**, porque las
> versiones rota y buena se ven idénticas. Se comprueba lanzando
> `document.elementFromPoint` sobre una malla de la tarjeta y contando adónde
> lleva cada punto: hoy **120 de 120 van al artículo** y el texto de la
> categoría al filtro.

#### En la portada hay UN tipo de filete, no dos

Y conviene distinguirlos porque hubo los dos y se retiró uno:

| | Dónde | Estado |
|---|---|---|
| **Filete del rótulo** | sale del texto de «LECTURA RECOMENDADA» y «ÚLTIMOS ARTÍCULOS» hasta el borde | **se queda** |
| ~~Filete de sección~~ | cruzaba la página entera entre el destacado y «Últimos artículos» | **retirado** |

> ⚠️ **El de sección se retiró porque sobraba, y el aire lo hace ahora el
> relleno.** Era un `border-top` en `.inicio .lista:not(.lista--cierre)`.
>
> El problema es que **la imagen del destacado ya cierra el bloque con su propio
> canto**, así que la línea caía a pocos píxeles de otro borde horizontal y se
> leía como un subrayado de la foto, no como una división. Y el rótulo de
> «Últimos artículos» trae su propio filete, con lo que quedaban **dos líneas
> casi seguidas y de distinta longitud**.
>
> **Al quitarla hubo que subir la separación**, porque los 55 px que había
> bastaban solo mientras la línea marcaba el corte: una foto tiene canto propio
> y necesita más aire que un texto. `.inicio .lista:not(.lista--cierre)` pasa de
> los 48 px que trae `.lista` a **74**, que son **80 medidos** entre el canto de
> la imagen y la caja del rótulo.
>
> **80 no es un número nuevo:** es el mismo hueco que hay entre las tarjetas y
> la banda, y el mismo con el que cierran `.articulo`, `sobre/` y el listado
> contra el pie.

Medido en los dos estados:

| Ancho | Fin del destacado → rótulo | Con `[hidden]` → banda |
|---|---|---|
| 1440 | **80** | 56 |
| 1000 | **80** | 56 |
| 375 | **74** | 56 |

Los 74 de móvil no son un descuido: los 6 px de diferencia son el interlineado
del rótulo, que por debajo de 430 px pasa a `display: block` y pierde la caja
flex. A esa escala no se distingue.

**Con la sección en `[hidden]` nada de esto aplica**: ese relleno no pinta, así
que el hueco sigue siendo el `margin-top: 56px` de la propia banda. Verificado
que los 56 no se mueven en los tres anchos.

#### El filete de los rótulos tiene dos puntos de corte medidos

El rótulo se queda en `--tinta` y **no pasa al acento**: el peso que le faltaba
lo da la línea, y así el verdigrís sigue reservado a la categoría y al enlace
«ver todos». Va en un `::after` con `flex: 1`, así que la línea mide lo que
sobre y no hay nada que calcular al cambiar el texto.

> ⚠️ **Por debajo de 430 px el filete se retira, y el número está medido.** El
> rótulo más largo —«Lectura recomendada»— pide **286,6 px** en Cormorant 20
> versales, y eso no baja porque el cuerpo es fijo. Con los 20 del hueco y un
> mínimo de 40 para que la línea se lea como filete y no como un guion, hacen
> falta **394,6 px** de ventana. Lo que sobra para la línea:
>
> | Ventana | 375 | 395 | 400 | 430 | 480 | 600 |
> |---|---|---|---|---|---|---|
> | Filete | **20,4** | **40,4** | 45,4 | 75,4 | 125,4 | 245,4 |
>
> ⚠️ **EL CORTE SIGUE EN 430 AUNQUE LA CUENTA PIDA 394,6, y esta sección daba el
> número anterior.** El rótulo decía **«La lectura recomendada»**, pedía 322,5 px
> y de ahí salía un corte de 430,5. Al quitarle el artículo baja a 286,6 y el
> corte exacto baja con él.
>
> O sea que **entre 395 y 430 el filete cabría** —sobran de 40,4 a 75,4— y aun
> así se retira. No rompe nada y los dos rótulos hermanos siguen tratados igual;
> es holgura, y el modo de fallar es el bueno: pasarse de prudente quita una
> línea decorativa, quedarse corto parte el rótulo en dos.
>
> **Bajarlo a 395 es una decisión de diseño, no una corrección.** Si se baja,
> hay que volver a mirar los 375: ahí solo sobran 20,4 px y la línea se leería
> como un guion, que es justo lo que este corte evita.
>
> Con un sobrante negativo pasaba algo peor que quedarse sin línea: **el texto
> envolvía a dos líneas** —64 px en vez de 32— porque el hueco y el `::after` le
> robaban sitio. **Con el texto de hoy no se llega a ese caso en ningún ancho.**
> Volviendo a `display: block` el texto recupera su única línea, porque 286,6
> caben de sobra en los 327 de la columna a 375. **Quitar el filete es lo que
> arregla el rótulo, no una pérdida.**

> ⚠️ **`flex: 1 1 auto` y no `flex: 1` en el rótulo de «Últimos artículos».**
> Parecen lo mismo: `flex: 1` es `flex-basis: 0%`, así que el rótulo se encoge
> hasta cero para quedarse en una fila con el enlace «ver todos» cueste lo que
> cueste. Medido a 480 px: se quedaba en ~190, «Últimos artículos» —que pide
> 236,2— **envolvía a dos líneas y su filete se iba a cero**, con el rótulo de
> arriba funcionando bien. Dos hermanos con distinto tratamiento en el mismo
> ancho se leen como un error.
>
> Con `auto` el tamaño base es su `max-content`, así que cuando no caben los dos
> baja **el enlace** —`.lista__encabezado` ya trae `flex-wrap`— y el rótulo
> recupera el ancho entero.

#### El destacado: orden del DOM, suelo de 448 px y por qué 3:2

**El texto va primero en el marcado** y la imagen después, en vez de colocarlos
con `order`. Así el orden de lectura —teclado, lector de pantalla, página sin
CSS— coincide con el visual. La única excepción es el tramo apilado, donde la
maqueta pide la imagen arriba: ahí sí se usa `order: -1`, y no se pierde nada
porque la imagen va `aria-hidden` y `tabindex="-1"`.

> ⚠️ **El suelo de 448 px de la columna de texto no es un número redondo: es el
> ancho que pide la fila de metadatos para caber en una línea** (447,4 medidos,
> redondeado arriba). Sin él, el reparto 45/55 dejaba el texto en 448,65 justo
> en 1085 —**1,3 px de holgura**— y un pelo de diferencia en el renderizado
> partía los metadatos en dos. Holgura medida: 1,3 en 1085, 8 en 1100, 30,5 en
> 1150 y 74,6 a partir de 1248, donde el contenedor topa en 1200.
>
> Con `minmax(448px, 45fr)` el texto nunca baja de 448 y la diferencia la absorbe
> la columna de la imagen, que puede ceder sin que se note. **Si se cambia el
> texto de «Leer artículo» o de los minutos, este número hay que volver a
> medirlo**: sale del contenido, no del diseño.

**La imagen se queda en 3:2 y eso es lo que evita el recorte.** La foto es
1600×1066, o sea 3:2 exactos, así que con `cover` **no se corta ni un píxel** y
se ve la escultura entera, balanza incluida. El `object-position: 62%` es una
**red, no un ajuste**: a 3:2 no hace nada porque no hay holgura que repartir, y
solo entra si la caja cambia de proporción. El 62 % sale de medir sobre la foto
—la balanza cae al 43 % del ancho y la figura al 69 %—.

Apilado, la imagen lleva `max-width: 560px`: a ancho completo y 3:2 se iría a
**690 px de alto** en una tablet. Se limita el ancho en vez de recortar con un
ratio más panorámico, porque el encargo era explícito en no cortar la escultura.

> ⚠️ **Las barras `|` de los metadatos las pone el CSS, no el marcado.** Van en
> `::after` porque `::before` ya lo ocupan los iconos de calendario y reloj, y
> fuera del HTML para que un lector de pantalla no tenga que ignorar glifos de
> puntuación. `:not(:last-child)` deja el último sin barra sin saber cuál es.
>
> **Y por debajo de 600 px el enlace baja de fila a propósito, con la barra que
> lo precede.** La fila pide 447 px, así que por debajo de unos 495 envuelve
> sola, y al envolver **la barra se quedaba colgando al final de la primera
> línea**: un separador sin nada que separar. En CSS no hay forma de saber si una
> fila flex ha envuelto, así que en vez de perseguir el punto exacto se hace
> explícito. El corte va en 600 —uno que ya existe— y no en 495: entre esos dos
> anchos la fila aún cabría, pero vale más que atar el diseño a un número que
> depende del largo de los metadatos.
>
> ⚠️ **LA REGLA LA COMPARTE AHORA LA FICHA DEL ARTÍCULO**, en un solo bloque con
> dos selectores: `.inicio .entrada__meta > :not(:last-child)::after` y
> `.articulo__ficha > :not(:last-child)::after`. El carácter, el color y el
> margen se tocan en **un** sitio. **No se solapan** —`.inicio` no está en el
> `<body>` del artículo y `.articulo__ficha` no existe en la portada—, así que
> agrupar no pinta ni una barra de más. Verificado: la portada sigue dando
> `time| lectura| leer` en el destacado y `time| lectura` en las tarjetas.
>
> El artículo tiene **sus propios cortes**, y están en su sección.

#### Responsive del rediseño, medido

| Ventana | Destacado | Imagen | Tarjetas | Filete |
|---|---|---|---|---|
| 1440 | 2 col · 500,4 / 611,6 | 611,6×407,7 (3:2) | 3 col · 365,3 | sí |
| 1085 | 2 col · **448,6** / 548,4 | 548,4 | 3 col · 327 | sí |
| 1000 | **1 col**, imagen arriba | 560×373,3 (3:2) | **2 col** · 462 | sí |
| 480 | 1 col, imagen arriba | 432 | 1 col | sí · 89 y 176 |
| 375 | 1 col, imagen arriba | 327×218 (3:2) | 1 col · 327 | **no** |

El destacado se apila en el **mismo corte que las tarjetas, 1084**, y el número
no es prestado: la columna de texto necesita 448 px, lo que pide 1082,2 px de
ventana, y el 1084 que ya existía cae 1,8 px por encima. Que las dos cosas se
apilen a la vez es además lo coherente: la página entera pasa a modo estrecho en
un punto en vez de degradarse por partes.

La banda de suscripción **ya se apilaba con el botón a todo el ancho** en su
corte de 900, de antes del rediseño. No hizo falta tocarla. Sin scroll
horizontal en ninguno de los anchos medidos.

> **El destacado existe para hacer de transición**, y de ahí viene su forma. El
> hero es una imagen a sangre de 520 px y debajo hay una rejilla: la pieza va
> **abierta**, sobre `--papel`, **sin fondo y sin filete**. Así la densidad crece
> hacia abajo en vez de saltar, y no compite con el hero porque no tiene cerco.
>
> **No es una tarjeta más**, y se separa de las de abajo en tres cosas:
> horizontal frente a vertical, reparto desigual 45/55 frente a columnas
> iguales, e imagen en 3:2 frente a 16:9.
>
> ⚠️ **Lo que ya NO la separa es la entradilla.** Aquí decía «entradilla
> completa frente a la recortada», y de las cuatro diferencias esa era la única
> de contenido. Desde el rediseño la entradilla del destacado **se recorta a
> tres líneas con `line-clamp`**, así que se lee igual de corta que la de una
> tarjeta.
>
> La diferencia que queda es de otro tipo, y conviene no perderla: **el texto
> completo sigue en el HTML** y solo se recorta al pintarlo. En la tarjeta el
> extracto es corto de verdad, escrito así. Aquí están las palabras del autor
> enteras y el límite es visual, o sea que quitar el clamp del CSS las devuelve
> sin tocar el marcado. **No se reescribe ni se acorta ese párrafo.**
>
> Y desde que las tarjetas de la portada son `.tarjeta--abierta`, tampoco las
> separa la caja ni el radio: ninguna de las dos tiene.

> ⚠️ **El titular va en `clamp` y no en 36 px fijos.** El `h1` del hero también
> es fluido y en móvil baja a **35,2**; con 36 fijos aquí, a 375 el destacado
> sería **más grande que el titular del hero** y la jerarquía quedaría del
> revés. Solo se ve midiendo en estrecho. Medido con `clamp(1.9rem, 3.6vw,
> 2.25rem)`:
>
> | Ancho | Hero | Destacado | Tarjeta |
> |---|---|---|---|
> | 375 | 38,4 | **30,4** | 24 |
> | 1440 | 48 | **36** | 28 |

> ⚠️ **En la imagen, `aria-hidden="true"` y `tabindex="-1"` van juntos, y el
> `alt=""` depende de los dos.** Sin ellos serían dos enlaces seguidos al mismo
> destino —imagen y titular—, que un lector de pantalla enumera por duplicado.
> Ocultando el de la imagen, el ratón la puede pulsar y el teclado solo
> encuentra el titular. Si alguien quita el `aria-hidden`, ese `<a>` se queda
> **sin nombre accesible**: hay que devolverle un `alt` descriptivo en el mismo
> movimiento.
>
> **No hay ninguna otra imagen enlazada en el sitio**, así que no había patrón
> que copiar; el de `aria-hidden` + `tabindex="-1"` juntos sí existía, en el
> `<video>` de la portada.

> **Detrás de «Últimos artículos» iba una franja de «Áreas del derecho»** con
> las cuatro materias del despacho, y se eliminó con su CSS —`.franja`,
> `.areas` y las dos reglas de `.area`, que no las usaba nadie más—.
>
> No hizo falta tocar ningún espaciado. `.lista` pasó a ser el último hijo del
> `<main>` y recogió sola el cierre de 80 px de `main > .lista:last-child`, que
> existe justo para eso. Medido antes y después: de 24 px hasta el pie a **80**,
> el mismo que el listado.
>
> Quien lo lea hoy: **el último hijo del `<main>` ya no es esa `.lista`**, sino
> la sección de la banda de suscripción, que también es `.lista` y por eso
> recoge los 80 igual. La regla no cambió; cambió quién la cumple.
>
> Se llevó por delante el falso positivo del `grep` de categorías —era su
> `<h3>Derecho penal</h3>`— y **la única banda a sangre rellena de
> `--papel-alt`**, o sea el único sitio donde ese tono cubría el ancho entero de
> la ventana. El token no se queda huérfano: lo siguen usando once reglas más.

### El vídeo del hero se dibuja al 110 % y corrido, y los dos números van atados

`.portada__video` no ocupa el ancho de la franja: lleva `width: 110%` con
`left: -6.83%`, y `.portada--video` necesita `overflow: hidden` por eso.

**`object-position` en X no sirve aquí, y conviene saberlo antes de intentarlo.**
La franja es 2,769 de proporción y el material 1,79, así que `cover` escala por
el ancho y **el recorte lateral es cero**: sin holgura horizontal, la X no mueve
nada por encima de 847 px de ventana. Para ampliar hay que dibujar más ancho que
la caja, y entonces quien coloca es el `left`.

> ⚠️ **El −6,83 % no es un valor de tanteo: sale de una cuenta y depende del
> material.** La figura está en el **F = 68,33 %** del ancho —medido por
> densidad de bordes sobre el póster—, y al ampliar por `k` su centro se iría a
> `F·k`. Para que **no se mueva**:
>
> ```
> left = F · (1 − k)
> ```
>
> Con `k = 1,10` sale −6,83 %. **Si cambia la ampliación o el material, hay que
> volver a medir F y rehacer la cuenta**, o la figura se desplazará.
>
> Van en porcentaje y no en píxeles para que la relación aguante en cualquier
> ancho de ventana.

**La Y es 30 % y no 12 %.** A 12 % quedaban 92 px de cielo muerto sobre la
balanza —casi un quinto de la franja— que se leían como un hueco entre la
cabecera y la figura. A 30 % quedan **27 px a 1440**, y crecen al estrechar.

Y de paso **mejora el corte de abajo**: subir la Y corre la ventana hacia el pie
del encuadre, así que se recorta **65 px menos** y se ve más pedestal. El
pedestal se sigue cortando —la figura es más alta que los 520 px de la franja y
eso no lo arregla ningún encuadre— pero menos que antes.

**Lo que cuesta:** el recorte vertical sube del 35,3 % al **41,2 %** a 1440. Se
desvanece al estrechar —9,1 % a 932 y **cero por debajo de 847**, donde el eje
de recorte cambia a horizontal— así que lo paga solo el escritorio ancho.

| Material | Peso | Antes |
|---|---|---|
| `video/portada-dama.mp4` | **806 KB** | 1,07 MB |
| `img/portada-poster.jpg` | **53 KB** | 90 KB |

El vídeo es un **bucle ping-pong**: medido, el primer y el último fotograma
difieren en **1,23 sobre 255**, o sea que el salto del `loop` no se ve.

El bloque de la portada es **titular, subtítulo y dos botones**.

> ⚠️ **EL ANTETÍTULO SE FUE POR TERCERA VEZ, Y ESTA SECCIÓN DECÍA QUE HABÍA
> VUELTO.** El historial importa porque el elemento regresa solo cada vez que
> alguien decide que al titular le falta un rótulo encima:
>
> | Pasada | Antetítulo | Regla de contraste |
> |---|---|---|
> | maqueta | «BLOG JURÍDICO» | puesta |
> | al retirarlo | — | retirada |
> | textos del cliente | línea de áreas | **repuesta** |
> | **hoy, por encargo** | **ninguno** | **retirada** |
>
> La línea de áreas decía «Derecho administrativo · Urbanismo · Jurisdicción
> contencioso-administrativa». **Se eliminó a propósito y no hay que reponerla**
> — está registrado arriba, en la sección de los textos del hero.
>
> ⚠️ **QUIEN VUELVA A PONER UN ANTETÍTULO EN LA PORTADA TIENE QUE REPONER
> `.portada--video .portada__antetitulo` EN EL MISMO MOVIMIENTO.** Son dos cosas
> y no una. Sobre el vídeo `--acento` se queda en **2,50:1** y no llega a AA;
> `--acento-oscuro` lo arregla, y con el antetítulo puesto medía **5,24–5,44:1**
> entre 932 y 1440 px. Ponerlo sin la regla **publica el rótulo ilegible y nada
> avisa**: el HTML se ve correcto al leerlo, que es lo que lo hace traicionero.
>
> **`.portada__antetitulo`, la clase base, NO se toca**: la sigue usando
> `404.html` para el rótulo «Error 404». Allí va sobre blanco, donde `--acento`
> da 5,91:1 y la regla de contraste nunca hizo falta. Verificado que `404.html`
> usa `.portada` y no `.portada--video`, así que la regla retirada no le
> aplicaba.

> **Si alguna vez vuelve una línea de áreas, se escribe en caja normal, no en
> mayúsculas.** Las versales las pone `text-transform` en el CSS, igual que en
> las categorías. Escribirla en mayúsculas en el HTML haría que algunos lectores
> de pantalla la deletrearan letra a letra. El documento del cliente la traía en
> caps, pero eso era una indicación de estilo, no el contenido.

El bloque se centra solo: `.portada` es flex con `align-items: center`, así que
los elementos se recolocan sin tocar nada. Verificado que la franja sigue en
520 px en 1440, 1084, 1000, 960 y 932 —lo garantiza el `min-height`— y que el
desvío respecto al reparto del padding es 0.

#### La columna del hero mide 620 px, y hoy la sostiene la calibración

La rejilla del hero estuvo en `1fr 1fr`, que a 1440 reparte **556** a cada lado.
Con los textos definitivos eso **no cabía en la franja de 520**: la línea de
áreas se partía en dos, el titular se iba a 3 líneas y el subtítulo a 6.

| Ancho | Con 556 | Con 620 |
|---|---|---|
| 1440 | 605,7 px | **520 exactos** |
| 1000 | 635,2 px | **520 exactos** |
| 375 | 746,8 px | 686,6 px (una columna) |

**620 salió de la línea de áreas**: ese texto pedía **619 px** para ir en una
sola línea, y de ahí el número. La casualidad útil era que el mismo ancho bajaba
el titular a 2 líneas y el subtítulo a 5.

> ⚠️ **ESA LÍNEA YA NO EXISTE, Y ESTA SECCIÓN LA DABA COMO ORIGEN DEL NÚMERO.**
> Se eliminó del hero por encargo, así que **el 620 ya no lo sostiene ningún
> texto**. Aquí decía además «si se alarga el texto de la línea de áreas, este
> número hay que volver a medirlo»; eso decae con la línea.
>
> **El número se mantiene igualmente, y no por inercia: es el ancho con el que
> está calibrado el resto del hero.** Con los textos de hoy ninguno de los dos
> llega a tocarlo:
>
> | | Línea más larga | ¿Toca los 620? |
> |---|---|---|
> | Titular (3 líneas) | 537 px | no |
> | Subtítulo (3 líneas) | 533 px | no — lo corta antes su `max-width: 31em`, ~570 px |
>
> Verificado que la franja sigue en **520 exactos** a 1440, 1084 y 932.
>
> ⚠️ **Lo que hace caro bajarlo es el contraste, no la maqueta.** El `max-width`
> del subtítulo está medido **con la columna en 620**: es una medida de
> contraste, porque una línea larga mete su cola en el plato de la balanza del
> vídeo, donde el velo está en su zona más floja, y ahí llegó a **1,78:1**. Está
> razonado en `styles.css`, sobre `.portada__entradilla`. Quien cambie el 620
> tiene que volver a medir aquello, no solo mirar si el titular cabe.
>
> Medido hoy en el peor caso —muestreando el fotograma **sin** el velo encima,
> así que el real es mejor—: **5,45:1** a 1084 y **5,32:1** a 932. AA con
> margen.

Va en `minmax(0, 620px) 1fr` y no en una fracción porque el ancho que hace falta
es **absoluto** y no una proporción del contenedor. La segunda columna se queda
con lo que sobre, que es el hueco por donde se ve la figura: 492 px a 1440 y 292
a 1000.

> **En móvil el hero ya no llena la pantalla, y esta sección decía que sí.**
> Aquí se registraba que a 375 ocupaba **686,6 px**, el 84,6 % de una pantalla
> de 812, y se aceptaba a regañadientes. Con los textos nuevos —sin línea de
> áreas y con un subtítulo más corto— baja a **574,5 px, el 70,8 %**.
>
> Lo que lo recortaba sigue en pie: el subtítulo baja a 16 px por debajo de 600,
> y con 18,4 el hero se iba a 746,8 px y al 92 %. El resto del alto lo pone el
> titular, que a 375 ocupa 5 líneas.

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
| `.boton--contorno` | filete y texto `--acento`, **sin fondo** | relleno `--acento`, texto `--papel` | **botones de filtro y desplegable de `articulos/`** |

> ⚠️ **LA COLUMNA «PARA QUÉ» DE `--contorno` DECÍA «enlace de sección que quiere
> peso de botón», Y ESE ERA «VER TODOS LOS ARTÍCULOS», QUE YA NO ES UN BOTÓN.**
> Pasó a enlace de texto con flecha; está abajo, en su propia sección.
>
> Hoy `--contorno` solo lo llevan **controles de verdad**: los cuatro botones de
> categoría y el del desplegable de etiquetas, todos en `articulos/index.html` y
> todos `<button>`. Es más coherente de lo que era —un modificador de botón que
> solo visten botones— pero conviene saberlo antes de tocarlo: **cualquier
> cambio ahí se ve en los filtros, no en la portada.**

> ✅ **`.boton__flecha` SE QUEDÓ SIN USO Y YA SE HA BORRADO.** Aquí decía «no se
> ha borrado» y que retirarla era «una limpieza aparte»; esa limpieza se hizo.
> Era la flecha de «Ver todos los artículos», su único portador, y se fueron sus
> cuatro reglas: la flecha, su desplazamiento en hover y las dos del bloque de
> `prefers-reduced-motion`.
>
> ⚠️ **De ese bloque SOLO se fue la flecha.** El `transition: none` de
> `.boton--contorno` se queda, porque el botón sigue animando su relleno y su
> texto: quien lo borre entero apaga una animación que sí existe.
>
> **La flecha que hay hoy en la portada no es esta**: son `.lista__flecha` y
> `.destacado__flecha`, que viven en su propio bloque y comparten estilo.

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

### Los enlaces de acción de la portada NO son botones

Son dos y **comparten estilo a propósito**, con las reglas agrupadas en un solo
bloque de `styles.css`. Si se toca uno, se toca el otro:

| Enlace | Dónde | Clases |
|---|---|---|
| «Leer artículo →» | el destacado | `.destacado__leer` + `.destacado__flecha` |
| «Ver todos los artículos →» | encabezado de «Últimos artículos» | `.lista__enlace` + `.lista__flecha` |

Acento, sin fondo ni filete, sin subrayado, y la flecha en un `<span>` propio
que se desplaza 4 px al pasar el ratón. **El subrayado se omite a propósito**:
la flecha ya dice que lleva a algún sitio, y competiría con el filete del rótulo
que tienen encima.

> ⚠️ **«VER TODOS LOS ARTÍCULOS» ERA UN `.boton--contorno`**, y el cambio fue
> por encargo para que se pareciera al mockup. **No se le devuelven las clases**:
> el encabezado tiene un solo rótulo enfrente y un botón ahí pesaba más que la
> sección que anuncia.
>
> Se resolvió **quitándole las dos clases, no redefiniéndolas**. Es la parte que
> más fácil se hace mal: `.boton--contorno` lo siguen usando los filtros de
> `articulos/`, así que tocar esa clase para «arreglar la portada» los cambia a
> los dos.

> ⚠️ **EL ALTO DE 44 px HAY QUE CONSERVARLO Y NO SE VE.** Lo traía el
> `min-height` de `.boton--contorno` y es el mínimo de área de pulsación. Sin él
> el enlace se queda en la altura de su línea —unos 17 px— y en un móvil es un
> blanco incómodo de acertar; en pantalla no se nota nada, porque el texto se ve
> igual.
>
> Lo repone `.lista__enlace` con `inline-flex` y `min-height: 44px`, que no
> pintan nada visible. **Quien lo simplifique a un `<a>` pelado porque «no hace
> falta nada más» rompe la diana sin que nada avise.**

> **La tipografía NO se repone en el enlace**, y por eso quitar las clases no
> cambió ni una letra: el cuerpo de 12, el peso 600, las versales y el tracking
> de `0.06em` ya los pone `.lista__mas--enlinea` en el `<p>` de fuera, con
> exactamente los mismos valores que declaraba `.boton--contorno`.

> ⚠️ **El anillo de foco pasó de `--tinta` a `--acento`, y es coherente.** El
> `--tinta` de `.boton--contorno` estaba razonado **porque el botón ya era de
> acento** —filete en reposo, relleno en hover— y un anillo del mismo color
> habría quedado pegado a su propio borde. Sin filete esa razón decae, y el
> análogo real pasa a ser **`.volver`**, el otro enlace de texto con flecha del
> sitio, que usa `--acento` con el mismo `outline-offset: 3px` y el mismo
> `border-radius: 2px`.

> **Con `prefers-reduced-motion` la flecha no se mueve en absoluto.** El bloque
> quitaba la transición pero dejaba el `transform`, así que la flecha **saltaba**
> los 4 px sin animarse — que es justo lo que sobra con esa preferencia.
> `.boton--contorno` ya lo apagaba entero, así que al compartir estilo los dos
> enlaces se igualaron por el más estricto. **Afecta también a «Leer artículo»**,
> que antes sí saltaba.

## Fotografía

Blanco y negro o tonos cálidos apagados, estilo editorial. Todas las miniaturas
de la cuadrícula, misma proporción. El retrato del autor no es corporativo: luz
natural, biblioteca o despacho, como una entrevista en *Monocle*.

> ⚠️ **EL RETRATO DE HOY NO CUMPLE ESA ÚLTIMA FRASE, y es del cliente.** Es un
> posado de estudio sobre fondo liso, con traje y corbata: exactamente el
> «corporativo» que la línea de arriba descarta. **No se sustituye por
> iniciativa propia** —la foto la pone él— y la frase se conserva porque sigue
> describiendo a dónde debería ir el sitio si algún día se encarga una sesión.

> ✅ **LA FOTO ANTERIOR, `img/juanconteramiranda.jpeg`, SE HA BORRADO.** Aquí
> decía «no se ha borrado» y que retirarla era una limpieza aparte; esa limpieza
> se hizo. Era cuadrada de 400 px y 21,7 KB, y la sustituyen las dos versiones
> nuevas, descritas en «Autoría».
>
> ⚠️ **Al comprobar que no la usaba nadie hubo que escapar el punto**, y conviene
> saberlo si algún día se repite la operación: el nombre nuevo contiene al viejo
> como **prefijo**, así que un `grep` de `juanconteramiranda` a secas devuelve
> también los dos archivos vivos y parecería que sigue en uso. Lo que distingue
> es el `\.jpeg`:
>
> ```sh
> grep -rn 'juanconteramiranda\.jpeg' --include='*.html' --include='*.mjs' \
>      --include='*.css' --include='*.xml' .
> ```

### La entradilla de `contacto/` va al ancho de la página

```
mancheta          h1 «Contacto», a sangre
entradilla        1152 — el ancho entero de la fila
──────────────    <hr>, mismo canto que la entradilla
formulario 600  │  caja de apoyo 487
```

La rejilla es `1.25fr minmax(0, 1fr)` con `gap: 56px`. Sobre los 1152 de
interior eso da **609 y 487**, y el formulario se topa en **600** dentro de su
columna.

> ⚠️ **LA ENTRADILLA NO LLEVA TOPE, POR ENCARGO DEL CLIENTE, Y ESTA SECCIÓN
> DECÍA LO CONTRARIO EN DOS SITIOS.** Se titulaba «se topa en el ancho del
> formulario» y había un aviso entero —**«NO SE PONE AL ANCHO DEL CONTENEDOR,
> aunque sea lo que pide el ojo»**— que es justo lo que se ha hecho.
>
> El tope fue primero `34em` (653 px) y después los 600 del formulario. **La
> medición que lo sostenía sigue siendo correcta**, y por eso se conserva: a
> 1152 son ~125 caracteres por línea, muy por encima del rango cómodo.
>
> Medido antes y después:
>
> | Ventana | Antes | Después |
> |---|---|---|
> | 1440 | 600 px · **64 cpl** · 4 líneas | 1152 px · **123 cpl** · 2 líneas |
> | 768 | 600 px · 64 cpl | 720 px · **77 cpl** |
> | 375 | 327 px · 35 cpl | 327 px · 35 cpl — *igual* |
>
> **Lo paga solo el escritorio ancho**: por debajo de 1248 el contenedor ya no
> llega a 1152, y a 375 no cambia nada porque el tope nunca llegaba a actuar.
>
> ⚠️ **NO SE COMPENSA CON UN `max-width` DISIMULADO** ni se vuelve a 600 «porque
> se lee mejor»: eso es deshacer el encargo. Si algún día molesta, la palanca
> honesta es **acortar el texto**, no reponer el tope.
>
> ✅ **Lo que sí decae es el argumento del canto.** Decía que con 653 el párrafo
> sobresalía 53 px respecto al formulario y se leía como un desajuste —«casi
> alinear es peor que no alinear»—. A ancho completo no hay casi-alineación: el
> párrafo cierra exactamente con el `<hr>` y con el borde del aparte, que son
> los elementos que cruzan la fila entera.

> ⚠️ **EL `<hr>` SE QUEDA, PERO YA NO POR LO QUE DECÍA AQUÍ.** Se justificaba
> como «lo que hace de ancho de página», porque cruzaba 1152 por debajo de un
> párrafo de 600. Con los dos al mismo ancho esa función desaparece.
>
> Le queda la que de verdad importa: **separar la banda de entrada de la fila de
> formulario + aparte**. Y gana algo, porque antes era una línea más ancha que
> el párrafo que cerraba y ahora comparte canto exacto con él — verificado a
> 1440, 768 y 375.
>
> Si alguna vez se quita, lo que hay que mirar **no es el ancho sino el hueco**:
> sin él, la entradilla y el formulario quedarían separados solo por los 56 del
> `gap`, que es el mismo aire que hay **entre** las dos columnas. Dejarían de
> leerse como dos zonas.

> **El `<hr>` es el mismo que cierra `sobre/`**, y las declaraciones viven
> agrupadas —`.articulo hr, .contacto hr`— para que el grosor y el color no
> puedan divergir. `.articulo hr` no alcanzaba a `contacto/`, que no lleva esa
> clase: allí un `<hr>` habría salido con el relieve por defecto del navegador.
>
> ⚠️ **El margen NO se comparte, y por eso va en una regla aparte.** En `sobre/`
> la línea está en flujo normal y necesita sus 48; en `contacto/` es un item de
> la rejilla y el aire se lo dan los **56 del `gap`**, arriba y abajo. Con los
> dos a la vez sumarían 104 por lado.

> **Va en el marcado y no como `border-bottom` de la entradilla**, porque tiene
> que medir lo que mide la **fila**, no lo que mide el párrafo.

> **El orden del DOM es el visual y no hay ni un `order`**: entradilla, filete,
> formulario, caja de apoyo. Al apilar por debajo de 932 cae en ese mismo orden
> —se viene a escribir, y las notas de al lado son secundarias—, que es lo que
> ya decidía el marcado antes de esto.

### `sobre/` son dos filas, y el PDF del cliente manda la estructura

La página pasó de una columna de lectura a esto:

```
mancheta            h1 «Acerca de», a sangre
                    48 px  ← el mismo arranque que articulos/ y contacto/
┌──────────────┬──────────────┐
│ h2 Enfoque   │ h2 Contenido │   .sobre__columnas, 548 px cada una a 1200
│ 3 párrafos   │ 1 párrafo    │
│              │ + 3 líneas ❖ │
└──────────────┴──────────────┘
                    48 px
╔═══════════════════════════════╗  .sobre__bloque-autor — caja --papel-alt
║ h2 Sobre el autor             ║  filete 1px --borde, radio 4, relleno 26/30
║ texto (720) + CV · foto 300×400║
╚═══════════════════════════════╝
```

#### El wrapper lleva DOS clases y las dos hacen falta

`<div class="articulo sobre">`. `articulo` da la tipografía del cuerpo, que esta
página comparte con las de artículo. `sobre` es el gancho para lo que aquí es
distinto.

> ⚠️ **LAS REGLAS VAN COMO `.articulo.sobre`, NO COMO `.sobre` A SECAS.** Las dos
> clases están en el **mismo elemento**, así que `.sobre h2` pesa (0,1,1) igual
> que `.articulo h2` y el empate lo rompería el orden del archivo. Con las dos
> juntas son (0,2,1) y ganan por especificidad.
>
> Es **la cuarta vez** que este patrón aparece en el proyecto —antes fueron
> `.entrada__titulo`, `.autor__cv` y `.compartir__lista`— y las tres anteriores
> acabaron en reglas muertas que no daban ningún error.

#### El arranque bajó de 104 a 48 px

Era **el doble que el resto del sitio**, y sumaba dos cosas que no se ven juntas
al leer el CSS:

| Página | Qué pone el hueco | px |
|---|---|---|
| `articulos/` | `.lista` → `padding-top` | **48** |
| `contacto/` | `.contacto .contenedor` → `padding-top` | **48** |
| `sobre/` antes | `.articulo` 56 **+** `margin-top` del primer `h2` 48 | **104** |
| `sobre/` hoy | `.articulo.sobre` 48, con el margen del `h2` a cero | **48** |

> ⚠️ **`.articulo` NO SE PUEDE TOCAR PARA ARREGLAR ESTO**, y es la razón de que
> exista el gancho `.sobre`: ese `padding: 56px 0 80px` lo llevan también
> **todas las páginas de artículo**.

> **Los dos `h2` de las columnas siguen alineados entre sí.** Antes lo estaban
> porque los dos conservaban el mismo margen; ahora, porque ninguno lo tiene.

#### Los epígrafes bajaron de 32 a 24 px, y la escala NO era propia

Lo primero que se comprobó es si `sobre/` usaba una escala mayor que el resto.
**No la usaba**: era exactamente la del artículo.

| | `sobre/` antes | artículo |
|---|---|---|
| `h2` | 32 / 38,4 / 600 | **32 / 38,4 / 600** |
| párrafo | 18 / 30,6 | **18 / 30,6** |

Lo que cambia no es el cuerpo de la letra sino **la columna sobre la que se
apoya**, y un epígrafe se percibe en relación con su columna:

| | Cuerpo ÷ columna |
|---|---|
| artículo | 32 ÷ 720 = **0,044** |
| `sobre/`, columnas | 32 ÷ 548 = **0,058** — un 33 % más |

Escalar el epígrafe a su columna da 32 × 548/720 = 24,4, y **24 px ya es un
escalón de la escala del sitio**: es el cuerpo del `h3` del artículo. No se
estrena ningún tamaño. Los márgenes acompañan en la misma proporción: 48 → 36 y
14 → 12.

> ⚠️ **EL CUERPO SE QUEDA EN 18 px, Y ES DELIBERADO AUNQUE EL ENCARGO HABLARA DE
> «el texto en general».** Es el único valor que tiene que ser idéntico en todo
> el sitio, y bajarlo aquí haría de `sobre/` la única página con otro cuerpo de
> texto — un defecto peor que el que resuelve.
>
> A 548 px y 18 px salen unos **61 caracteres por línea**, que está en el rango
> cómodo. Si aun así se quisiera más pequeño, es una decisión de **todo el
> sitio** y se toma en la escala tipográfica, no en esta página.

#### «Sobre el autor» va en caja, y no estrena ni un valor

| Caja | Fondo | Filete | Radio | Relleno |
|---|---|---|---|---|
| `.indice`, `.referencias` | `--papel-alt` | 1 px `--borde` | 4 | 26/30 |
| `.articulo__lateral` | `--papel-alt` | 1 px `--borde` | 4 | 28/24 |
| **`.sobre__bloque-autor`** | **`--papel-alt`** | **1 px `--borde`** | **4** | **26/30** |

Se copia el relleno de `.indice` y `.referencias` y no el del lateral porque esas
dos son las cajas que viven **en la columna de contenido**, que es lo que esto
es; el lateral es una barra estrecha y por eso aprieta más los lados.

> ⚠️ **El `h2` pierde su margen de arriba dentro de la caja.** Con relleno los
> márgenes **no colapsan**, así que los 36 px se sumarían a los 26 del padding y
> dejarían el título flotando a 62 del canto.

> ⚠️ **LA CAJA DESTAPÓ UN DESBORDAMIENTO QUE LLEVABA MESES AHÍ.**
> `.sobre__autor` era `minmax(0, 720px) minmax(0, 1fr)`: la segunda columna se
> queda con lo que **sobra**, y la primera, al poder crecer hasta 720, no dejaba
> sobrar nada. Medido a 768 px, las columnas calculadas eran **`664px 0px`** —el
> retrato en una columna de cero— y como `.sobre__retrato` tiene 300 px fijos, se
> salía 300 px y arrastraba **scroll horizontal a toda la página**: 1044 px de
> documento en una ventana de 768.
>
> Pasaba entre el corte de apilado y los ~1124 px que hacen falta para que quepan
> 720 + 56 + 300. **Casi todas las tablets.**
>
> **No se veía**, y por eso duró: el retrato se salía sobre el blanco de la
> página, donde un desbordamiento no deja rastro. En cuanto el bloque es una caja
> con fondo, el mismo fallo se ve a la primera.
>
> Lo arregla `minmax(0, 720px) auto`: la segunda columna se dimensiona a su
> contenido y la primera se queda con el resto hasta su tope.

> ⚠️ **Y EL CORTE DE APILADO SUBE DE 600 A 900**, esta vez sí por consecuencia de
> la caja. Con el retrato fijo en 300 y el hueco de 56, al texto le queda lo que
> sobre del **interior** de la caja:
>
> | Ventana | Columna de texto | Caracteres por línea |
> |---|---|---|
> | 768 | 302 px | **35** — ilegible |
> | 900 | 434 px | 50 — aceptable |
> | 1440 | 720 px | ~82 |
>
> 900 no es un número nuevo: es donde el artículo baja su lateral.

> ⚠️ **Y EL RETRATO TIENE QUE PODER ENCOGER.** Sus 300 px cabían mientras el
> bloque no tenía relleno: a 375 el contenedor son 327 y la foto 300, con 27 de
> sobra. Con los 30 px de relleno por lado el interior baja a **265** y la foto
> **se salía de la caja**.
>
> Se resuelve con `min(300px, 100%)` **y `aspect-ratio: 3/4`**, no con
> `max-width` a secas: con la altura fija en 400 la caja pasaría a 265 × 400
> —proporción 0,66— y empezaría a recortar por los lados, perdiendo el «recorte
> 0» que está documentado más abajo. Verificado: a 375 la foto mide 265 × 353 y
> el recorte sigue siendo **0 × 0**.

⚠️ **ESTA PÁGINA REPRODUCE EL PDF DEL CLIENTE TAL CUAL, en contenido Y en
composición.** Hubo una pasada intermedia que lo trataba como referencia de
estructura y combinaba su texto con el anterior; se corrigió. **Los textos
aprobados de `sobre/` son hoy los del PDF, sin añadidos.**

**Va en `.contenedor--amplio` y no en `.contenedor`**, que es lo que usaba: en
el ancho de lectura —820— dos columnas quedarían a 380 y el texto se parte mal.

> ⚠️ **SE PERDIERON DOS PÁRRAFOS Y FUE DELIBERADO.** «En esta disciplina
> confluyen conceptos de difícil delimitación…» y «Los artículos buscan combinar
> claridad expositiva…» no están en el PDF del cliente, que fija «Enfoque» en
> tres párrafos y «Contenido» en uno más la lista. No hay que reponerlos.

> ⚠️ **FUERA TODO LO QUE NO ESTÁ EN EL PDF, Y ESTA SECCIÓN DECÍA LO CONTRARIO.**
> Se conservaban «por encargo» el **aviso legal**, los **dos botones de salida**
> —«Explorar artículos» y «Contacto»— y el **`<hr>`** que los precedía. El
> encargo posterior fue reproducir el PDF tal cual, así que **los tres se han
> retirado**.
>
> **Consecuencia que hay que tener presente:** `sobre/` es ahora la única página
> de contenido **sin descargo legal** y **sin ninguna salida** hacia el listado
> o hacia contacto —solo quedan las del menú y el pie—. No es un descuido.
>
> ✅ **Y dejó `.sobre__cierre` sin uso, regla que YA SE HA BORRADO** en la
> limpieza del lote. Aquí decía «no se ha borrado». Era una línea
> —`max-width: 720px`— y esta página era su único portador.

> ⚠️ **LA BIOGRAFÍA ES EL TEXTO DEL PDF, LITERAL. ESTA SECCIÓN DECÍA QUE ERA UNA
> COMBINACIÓN.** Durante una pasada se conservaron tres datos que el PDF no
> trae; **ya no**. Lo que decía, y que hoy NO describe la página:
>
> | Dato | Hoy en la página |
> |---|---|
> | Colegio (ICAM) | **no aparece** |
> | Práctica: licencias, sanciones, expropiaciones, responsabilidad patrimonial | **no aparece** |
> | Universidades | **siglas**: UCM, UEA, UNIR |
>
> ⚠️ **Eso hace decaer el «✅ Ya hay colegio y despacho» de la deuda pendiente**:
> el despacho sigue —Sterling Abogados—, pero **el ICAM ya no se nombra en
> ninguna página**. Sigue en el CV descargable, que es donde el cliente lo puso.
>
> Y las mayúsculas del PDF se copian tal cual, incoherencias incluidas:
> «Derecho **a**dministrativo» en «Enfoque» y «Contenido», pero «el Derecho
> **A**dministrativo y el Urbanismo» en «Sobre el autor». **No se corrigen.**

> ⚠️ **LOS TRES NOMBRES DE LA LISTA SON ENLACES AL FILTRO**, y es el único sitio
> donde el texto del cliente coincide **literalmente** con las tres claves de
> `CATEGORIAS`: `fundamentos`, `jurisprudencia` y `ensayos`. Llevan el mismo
> `href` y el mismo `<span class="oculto">Ver artículos de </span>` que la
> portada y la ficha del artículo.
>
> **La coma queda fuera del `<strong>` y fuera del enlace**: es de la frase, no
> del nombre de la categoría.

> **La viñeta ❖ va en `::before`, no en `::marker`.** Es decorativa, y un
> pseudoelemento no entra en el árbol de accesibilidad: un lector de pantalla
> lee «Fundamentos, mediante artículos…» sin anunciar el glifo. Se descartó
> `::marker` con `content` porque **Safari no lo soporta en todas las versiones**
> y ahí la viñeta desaparecería. La sangría francesa es la misma técnica de
> `.lista--marcada`: la segunda línea alinea con la primera palabra, no con el
> rombo.

> ⚠️ **EL RETRATO ES UN RECTÁNGULO VERTICAL DE 300 × 400, COMO EL PDF. ESTA
> SECCIÓN DECÍA QUE ERA UN CÍRCULO**, con el argumento de que «el PDF marca
> estructura y contenido, no estilos». El encargo posterior fue reproducirlo
> también en composición.
>
> `.autor__retrato` sigue puesto por la **mecánica** —`overflow`, fondo de
> respaldo y el `object-fit: cover` del `<img>`—; `.sobre__retrato` cambia la
> forma, el tamaño y el radio. El lateral del artículo no se entera: verificado,
> **sigue en 132 × 132 y con `border-radius: 50%`**.
>
> ✅ **AQUÍ SE AVISABA DE QUE LA FUENTE SE QUEDABA JUSTA, Y ESO YA DECAE.**
> Decía que el original era **cuadrado de 400 px**, así que a 3:4 dejaba
> **300 × 400 útiles** para una caja de 300 × 400 —**exactamente 1×**, blanda en
> un portátil retina— y que «la única salida es una foto de más resolución,
> ~600 × 800».
>
> **Esa foto llegó.** El cliente entregó un retrato de **1792 × 2400**, que es
> 3:4 de origen, y de ahí sale `img/juanconteramiranda-600x800.jpg`: **2×
> justos** para esta caja. Verificado en 1440, 1280 y 375 — caja 300 × 400,
> **recorte 0 px** en los dos ejes y sin scroll horizontal.
>
> ⚠️ **Y el recorte 0 tiene una consecuencia que no se ve:** al coincidir la
> proporción no hay holgura, así que el `object-position` que `.sobre__retrato`
> hereda de `.autor__retrato` **aquí no hace nada**. Quien cambie la proporción
> de esta caja empezará a recortar de golpe, y entonces sí tendrá que mirar por
> dónde corta.

> ⚠️ **EL TEXTO VA ANTES QUE LA FOTO EN EL MARCADO.** El PDF pone la foto a la
> derecha, así que el orden de lectura es texto → foto y apilado en móvil cae
> igual **sin `order`**. Antes estaba al revés. Es la misma regla que el reorden
> de la cabecera del artículo: el orden del DOM es el que oyen los lectores de
> pantalla.

> ⚠️ **`.sobre__autor` PASÓ DE FLEX A GRID, Y ESO ROMPIÓ EL APILADO SIN DAR
> ERROR.** Con flex el texto se quedaba con todo lo que sobraba —**992 px
> medidos** en el contenedor de 1200— y ahí la línea es incómoda. La rejilla lo
> topa en los 720 del ancho de lectura.
>
> Lo que se escapó: la media query de 600 decía `flex-direction: column`, que
> **en una grid no pinta nada**. El retrato se quedaba al lado del texto en una
> columna de 327. No daba ningún error; solo se veía apretado. Hoy apila con
> `grid-template-columns`.

> **Los dos cortes de esta página no coinciden, y es a propósito.** Las columnas
> apilan en **748** —el de las tarjetas— porque a 600 bajarían a 248 y
> «contencioso-administrativa» no cabe; el retrato se despega del texto en
> **900**. Uno parte una retícula de texto y el otro despega una foto: no hay
> motivo para que cedan a la vez.
>
> ⚠️ **EL SEGUNDO ERA 600 Y SUBIÓ A 900** al meter «Sobre el autor» en caja: el
> relleno de 30 px por lado estrecha la columna de texto y a 768 se quedaba en
> 35 caracteres por línea. Está medido unas líneas más arriba.
>
> **Consecuencia curiosa:** entre 749 y 900 la página queda con las columnas de
> arriba **en dos** y el bloque del autor **apilado**. No es una incoherencia —
> arriba hay dos columnas de texto, que aguantan; abajo hay una foto de ancho
> fijo, que no— pero sorprende al redimensionar.

### El CV vive en `documentos/` y se descarga desde UN sitio

```
documentos/CV-Juan-Contera-Miranda.pdf      1 página · 63 KB
```

Es la única carpeta de descargas del sitio y hoy solo tiene ese archivo. **El
nombre es parte de la URL**: cambiarlo rompe cualquier enlace que se haya
compartido, así que al actualizar el CV se **sobrescribe el archivo**, no se
sube uno con otro nombre.

| Dónde | Ruta | Qué lo pinta |
|---|---|---|
| `sobre/`, bajo la biografía | `../documentos/…` | a mano, en `sobre/index.html` |

Es un `.boton--contorno` con `download`, sin una sola declaración de color
propia.

> ⚠️ **ESTA SECCIÓN SE TITULABA «desde DOS sitios» Y HABÍA UN SEGUNDO BOTÓN EN
> EL LATERAL DE CADA ARTÍCULO. Se retiró por encargo:** el cliente lo quiere
> solo en `sobre/`.
>
> Lo pintaba `plantilla.mjs` en `.lateral__bloque.autor`, justo bajo «Ver
> perfil →», así que la retirada **pasa por regenerar**. La salida de ese bloque
> vuelve a ser «Ver perfil →» a secas, que lleva precisamente a la página donde
> sigue estando el botón.
>
> **Con él se fue `.articulo .autor__cv`**, su única portadora. Lo que aquella
> regla dejaba escrito y conviene no perder, porque describe una trampa del
> proyecto y no solo ese botón: iba prefijada con `.articulo` porque es un `<p>`
> dentro de `<article class="articulo">`, y `.articulo p` pesa (0,1,1) frente a
> los (0,1,0) de una clase sola. **Estuvo escrita sin el prefijo y era una regla
> muerta**; no daba ningún error. Sigue vigente para cualquier clase nueva sobre
> un `<p>`, `<ul>` o `<h3>` del artículo.
>
> ✅ **Y con él se va una de las dos copias del peso en bytes.** Esta sección
> avisaba de que estaba «escrito a mano en los dos sitios y nada lo comprueba».
> Ahora hay una sola, en `sobre/index.html`. Una incoherencia menos posible.
>
> **El lateral queda bien compuesto sin él**, medido a 1440: el bloque del autor
> baja de **441 a 369 px** —los 44 del botón más sus 28 de margen— y el hueco
> contra el filete de «Etiquetas» se mantiene en los ~32 px que separan todos
> los bloques del lateral. No hay que reponer ningún margen.
>
> **El PDF no se entera**: `imprimir.css` oculta `.articulo__lateral` entero, así
> que el documento sale **byte a byte idéntico**. Verificado.

> **El de `sobre/` NO se vio afectado**, y por eso la retirada queda acotada:
> allí el botón vive en un `<p>` **sin clase** dentro de `.sobre__autor-texto`,
> así que nunca dependió de `.autor__cv`. Verificado.

> ⚠️ **EL PESO SIGUE ESCRITO A MANO y nada lo comprueba.** Va en un
> `<span class="oculto"> (PDF, 63 KB)</span>`, de modo que el nombre accesible
> del enlace es «Descargar CV (PDF, 63 KB)» y lo que se ve es «Descargar CV» a
> secas, como en el PDF del cliente.
>
> **Al sustituir el archivo hay que volver a mirar el número.** Un peso
> desfasado no da ningún error y no se ve en pantalla:
>
> ```sh
> grep -rn 'PDF, .. KB' sobre/index.html
> ```

> **La ruta es relativa, como todo el sitio.** Verificado que no empieza por `/`
> y que resuelve a `/documentos/…`: así funciona igual en el subdirectorio de
> GitHub Pages y en `elderechoescrito.es`. No hay `<base>` en ninguna página.

> **El texto visible no lleva el formato**, y es deliberado: el PDF del cliente
> pone «Descargar CV» y nada más. El formato y el peso van donde el sitio ya
> pone lo que solo necesita quien no ve la pantalla, el mismo recurso que el
> «Ver artículos de » de las categorías.

> ⚠️ **ESTE ARGUMENTO DECAYÓ A MEDIAS: «Descargar PDF» ya no vive en la lista.**
> Salió de `.compartir` y hoy es un `.boton--contorno` propio, igual que este,
> **pero conservó su icono**. O sea que la diferencia entre los dos botones de
> descarga del sitio es hoy solo esa, y es la que habría que revisar si alguna
> vez se unifican. El razonamiento original se conserva entero debajo.

> ⚠️ **NO LLEVA ICONO, al contrario que «Descargar PDF» del artículo.** Aquel
> vive en `.compartir`, una lista de cuatro acciones donde el icono distingue
> una de otra; este es un botón suelto y un icono ahí sería adorno. Si algún día
> se le pone, va por `mask` en `::before` como los demás, no como `<svg>`.

### Texto sobre imagen: hay que medir dónde cae, no la media

La mancheta es una **banda a sangre de 170 px** con `img/fondo-paginas.jpg` de
fondo y **sin velo**. Abre las tres páginas de sección —`articulos/`, `sobre/` y
`contacto/`— con el título centrado y nada más. El fondo cruza toda la ventana;
el título se queda en la rejilla de 1200 gracias al `.contenedor` que lleva
dentro.

> ⚠️ **EL ARCHIVO SE LLAMA IGUAL PERO LA FOTO ES OTRA, Y ESA ES LA TRAMPA DE
> ESTE CAMBIO.** `img/fondo-paginas.jpg` se **sobrescribió** con una imagen nueva
> generada con IA: un gris verdoso pálido con franjas diagonales de luz
> desenfocadas, mucho más simple que el veteado anterior.
>
> **Se sobrescribe en vez de añadir un nombre nuevo, y es deliberado:**
>
> | | Sobrescribir | Nombre nuevo |
> |---|---|---|
> | CSS | no se toca | hay que editarlo |
> | Archivos huérfanos | **ninguno** | uno más |
> | Qué enseña el diff | que la imagen cambió | que hay dos imágenes |
>
> El nombre describe **el papel** —«el fondo de las páginas»— y no el dibujo, así
> que sigue siendo exacto. Y el repositorio ya ha pagado dos veces el precio de
> acumular imágenes sin uso: `fondo-cabecera.jpg` y `juanconteramiranda.jpeg`
> necesitaron una limpieza dedicada. Añadir una tercera por no sobrescribir
> repite justo el error que esa limpieza arregló.
>
> **Consecuencia que hay que tener presente:** un `grep` del nombre no dice qué
> imagen hay. Para saberlo hay que mirar el archivo o esta sección.
>
> **Antes de esta, el archivo contuvo el recorte del veteado de la portada**, y
> antes de eso la banda usaba `img/fondo-cabecera.jpg`, que se borró al quedarse
> sin uso.

> **Cómo se preparó, y el orden importa.** El original es
> `Gemini_Generated_Image_vvrrjvvrrjvvrrjv.jpeg`, **3168 × 1344** y 1,6 MB. Para
> 4:1 usando el ancho entero hace falta una franja de 792 px de alto, y **cuál**
> de las muchas posibles se elige es la única decisión de diseño que hay aquí:
>
> ```sh
> # recorte ANTES de reducir, con desplazamiento: la franja y=240..1032
> sips -c 792 3168 --cropOffset 240 0 original.jpeg --out base.jpg
> sips -Z 2560 -s format jpeg -s formatOptions 65 base.jpg --out img/fondo-paginas.jpg
> ```
>
> ⚠️ **`--cropOffset` no es opcional.** `sips -c` recorta **centrado**, y el
> recorte centrado (y=276) no es el que se quiere. Hace falta elegir la Y.
>
> **El 240 está medido, no elegido a ojo.** El original tiene una sombra fuerte
> arriba a la izquierda y una banda oscura en el borde derecho; entre medias hay
> una meseta clara. Barriendo los desplazamientos posibles y midiendo la
> luminancia del **tercio central**, que es donde cae el título:
>
> | Desplazamiento | Tercio izquierdo | **Tercio central** | Tercio derecho |
> |---|---|---|---|
> | **240** | 0,488 | **0,712** | 0,427 |
> | 384 | 0,541 | 0,621 | 0,427 |
> | 480 | 0,615 | 0,612 | 0,426 |
> | 528 | 0,614 | 0,607 | 0,426 |
>
> El 240 deja el centro **mucho más claro** que cualquier otro —0,712 contra
> 0,61— al precio de un tercio izquierdo algo más oscuro, que es donde no hay
> texto. Los demás se parecen entre sí porque a partir de 384 la meseta ya ha
> quedado arriba del recorte.

> **La calidad 65 también está medida, y la métrica obvia engaña.** En una imagen
> tan lisa el riesgo no es perder detalle sino el **bloqueo 8 × 8** del JPEG, que
> en una superficie plana se ve como bandas. Contar «saltos bruscos» da el
> resultado al revés —sube con la calidad, porque conserva el grano del
> original—; lo que sirve es comparar el salto en los bordes de bloque contra el
> de dentro:
>
> | Calidad | Peso | Bloqueo a 2560 (nativo) | Salto absoluto | Ya escalada a 1440 |
> |---|---|---|---|---|
> | 55 | 35,6 KB | 7,08× | 0,38/255 | 0,15/255 |
> | 60 | 36,0 KB | 6,46× | 0,39/255 | 0,16/255 |
> | **65** | **45,9 KB** | **3,93×** | **0,48/255** | **0,24/255** |
> | 70 | 64,8 KB | 2,89× | 0,54/255 | 0,32/255 |
> | 75 | 74,0 KB | 2,23× | 0,62/255 | 0,39/255 |
>
> ⚠️ **El ratio de bloqueo asusta más de lo que debe**: el salto absoluto es de
> medio nivel sobre 255 en todos los casos, o sea invisible. Lo que lo infla es
> que el gradiente *dentro* del bloque es casi cero, no que el borde se vea.
>
> Y **al escalar se suaviza**: a 1440 la imagen se dibuja al 0,5625 y promedia
> los bloques. Medida la diferencia entre q55 y q75 ya escaladas: **máximo 5/255**,
> media 0,39/255. O sea que cualquiera valdría; 65 se elige porque es el codo de
> la curva y porque **en pantalla densa no hay reducción que suavice** —ahí los
> 2560 px se dibujan casi 1:1—.
>
> **Pesa 45,9 KB frente a los 130,7 de la imagen anterior**, un 65 % menos.

> ⚠️ **EL ORIGINAL NO ESTÁ EN EL REPOSITORIO, y sin él no se puede rehacer el
> recorte.** Es el único insumo del sitio del que no se guarda la fuente —el logo
> sí la tiene, en `img/logo_elderechoescrito.jpeg`—. Mientras no se guarde, lo
> único que permite reproducir esta imagen es el comando de arriba **más el
> archivo original**, que vive fuera del proyecto.

> ⚠️ **SE DESCARTÓ USAR EL FONDO DE LA PORTADA TAL CUAL, y conviene saber por
> qué antes de volver a intentarlo.** El de la portada no es una imagen de CSS:
> es un **`<video>`** con `img/portada-poster.jpg` de póster. Lo único
> reutilizable era el póster, y **es 1,79:1 contra los 7,42:1 de la banda**, así
> que `cover` enseñaba el 24 % central de su altura: la estatua salía
> **decapitada y cortada por las rodillas**, justo al lado del título.
>
> El contraste no era el problema —medido, 8,98:1, que pasa AA de sobra para un
> `h1` de 44 px—. Era la geometría. De ahí el recorte 4:1 propio.

**Dónde cae el texto importa más que cómo de clara sea la imagen**, y esta banda
lo demuestra en las dos direcciones.

Los manchones oscuros de la imagen están en los **bordes izquierdo y derecho**.
Mientras la mancheta llevaba el título a la izquierda y una entradilla a la
derecha, el texto caía justo encima: **1,68:1** y **1,02:1**, ilegible. Hizo
falta un velo blanco al 45 % para salvarlo, y aun así lavaba la imagen.

Con el título **centrado**, cae sobre la franja clara del medio y no hace falta
velo ninguno. El velo se retiró: protegía a un texto que ya no está ahí.

Medido sobre la imagen de hoy, el píxel más oscuro bajo la caja del `h1`,
muestreando el recorte **ya pintado** —se replica `cover` en un `<canvas>` con la
geometría real del elemento y se leen los píxeles de la caja del título—:

| Ancho de ventana | 375 | 768 | **901** | **1440** | 1920 |
|---|---|---|---|---|---|
| ¿Hay imagen? | **no** | **no** | sí | sí | sí |
| Peor contraste | 16,67:1 | 16,67:1 | **12,69:1** | **12,69:1** | 12,69:1 |

> ⚠️ **A 768 Y 375 NO HAY IMAGEN, Y ESO SORPRENDE AL MEDIR.** El fondo se declara
> dentro de `@media (min-width: 901px)` —está razonado en `styles.css`: por
> debajo no se pide el archivo y además `cover` recortaría una tira inútil—, así
> que ahí el `h1` cae sobre el blanco de la página y da **16,67:1**. Quien mida
> el contraste en móvil no está midiendo esta imagen.
>
> **Por encima de 901 el número no se mueve**, y tiene explicación: `cover`
> escala por el ancho en toda esa franja, así que el título siempre cae sobre el
> mismo punto del archivo. Lo que cambia con la ventana es cuánta imagen se ve a
> los lados, no lo que hay detrás del texto.

> **`background-position` sigue en `center`.** Con la imagen anterior se midieron
> cinco posiciones verticales y las cinco daban entre 11,6 y 12,4:1; con esta, el
> recorte ya se eligió para que el centro fuera la zona más limpia, así que mover
> la Y solo puede empeorarlo.

Una media de luminancia habría dicho las dos veces que no hacía falta velo,
porque la imagen es clara *de media*. **Lo que sirve es muestrear el recorte
real bajo cada caja de texto**, en cada ancho, porque `cover` cambia el encuadre
con la proporción de la caja.

> ✅ **AQUÍ HABÍA UNA GUARDA DE 450 px Y LA IMAGEN NUEVA LA DISUELVE.** Decía que
> a partir de ahí el título invadía los bordes oscuros: 12,71 a 450, **5,79 a
> 600 y 2,86 a 800, que ya no cumplía**. Y se avisaba de que `sobre/` estuvo a
> 32 px del límite cuando se titulaba «Sobre El Derecho Escrito» (417,8 px).
>
> Medido forzando títulos cada vez más anchos. La columna de la derecha es la
> **imagen de hoy**, remedida; las otras dos se conservan para ver la deriva:
>
> | Ancho del título | `fondo-cabecera` | veteado anterior | **la de hoy** |
> |---|---|---|---|
> | 160 px (el real) | 14,64 | 11,81 | **12,69** |
> | 450 px | 12,88 | 10,79 | **12,57** |
> | 600 px | 12,88 | 8,15 | **12,34** |
> | 800 px | 12,00 | 8,15 | **11,42** |
> | 1000 px | 5,56 | 6,61 | **10,64** |
> | 1200 px | **2,45** ✗ | 6,61 | **10,64** |
>
> **La de hoy no baja de 10,64 ni con un título de 1200 px**, más ancho que
> cualquier rótulo imaginable, y es la más plana de las tres: pierde 2 puntos de
> extremo a extremo donde la anterior perdía 5 y la primera 12. Es lo que se
> esperaba de una imagen sin motivo, y de haber elegido el recorte por la
> limpieza del centro.
>
> Así que el corte de 450 px sigue sin aplicar y `sobre/` no está al borde de
> nada aunque recupere un título largo.
>
> **Lo que no decae es el método**: si algún día se cambia la imagen, hay que
> volver a medir esta tabla. El número sale de muestrear, no de mirar.

> ⚠️ **AL IMPRIMIR NO SALE, Y LA REGLA VIVE EN `styles.css`, NO EN
> `imprimir.css`.** Las tres páginas con mancheta **no enlazan `imprimir.css`**:
> esa hoja la cargan solo las páginas de artículo, para el PDF. Así que
> `styles.css` es la única desde la que se puede apagar, y por eso tiene ahora
> su primer y único `@media print`.
>
> **Y hace falta decirlo explícitamente.** Los navegadores no imprimen imágenes
> de fondo por defecto, pero el usuario puede activar «gráficos de fondo», y
> entonces el `@media (min-width: 901px)` casa igual —el medio `print` también
> tiene ancho— y la banda saldría tintada.

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

El logo es **`img/logo.svg`**: un cuadrado redondeado en `--acento` con el rostro
vendado en blanco. Se usa en la cabecera, a la izquierda del nombre en versales,
y en la tarjeta de «Próximamente».

Sale de vectorizar con potrace el logo que entregó el cliente. Medido sobre el
original (1312×1199): **radio de esquina 90 px**, ajustado con detección de
borde subpíxel; la superelipse converge a **n = 2,00**, o sea que es una
circunferencia limpia y un `<rect rx>` la reproduce exacta.

**Pesa 15,6 KB** con `floatPrecision: 0` en svgo. Se midió: la precisión 2 pesa
109,8 KB y la 1 son 59,1, y la desviación entre la 0 y la 2 es de 2 333 píxeles
sobre 1,57 M al renderizar a tamaño completo. A 40 px no se distingue.

> ⚠️ **El color del archivo es `--acento` (#2F6E68), NO el del logo original.**
> El verde del JPEG es **#006E68**, muestreado sobre 678 000 píxeles de zona
> lisa. La diferencia está solo en el rojo —0 frente a 47—: G y B son idénticos.
> ΔE2000 = 3,26, por encima del umbral de percepción, así que puestos uno al
> lado del otro se distinguen. Se eligió `--acento` para no tener dos verdes.

### El logo va por background-image, nunca por mask

La balanza anterior se pintaba con `mask` + `currentColor`, que es lo correcto
para un icono de un trazo: hereda el color y no hay que duplicar el archivo.

**Con el logo eso no vale.** Una máscara se queda solo con el canal alfa, así que
el cuadrado verde con la figura blanca se aplanaría a un **rectángulo macizo**
del color del texto. Hay dos sitios y los dos usan `background`:

| Dónde | Regla | Caja |
|---|---|---|
| Cabecera | `.marca::before` | 1.64em × 1.5em (42,6 × 39 a 26 px) |
| «Próximamente» | `.tarjeta--proxima::before` | 46 × 44 px |

Efecto lateral: al soltar `currentColor`, **el logo ya no cambia de color al
pasar el ratón**. Es lo correcto para una marca, pero es un cambio respecto a la
balanza.

> **Va en `::before` y no en un `<img>`, y eso resuelve solo la accesibilidad.**
> Un pseudoelemento no entra en el árbol de accesibilidad, así que el lector de
> pantalla lee «El Derecho Escrito» **una vez**, la del texto del enlace. Con un
> `<img alt="El Derecho Escrito">` al lado lo diría dos veces.

> ⚠️ **PONER EL LOGO SUBIÓ LA CABECERA DE 72,2 A 80 px**, y eso arrastró cuatro
> números medidos. El logo mide 39 px de alto y la caja de texto de la marca
> 31,2, así que la cabecera crece esos 7,8 px:
>
> | | Antes | Ahora |
> |---|---|---|
> | Cabecera, una fila | 72,2 | **80** |
> | Cabecera, dos filas | 108,2 | **116** |
> | Corte del buscador | 944 | **959** |
> | Corte de dos filas | 724 | **740** |
> | `scroll-margin-top` ancho | 118 | **126** |
> | `scroll-margin-top` estrecho | 154 | **162** |
>
> Los dos cortes se movieron porque la marca es 15,3 px más ancha; los dos
> `scroll-margin` porque la obstrucción creció 7,8. Rebarrido: rompe a 959 y
> aguanta a 960; rompe a 740 y aguanta a 741. Aire del salto restaurado a ~16 px
> en los dos tramos.
>
> **Si se cambia el alto del logo, hay que rehacer los seis números.**

### Favicon

`favicon.svg` es la **versión simplificada** del logo: venda + perfil, sin los
mechones interiores. No es un recorte: son los paths 6 y 10 del trazado de
potrace, que resultaron ser exactamente la venda y el rostro.

**El logo completo no sirve de favicon.** Medido el porcentaje de píxeles de
tono intermedio —lo que emborrona una marca pequeña—:

| | 16 px | 32 px | 48 px |
|---|---|---|---|
| Logo completo | **40,2** | 23,0 | 16,9 |
| Favicon simplificado | 19,1 | **10,1** | **7,5** |

> ⚠️ **A 16 px no se reconoce como un rostro, y conviene saberlo.** Su 19,1 % es
> el mismo que tenía la balanza, pero nitidez no es legibilidad: la balanza a
> 16 px se leía como una balanza; esto se lee como una mancha. De 32 px en
> adelante funciona bien. Fue una decisión consciente del cliente.

Los PNG se generan con `@resvg/resvg-js` desde los SVG:

```sh
node r.mjs favicon.svg favicon-32.png 32
node r.mjs favicon.svg favicon-16.png 16
node r.mjs img/apple-touch-src.svg apple-touch-icon.png 180 '#2F6E68'
```

> ⚠️ **El apple-touch-icon va SIN esquinas redondeadas y opaco**, y por eso
> existe `img/apple-touch-src.svg`: es el favicon con el `rx` quitado. iOS
> aplica su propia máscara al icono, así que si se le da uno ya redondeado
> quedan huecos transparentes en las puntas.
>
> `qlmanage` de macOS **no sirve** para generar estos PNG: aplana la
> transparencia a blanco.

**No hay manifest**, así que no se han generado los 192/512.

### La tarjeta social ya lleva el logo

`og.svg` tenía el path de la balanza inline y ahora tiene el del logo, con los
dos elementos copiados de `img/logo.svg`: el `<rect rx="90">` y el `<path>` de
la figura.

**Va inline y no con `<image href>`** para que la tarjeta siga siendo un solo
archivo exportable sin arrastrar dependencias. Es el mismo criterio que tenía la
balanza.

| | Valor | De dónde sale |
|---|---|---|
| Alto del logo | **120 px** | 2,1 × la altura de mayúscula del logotipo (57 px) |
| Base | **y = 311** | la misma que tenía la balanza, así el hueco de 56 px al texto no se mueve |
| Escala | **0,100083** | 120 / 1199, el alto del logo original |

Se compararon 100, 120 y 140: con 100 el logo se queda pequeño al lado del
texto y con 140 le come protagonismo.

> ⚠️ **`og.png` NO se regenera con resvg, y esta es la trampa que cuesta caro.**
> El texto va en Cormorant Garamond, que **no está instalada en el sistema** y
> que el `@import` del SVG **solo resuelve un navegador**. resvg cae a Georgia:
> las letras salen más anchas y más pesadas, y la tarjeta cambia de aire.
>
> Se comprobó generando las dos y comparándolas.
>
> **Cómo se regeneró:** se conservó el `og.png` anterior —que sí tenía el texto
> en Cormorant—, se borró la zona de la balanza rellenándola con el fondo
> `#fbfaf7`, y se compuso encima el logo rasterizado con resvg:
>
> ```sh
> node r.mjs img/logo.svg /tmp/logo-120.png 120   # fitTo height
> # y en Python: pegar sobre og.png en (535, 191), tras limpiar (520,160)-(680,312)
> ```
>
> **Si algún día hay que rehacer el texto**, las opciones son instalar la fuente
> y usar resvg, o exportar `og.svg` desde un navegador. Lo que no vale es
> rasterizar con resvg tal cual.

### El publisher.logo apunta al logo, no a la tarjeta social

`img/logo-512.png` es un lienzo de **512×512 transparente con el logo centrado**
(512×468, con 22 px de margen arriba y abajo). Lo usa `publisher.logo` del
JSON-LD, en `index.html`, que es donde se define la `Organization` una sola vez.

Antes apuntaba a `og.png`, que es el **banner social de 1200×630**, no un
logotipo. Funcionaba, pero le estaba dando a Google una imagen que no es la
marca.

### Los archivos fuente y qué hacer con cada uno

En `img/` conviven el logo servido y tres fuentes que **no se sirven nunca** pero
que hay que conservar: sin ellas no se puede rehacer nada.

| Archivo | Qué es | Para qué sirve |
|---|---|---|
| `img/logo.svg` | **el logo, en producción** | cabecera y tarjeta de «Próximamente» |
| `img/logo-512.png` | **en producción** | `publisher.logo` del JSON-LD |
| `favicon.svg` | **en producción** | pestaña; es el logo simplificado |
| `favicon-16/32.png`, `apple-touch-icon.png` | **en producción** | respaldos de mapa de bits |
| `img/logo_elderechoescrito.jpeg` | original del cliente | **fuente de todo.** De aquí salieron el radio de 90 px y el verde medido |
| `img/logo-figura.svg` | trazado crudo de potrace | **fuente del favicon**: sus paths 6 y 10 son la venda y el rostro |
| `img/apple-touch-src.svg` | el favicon sin `rx` | **fuente del apple-touch-icon**, que va sin esquinas redondeadas |

> **Se borraron** `balanza.svg`, `favicon-balanza-anterior.svg`, las dos
> propuestas de favicon y `logo-figura.bmp` (1,7 MB, el intermedio de potrace).
> Comprobado antes: cero referencias vivas en HTML, CSS, JS, XML y SVG.

**Cómo se regenera cada cosa**, con `@resvg/resvg-js` —`qlmanage` de macOS **no
sirve**, aplana la transparencia a blanco—:

```sh
# favicon de mapa de bits
node r.mjs favicon.svg favicon-32.png 32
node r.mjs favicon.svg favicon-16.png 16

# apple-touch: OPACO y SIN redondeo, porque iOS aplica su propia máscara
node r.mjs img/apple-touch-src.svg apple-touch-icon.png 180 '#2F6E68'

# logo para el JSON-LD: 512 de ancho y luego centrar en un lienzo 512x512
node r.mjs img/logo.svg /tmp/logo-w512.png 512
```

> ⚠️ **`img/logo-figura.svg` no se puede borrar aunque parezca un intermedio.**
> El favicon NO es un recorte del logo: son dos de los veinte paths de ese
> trazado. Sin él no se puede rehacer ni ajustar.

---

## Deuda pendiente

- **Las tarjetas de ejemplo siguen puestas, y ahora conviven con contenido
  real.** Tres en la portada y tres entradas provisionales en el listado. Con un
  solo artículo de verdad se distinguían; con dos ya no tanto, y la portada
  enseña **cuatro** tarjetas de las que tres son atrezo. Se borran a mano —cada
  una tiene su sección— y el generador no las toca porque están fuera de las
  regiones marcadas.
- **El PDF no se regenera si solo cambia el CSS de impresión**, salvo que se
  lance `regenerar.yml` a mano. Es deliberado, pero es una de esas cosas que se
  olvidan: tocar `css/imprimir.css` y dar por hecho que los PDF publicados ya lo
  llevan.
- **El artículo de MASC está en `contenido/` sin que su publicación esté
  decidida.** Se creó para probar el generador con un texto real. Si no se
  publica, se borra su carpeta de `contenido/` **y** la de `articulos/`: el
  build no borra nada.
- Detalle menor: los trazos de la balanza en `favicon.svg` son marfil
  `#fbfaf7`, no el blanco puro que declara el sistema.
- Falta el bloque «Sobre el autor» en portada, que el cliente quiere y aún no
  existe en ninguna versión. La banda de newsletter ya está.
- ~~`sobre/index.html` tiene texto de relleno entre corchetes.~~ **RESUELTO**
  con los textos definitivos del cliente. Ya no queda ningún corchete en el
  sitio.

  ⚠️ **Y DESDE ENTONCES LA PÁGINA SE REESTRUCTURÓ ENTERA.** Era una columna de
  lectura —entradilla suelta, «Contenido» y «Sobre el autor»— y hoy son **dos
  filas**: «Enfoque» y «Contenido» a la par, y «Sobre el autor» debajo. Está
  descrito en su propia sección, más abajo.
- ~~Falta el CV.~~ **RESUELTO**: está en `documentos/` y se descarga desde dos
  sitios. Tiene su propia sección, más abajo.
- ~~La web no dice en qué materias ejerce~~ **RESUELTO, y con ello se cierra la
  contradicción que había aquí.** Se nombran en **tres** sitios: el titular del
  hero, la apertura de `sobre/` y su apartado «Contenido». Son Derecho
  administrativo, urbanismo y jurisdicción contencioso-administrativa, o sea las
  que la cabecera de este archivo daba por buenas.

  ⚠️ **Eran cuatro sitios y este apartado listaba dos del hero que ya no
  valen.** Decía «la línea de áreas del hero, su subtítulo, la apertura de
  `sobre/` y su apartado "Contenido"», y los dos primeros han decaído:

  | Sitio | Estado |
  |---|---|
  | línea de áreas del hero | **ya no existe** — se eliminó a propósito |
  | subtítulo del hero | **ya no las nombra**: dice «Derecho Público», «vía administrativa» y «ante los tribunales», que es una paráfrasis |
  | **titular del hero** | las nombra ahora, pero **solo dos**: Derecho Administrativo y Urbanismo |
  | apertura de `sobre/` | las tres |
  | apartado «Contenido» | las tres |

  O sea que **la jurisdicción contencioso-administrativa ya no se nombra en la
  portada**, solo en `sobre/`. No es un descuido que haya que reparar metiéndola
  de vuelta en el hero: los textos del hero son los que son y están registrados
  arriba. Se anota porque cambia dónde hay que mirar si algún día se revisa el
  discurso del sitio.

  Ojo a la **grafía del cliente**, que no es la que usa este archivo: él escribe
  «Derecho administrativo» y «jurisdicción contencioso-administrativa», con
  minúscula después de «Derecho». Se respeta tal cual en los textos.

  ⚠️ **Con una excepción, el hero**, que va en mayúscula por encargo —«Derecho
  Administrativo», «Derecho Público»— y está registrado en la sección de los
  textos visibles, al principio de este archivo. La regla sigue valiendo en todo
  lo demás. **No se corrige el hero a minúscula.**
- ✅ **Ya hay colegio y despacho**: Ilustre Colegio de la Abogacía de Madrid y
  Sterling Abogados, en `sobre/`. **Siguen faltando** número de colegiado,
  tarifas y plazos de respuesta, y no se inventan.
- **Ninguna de las dos suscripciones envía nada**, ni la banda de la portada ni
  la del lateral del artículo: comparten componente y las dos van sin `<form>`
  y con los controles deshabilitados, a propósito, para que no se pueda enviar
  por accidente. Al conectar backend hay que tocar las dos.

  ⚠️ **Y desde los textos definitivos, las dos NO dicen lo mismo.** El cliente
  dio una versión para cada una y se respetan:

  | | Portada (banda) | Artículo (lateral) |
  |---|---|---|
  | Título | Sigue las publicaciones de *El Derecho Escrito* | Sigue *El Derecho Escrito* |
  | Nota | **Recibirás** un correo con cada… | **Un correo** con cada… |

  El apoyo («Suscríbete para recibir…») y el placeholder («Correo electrónico»)
  sí son idénticos. La versión corta es la de la columna de 300 px.
- El formulario de contacto tampoco tiene backend: no envía nada. Su `action`
  apunta a `formspree.io/f/TU_ENDPOINT_AQUI`, que es literalmente un marcador.
- ✅ **El correo ya es real: `jcontera@icam.es`.** Aquí había un aviso de que
  `hola@elderechoescrito.es` no existía y era un marcador que se publicaba sin
  dar error. Ya no está en el HTML.

  **Lo que sigue vigente es la trampa**: la dirección se escribe **dos veces en
  la misma línea** —el `href` del `mailto` y el texto visible— y hay que cambiar
  las dos. Cambiar solo el texto deja un enlace que enseña una dirección y envía
  a otra, y eso no da ningún error.

  Sigue siendo la única dirección de correo del sitio: el `mailto` de los
  botones de compartir del artículo no lleva destinatario, solo asunto y cuerpo.
- `_headers` y `_redirects` son de Netlify. GitHub Pages los ignora. Se
  mantienen por si se mueve el hosting.

### Pendiente de consultar con el cliente

Textos visibles que **no venían en su documento** y siguen como estaban:

| Dónde | Qué dice hoy | Por qué preguntar |
|---|---|---|
| Portada | «ÚLTIMOS ARTÍCULOS», «VER TODOS LOS ARTÍCULOS →» | El documento los daba por buenos explícitamente |
| Portada · rótulo del destacado | **«LECTURA RECOMENDADA»** — decía «LA LECTURA RECOMENDADA» y se acortó **por encargo**, no por estilo. No devolverle el artículo | Ya no es «sigue como estaba»: cambió después del documento |
| Pie | «Contenido divulgativo. No constituye asesoramiento jurídico.» | Convive con el aviso nuevo del artículo, que dice lo mismo más largo |
| Formulario de `contacto/` | Etiquetas «Nombre», «Email», «Asunto», «Mensaje», botón «Enviar mensaje» | El documento solo daba la entradilla |
| Artículo de ejemplo | Cuerpo, titular, entradilla, `keywords`, `FAQPage` y sus metadatos | Se borra al entregar, así que no se reescribió nada de él |
| `sobre/`, apartado «Contenido» | Los tres puntos en `<strong>` | Confirmar que la negrita va solo en el término y no en la coma |

**Resuelto en pasadas posteriores** y por tanto fuera ya de esta lista: el menú
y el pie —ahora «Acerca de»—, el aviso de `sobre/` —ya en la fórmula del
artículo—, la bio corta del lateral, y los `<title>`, meta descriptions, Open
Graph, Twitter y JSON-LD de las cinco páginas indexables.

> ⚠️ **Lo que más pesaba de esta lista eran las meta descriptions y el JSON-LD**,
> que seguían anunciando «derecho penal, civil, constitucional, laboral y
> mercantil». Ya no. **Y había una copia más que no estaba apuntada aquí: el
> `<description>` del canal en `feed.xml`**, que un lector de RSS enseña igual
> que Google la meta description. Apareció al grepear las materias viejas, no
> revisando el HTML.
>
> Si algún día vuelve a cambiar el discurso del sitio, hay que buscar en los
> **cuatro** sitios: HTML visible, metadatos, JSON-LD y `feed.xml`.

### SEO de un artículo nuevo — la regla

| Campo | Regla |
|---|---|
| `<title>` | **El titular a secas, SIN sufijo de marca.** Con «\| El Derecho Escrito» —20 caracteres— cualquier titular real se pasa de 60. Consecuencia: **el titular debe medir ≤60** |
| `description` | **140–160** caracteres, resumen del artículo |
| `og:title` y `twitter:title` | Iguales que el `<title>` |
| `og:description` | Puede ser más corta que la meta; no hay límite duro |
| `article:section` y `articleSection` | La **categoría real**, y las dos tienen que coincidir |
| `keywords` | Frases largas de cola, propias del artículo. No son las etiquetas de navegación |
| `author.description` | **La bio corta**, idéntica a `.autor__bio` del lateral |

**De los siete campos, el generador escribe seis solo.** Lo único que hay que
darle en el JSON son `titulo` —o `titulo_seo`, si el titular pasa de 60— y
`descripcion`. Del resto:

- `og:title` y `twitter:title` salen del mismo valor que el `<title>`, así que
  no pueden discrepar.
- `og:description` y `twitter:description` salen de `descripcion`.
- `article:section` y `articleSection` salen los dos de `categoria`, que es la
  clave y no el texto, así que tampoco pueden discrepar.
- `keywords` sale del array `keywords`, que es un campo aparte de `etiquetas` a
  propósito. Está razonado arriba: son vocabularios distintos.
- `author.description` la escribe la plantilla, la misma cadena que pone en
  `.autor__bio`.

> ⚠️ **`titulo_seo` NO es un titular alternativo, y el nombre engaña.** Es lo
> que va en el `<title>`, en `og:title` y en el `name` del `WebPage` cuando el
> titular real no cabe en 60 caracteres. **El `<h1>`, la portada, las tarjetas y
> el `headline` del JSON-LD siguen usando `titulo`.**
>
> El de MASC lo necesita: el titular completo mide 82 y el `titulo_seo` 51.

> ⚠️ **El generador NO comprueba las longitudes, y podría.** Hoy un `<title>`
> de 80 caracteres pasa sin decir nada. Se dejó así porque la regla de los 60
> es una recomendación de Google que cambia, y un build que falla por eso
> bloquearía una publicación por un motivo que no es un error. **Si algún día
> molesta, el sitio donde añadirlo es `validar()` en `scripts/build.mjs`, y
> tiene que ser un AVISO, no un error.**

> ⚠️ **AQUÍ SE EXCEPTUABA EL ARTÍCULO DE EJEMPLO, Y YA NO HACE FALTA.** Su
> `<title>` medía 61, su `description` 184 y sus `keywords` eran de Derecho
> penal; se toleraba porque se borraba al entregar. **Ya está borrado**, así que
> la regla no tiene excepciones: el único artículo, el de MASC, la cumple con su
> `titulo_seo` de 51 caracteres.

---

# El generador de artículos

Convierte `contenido/articulos/<slug>/articulo.json` en todo lo que el sitio
necesita para que ese artículo exista: su página, su imagen, su PDF, su tarjeta
en el listado y en la portada, su URL en el sitemap y su `<item>` en el feed.

Lo dispara n8n abriendo un PR; también se ejecuta a mano.

> ⚠️ **ESTO NO CONVIERTE EL PROYECTO EN UN SITIO CON BUILD, Y LA DISTINCIÓN NO
> ES UNA SUTILEZA.** Lo que se publica sigue siendo HTML, CSS y JS puro, sin
> dependencias, servido tal cual por GitHub Pages. El generador escribe esos
> archivos **antes** y los deja en el repositorio; nadie compila nada en el
> servidor ni en el navegador del lector.
>
> La prueba: se puede borrar `scripts/` entero y el sitio sigue funcionando
> igual. Lo que se pierde es la comodidad de publicar, no la web.
>
> Quien lea «hay un generador» y deduzca que ya se puede meter un framework, un
> preprocesador o un componente que se hidrate en el cliente, ha leído justo lo
> contrario de lo que dice esta sección.

## Los cuatro comandos

```sh
cd scripts
npm install                        # una vez
npx playwright install chromium    # una vez, solo para PDF y capturas

npm run build       # HTML, imágenes, portada, listado, sitemap y feed
npm run pdf         # los PDF; LEE el HTML, así que va DESPUÉS del build
npm run publicar    # los dos, en orden. Es el que conviene usar
node capturas.mjs   # capturas a 1440 y 375 en scripts/.capturas/
```

Los tres primeros aceptan slugs para trabajar sobre uno solo:

```sh
npm run pdf -- masc-requisito-procedibilidad
```

> ⚠️ **`npm run pdf` NO regenera el HTML: lo lee del disco.** Si se edita el
> JSON y se ejecuta solo `pdf`, sale un PDF del texto anterior y **no avisa de
> nada**. Por eso existe `publicar`, que encadena los dos, y por eso el PDF se
> genera en el mismo job del workflow, detrás del build.

## El contrato: `articulo.json`

Un solo archivo por artículo, en `contenido/articulos/<slug>/`, junto a su
`portada.jpg`. **El nombre de la carpeta y el campo `slug` tienen que
coincidir**, y el build falla si no —es lo único que ata la URL al contenido.

> ⚠️ **EL EJEMPLO DE ABAJO NO ES EL ARTÍCULO REAL, aunque lleve su slug.** Está
> recortado y trae dos campos que el de MASC no tiene —`actualizado` y
> `destacado`—, puestos para enseñarlos. Van marcados en el propio bloque.
> **No se copia de aquí para comprobar qué hay publicado**: para eso está el
> JSON, y la tabla de «El estado de hoy» dice cómo leerlo.

```jsonc
{
  "slug": "masc-requisito-procedibilidad",
  "titulo": "La falta de MASC como requisito de procedibilidad: entre la inadmisión y la subsanación",
  "titulo_seo": "La falta de MASC como requisito de procedibilidad",
  "descripcion": "Cuándo la falta de intento de negociación previa permite inadmitir…",
  "entradilla": "La exigencia de negociación previa ha abierto una controversia…",
  "categoria": "jurisprudencia",
  "etiquetas": ["MASC", "LO 1/2025", "Procedibilidad"],
  "keywords": ["requisito de procedibilidad MASC", "LO 1/2025 negociación previa"],
  "fecha": "2026-09-28",
  "actualizado": "2026-10-15",   // ← INVENTADO: el artículo real no lo lleva
  "destacado": true,             // ← INVENTADO: el artículo real no lo lleva

  "secciones": [
    {
      "id": "introduccion",
      "numero_original": "I",
      "titulo": "Introducción",
      "bloques": [
        { "tipo": "parrafo",   "html": "Desde la entrada en vigor de la <strong>LO 1/2025</strong>… {{ref:1-2}}" },
        { "tipo": "subtitulo", "texto": "Un matiz" },
        { "tipo": "cita",      "html": "«En todo caso, la decisión de archivo directo es precipitada».",
                               "fuente_html": "— AAP Alicante 48/2025 {{ref:6}}" },
        { "tipo": "lista", "ordenada": true, "items": [
            { "marcador": "1.º", "html": "La inexistencia de cualquier intento negociador previo." }
        ]}
      ]
    }
  ],

  "referencias_titulo": "Referencias",
  "referencias": [
    { "grupo": "Normativa", "items": [
        { "numero": 1, "html": "Ley Orgánica 1/2025, de 2 de enero…" },
        { "numero": null, "html": "Ley Orgánica 6/1985, del Poder Judicial." }
    ]}
  ],

  "imagen": {
    "archivo": "portada.jpg",
    "alt": "Estatua de bronce de la dama de la justicia…",
    "origen": "cliente"
  },

  "avisos": ["Errata del original: …"]
}
```

### Campos, uno por uno

| Campo | ¿Obligatorio? | Qué hace |
|---|---|---|
| `slug` | **sí** | la URL. Tiene que ser el nombre de la carpeta |
| `titulo` | **sí** | `<h1>`, tarjetas, destacado, `headline` del JSON-LD |
| `titulo_seo` | no | solo `<title>`, `og:title` y `name` del `WebPage`. Para titulares de más de 60 |
| `descripcion` | **sí** | meta description, OG, extracto de las tarjetas y entradilla del destacado |
| `entradilla` | **sí** | el párrafo de apertura del artículo. **No es lo mismo que `descripcion`** |
| `categoria` | **sí** | una de `ensayos`, `fundamentos`, `jurisprudencia`. En **clave** y en PLURAL, no en texto |
| `etiquetas` | no | texto visible. De aquí salen las píldoras, `data-etiquetas` y el desplegable |
| `keywords` | no | frases de cola para `article:tag` y el JSON-LD. **No son las etiquetas** |
| `fecha` | **sí** | `YYYY-MM-DD`. Ordena el listado y fija la hora de publicación a las 09:00 +02:00 |
| `actualizado` | no | `YYYY-MM-DD`. La revisión posterior. **Sin él se usa `fecha`**: la línea «Última actualización» se ve siempre |
| `destacado` | no | `true` fuerza la lectura recomendada. Sin ninguno, manda el más reciente |
| `secciones` | **sí** | los `<h2>` y su contenido |
| `referencias` | no | agrupadas o sueltas |
| `imagen` | **sí** | `archivo`, `alt` |
| `avisos` | no | notas para quien revise el PR. Se imprimen y se comentan; no salen en la web |

#### «Última actualización» SE VE SIEMPRE, y el campo `actualizado` solo cambia qué fecha pone

> ⚠️ **ESTA SECCIÓN SE TITULABA «es opcional de verdad» Y DECÍA QUE SIN EL CAMPO
> LA PÁGINA SALÍA EXACTAMENTE IGUAL. Ya no.** Hoy la línea se enseña en **todos**
> los artículos. Si el JSON no trae `actualizado`, se usa la fecha de
> publicación.
>
> **Es un encargo del cliente**, que echaba en falta la línea en el artículo de
> MASC —el único publicado, y no trae el campo—.

El campo sigue siendo **opcional en el JSON**; lo que ha dejado de ser opcional
es la línea en la página. `derivar()` resuelve el valor una vez:

```js
const actualizado = art.actualizado || art.fecha;
```

y de ahí salen **cinco** sitios:

| Dónde | Qué pone |
|---|---|
| la ficha del artículo | un `<time class="actualizado">` con «Última actualización: …» |
| **la primera página del PDF** | la misma línea, en la ficha del bloque de título |
| **`/ModDate` del PDF** | la marca `D:AAAAMMDD…` del diccionario `/Info` |
| JSON-LD | `dateModified` |
| Open Graph | `<meta property="article:modified_time">` |
| `sitemap.xml` | `<lastmod>` |

> **De los seis, cuatro no cambian de valor al hacer esto.** `dateModified`,
> `article:modified_time`, `<lastmod>` y `/ModDate` **ya caían a la fecha de
> publicación** cuando no había campo: era `actualizado || art.fecha` escrito en
> cada consumidor. Lo único que estrena valor es lo que se ve —la ficha del
> artículo y la línea del PDF—, que antes no se pintaban.
>
> Por eso el diff del HTML de MASC es **una sola línea añadida**, y el del
> sitemap, el feed y el JSON-LD es **cero**.

> ⚠️ **Y `art.actualizado` YA NO PUEDE SER NULO**, lo que deja sin sentido los
> `|| art.fecha` que había aguas abajo. Se retiró el de `conFechasFijas()` en
> `pdf.mjs`; si aparece otro, es código muerto que sugiere un caso que ya no
> existe.

> ⚠️ **EL `<pubDate>` DEL FEED NO SE TOCA, Y NO ES UN OLVIDO.** En RSS 2.0
> `pubDate` es **la fecha de publicación** y no hay ningún campo de modificación
> por `<item>`: eso es de Atom. Ponerle ahí la fecha de revisión volvería a
> anunciar el artículo como nuevo en todos los lectores, que es justo lo que no
> se quiere.
>
> Si algún día se quiere exponer la revisión en el feed, la vía es
> **`<atom:updated>`** —el espacio de nombres `xmlns:atom` **ya está declarado**
> en `feed.xml`— y es una decisión aparte, no parte de este campo.

> ⚠️ **AQUÍ SE DESCARTABA UNA `actualizado` IGUAL A `fecha`, Y ESA DECISIÓN
> DECAE ENTERA. HAY QUE LEER ESTO ANTES DE «ARREGLAR» LO QUE SE VE HOY.**
>
> Decía que una actualización igual a la publicación se trataba como si no
> existiera, porque la ficha leería
>
> > 28 DE SEPTIEMBRE DE 2026 · ÚLTIMA ACTUALIZACIÓN: 28 DE SEPTIEMBRE DE 2026
>
> o sea «un dato que ocupa sitio y no dice nada, y que además **parece un fallo
> del generador** más que una decisión del autor».
>
> **Ese efecto es exactamente lo que se ve hoy en el artículo de MASC**, que no
> trae el campo y por tanto repite su fecha de publicación. El razonamiento
> seguía siendo correcto; lo que pasa es que el cliente prefiere ver la línea
> siempre, y es su decisión. **No es un descuido y no hay que revertirlo.**
>
> ✅ **Con ello se retiró también el aviso de `validar()`**, que decía que esa
> fecha «NO se va a mostrar». Había dejado de ser verdad. Hoy escribir
> `actualizado` igual a `fecha` da el mismo resultado que no escribirlo, así que
> no hay nada de lo que avisar.
>
> **Si algún día se quiere volver a distinguir los dos casos**, la vía NO es
> reponer el descarte en `derivar()` —eso devuelve el artículo de MASC a no
> enseñar nada—, sino cambiar el TEXTO cuando las dos fechas coinciden. Pero eso
> es otro encargo.

> ⚠️ **Y una `actualizado` ANTERIOR a `fecha` es un ERROR que para el build.**
> No es un problema de formato sino de sentido —un artículo no se actualiza
> antes de existir— y publicaría un `dateModified` previo al `datePublished`.

> ⚠️ **LA VALIDACIÓN COMPRUEBA QUE LA FECHA EXISTE, NO SOLO SU FORMA, Y ESO
> ARREGLA DE PASO UN AGUJERO QUE TENÍA `fecha`.** El control era un
> `/^\d{4}-\d{2}-\d{2}$/` a secas, así que **`2026-13-45` pasaba**. Lo que
> publicaba, sin un solo error:
>
> | Dónde | Qué salía |
> |---|---|
> | la ficha | **«45 de undefined de 2026»** |
> | `<time datetime>` | `2026-13-45T09:00:00+02:00` |
> | `dateModified` | `2026-13-45T09:00:00+02:00` |
> | `<lastmod>` | `2026-13-45` |
>
> El «undefined» sale de `MESES[12]`, que no existe. Lo ve cualquiera que mire
> la página; los otros tres no los ve nadie hasta que un buscador los descarta.
>
> Lo cierra `fechaValida()` en `build.mjs`, que comprueba el día contra el mes
> de verdad —bisiestos incluidos: `2028-02-29` pasa y `2026-02-30` no—. **Se
> aplica a los dos campos**: dejar `actualizado` estricto y `fecha` laxo habría
> sido una incoherencia peor que cualquiera de las dos.

> **La ficha lo pinta con el patrón de la casa, no con un `<svg>` suelto.** El
> icono —dos flechas en círculo— va por `mask` en `::before`, como el
> calendario, el reloj y la persona, y está razonado en `styles.css`: un
> pseudoelemento no entra en el árbol de accesibilidad, así que no hay ningún
> `aria-hidden` del que acordarse.
>
> El selector es `.entrada__meta time.actualizado::before`, con la clase
> **además** del elemento: es un `<time>`, así que ya le ha caído el calendario,
> y los (0,2,2) ganan a los (0,1,2) de la regla general **por especificidad y no
> por orden**, así que aguanta si alguien reordena el archivo.

> **En móvil envuelve, y se ha medido el peor caso.** La fila es flex con
> `flex-wrap`, así que a 375 px cada dato cae en su línea. Con el mes más largo
> —«30 de septiembre de 2026»— el bloque mide **327 px exactos**, justo el ancho
> de la columna, y parte a dos líneas sin desbordar ni provocar scroll
> horizontal. Verificado.

#### Los separadores de la ficha, y por qué la actualización va en su fila

La ficha lleva barras `|` entre sus datos, **la misma regla que la portada**,
agrupada con ella. Pero el artículo tiene dos cortes propios, los dos medidos.

> ⚠️ **«ÚLTIMA ACTUALIZACIÓN» VA SIEMPRE EN SU PROPIA FILA, Y NO ES UNA
> PREFERENCIA: NO CABE AL LADO A NINGÚN ANCHO.** Medido con el mes más largo
> sobre el artículo de MASC:
>
> | | px |
> |---|---|
> | fecha | 198 |
> | minutos | 145,3 |
> | **«Última actualización: 30 de septiembre de 2026»** | **367,3** |
> | con los dos huecos de 12 | **734,6** |
>
> Y la columna topa en los **720** de `.articulo__principal`. O sea que
> envolvería igual en un monitor de 2560: lo que la limita es el ancho de
> lectura, no la ventana.
>
> **Con meses cortos sí cabría** —«5 de mayo de 2026» baja la suma a ~667— y esa
> es justamente la razón de forzarlo: un diseño que se coloca distinto según el
> mes que lleve la fecha no se puede revisar ni explicar. Lo resuelve
> `flex-basis: 100%` en `.actualizado`.
>
> **Si alguien quiere los tres en una línea, como el mockup, la palanca es
> acortar el rótulo** —«Actualizado: 30 sep 2026»—, no tocar el `max-width` de
> la columna, que está puesto por legibilidad.

> ⚠️ **Con ella se va la barra que la precede**, o se queda colgando al final de
> la primera línea. La apaga `.articulo__ficha > :has(+ .actualizado)::after`,
> que apunta al elemento **que tenga `.actualizado` justo detrás** en vez de a
> `.lectura` por su nombre: si cambia el orden de la ficha, la regla sigue
> sirviendo sola.

> ⚠️ **Por debajo de 748 px no hay separadores, y el número está medido.** Ahí
> abajo la ficha gana la firma —aparece por debajo de 900— y la fila pasa a
> pedir **582,9 px**: firma 215,6 + fecha 198 + minutos 145,3 y sus dos huecos.
> La columna es la ventana menos 48, así que **envuelve por debajo de ~631** y
> vuelve la barra colgando.
>
> El corte va en el **748 que ya existe** —el de las tarjetas— y no en 631:
> entre esos dos anchos la fila aún cabe de una pieza, pero vale más pasarse de
> prudente que atar el corte al largo de la fecha y del nombre del mes.
> Perderse una barra decorativa no se nota; una barra colgada sí.

> ⚠️ **ESTE BARRIDO TENÍA DOS COLUMNAS —«sin `actualizado`» y «con»— Y YA SOLO
> HAY UN CASO**, desde que la fila se enseña siempre. La columna de «sin» no
> describe ningún artículo posible.

Barrido de verificación, remedido con la fila ya permanente:

| Ancho | Qué se ve |
|---|---|
| 1440 / 1280 | `fecha \| minutos` + fila propia |
| 901 | `fecha \| minutos` + fila propia |
| 900 | `firma \| fecha \| minutos` + fila propia |
| **749** | `firma \| fecha \| minutos` + fila propia |
| **748** | sin barras, una fila + fila propia |
| 375 | sin barras, **cuatro** filas |

**Cero separadores colgando en los seis casos.** Se comprueba mirando si el
*último elemento de cada fila renderizada* tiene `::after`, que es lo único que
distingue una barra correcta de una colgada; contar hijos no sirve, porque el
envoltorio no cambia el DOM.

> **Lo que el cambio NO movió:** el corte de 748 sigue cayendo donde caía
> —verificado a 749 con barras y a 748 sin ellas—, y a 375 la línea sigue
> midiendo **327 px exactos**, el ancho de la columna, partida en dos líneas sin
> desbordar ni provocar scroll horizontal. La ficha pasa de 3 filas a 4, y de
> 50,4 px de alto a 132.

> ⚠️ **`descripcion` y `entradilla` NO son el mismo texto, y confundirlas no da
> ningún error.** La `descripcion` es el resumen de 140–160 caracteres que ven
> Google y las tarjetas; la `entradilla` es el párrafo con el que abre el
> artículo, escrito por el autor y normalmente más largo.
>
> Ponerlas iguales «funciona»: la página se genera, se ve bien y la entradilla
> se lee como un resumen seco. Solo se nota leyendo.

> ⚠️ **`categoria` va en CLAVE y `etiquetas` en TEXTO VISIBLE, y es al revés de
> lo que parece.** Es la misma asimetría que el CLAUDE.md ya documenta para
> `data-categoria` y `data-etiquetas`, y por el mismo motivo: la clave de una
> etiqueta no permite reconstruir sus tildes. Escribir `"categoria":
> "Jurisprudencia"` hace fallar el build, que es el modo de fallar bueno.

### Los bloques

Cuatro tipos, y no hay un quinto por ahora. Añadir uno es añadir un caso a
`pintarBloque()` en `scripts/lib/plantilla.mjs`; el build falla con el nombre
del tipo si le llega uno que no conoce.

| `tipo` | Campos | Sale como |
|---|---|---|
| `parrafo` | `html` | `<p>` |
| `subtitulo` | `texto` | `<h3>`. **Texto plano, no HTML** |
| `cita` | `html`, `fuente_html` | `<blockquote>` y su `.cita__fuente`. **La clase la elige el generador** — ver abajo |
| `lista` | `ordenada`, `items[{marcador, html}]` | `<ul>`/`<ol>`, o `.lista--marcada` si hay marcadores |

#### Las citas tienen DOS estilos y los elige el generador

**El cliente no marca nada en el Word.** Lo decide `claseDeCita()` en
`plantilla.mjs`, a partir del propio texto:

| Clase | Qué es | Aspecto |
|---|---|---|
| `.cita--destacada` | una frase que se **mira** | Cormorant 25,6 px, comilla de apertura en acento, `--tinta` |
| `.cita--extracto` | un pasaje que se **lee** | Source Serif 16 px, filete lateral en acento, `--tinta-suave`, sin comilla |

**El criterio: más de 40 palabras, o cualquier salto de línea.**

> ⚠️ **LAS DOS MITADES HACEN FALTA Y NINGUNA SOBRA.** Por largo, porque una cita
> de 113 palabras no es un reclamo aunque vaya en un solo párrafo —son 28 líneas
> en un móvil—. Por **salto de línea**, porque una cita de dos puntos separados
> por `<br>` es un documento **por estructura**, no por tamaño: es el caso de la
> cita 2 de MASC, que con 37 palabras se escaparía del umbral.

> ⚠️ **EL 40 NO ES UN NÚMERO FRÁGIL, y conviene saberlo antes de afinarlo.** Las
> citas reales de MASC se reparten en **37 (con `<br>`), 113, 115, 174 y 579**:
> no hay ninguna entre 40 y 112. **Cualquier umbral entre 38 y 112 clasifica el
> artículo exactamente igual**, así que el resultado no depende de haber
> acertado el número.
>
> Lo que lo fija en 40 es el otro extremo: es lo que ocupa una frase larga de una
> sola oración, que es lo que un reclamo puede llegar a ser.
>
> Se cuenta en **palabras** y no en caracteres porque es la unidad que el build
> ya usa para los minutos de lectura. Con caracteres —246, 669, 727, 1049,
> 3686— el reparto sale idéntico.

**Qué lo motivó, medido a 375 px antes del cambio:**

| Cita | Palabras | Alto | Líneas | % del documento |
|---|---|---|---|---|
| 1 | 113 | 968 px | 28 | 2,6 % |
| 2 | 37 | 415 px | 12 | 1,1 % |
| 3 | 174 | 1 590 px | 46 | 4,2 % |
| **4** | **579** | **5 529 px** | **160** | **14,7 %** |
| 5 | 115 | 1 071 px | 31 | 2,8 % |
| | | **9 572 px** | | **25,5 %** |

Una cuarta parte del artículo eran citas en cuerpo de titular, y la cuarta sola
medía **6,8 pantallas de móvil**. Después:

| | Antes | Después |
|---|---|---|
| Altura de las citas a 375 | 9 572 px | **5 133 px** (−46 %) |
| Peso en el documento | 25,5 % | **15,5 %** |
| Altura del artículo a 375 | 37 607 px | **33 024 px** (−12,2 %) |
| Páginas del PDF | 14 | **13** |

> **El extracto no estrena casi nada**: es el `blockquote` base que `styles.css`
> ya tenía —filete de 2 px en acento, sangría, `--tinta-suave`— con tres
> cambios. **Redonda** en vez de cursiva, porque un pasaje de 579 palabras en
> cursiva se lee peor y en papel todavía peor, y la convención académica para
> una cita en bloque larga es redonda. **Cuerpo 1rem (16 px)**, que es «algo
> menor» que los 18 del cuerpo sin estrenar un escalón: es el tamaño raíz del
> documento. E **interlineado 1,7**, el mismo del cuerpo, porque es texto para
> leer seguido.
>
> **Sin comilla de apertura**, y es deliberado: el filete ya dice que es una
> cita, y una comilla de 3,6rem sobre un pasaje de varias líneas compite con el
> texto en vez de introducirlo. La comilla es un recurso de reclamo.
>
> **La negrita del original se respeta sola**: no se toca `font-weight`, así que
> los `<strong>` del texto del cliente salen como vienen.

> ⚠️ **LA DESTACADA TAMBIÉN BAJA EN MÓVIL, de 25,6 a 22,4 px.** A 375 la columna
> son 327 px, y a 1,6rem una frase de reclamo cae en ~3 palabras por línea: deja
> de leerse como una frase y pasa a leerse como una lista vertical. El corte es
> el **600** que ya usa el cuerpo del artículo, no uno nuevo.

> ⚠️ **EN EL PDF EL EXTRACTO SÍ SE PUEDE PARTIR, al revés que la destacada.** El
> `break-inside: avoid` de la destacada tiene sentido —son dos o tres líneas y
> partirla le quita la comilla, que es lo único que la identifica—. Un extracto
> de 579 palabras ocupa varias páginas, así que prohibirle el salto lo empujaría
> entero a la siguiente y dejaría media página en blanco antes: el mismo fallo
> que ya razona la caja de referencias. Lo que sí se protege es cada línea, con
> `orphans`/`widows` a 2.

> ⚠️ **LA FUENTE DE LA CITA SE ALINEA CON LA SUYA, Y SON DOS SANGRÍAS DISTINTAS.**
> Los 54 px de `.cita__fuente` son los que deja la comilla de apertura, y un
> extracto no la tiene. Sin corregirlo, la fuente quedaba **32 px más adentro**
> que la cita que atribuye.
>
> Se engancha con `.articulo .cita--extracto + .cita__fuente` —hermano
> adyacente— y no con una clase propia, porque la fuente siempre va pegada a su
> cita: así no hay dos sitios que mantener sincronizados ni una clase que se
> pueda olvidar al escribir el JSON. **Con el prefijo `.articulo`**, que lo deja
> en (0,3,0) y le hace ganar por especificidad y no por orden.

El `html` de los bloques **es HTML de verdad y no se escapa**: ahí van los
`<strong>`, `<em>` y `<a>` del texto. Lo que sí se escapa es todo lo demás
—títulos, `alt`, metadatos—, porque son texto.

> **Los marcadores tipo «1.º» se escriben, y no los pone un `<ol>`.** Un `<ol>`
> nativo sabe poner `1.`, `a)` o `i.`, pero no la ordinal masculina española. Si
> algún item trae `marcador`, la lista pasa a `.lista--marcada`, que apaga el
> `list-style`, y la marca va en un `<span>`.
>
> El colgado se hace con sangría francesa y no con flex: así, cuando un item
> ocupa varias líneas, la segunda alinea con la primera palabra y no con el
> marcador.

### Las referencias y sus llamadas

Se escriben con **tokens**, no con HTML:

| En el JSON | Sale como |
|---|---|
| `{{ref:7}}` | `[7]` |
| `{{ref:1-2}}` | `[1–2]` — guion corto al escribir, **raya al pintar** |
| `{{ref:1,6}}` | `[1, 6]` |

**Cada número es su propio enlace**, aunque vayan en rango: `[1–2]` son dos
anclas, no una. Los corchetes, la raya y la coma los escribe la plantilla
**fuera** de los `<a>`, para que no formen parte ni de la superficie pulsable ni
del texto del enlace.

```html
<sup class="llamada" aria-label="Referencias 1, 6">[<a href="#ref-1">1</a>, <a href="#ref-6">6</a>]</sup>
```

> ⚠️ **Citar un número que no existe ES UN ERROR y detiene el build; declarar
> una referencia y no citarla es solo un aviso.** No es una asimetría caprichosa:
>
> - Una llamada a una referencia inexistente produce **un enlace roto en la
>   página publicada**. Es un fallo del sistema y hay que pararlo.
> - Una referencia declarada y nunca citada es una **errata del texto**. El
>   artículo se publica perfectamente; lo que hay es una entrada de bibliografía
>   de más. Parar el build por eso sería bloquear una publicación por una
>   decisión que es del autor.
>
> El artículo de MASC tiene tres —`[4]`, `[5]` y `[11]`—, detectadas solas.

> ⚠️ **Una referencia puede ir SIN número, y entonces no se puede citar.** Es el
> caso de la LOPJ en el artículo de MASC: `"numero": null`. Sale en la lista,
> sin marca y **sin `id`**, porque un ancla a la que nadie puede apuntar no
> sirve de nada.
>
> Es una errata del original y está anotada en `avisos`. Se conserva tal cual
> porque **el texto del cliente no se corrige por iniciativa propia**, que es la
> regla que abre este archivo.

> **Las referencias van en `<ul>` y no en `<ol>`, y NO es un descuido.** El
> número de una referencia es un **dato del texto** —el que aparece entre
> corchetes en la llamada— y no una posición en la lista. Con un `<ol>` los dos
> números pueden separarse en silencio: basta una referencia sin número, como la
> LOPJ, para que el `<ol>` siga contando y a partir de ahí enseñe un número que
> no es el que citan las llamadas.
>
> Así que la numeración se escribe, en `.ref__numero`, y la lista no cuenta.

> ⚠️ **`.referencias__grupo` va prefijado con `.referencias` en las DOS hojas de
> estilo.** Es un `<h3>`, y `.articulo h3` —que lo pone en Cormorant a 24 px—
> pesa (0,1,1) frente a los (0,1,0) de la clase sola: gana por especificidad, no
> por orden, así que ponerlo después no basta.
>
> **Se vio antes en el PDF que en pantalla**: «DOCTRINA» salía en versales
> —el `text-transform` sí se aplicaba— pero con el cuerpo y la familia de un
> epígrafe de sección, y parecía un apartado nuevo dentro de la caja.

### El tiempo de lectura se calcula, a 200 ppm

`minutosDe()` divide las palabras del texto visible entre 200 y redondea hacia
arriba, con un mínimo de 1. Se descuentan las etiquetas y los tokens de
referencia, que no se leen.

> ⚠️ **ESTE NÚMERO ES NUEVO Y NO REPRODUCE NADA.** El artículo escrito a mano
> decía «7 min de lectura» y declaraba `wordCount: 950`, pero tiene **639
> palabras reales**: el ritmo implícito era de 91 ppm, que no es una medida de
> nada. Eran cifras de maqueta.
>
> Al generarlo, ese artículo pasa a **4 min** y el de MASC sale en **15**, con
> 2 853 palabras. Si alguien compara con una versión anterior y ve que los
> minutos «han bajado», es esto.

## Cómo se actualizan los archivos compartidos: regiones marcadas

El generador **no reescribe entero** ningún archivo que tenga contenido escrito
a mano. Solo sustituye lo que hay entre dos marcas:

```html
<!-- GENERADO:ultimos inicio — … -->
   …lo que escribe el build…
<!-- GENERADO:ultimos fin -->
```

Hay **siete** regiones:

| Archivo | Región | Contenido |
|---|---|---|
| `index.html` | `destacado` | la pieza de «Lectura recomendada» |
| `index.html` | `ultimos` | las tarjetas de «Últimos artículos» |
| `articulos/index.html` | `filtros` | los botones de categoría |
| `articulos/index.html` | `articulos` | las tarjetas del listado |
| `articulos/index.html` | **`itemlist`** | **el `ItemList` del JSON-LD, en el `<head>`** |
| `sitemap.xml` | `articulos` | las `<url>` |
| `feed.xml` | `articulos` | los `<item>` |

> **Por qué regiones y no reescribir el archivo.** `index.html` y
> `articulos/index.html` están llenos de decisiones medidas y comentadas —los
> 448 px del destacado, las dos trampas del enlace extendido, los cortes de
> cabecera— y de bloques escritos a mano como el hero. Un generador que
> escribiera el archivo entero se los llevaría por delante, y habría que
> mantener todo eso en una plantilla, o sea en un sitio donde no se ve al leer
> la página.

#### El `ItemList` del listado YA es una región, y va en DOS `<script>`

> ✅ **ESTA SECCIÓN DECÍA QUE ERA MANUAL Y QUE HABÍA QUE TOCARLO A MANO. YA NO.**
> El `ItemList` del `<head>` de `articulos/index.html` es la **séptima región**,
> `GENERADO:itemlist`, y lo escribe `bloqueItemList()` en `plantilla.mjs` a
> partir de los mismos datos que las tarjetas. No se puede desincronizar.
>
> Aquí se decía que había que actualizar `numberOfItems`, la `url` y el `name`
> al añadir y al borrar. **Ya no hay que tocar nada**, y `numberOfItems` se
> cuenta en vez de escribirse, que era el campo que más fácil se quedaba atrás.

**Mordió una vez, y por eso se convirtió:** al eliminar el artículo de ejemplo,
el `ItemList` se quedó declarándole a Google una URL que pasaba a dar 404.
Portada, listado, sitemap y feed se corrigieron solos porque eran regiones.
Este no, y no se ve leyendo la página ni probándola: es metadato.

> ⚠️ **VA EN SU PROPIO `<script>`, SEPARADO DEL `CollectionPage`, Y ESO NO ES
> COSMÉTICO: es lo que hace posible que sea una región.**
>
> Los dos vivían en un solo `<script type="application/ld+json">` compartiendo
> un `@graph`. Ahí **no se podía marcar**: las marcas de región son comentarios
> HTML, y un `<!-- -->` dentro de un bloque `ld+json` **rompe el JSON**. El
> bloque entero deja de parsear y la página se queda sin datos estructurados,
> sin dar ningún error visible.
>
> Partirlo en dos es estándar: varios bloques `ld+json` en la misma página son
> válidos y el buscador los fusiona. El reparto es el que tiene sentido:
>
> | Bloque | Qué es | Quién lo escribe |
> |---|---|---|
> | `CollectionPage` | descripción de la página | **a mano** |
> | `ItemList` | la lista de artículos | **el build** |
>
> **Quien vuelva a juntarlos en un `@graph` rompe la región**, y el build
> fallará diciendo que faltan las marcas — que es el modo de fallar bueno.

Comprobado de las tres formas: corrompiendo el `ItemList` a propósito —el build
lo repara—, quitándole una marca —el build falla— y verificando que los dos
bloques parsean por separado.

> ⚠️ **QUE FALTE UNA MARCA ES UN ERROR, NO UN AVISO.** Si alguien borra un par
> de marcas, el build **falla**. Es deliberado: sin eso, el generador dejaría de
> actualizar ese sitio **en silencio**, y el primer síntoma sería una portada
> que no cambia al publicar.

> ⚠️ **Las tarjetas de EJEMPLO están FUERA de la región a propósito.** Las tres
> de la portada y las tres entradas provisionales de `articulos/index.html`
> viven fuera de las marcas, así que el build ni las toca ni las cuenta. Por eso
> hoy la portada enseña cuatro tarjetas —tres de ejemplo más la real— y el
> listado dice «5 artículos publicados».
>
> **Se borran a mano cuando toque**, como ya documentan sus propias secciones.
> El generador no puede borrarlas y no debería: no sabe distinguir una tarjeta
> de atrezo de una escrita a mano a propósito.

## Es idempotente, y eso hay que mantenerlo

Ejecutar **`build` y `pdf`** dos veces da exactamente el mismo resultado. Se
comprueba en el workflow del PR, y falla si no.

> ⚠️ **ESTA SECCIÓN DECÍA «el build», Y ERA MEDIA VERDAD QUE COSTÓ UN BUCLE.**
> El gate del workflow corría `npm run build` dos veces, pero **el PDF no lo
> escribe build: lo escribe `pdf`**, así que el PDF nunca entraba en la
> comprobación. Hoy el paso se llama «Comprobar que build y pdf son
> idempotentes» y encadena los dos. Está contado abajo, en «El PDF».

Tres cosas lo garantizan y ninguna es opcional:

1. **El orden es determinista**: fecha descendente, y el `slug` desempata. Sin
   el desempate, dos artículos del mismo día podrían salir en distinto orden
   según el sistema de archivos.
2. **Ninguna fecha sale del reloj.** Ni la del `<time>`, ni la del `pubDate` del
   feed, ni la del `lastmod` del sitemap, ni la del `dateModified` del JSON-LD:
   todas vienen del campo `fecha`.
3. **Tampoco las de dentro del PDF**, que son las que se escapan porque no se
   ven: `/CreationDate` y `/ModDate` del diccionario `/Info`. Las normaliza
   `pdf.mjs` a la fecha del artículo.

> ⚠️ **Por eso `headerTemplate` del PDF va vacío y no se quita.** Chromium, sin
> plantilla de cabecera, pinta la suya: el título de la página y **la fecha del
> día**. Eso cambiaría el PDF en cada ejecución.
>
> **Pero eso solo tapa la fecha que se IMPRIME**, y durante un tiempo se dio por
> hecho que con eso bastaba. La otra va en los metadatos y no se ve al abrir el
> documento: ver el punto 3.

> **Y por eso se escribe solo si cambia.** `escribirSiCambia()` compara antes de
> tocar el disco, así que una pasada sin novedades no modifica ninguna marca de
> tiempo y el `git status` sale limpio.

## El PDF

`npm run pdf` abre con Chromium la página **ya generada** y le pide un PDF en
A4, con márgenes de 20/18/20/20 mm.

> ⚠️ **NO HAY PLANTILLA DE PDF, Y ES LA DECISIÓN CENTRAL.** El documento es la
> propia página del artículo vista con el medio `print`, revestida por
> `css/imprimir.css`. Una plantilla aparte sería **un segundo sitio donde vive
> el artículo**, y se desincronizaría en silencio: el día que alguien añadiera un
> tipo de bloque nuevo, el PDF lo dejaría fuera sin dar ningún error.
>
> Lo único que `pdf.mjs` añade al documento es **la portada**, que es una pieza
> que en la web no existe.

### Las fechas de dentro del PDF se normalizan, y es lo que corta el bucle

Chromium escribe en el diccionario `/Info` de cada PDF dos campos con **la hora
del reloj**:

```
/CreationDate (D:20260928181252+00'00')
/ModDate      (D:20260928181252+00'00')
```

Dos bytes de diferencia bastan para que git vea el archivo modificado. Y el
efecto no se quedaba en el repositorio: `contenido.yml` **empuja lo generado al
PR con un PAT**, y un push con PAT sí dispara el workflow, así que cada
ejecución escribía un PDF nuevo, lo empujaba y arrancaba la siguiente.

> ⚠️ **EL BUCLE ES REAL Y ESTÁ EN EL HISTORIAL.** El PR #4 tiene **siete**
> commits del bot seguidos, uno cada ~85 s, y los seis últimos cambian solo el
> PDF: mismo tamaño, 8 bytes distintos, todos dentro de esas dos fechas. **Lo
> cortó el merge, 14 segundos después del último commit**, no el generador.
>
> GitHub no aplicó su protección anti-bucle porque **solo cubre los pushes con
> `GITHUB_TOKEN`**, y este va con PAT. Eso es a propósito y está razonado en el
> propio `contenido.yml`: con `GITHUB_TOKEN` el commit del bot se quedaría sin
> ningún check y un check obligatorio que no se reporta bloquea el merge para
> siempre. O sea que el PAT no se puede quitar para arreglar esto.

**Lo resuelve `conFechasFijas()` en `scripts/pdf.mjs`**, que sustituye las dos
fechas por una derivada del campo `fecha` del `articulo.json`:

| | De dónde sale |
|---|---|
| Día | el campo `fecha` del JSON |
| Hora | **09:00 +02:00**, la misma que `fechaISO()` |

> **La hora no se inventa aquí, y conviene saberlo antes de «unificarla» con
> otra.** `fechaISO()` ya fijaba las 09:00 +02:00 para `article:published_time`,
> el `datePublished` del JSON-LD y los `<time>` de las tarjetas. El PDF usa esa
> misma hora, así que **hay una sola hora de publicación en todo el proyecto** y
> los metadatos del PDF coinciden con lo que declara el HTML.

> ⚠️ **LOS DOS CAMPOS YA NO VALEN LO MISMO, Y ESTA SECCIÓN DECÍA QUE SÍ.**
> `/CreationDate` es cuándo se creó el documento —la publicación— y `/ModDate`
> cuándo se modificó por última vez. Mientras no existió el campo `actualizado`
> los dos salían de `fecha`, porque era lo único que había:
>
> | | De dónde sale |
> |---|---|
> | `/CreationDate` | **siempre** de `fecha` |
> | `/ModDate` | de `art.actualizado`, que `derivar()` deja **siempre con valor** — la revisión si la hay, y si no la publicación |
>
> **No rompe el determinismo**, que es lo único intocable aquí: la fecha nueva
> sale del JSON igual que la vieja, nunca del reloj.
>
> ✅ **Y un artículo sin `actualizado` sigue dando `/ModDate` == `/CreationDate`**,
> igual que siempre. Lo que ha cambiado es por qué: antes `derivar()` dejaba el
> campo en `null` y aquí se escribía `art.actualizado || art.fecha`; ahora
> `derivar()` ya le pone la fecha de publicación, así que ese `||` se retiró por
> código muerto.
>
> Las dos marcas miden los mismos 23 bytes —solo cambian los dígitos del día—,
> así que la guarda de longitud sigue cubriendo las dos.

> ⚠️ **LA SUSTITUCIÓN TIENE QUE MEDIR LO MISMO EN BYTES, y si no, el PDF sale
> corrupto.** La tabla `xref` del final de un PDF son **offsets absolutos en
> bytes** desde el principio del archivo: alargar o acortar el `/Info` correría
> todo lo que viene detrás y dejaría el `xref` apuntando a mitad de un objeto.
> Algunos lectores lo abrirían igual y otros lo declararían roto, que es el peor
> reparto posible.
>
> El formato de Chromium es `D:YYYYMMDDHHmmSS+00'00'` —**23 bytes**— y el
> nuestro mide los mismos 23. Verificado. **Aun así se comprueba en caliente**:
> si la longitud no cuadra, `conFechasFijas()` lanza en vez de escribir, y si no
> encuentra las dos fechas, también. Lo que no puede pasar es que un cambio de
> formato de Chromium se publique como un PDF roto.

> **El PDF se escribe con `escribirSiCambia()`, igual que el HTML**, pero con
> una versión binaria propia: la de `build.mjs` es `utf8` y sobre un PDF
> devolvería basura. Y `p.pdf()` va **sin `path`**, devolviendo el buffer, para
> que la versión con la hora del reloj no llegue a pasar por disco.

> ⚠️ **QUÉ CUBRE EL GATE, exactamente.** Toma huellas `sha256` de todo lo que
> hay bajo `articulos/` más `index.html`, `sitemap.xml` y `feed.xml`, ejecuta
> `build` y `pdf` una segunda vez, y vuelve a tomarlas. Si alguna cambia, falla
> y **dice qué archivo**.
>
> Ya no usa `git add -A` antes del diff. Funcionaba para lo que escribe `build`,
> pero ataba la medición al estado del índice de git, que es un sitio raro donde
> guardar una comprobación, y no decía cuál de los archivos se había movido.
>
> Son **dos pasadas en total, no tres**: la primera es la que publica y esta es
> la segunda.

Qué se imprime y qué no:

| Se va | Se queda |
|---|---|
| cabecera, menú, buscador | **bloque de título**: logo pequeño, «El Derecho Escrito», categoría, titular, autor, fecha, minutos y **actualización si la hay** |
| barra de progreso | **resumen**: la entradilla, una sola vez |
| lateral entero: autor, etiquetas, suscripción | índice |
| «Volver a los artículos» ×2 | cuerpo, con sus citas y listas |
| botones de compartir y de PDF | referencias |
| «Continúa leyendo» | el aviso legal, al final |
| pie de la web | **cabecera corriente**: título abreviado y autor |
| **la foto del artículo** | pie propio: nombre del blog, URL del artículo y `n / total` |

> ⚠️ **EL PIE Y LA CABECERA SALEN TAMBIÉN EN LA PRIMERA PÁGINA, y no es un
> descuido.** Chromium aplica `headerTemplate` y `footerTemplate` a **todas**
> las páginas y no da ninguna forma de saltarse la primera: el número llega como
> texto dentro de un `<span class="pageNumber">`, así que no hay selector que lo
> distinga. Tampoco sirve `@page :first`, porque los márgenes vienen por la API
> y Chromium ignora los del `@page`.
>
> **Se asume para la cabecera igual que ya se asumía para el pie**: en la página
> 1 la línea del título abreviado queda encima del bloque de título. Es una línea
> de 7 px en gris claro y funciona como cintillo.
>
> Las alternativas eran peores. Generar dos PDF y unirlos pide una librería más
> y descuadra la numeración; renunciar a los números de página sería cambiar
> algo que se usa por algo que se mira una vez.

> ⚠️ **La plantilla del pie es un DOCUMENTO APARTE**: no hereda ni los estilos
> de la página ni los márgenes. Por eso repite el padding lateral de 20 mm a
> mano —para alinear con la mancha de texto— y trae sus propias fuentes.

### El formato es un PAPER: bloque de título, no portada

```
cabecera corriente     título abreviado · · · Juan Contera Miranda
logo + El Derecho Escrito
CATEGORÍA
Titular a 22 pt
autor · fecha · minutos · actualización
RESUMEN
  la entradilla, en cursiva y sangrada a los dos lados
ÍNDICE DEL ARTÍCULO
I. Primer apartado…
pie                    El Derecho Escrito · url · · · n / total
```

> ⚠️ **ERA UNA PORTADA DE PÁGINA ENTERA Y LA CALIBRACIÓN DE 259 mm YA NO
> EXISTE.** `.pdf-portada` tenía `height: 259mm` —297 menos los márgenes— y
> `break-after: page`, con la foto cerrando abajo y un `overflow: hidden` de
> red. Este archivo avisaba de que **al tocar los márgenes había que recalcular
> ese número** o la portada empujaba una página en blanco.
>
> **Nada de eso aplica ya**: el bloque de título fluye con el texto, así que no
> hay altura que calibrar ni página que empujar. Con ello desaparece también el
> fallo que costó una vez —el `padding-top` de la barra de progreso empujaba la
> portada y mandaba la foto a una página suelta—.

> **Lo que se ganó, medido en el artículo de MASC:** de **9 páginas a 8**, y de
> 616 KB a 452 KB. La página que se ahorra es la portada; los kilobytes, la
> foto.

> ⚠️ **EL RESUMEN ES LA ENTRADILLA, Y ANTES EL TEXTO DE APERTURA SALÍA DOS
> VECES.** La portada llevaba `descripcion` y el cuerpo `entradilla`: dos
> párrafos distintos con el mismo papel. Hoy el bloque de título no lleva
> ninguno y el resumen es el `<p class="entradilla">` que ya estaba en el
> cuerpo.
>
> **Eso evita además tener que resolver las llamadas de referencia en
> `pdf.mjs`**: ese párrafo ya viene con sus `{{ref:n}}` resueltos desde el build.
>
> Va en cursiva y con sangría a los **dos** lados, sin recuadro: es la convención
> del abstract y no estrena ningún color ni filete. El rótulo «RESUMEN» va en
> `::before` porque es decorativo y porque el `<p>` lo escribe el build para la
> **web**, donde no hay ningún resumen.

> ⚠️ **CÓMO SE ABREVIA EL TÍTULO DE LA CABECERA.** Se corta a **60 caracteres y
> siempre en un espacio**: se retrocede al último blanco antes del límite, de
> modo que no se parte una palabra. Si no hubiera ningún espacio en los primeros
> 60 se corta en seco, que es el único caso en que puede partirse.
>
> Los 60 no aprietan. Verificado con un titular de prueba de **158 caracteres**:
> queda en 56 más la elisión y la cabecera no desborda —a 7 px Helvetica, sobre
> los 170 mm útiles menos el nombre del autor, caben del orden de 130—. El
> límite está para que la cabecera sea una **referencia** y no una segunda
> portada.

> ⚠️ **EL MARGEN SUPERIOR SUBIÓ DE 20 A 28 mm.** Chromium dibuja la cabecera
> **dentro** del margen superior, no sobre el texto: sin esos 8 mm de más, la
> línea del título abreviado se solapa con el cuerpo.

> ⚠️ **LA CABECERA NO PUEDE VOLVER A IR VACÍA.** Estaba en `'<span></span>'`
> justamente porque **sin plantilla Chromium pinta la suya, con la fecha del
> día**, y eso rompe el determinismo. Llenarla no abre esa puerta: lo que la
> mantiene cerrada es que haya **contenido**, no que esté vacía. `conFechasFijas()`
> no se ha tocado y el PDF sigue saliendo idéntico en dos pasadas.

#### La ficha de la portada lleva «Última actualización» EN LA MISMA LÍNEA

Y en la web va en su propia fila. **Parece una incoherencia y no lo es: aquí
cabe y allí no.**

> ⚠️ **ESTA MEDIDA ESTABA MAL Y SE HA REHECHO SOBRE EL RENDERIZADO, NO SUMANDO.**
> Decía «≈ 160 mm» y por tanto 10,1 mm de holgura. Sumaba los anchos de los tres
> datos y se dejaba fuera el `gap` del flex, así que el número salía corto.
>
> Medido en Chromium con el medio `print` y el viewport a los 170,1 mm útiles,
> con el mes más largo y el día de dos dígitos —que es el peor caso y es
> exactamente el del artículo de MASC—:

| | |
|---|---|
| fecha | 161,8 px |
| minutos | 104,2 px |
| «Última actualización: 28 de septiembre de 2026» | 293,2 px |
| los dos `·` y los huecos del flex | el resto |
| **la línea entera, de borde a borde** | **619,8 px = 164,0 mm** |
| **ancho útil del A4 con estos márgenes** | **643 px = 170,1 mm** |
| **holgura** | **6,1 mm** |

> ⚠️ **Y DESDE QUE LA LÍNEA SE ENSEÑA SIEMPRE, ESA HOLGURA ES EL ESTADO
> PERMANENTE Y NO EL PEOR CASO OCASIONAL.** Antes solo se pagaba en los
> artículos que traían el campo; hoy la pagan todos.
>
> Sigue cabiendo con margen suficiente: el dato que más puede crecer son los
> minutos, y pasar de «15» a «120» añade ~8 px sobre los 23 que sobran.
>
> **El nombre del autor NO entra en esa cuenta**: va en su propia línea, porque
> `.pdf-portada__ficha` le da ancho completo. La ficha del PDF son dos líneas,
> no una.

La misma fila en la web pide 734,6 px sobre una columna de 720. **La diferencia
no es el ancho** —la columna web son 190 mm, *más* que estos 170— **sino el
estilo**: la ficha de la web va en **versales**, con tracking de 0,06em y un
icono por dato; la de aquí va en caja baja, sin iconos y con 0,04em. Las
versales y los iconos son lo que la desbordan allí.

> ⚠️ **Si algún día se le ponen versales o iconos a esta ficha, hay que volver a
> medir**: con 6,1 mm de holgura se la comen de golpe.

> ⚠️ **Y SI LA LÍNEA ENVOLVIERA, HOY NO PASA NADA.** Aquí se explicaba que
> `.pdf-portada__texto` llevaba `margin-top: auto` y que el bloque crecía hacia
> arriba comiéndose el hueco libre, con el `overflow: hidden` mordiendo solo si
> se pasaba de los 259 mm.
>
> **Todo eso decae con la portada de página entera**: el bloque de título fluye
> con el texto, así que una línea de más es simplemente una línea de más.
>
> Verificado con un artículo de prueba que llevaba `actualizado` **y** un titular
> de 158 caracteres: los cinco elementos de la ficha caen en la misma coordenada
> vertical, o sea que **no envuelve**.

> ⚠️ **Y ESTO YA FALLÓ UNA VEZ, DE UNA FORMA QUE CONVIENE CONOCER.**
> `body:has(.progreso)` reserva en `styles.css` los 30 px de la banda de
> progreso, y pesa (0,1,1) frente a los (0,0,1) de `html, body`: **gana por
> especificidad, no por orden**, así que el reset de `imprimir.css` no lo
> desactivaba por estar después.
>
> Con esos 30 px la portada empezaba más abajo y su último bloque —la foto—
> terminaba pasada la caja de la página. **Una imagen es un bloque indivisible:
> al no caber no se parte, se va ENTERA a la página siguiente.** El PDF salía
> con una portada sin foto y una segunda página con la foto sola, y nada daba
> error. Se veía con 10 páginas en vez de 9.
>
> Lo arregla `body:has(.progreso) { padding-top: 0 }`, declarado aparte. Y
> `.pdf-portada` lleva además `overflow: hidden` como red: si algún día un
> ancestro vuelve a meter relleno, lo que sobre se **recorta** en vez de
> paginarse. Una portada con la foto tres milímetros más baja se ve rara; una
> portada sin foto y una página suelta con la foto se ve como un PDF roto.

> ⚠️ **HAY QUE ESPERAR A QUE CARGUE LA FOTO DE LA PORTADA.** La inyección ocurre
> **después** del `networkidle`, así que el `<img>` empieza a cargarse cuando la
> página ya se considera quieta. Sin la espera, `page.pdf()` dispara antes y la
> portada sale con un hueco blanco. **El PDF se genera igual y nada avisa.**
>
> El logo no la necesita: va incrustado en base64, y va así justamente porque
> una ruta rota en CI tampoco daría error, solo un hueco donde iba la marca.

### Los saltos de página

Lo que evita que el PDF se lea como generado sin cuidado:

| Regla | Dónde | Qué evita |
|---|---|---|
| `break-after: avoid` | `h2`, `h3`, rótulos de referencias | un epígrafe solo al pie de una página |
| `break-inside: avoid` | índice, cita, cada referencia, aviso final | cortes por la mitad |
| `break-before: avoid` | `.cita__fuente` | que la fuente se separe de su cita |
| `orphans`/`widows: 2` | párrafos y items | una línea suelta al final o al principio |

> ⚠️ **La caja de referencias NO lleva `break-inside: avoid`, y es deliberado.**
> Con once referencias no cabría en ninguna página y Chromium la empujaría
> entera a la última, dejando media página en blanco antes. Lo que se protege es
> **cada referencia por separado**, que es donde el corte se ve mal.

### El botón «Descargar PDF»

Es un `.boton--contorno` propio, **antes** del bloque «Compartir», con el icono
de línea dentro. Apunta a `./<slug>.pdf`, en la misma carpeta del artículo.

> ⚠️ **ERA EL CUARTO ELEMENTO DE LA LISTA DE COMPARTIR Y SALIÓ DE ELLA.** Allí
> se veía igual que LinkedIn, WhatsApp y Correo —misma píldora gris— así que se
> leía como un destino más al que mandar el artículo. **Y no lo es: los otros
> tres lo envían a otro sitio y este te lo da a ti.**
>
> Con `.boton--contorno` pasa a verse como «Descargar CV» de `sobre/` y del
> lateral: **las dos descargas del sitio se ven igual**, que es la relación que
> de verdad tienen.

> ⚠️ **VA ANTES DE «COMPARTIR», NO DESPUÉS.** Llevarse el artículo es para uno
> mismo; compartirlo es para terceros. El orden va de lo propio a lo ajeno, que
> es también el orden en que se decide.
>
> Con él se mudaron los márgenes: los 40 de arriba que tenía `.compartir` los
> lleva ahora `.descarga`, que es quien abre la fila de acciones, y `.compartir`
> se queda en `margin: 0 0 32px` con su filete.

> ⚠️ **`.descarga` Y `.compartir__lista` VAN PREFIJADAS CON `.articulo`, Y SIN
> ESO NO SE APLICAN. LAS DOS ESTUVIERON MUERTAS A LA VEZ.**
>
> | Regla | Declaraba | Computaba | Quién ganaba |
> |---|---|---|---|
> | `.descarga` | `margin: 40px 0 28px` | `0 0 22px` | `.articulo p` |
> | `.compartir__lista` | `margin: 0; padding: 0` | `padding-left: 24px` | `.articulo ul` |
>
> Las dos son (0,1,0) contra los (0,1,1) del selector del cuerpo: **ganan por
> especificidad, no por orden**.
>
> Lo que se veía: el botón **pegado** a «Volver a los artículos» —hueco medido:
> **0**— y las píldoras de compartir arrancando **24 px más a la derecha** que
> el rótulo «COMPARTIR», como si estuvieran sangradas a propósito. **No lo
> estaban**: era el relleno por defecto de las listas del cuerpo.
>
> De las tres declaraciones de `.compartir__lista` solo funcionaba
> `list-style: none`, porque `.articulo ul` no lo declara.
>
> ⚠️ **ES LA TERCERA VEZ QUE MUERDE ESTE PATRÓN**: antes fueron `.articulo h3`
> contra `.entrada__titulo` en «Continúa leyendo» y `.articulo p` contra
> `.autor__cv` en el lateral. **Cualquier clase nueva sobre un `<p>`, `<ul>` o
> `<h3>` dentro del artículo necesita el prefijo**, y el fallo no da ningún
> error: solo se ve mirando el estilo computado.

> **Los huecos de la zona, ya con las reglas vivas:**
>
> | | px |
> |---|---|
> | referencias → «Volver» | 40 |
> | **«Volver» → botón PDF** | **40** |
> | botón → filete de «Compartir» | 28 |
> | filete → rótulo | 29 |
> | rótulo → píldoras | 28 |
>
> Los 40 igualan el hueco que ya había encima de «Volver», así que el enlace
> queda con el mismo aire por los dos lados y se lee como una pieza suelta entre
> dos bloques. Y **todo alinea a 0** con la columna: «Volver», el botón, el
> rótulo, las píldoras y el aviso.

> **UNA SOLA UBICACIÓN, y se descartó la segunda.** Arriba, junto a la ficha,
> competiría con el arranque de la lectura y empujaría el texto: esa columna ya
> lleva `.volver`, foto, categoría, titular, ficha, entradilla e índice. Y el
> momento de descargar es **después** de decidir que el artículo interesa, que
> es justo donde está. Dos puntos de descarga serían además dos sitios que
> mantener.

> **El icono se queda, y eso cambia lo que decía la sección del CV.** Allí está
> escrito que el botón del CV no lleva icono «al contrario que Descargar PDF del
> artículo, que vive en una lista de cuatro acciones donde el icono distingue
> una de otra». Ese argumento decae: el botón ya no vive en la lista. Se
> conserva porque aquí distingue «descargar» de un enlace cualquiera, y porque
> es un `<span aria-hidden>` con `mask` que no entra en el árbol de
> accesibilidad.

> ⚠️ **NO LLEVA EL PESO EN BYTES, al contrario que «Descargar CV», y no es un
> olvido.** El del CV se escribe a mano porque el archivo es fijo. El del
> artículo tendría que calcularlo el build, y **ahí choca con la idempotencia**:
> `build` escribe el HTML **antes** de que `pdf` escriba el PDF, así que el
> tamaño que leyera sería siempre el de la pasada anterior. El gate —que vuelve
> a correr `build; pdf` y compara— lo cazaría como no idempotente justo en la
> primera publicación de cada artículo, que es cuando el PDF aún no existe.
>
> **Para ponerlo haría falta cambiar el orden de publicación** a
> `build → pdf → build`, o que `pdf.mjs` reescriba el HTML después de generar.
> Las dos tocan el pipeline, así que es una decisión aparte.
>
> El nombre accesible es «Descargar PDF», que ya dice el formato.

> ⚠️ **SI EL PDF NO SE HA GENERADO, EL BOTÓN DA 404 Y NADA LO IMPIDE.** La
> plantilla lo pinta siempre, porque mirar si el archivo existe en el momento
> del build ataría el HTML al orden en que se ejecutan los dos comandos: la
> primera vez no existiría y el botón no saldría, la segunda sí.
>
> Se resuelve por proceso y no por código: `npm run publicar` encadena los dos,
> y el workflow los ejecuta en el mismo job. **Quien ejecute solo `npm run
> build` tiene que acordarse del `pdf`.**

## El flujo de publicación, de punta a punta

Quien publica es **el cliente**, desde GitHub, sin tocar código ni ejecutar
nada. El recorrido completo:

```
1. CLIENTE     sube el .docx y su imagen a una carpeta de Drive
2. n8n         lee Drive, monta articulo.json + portada.jpg
                 y abre un PR en GitHub
3. CHECK       contenido.yml: valida, genera, empuja lo generado AL PR
                 y comenta con la vista previa
4. TÚ          miras los avisos del comentario
5. CLIENTE     abre la vista previa, la revisa y pulsa «Merge pull request»
6. PUBLICADO   GitHub Pages sirve lo que hay en main
```

> ⚠️ **EL MERGE ES LA PUBLICACIÓN, Y NO HAY NINGÚN WORKFLOW DETRÁS.** Es la
> pieza que más cuesta creerse, así que conviene tenerla clara: `contenido.yml`
> **empuja lo generado a la rama del PR** —`git add articulos index.html
> sitemap.xml feed.xml`—, así que cuando el cliente mergea, esos archivos ya
> están hechos y entran en `main` con el merge.
>
> No hace falta —y no existe— un workflow que reconstruya al mergear. **Ninguno
> escucha `push` a `main`**, que es lo que evita el bucle de un generador que se
> dispara a sí mismo. Si alguien añade uno, que lea antes esto.

**Si el build falla, el cliente no puede publicar a medias.** El check queda en
rojo, el comentario dice «Vista previa no disponible» en vez de traer enlaces, y
la protección de rama impide mergear con el check en rojo. Las tres cosas tienen
que estar: sin la tercera, el botón verde sigue pulsable.

### Los dos checks que protegen el merge

**1. La rama tiene que estar al día con `main`.** Se comprueba antes de generar.

> ⚠️ **ESTE CHECK EVITA UN BORRADO SILENCIOSO, no un conflicto.** Las regiones
> `GENERADO:` se calculan con los artículos **de la rama**. Si se mergea el PR A
> y después el PR B, que se generó sin ver a A, las regiones de B no contienen a
> A: al mergear, el artículo de A **desaparece de la portada, el listado, el
> sitemap y el feed**, aunque su carpeta siga en `articulos/`. Git no siempre lo
> ve como conflicto.
>
> Se arregla solo: GitHub enseña un botón **«Update branch»**, eso relanza el
> workflow y las regiones se regeneran ya con A dentro.

**2. El `articulo.json` tiene que ser válido.** Lo comprueba `validar()`, que
hace `process.exit(1)` y deja el check en rojo. Cubre: campos obligatorios,
**categoría fuera de la lista**, fecha mal formada, sección sin `id`, `id`
repetido, cita a una referencia que no existe, JSON inválido, slug que no
coincide con la carpeta e imagen que falta.

> **Esto es lo que impide que se repita el PR #1**, que traía
> `"categoria": "comentarios"` —en plural, y no existe—. Hoy tumbaría el build.

> ⚠️ **Los `id` derivados del título son AVISO, no error, y es deliberado.** Un
> `id` como `finalidad-del-requisito-de-negociacion-previa` funciona; lo que
> tiene es que al retocar una palabra del epígrafe cambia el ancla y se rompen
> los enlaces compartidos. Pero la detección es una **heurística** —comparar el
> `id` con el título normalizado— y puede dar un falso positivo con un epígrafe
> de una sola palabra. **Un falso positivo que bloquee una publicación legítima
> del cliente es peor que un `id` largo**, así que sale como aviso en el
> comentario del PR, donde lo ve quien revisa antes de que él mergee.

### La vista previa

La sirve **raw.githack**, que devuelve los archivos del repositorio con su
`content-type` real: el HTML se renderiza y el PDF se abre en el navegador. **No
hay nada que desplegar ni que limpiar**: cuando se borra la rama del PR, el
enlace muere solo.

> ⚠️ **EL ENLACE VA POR SHA, NO POR NOMBRE DE RAMA.** Las ramas que abre n8n
> llevan **barra** —`articulo/falta-de-masc-…`— y la URL de githack es
> `/owner/repo/REF/ruta`: una barra en la ref hace que el servicio parta por
> donde no es y el enlace da 404. Por SHA es además más fiel, porque apunta al
> commit exacto que se está revisando.

> **El preview es público**, como el repo. No lleva contraseña. Si algún día un
> borrador no debe circular antes de publicarse, la vía es Cloudflare Pages con
> Access, no githack.

## Los workflows

Dos, y hacen cosas distintas.

### `contenido.yml` — el PR de n8n

Se dispara con `pull_request` **en todos los PR, sin filtro de rutas**. Instala,
genera, **empuja lo generado al mismo PR**, adjunta el PDF y las capturas como
artefacto y comenta los avisos.

#### Corre en TODOS los PR, y el filtro `paths` se quitó a propósito

> ⚠️ **ESTUVO FILTRADO A `contenido/**`, `scripts/**` Y `css/**`, y esta sección
> lo decía.** Son las rutas que de verdad cambian lo generado, así que el filtro
> parecía gratis. **No lo es, en cuanto `generar` sea un check obligatorio.**
>
> El problema no es lo que el filtro deja pasar: es lo que **no dispara**. En un
> PR que no toca ninguna de las tres —solo HTML, solo `CLAUDE.md`, solo el propio
> workflow— el job no corre y el check **no se reporta nunca**. Y un check
> obligatorio que no se reporta no cuenta como ausente:
>
> | | Qué ve GitHub | Qué pasa |
> |---|---|---|
> | check en rojo | `failure` | el merge se bloquea **y se explica** |
> | check sin reportar | `pending` para siempre | el merge se bloquea **y no hay nada que mirar** |
>
> Es el mismo modo de fallo que ya razona el bloque del PAT —un check obligatorio
> que no llega a la cabeza del PR— entrando por la otra puerta: allí era el
> commit del bot el que se quedaba sin check, y aquí el PR entero.
>
> **El precio es correr el job en PR que no cambian el sitio**, y se acepta: es
> tiempo de runner y nada más. El generador es idempotente, así que ahí no
> encuentra nada que empujar y termina en verde sin tocar el repositorio.
>
> ⚠️ **Y no se salta ningún paso en esos PR, tampoco el `build` ni la vista
> previa.** La tentación es condicionarlos a «¿ha cambiado algo que importe?»,
> y esa pregunta es justo la que ya salió mal una vez: el comentario del bot la
> respondía por su cuenta y por eso anunciaba fallos que no existían. Un PR de
> CSS o de HTML **necesita** la vista previa, que es lo único que enseña si algo
> se ha descolocado. Si algún día sobra, que se salte con un `if:` en el paso y
> nunca saltando el job, o volvemos a tener un check que no se reporta.

> ⚠️ **ASUME QUE EL PR SE ABRE EN ESTE MISMO REPOSITORIO, NO DESDE UN FORK.** Es
> lo que permite usar `pull_request` a secas: en un PR desde un fork el
> `GITHUB_TOKEN` es de solo lectura y el `git push` fallaría. Si algún día el
> flujo cambia a forks, hay que pasar a `pull_request_target` **y leer antes sus
> implicaciones de seguridad**, porque ese evento ejecuta el workflow de la rama
> base con permisos de escritura sobre código que viene de fuera.

Permisos: `contents: write`, `pull-requests: write` y `deployments: write`.
Nada más.

#### Un PR de artículo produce DOS ejecuciones, y cada una hace la mitad

Es la pieza que más cuesta creerse, y de no entenderla salió una X roja que
parecía un error y no lo era.

El checkout usa un **PAT**, no el `GITHUB_TOKEN`, justamente para que el push del
bot dispare una segunda ejecución —si no, el commit del bot se quedaría sin
ningún check y un check obligatorio que no llega a la cabeza bloquea el merge
para siempre—. Está razonado sobre el propio `token:`.

Así que el reparto es:

| | Ejecución A (commit del autor) | Ejecución B (commit del bot) |
|---|---|---|
| Genera HTML, PDF, sitemap, feed | sí | sí |
| Comprueba idempotencia | sí | sí |
| ¿Encuentra algo que empujar? | **sí → empuja** | no |
| Deployment, vista previa, capturas, comentario | **no, se corta** | **sí** |
| Cómo termina | **verde** | verde |

La bisagra es el output **`cambios`** del paso «Añadir lo generado al PR»: si ha
empujado vale `si`, y todos los pasos de después llevan
`if: steps.publicar.outputs.cambios != 'si'`.

> ⚠️ **ESTO ESTUVO RESUELTO CON `cancel-in-progress: true`, Y ERA UNA
> AUTOCANCELACIÓN.** El workflow empuja a la misma rama que lo dispara, así que
> su propio push metía una ejecución nueva en el mismo grupo de concurrencia y
> **mataba a la que estaba empujando**:
>
> ```
> A empuja ──> evento `synchronize` ──> B entra en el grupo ──> B cancela a A
> ```
>
> A moría con seis pasos por delante. El PR #6 lo enseña: X roja sobre el commit
> del autor, check verde sobre el del bot, 23 minutos entre los dos.
>
> **No bloqueaba el merge** —la cabeza es el commit del bot y ahí el check está
> en verde— pero el cliente veía una X roja, y `PARA-EL-CLIENTE.md` le enseña que
> los colores significan algo.
>
> Hoy `cancel-in-progress: false`. Y **no se arregla quitando el PAT**: eran dos
> cosas incompatibles —empujar con PAT o cancelar en curso— y la que se conserva
> es el PAT.

> ⚠️ **NINGÚN DEPLOYMENT PUEDE QUEDARSE COLGADO EN `in_progress`, y es por cómo
> encadenan los dos `if`.** «Abrir el deployment» también se salta cuando se ha
> empujado, así que `steps.deploy.outputs.id` queda vacío; y «Cerrar el
> deployment» lleva `always() && steps.deploy.outputs.id`, que con el id vacío no
> se ejecuta. O se abren y cierran los dos, o no se abre ninguno.
>
> Con la cancelación sí podía pasar: A abría el deployment y moría antes de
> cerrarlo.

> **El comentario se reutiliza en vez de apilarse.** Un PR con tres correcciones
> acabaría con tres listas de avisos y habría que mirar la fecha para saber cuál
> vale. Se busca un comentario con la marca `<!-- avisos-del-build -->` y se
> edita.

#### El comentario del bot tiene TRES estados, no dos

| Estado | Cuándo | Qué dice |
|---|---|---|
| **Con artículo** | el job va bien y el PR trae `contenido/articulos/<slug>/` | vista previa, PDF, qué mirar y cómo publicar |
| **Sin artículos** | el job va bien y el PR no trae ninguno | que no hay texto nuevo, que las páginas se han regenerado y que el sitio entero está en «View deployment». **Sin alarma** |
| **Fallo** | `job.status !== 'success'` | que no se ha podido generar y que el motivo está en «Checks» |

> ⚠️ **ERAN DOS ESTADOS Y EL SEGUNDO MENTÍA.** La condición era
> `sha && slugs.length`, así que **cualquier PR sin artículo** —de diseño, de
> código, de documentación— caía en la rama del error y anunciaba «El artículo no
> se ha podido generar» con el check en verde y la vista previa desplegada. Pasó
> en el PR #6.
>
> Y el daño de fondo no era el susto: **el mensaje de error estaba ocupado por un
> caso que no es un error**, así que el día que un PR del cliente fallara de
> verdad habría salido el mismo texto y no habría forma de distinguirlos.
>
> El fallo se detecta ahora por **`job.status`**, que es el estado real, no por
> una lista de slugs que no dice nada del éxito del build.

> ⚠️ **LOS SLUGS SALEN DEL PASO `art`, Y ANTES SE CALCULABAN DOS VECES.** El
> comentario hacía su propio `pulls.listFiles` y trataba el caso vacío **al
> revés** que el resto del job: `art` lo tolera y cae a la raíz del sitio —por eso
> la vista previa se desplegaba y el check salía verde—, mientras que el
> comentario lo daba por fallo de generación. Dos respuestas opuestas a la misma
> pregunta, en el mismo job.
>
> De paso se va el `per_page: 100` de `listFiles`, que en un PR grande podía
> dejar el artículo fuera de la lista y disparar el mismo falso aviso.

#### Los avisos se reparten: los del PR arriba, los ajenos en un desplegable

`.avisos.json` lo escribe el build recorriendo **todos** los artículos del sitio,
no los del PR. Así que en un PR de un artículo se colaban en la misma lista los
avisos de los demás, presentados como si fueran del texto que el cliente está
revisando.

El reparto usa el prefijo `<slug>: ` que el build pone delante de muchos avisos:

| Aviso | Dónde va |
|---|---|
| prefijo de un artículo **que este PR no toca** | desplegable «no son de este PR» |
| prefijo del artículo del PR | lista principal |
| **sin prefijo** | lista principal |

> ⚠️ **QUE LOS AVISOS SIN PREFIJO SE QUEDEN ARRIBA ES DELIBERADO, Y ES EL PUNTO
> DELICADO.** Hoy `build.mjs` **no prefija todos**: varios se escriben como «La
> imagen de portada de **este** artículo no la has aportado tú…», sin decir de
> cuál. Y ese es justamente el aviso que el cliente tiene que leer.
>
> Repartir «lo que no sé de quién es» al desplegable escondería lo importante, y
> el desplegable existe para quitar ruido, no para enterrar avisos.
>
> **La solución completa es que `build.mjs` prefije SIEMPRE con el slug**, y
> entonces el reparto sería exacto. Mientras no lo haga, esto es lo que se puede
> hacer sin mentir. Es una deuda anotada, no un olvido.

> **Por qué se empuja al PR y no se publica directamente.** Lo generado es
> revisable: un titular mal cortado o una imagen que recorta donde no debe se
> ven leyendo, no probando. El PR es el sitio donde mirar eso, y el artefacto
> con el PDF y las capturas está para poder mirarlo **sin descargar la rama**.

### `regenerar.yml` — a mano, desde Actions

El generador no solo escribe artículos nuevos: reescribe también los viejos. Así
que cuando cambia algo que afecta a todos —la plantilla, el CSS de impresión, la
bio del autor del JSON-LD, el ritmo de lectura— hay que volver a pasarlo por
encima de lo ya publicado. `contenido.yml` no sirve: solo se dispara cuando
llega contenido nuevo, y un cambio de plantilla no toca `contenido/`.

> ⚠️ **NO se dispara solo al cambiar `scripts/` o `css/` en `main`, y es a
> propósito.** Un push a `main` ya está publicado, así que una regeneración
> automática empujaría otro commit encima sin que nadie lo haya mirado. Aquí el
> paso manual **es** la revisión.

Deja el resultado en una rama y abre un PR; nunca escribe en `main`. Una
regeneración masiva puede tocar todos los artículos a la vez, y eso es justo lo
que hay que mirar antes de publicar.

## El sitio SIN artículos es un estado legítimo, y costó dos fallos

Se pasa por él cada vez que se retira el último artículo —por ejemplo para
republicarlo por el circuito automático— y el generador no lo contemplaba.

> ⚠️ **FALLO 1: `build.mjs` se salía sin tocar nada.** Tenía un `return` con el
> mensaje «No hay artículos. Nada que generar», y eso es lo contrario de lo que
> hace falta: las regiones `GENERADO:` se quedaban con **la tarjeta, la URL del
> sitemap, el `<item>` del feed y el `ItemList`** del artículo que ya no existe.
> Cuatro sitios anunciando un 404.
>
> **El síntoma era desconcertante:** el build decía que todo iba bien, `git
> status` salía limpio, y la portada seguía enseñando el artículo borrado. No
> había nada que hiciera sospechar del generador.
>
> Hoy sigue adelante con la lista vacía y las reescribe vacías.

> ⚠️ **FALLO 2: `pdf.mjs` reventaba con un stack trace.** Hacía `readdir` sobre
> `contenido/articulos/` dando por hecho que existe, y al borrar la carpeta
> entera saltaba `ENOENT: scandir`. En local se entiende; **en CI deja el job en
> rojo sin explicar nada**, y como `npm run publicar` encadena con `&&`, un
> build correcto acababa igualmente en fallo.
>
> Hoy tolera la carpeta ausente. Y distingue dos casos que no son lo mismo:
> pedir un slug que no está **sí** es un error —quien lo pidió se equivocó— pero
> no encontrar ninguno sin haber pedido nada **no lo es**.

**Lo que se ve con cero artículos**, y es aceptable porque dura lo que tarde en
publicarse uno:

| | Estado |
|---|---|
| Destacado | la `<section>` pinta su rótulo «Lectura recomendada» **sobre un hueco** |
| «Últimos artículos» | las tres tarjetas de atrezo |
| Listado | dos de atrezo más «Próximamente» |
| Contador | «2 artículos publicados» — solo el atrezo |
| Filtros | los tres, pulsables; Jurisprudencia da cero |
| Desplegable de etiquetas | **se oculta solo**, no hay ninguna |
| `ItemList` | `numberOfItems: 0` |
| Consola | sin errores |

> ⚠️ **EL RÓTULO HUÉRFANO DEL DESTACADO NO LO PUEDE ARREGLAR EL GENERADOR**, y
> conviene saber por qué antes de intentarlo. La región `GENERADO:destacado`
> vive **dentro** de la `<section class="destacado">`, así que el build puede
> vaciar su contenido pero no esconder la sección que la contiene.
>
> Esconderla pediría mover las marcas **fuera** de la `<section>`, y eso es un
> cambio de maqueta, no de generador: el CLAUDE.md ya documenta que para quitar
> el destacado se borra la sección entera a mano. Se dejó así a propósito.

## Qué NO hace el generador

Para que nadie lo busque:

- **No borra.** Quitar un artículo es borrar su carpeta de `contenido/` **y** la
  de `articulos/`. El build no sabe que la segunda sobra.
- ~~**No toca el `ItemList` del JSON-LD.**~~ **Ya sí**: es la séptima región,
  `GENERADO:itemlist`. Era el único sitio donde un artículo se escribía a mano.
- **No toca las tarjetas de ejemplo**, ni las de la portada ni las
  provisionales del listado. Están fuera de las regiones.
- **No escribe `sobre/`, `contacto/`, `404.html` ni el hero.** Son páginas a
  mano y siguen siéndolo.
- **No valida longitudes de SEO.** Razonado arriba.
- **No comprueba los enlaces del texto.** Un `<a>` roto dentro de un párrafo
  pasa sin decir nada.
- **No genera variantes de imagen por proporción.** Y no hace falta: el CSS
  recorta con `object-fit: cover`, así que **la misma foto sirve para el 21:9
  del artículo, el 3:2 del listado, el 16:9 de la portada y el de la portada del
  PDF**. Una sola imagen, cuatro encuadres.

## El estado de hoy

**UN artículo en `contenido/`**, y es el único publicado:

| Slug | Categoría | Fecha | Min | Palabras | Qué es |
|---|---|---|---|---|---|
| `masc-requisito-procedibilidad` | **Jurisprudencia** | **2026-09-28** | 15 | 2 853 | el artículo real, texto del cliente |

> ⚠️ **ESTA FILA DECÍA «Comentario» Y «2026-09-20», Y LAS DOS ERAN FALSAS.** La
> categoría «Comentario» **se eliminó del sitio** —está razonado arriba, en «La
> categoría se escribe UNA vez»— y este artículo pasó a `jurisprudencia`; la
> fecha del `articulo.json` es el 28, no el 20.
>
> Ninguna de las dos daba error, porque **esta tabla es prosa**: nada la compara
> con el JSON. Se verifican así:
>
> ```sh
> python3 -c "import json;d=json.load(open('contenido/articulos/masc-requisito-procedibilidad/articulo.json'));print(d['fecha'],d['categoria'])"
> ```

Sigue siendo el que prueba el formato entero: cinco apartados numerados I–V, una
cita con fuente, una lista con ordinales, once referencias en tres grupos y
diecisiete llamadas. Es exactamente el artículo que hacía falta para que las
cuatro cosas raras del formato se probaran a la vez.

> ⚠️ **ESTA SECCIÓN LISTABA DOS ARTÍCULOS Y DECÍA QUE NINGUNO ERA DEFINITIVO.**
> El segundo, `principio-de-legalidad-penal`, era el ejemplo de la maqueta y
> **se ha eliminado**: su carpeta en `articulos/`, su fuente en `contenido/` y
> sus menciones en este archivo.
>
> Decía también que el de MASC estaba «pendiente de decidir». **Ya está
> decidido: se publica**, y es el único.
>
> El ejemplo se había convertido a JSON para que el generador tuviera dos
> artículos con los que probarse. Con uno solo, dos cosas cambian y **las dos
> son el comportamiento previsto, no fallos**: «Últimos artículos» se queda sin
> artículos que listar —enseña el atrezo— y **«Continúa leyendo» se oculta**,
> porque el destacado no se repite y el atrezo no es candidato. Están razonadas
> en sus secciones.

> ⚠️ **Quedan DOS URLs muertas, y se asumen.** Al borrar el ejemplo dejan de
> existir `/articulos/principio-de-legalidad-penal/` y su PDF. **No se pone
> redirección**: apuntaría a un artículo que nunca fue contenido real, y
> mandarla al de MASC sería llevar al lector a algo que no buscaba.
>
> No hay enlaces entrantes que se rompan —salieron a la vez del sitemap, del
> feed, de la portada y del listado, que los reescribe el build— y `robots.txt`
> está en `Disallow: /`, así que tampoco hay nada indexado que reclame esas
> direcciones.

---

# Los comentarios de los artículos

**Artalk 2.10.0 autoalojado**, en `https://comentarios.elderechoescrito.es`.
Solo los artículos lo llevan; ni la portada, ni el listado, ni `sobre/` ni
`contacto/`.

| | |
|---|---|
| Servidor | `https://comentarios.elderechoescrito.es` |
| Sitio, dentro de Artalk | **El Derecho Escrito** |
| Assets | `/dist/Artalk.js` (194 KB) y `/dist/Artalk.css` (37 KB) |
| Orígenes permitidos | `elderechoescrito.es`, `www.elderechoescrito.es`, `duowave-web.github.io` |
| Moderación | publicación inmediata, con filtro de palabras y captcha en el servidor |

**Lo escribe el generador**, en `bloqueComentarios()` de `plantilla.mjs`. El
HTML publicado es una `<section>` con su `<h2>`, un `<div>` vacío y dos
párrafos: **todo lo demás lo monta Artalk en el navegador**.

### Dónde va: detrás de «Compartir», delante del aviso legal

```
cuerpo → referencias → Volver → Descargar PDF → Compartir
→ COMENTARIOS → aviso legal → Leer anterior/siguiente → Continúa leyendo
```

La lectura del bloque entero es: primero el artículo, después lo que puedes
**hacer** con él —volver, llevártelo, compartirlo—, después lo que puedes
**decir** sobre él, y al final la letra pequeña y las salidas a otros artículos.

> ⚠️ **ES LA TERCERA POSICIÓN, Y LAS DOS ANTERIORES TENÍAN SU PROPIO ARGUMENTO
> ESCRITO AQUÍ.** Conviene saberlo antes de volver a moverla:
>
> | | Dónde | Lo que se razonaba |
> |---|---|---|
> | 1ª | detrás del aviso legal | «el aviso **cierra** el texto: primero se acaba de leer, después se responde» |
> | 2ª | detrás de las referencias, delante de «Volver» | «un comentario es la **continuación de la lectura**, así que va pegado a lo que se acaba de leer» |
> | **3ª** | **detrás de «Compartir»** | la de ahora |
>
> Las tres son defendibles y las tres se pidieron. Lo que **no** hay que hacer
> es moverla «porque el comentario de arriba dice otra cosa»: el comentario se
> actualiza con el encargo, no al revés.

> ⚠️ **LO QUE SÍ ES ESTRUCTURAL, Y NO UNA PREFERENCIA:** va **delante de `.paso`
> y de `.continua`**. Esos dos son las salidas hacia **otros** artículos, y
> pedir un comentario después de haber ofrecido la puerta llega tarde.
>
> Hoy no se ven —con un solo artículo publicado `.paso` no emite ni un byte y
> `.continua` sale con `hidden`— pero **aparecen solos con el segundo**.
> Verificado creando un artículo de prueba en local: con los ocho bloques
> presentes el orden y los huecos salen como aquí se describen. El artículo de
> prueba se borró de `contenido/` **y** de `articulos/`, que el build no borra.

#### Los márgenes de la zona, medidos con todo presente

| Hueco | px |
|---|---|
| referencias → «Volver» | 40 |
| «Volver» → botón PDF | 40 |
| botón PDF → filete de «Compartir» | **28** — el par apretado, deliberado |
| «Compartir» → filete de COMENTARIOS | **40** |
| COMENTARIOS → aviso legal | **40** |
| aviso → `.paso` | 48 |
| `.paso` → `.continua` | 56 |

Idéntico a 1440, 768 y 375. La zona se lee a un solo ritmo de 40, con el 28 como
única excepción, y a partir del aviso el aire crece conforme se aleja del texto.

> ⚠️ **ARRIBA ESTUVO EN 56 Y DESENTONABA.** Era el valor de `.continua`, que
> cierra la página; aquí caía justo **después** del hueco más apretado de la
> zona —los 28— y hacía el salto más grande de toda la columna. Con 40, el
> `margin-bottom: 32` de `.compartir` colapsa con él y manda el mayor.

> ⚠️ **EL `margin-bottom` NO SE PUEDE SOLTAR A 0, y el motivo cambió con la
> posición.** En la 2ª posición existía para que «Volver» no quedara pegado
> —ese enlace no tiene margen propio y los 40 se los daba `.referencias`—.
> Hoy ese problema no existe: «Volver» ha vuelto a su sitio y recupera sus 40
> automáticamente.
>
> Pero el margen sigue haciendo falta **por otra razón**: el aviso legal es un
> `<p>` y le cae `.articulo p`, que trae `margin-top: 0`. Sin estos 40, el aviso
> quedaría pegado al final de los comentarios. Antes del traslado esa separación
> la ponía el `margin-bottom: 32` de `.compartir`, que ya no es su vecino.

### Los campos: el borde pasa del recuadro a cada campo

Artalk envuelve el editor en un recuadro con filete y radio 6, y dentro pone los
campos **sin borde** —`2px solid transparent`—, así que el nombre, el correo y
el comentario se leían como texto suelto dentro de una caja.

Se invierte: **el recuadro se va y el borde pasa a cada campo**, que es como
funciona el formulario de `contacto/`. Los valores son los mismos, uno por uno:

| | `.campo input` de contacto/ | comentarios |
|---|---|---|
| Relleno | 12px 14px | **igual** |
| Familia y cuerpo | Inter 0,95rem | **igual** |
| Filete | 1px `--borde` | **igual** |
| Radio | **0** | **igual** |
| Foco | 2px `--acento`, offset 1 | **igual** |

Nombre y correo van en pareja con `repeat(auto-fit, minmax(220px, 1fr))`, el
mismo recurso que `.campos-par`: hace el trabajo de una media query, así que no
hay ningún número que mantener sincronizado con un corte. Medido:

| | 1440 | 768 | 375 |
|---|---|---|---|
| Nombre + correo | 352 + 352 | 352 + 352 | **327, apilados** |
| Comentario | 720 | 720 | 327 |
| Botón a la derecha | ✓ | ✓ | ✓ |

El botón toma el estilo de `.boton.boton--principal` —Inter 14/500, relleno
13/26, radio 4, relleno de acento—. Hay que soltarle el `height: 30px` y el
`min-width` de Artalk o el relleno no cabe.

> **La caja exterior no hace falta**, y por eso se quita: con los tres campos ya
> delimitados sería una caja dentro de otra, y el formulario de `contacto/`
> tampoco la tiene. El `.atk-bottom` viene en `space-between`, así que con el
> grupo de la izquierda vacío —sin emoticonos, vista previa ni subir imagen— el
> botón queda a la derecha él solo, sin tocar la alineación.

### La lista vacía decía dos veces lo mismo

Salían a la vez «0 comentarios» en la cabecera, a la izquierda, y «Todavía no
hay comentarios» debajo, centrado y con otra tipografía.

Se **esconde la cabecera** y se deja el mensaje, que es el que habla como una
persona:

```css
.comentarios .artalk > .atk-list:has(.atk-list-no-comment) > .atk-list-header { display: none }
```

`:has()` es lo que permite distinguir el caso vacío **sin JavaScript**:
`.atk-list-no-comment` solo existe cuando no hay comentarios. Es el mismo
recurso que ya usan `body:has(.progreso)` y la ficha del artículo.

**El árbol que pinta Artalk cuando la lista está vacía**, verificado en el
navegador y no deducido del bundle:

```
.atk-list
  .atk-list-header            ← el recuento «0 comentarios», lo que se esconde
    .atk-comment-count > .atk-text > span.atk-comment-count-num
    .atk-right-action
  .atk-list-body
    .atk-list-comments-wrap
      .atk-list-no-comment    ← el mensaje
    .atk-list-read-more       (display: none)
  .atk-list-footer            (oculto: el «Powered by»)
```

> ⚠️ **ESTA SECCIÓN DECÍA `.atk-no-comment` Y ESA CLASE NO EXISTE**, así que la
> regla no casaba con nada y el recuento «0 comentarios» seguía saliendo.
>
> El nombre salió de leer un `grep` **recortado** del bundle: la captura
> empezaba a mitad de palabra —`t-no-comment"></div>`— y se leyó como el nombre
> entero cuando era la cola de `atk-lis|t-no-comment`.
>
> ⚠️ **Y LA COMPROBACIÓN DE ENTONCES NO LO CAZÓ PORQUE ERA CIRCULAR:** se
> «verificó» inyectando un elemento **con ese mismo nombre inventado**, así que
> la prueba confirmaba la suposición en vez de contrastarla. La cabecera pasaba
> de `flex` a `none`, sí, pero solo ante un elemento que Artalk nunca crea.
>
> **La lección, que vale para cualquier integración de terceros:** el árbol se
> mira en el navegador con el widget montado, no se deduce del código fuente ni
> de una captura de `grep`. Y si hay que inyectar algo para probar, se copia del
> DOM real.

Con comentarios, el recuento se queda y se alinea con el resto: Artalk le mete
17 px de relleno lateral que lo descuadraban respecto al título y al formulario.

#### El mensaje de lista vacía se centra por DOS mecanismos

```css
.atk-list-no-comment { text-align: center; justify-content: center; display: flex; height: 150px; font-size: 19px }
```

> ⚠️ **NO BASTA CON `text-align: left`.** Artalk lo centra con `text-align` **y**
> con `justify-content` sobre un flex, y el segundo manda sobre el primero:
> cambiando solo el `text-align` el texto seguiría en el centro.
>
> Se resuelve pasando a **`display: block`**, que deja el `justify-content` sin
> efecto en vez de tener que contrarrestarlo —es una línea de texto, no una fila
> que colocar— y con ello el `height: 150px` pasa a `auto`.

Y el cuerpo de la lista trae `min-height: 150px`, que reservaba sitio mientras
carga y con el mensaje ya en una línea dejaba un hueco debajo. Se suelta a 0:
quien reserva sitio es `.comentarios__caja`, con sus 220 px.

**Verificado inyectando el árbol real** —`.atk-list-no-comment` dentro de
`.atk-list-body > .atk-list-comments-wrap`, sobre el Artalk ya montado— a 1440,
768 y 375:

| | |
|---|---|
| Cabecera | `flex` → **`none`** |
| `display` del mensaje | `flex` → **`block`** |
| Alto | 150 px → **43** |
| Cuerpo | 19 px → **16**, Source Serif |
| Color | **`#66615b`** = `--tinta-suave` |
| x del mensaje / del `<h2>` | **144 / 144** a 1440, **24 / 24** a 768 y 375 |

### «1 COMENTARIOS»: Artalk no sabe de plurales

Su traductor es un **reemplazo de marcadores y nada más** —`{count}` por el
número, con una expresión regular— así que la cadena del recuento es la misma
para 0, para 1 y para 20. No hay forma de arreglarlo desde el objeto de
traducción.

Lo corrige `recuentoEnPlural()` en `main.js`, que cambia la palabra a singular
cuando el número es 1.

> ⚠️ **VIGILA EL DOM Y NO ESCUCHA LOS EVENTOS DE ARTALK**, que también existen
> —`list-loaded`, `comment-inserted`, `comment-deleted`…—. Con los eventos
> habría que acertar con **todos** los que cambian el número **y** llegar
> después de que Artalk haya repintado; perder esa carrera deja «1 comentarios»
> otra vez, en silencio. Un observador se entera de cualquier repintado, venga
> del evento que venga.

> ⚠️ **Y NO SE CICLA, aunque el observador vigile justo lo que la función
> escribe:** antes de tocar nada comprueba si la palabra ya es la correcta y se
> va. La escritura es idempotente, así que la mutación que ella misma provoca no
> produce una segunda escritura.
>
> **Una bandera no habría servido**: los callbacks del observador son
> microtareas, así que ya estaría a `false` cuando llegasen.

El plural es el valor por defecto en el objeto de traducción, así que si esto no
llegara a ejecutarse el peor caso es el fallo de hoy, no uno nuevo. Verificado
inyectando el marcado real del recuento: **0 → «0 comentarios», 1 → «1
comentario», 2 → «2 comentarios», 21 → «21 comentarios»**, y estable al repetir.

### Fuera el enlace «Mensajes», que abre el panel lateral

Aparece a la derecha del recuento en cuanto el lector se identifica —basta con
haber comentado una vez— y abre una capa con «Messages», «Mentions», «Mine» y
«Pending» **en inglés**: esas cadenas no están en el objeto de traducción de la
interfaz, viven en el panel, que es otra aplicación.

> ⚠️ **NO HAY OPCIÓN DE CONFIGURACIÓN**, comprobado en el bundle: el enlace no
> depende de ninguna opción sino de si hay usuario identificado —
> `Text = t.is_admin ? T("ctrlCenter") : T("msgCenter")` … `else
> n.classList.add("atk-hide")`— y `showSidebar()` se invoca **desde un solo
> sitio**, el `onclick` de ese elemento. Al ocultarlo no queda ningún otro
> acceso.

> ⚠️ **ESTO NO LE QUITA NADA AL AUTOR.** Responder con la etiqueta «Autor» es
> cosa del **editor** —escribe su nombre y su correo, Artalk le pide la
> contraseña— y no pasa por el panel. Y moderar lo hace en
> `comentarios.elderechoescrito.es/admin`, que es una URL aparte y la que ya
> documenta `PARA-EL-CLIENTE.md`. Lo único que pierde es un atajo que además
> estaba en inglés.

Se oculta **solo ese `<span>`** y no todo `.atk-right-action`: ahí dentro vive
también `admin-close-comment` —cerrar los comentarios de la página—, que es una
acción de moderación legítima, está traducida y no abre ningún panel.

### «Responder @Nombre» salía cortado

Lo cortaba un `max-width: 8em` de Artalk, que a 14 px son 112: cualquier nombre
de más de ocho caracteres perdía el final.

> ⚠️ **NO BASTA CON SOLTAR EL TOPE.** Con solo quitarlo, un nombre muy largo no
> se recorta: **desborda la fila**. Un item de flex no baja de su tamaño de
> contenido salvo que se le diga, y aquí hay **tres anidados**
> —`.atk-bottom-left`, `.atk-state-wrap`, `.atk-state-btn`— que hay que dejar
> encoger antes de que el recorte pueda actuar.
>
> Medido a 1440 con un nombre de 925 px: sin la cadena desbordaba; con ella se
> recorta a 671 y el aspa sigue en su sitio. Un nombre normal —«Arnau Montero
> Miranda», 258 px— no se recorta nada.

> ⚠️ **POR DEBAJO DE 768 px ESA ETIQUETA NO EXISTE:** Artalk la oculta entera en
> una media query propia y deja solo el aspa. No es cosa de estas reglas y no se
> repone: en una columna de 327 px el nombre no cabría de todas formas.

### Los dos nombres de una respuesta salían de tamaños distintos

«Arnau ▸ Juan Contera» con el segundo más grande. La causa era que **mi propia
regla estaba medio muerta**:

| Elemento | Qué es | Artalk le pone |
|---|---|---|
| `.atk-item.atk-nick` | el autor del comentario | **`font-size: 14px`** |
| `.atk-reply-at > .atk-nick` | a quién responde | *nada de tamaño* |

Y su selector del primero —`.atk-comment > .atk-main > .atk-header
.atk-item.atk-nick`— pesa **(0,4,0)**, más que los (0,3,0) de
`.comentarios .artalk .atk-nick`. Así que de los dos nombres, el mío ganaba
**solo en el segundo**: 14 px contra 16,8 en la misma línea, sin que nada
avisara.

Se sube a **(0,6,0)** nombrando los dos casos a la vez. Verificado: los dos en
Cormorant Garamond 16,8 px, peso 600, y la fecha intacta en Inter 12 px
`--tinta-suave`.

### «Powered by Artalk»: se quita con CSS porque no hay opción

> ⚠️ **SE COMPROBÓ ANTES DE RECURRIR AL CSS.** En el bundle de la v2.10.0 las
> únicas apariciones de «copyright» son **el nombre de la clase y la plantilla
> del DOM**: no existe ninguna opción de configuración que lo gobierne. El texto
> lo escribe el propio Artalk al emitir su evento `mounted`:
>
> ```js
> e.on("mounted", () => { …querySelector(".atk-copyright").innerHTML = "Powered By …" })
> ```
>
> Quitarlo desde JS sería una **carrera** contra ese manejador —si el nuestro
> corre antes, Artalk lo vuelve a escribir—, así que el CSS es además la vía
> **fiable**, no solo la única.
>
> Se oculta el **pie entero** y no solo `.atk-copyright`: el pie trae su propio
> relleno y dejaría un hueco al final de la lista.
>
> La licencia **MIT** de Artalk permite quitar la atribución de la interfaz. El
> aviso de copyright del código sigue intacto en los archivos que sirve el
> servidor de comentarios.

### ⚠️ Estos estilos ganan por especificidad, no por orden

**La hoja de Artalk la inyecta `main.js` en el `<head>` en tiempo de ejecución**,
o sea **después** de `styles.css`: en un empate gana siempre ella.

Sus selectores son del tipo `.artalk > .atk-list > .atk-list-header`, (0,3,0).
El prefijo `.comentarios` añade una clase y deja los de aquí en (0,4,0). **Quien
quite ese prefijo para «simplificar» desactiva la regla** sin que nada avise.

### El `pageKey` lo escribe el build, y es lo que sobrevive a la mudanza

> ⚠️ **ES EL PUNTO QUE MÁS CARO SALE SI SE HACE MAL, Y NO DA NINGÚN ERROR.**
> Artalk usa por defecto `location.pathname`, que **hoy** incluye el prefijo de
> GitHub Pages:
>
> | | Ruta |
> |---|---|
> | hoy | `duowave-web.github.io/el-derecho-escrito/articulos/<slug>/` |
> | mañana | `elderechoescrito.es/articulos/<slug>/` |
> | **`pageKey`** | **`/articulos/<slug>/`** — igual en las dos |
>
> Con el valor por defecto, al conectar el dominio **todos los comentarios se
> quedarían huérfanos**: no se borran, simplemente dejan de encontrarse, y lo
> que se ve es una caja vacía. Nada avisa.
>
> Por eso lo escribe el generador en `data-pagekey`, y el JS lo lee de ahí en
> vez de deducirlo. **No hay que cambiarlo nunca** en un artículo publicado: esa
> clave es lo que ata cada comentario a su artículo.

El `pageTitle` sale del titular del artículo y solo lo usa el panel y los
avisos por correo.

### Carga diferida

231 KB entre JS y CSS, para una caja que está al final y que mucha gente no
llega a ver. Se piden con un `IntersectionObserver` sobre la **sección**, con
`rootMargin: 400px` para que lleguen antes de que entre en pantalla.

> ⚠️ **SE OBSERVA LA SECCIÓN Y NO LA CAJA, y eso costó un fallo mudo.** La caja
> nace vacía, así que mide 0 px de alto, y un observador sobre un elemento sin
> área no dispara de forma fiable. La sección siempre tiene contenido —el `<h2>`
> y la nota— así que siempre tiene área.
>
> La caja lleva además `min-height: 220px`, que reserva sitio y evita que la
> página pegue un salto cuando Artalk monta.

### Lo que se le impone al servidor desde el código

> ⚠️ **LA CONFIGURACIÓN DEL SERVIDOR CONTRADICE LOS REQUISITOS, Y SE LE GANA
> DESDE EL FRENTE.** Su `/api/v2/conf` trae hoy:
>
> | Opción del servidor | Qué implica | Qué se pone en el código |
> |---|---|---|
> | `gravatar.mirror: gravatar.com` | la IP y el hash del correo del lector van a un tercero | `avatarURLBuilder` → inicial en un SVG incrustado |
> | `emoticons: …jsdelivr.net` | un segundo tercero, y emoticonos que no se quieren | `emoticons: false` |
> | `imgUpload: true` | subida de imágenes | `imgUpload: false` |
> | `vote: true` | votos | `vote: false`, `voteDown: false` |
> | `darkMode: "inherit"` | widget oscuro sobre una web que **no** tiene modo oscuro | `darkMode: false` |
> | `locale: "en"` | interfaz en inglés | objeto de traducción completo |
>
> La precedencia documentada de Artalk es **«código del front > variables de
> entorno > panel»**, así que las opciones locales ganan.
>
> ⚠️ **NO SE ACTIVA `preferRemoteConf`**, que invierte esa precedencia. Si
> alguien lo pusiera, volverían Gravatar y jsDelivr y los datos del lector
> saldrían a dos terceros **sin que nada avisara**.

**Comprobado con `performance.getEntriesByType('resource')`**: con los
comentarios cargados, el bloque no genera ni una petición fuera de
`comentarios.elderechoescrito.es`.

> **Lo que sí sale fuera, y no es de los comentarios:** el sitio entero carga
> las tipografías desde `fonts.googleapis.com` y `fonts.gstatic.com`. Es
> anterior a esto y queda fuera del encargo, pero si la privacidad del lector
> importa de verdad, ese es el tercero que queda.

### El español lo ponemos nosotros

> ⚠️ **ARTALK NO TRAE ESPAÑOL.** El objeto `ES` de `main.js` tiene las ~100
> claves de su `en.ts` de la v2.10.0, **todas**, incluidas las que esta
> instalación no llega a enseñar. Una clave que falte no da ningún error: cae al
> inglés y aparece una palabra suelta en otro idioma en mitad de la interfaz.
>
> **Al actualizar Artalk hay que comparar la lista con su `en.ts`**: una clave
> nueva no se traduce sola y tampoco avisa.

### Los campos, y lo que Artalk no deja configurar

Su editor pinta siempre tres:

```html
<input name="name"  class="atk-name"  required>
<input name="email" class="atk-email" required>
<input name="link"  class="atk-link">        <- este sobra
```

Los dos primeros **ya nacen obligatorios**, así que ese requisito no hay que
forzarlo. El tercero no tiene opción para quitarlo y se oculta con
`display: none` —no con `visibility`— para que tampoco reciba el foco.

> ⚠️ **NINGÚN CAMPO DE ARTALK TIENE `<label>`: se apoyan solo en el
> placeholder**, que desaparece al escribir y que varios lectores de pantalla no
> anuncian. `etiquetarCampos()` les pone un `aria-label` al montarse.
>
> ⚠️ **Y ESO ESTUVO EN UN `setTimeout(…, 0)` QUE LLEGABA DEMASIADO PRONTO.**
> `Artalk.init()` devuelve **antes** de pintar el editor, así que los campos no
> existían todavía y no se etiquetaba ninguno. No daba error y no se ve
> mirando: se descubrió leyendo el DOM. Hoy espera con un `MutationObserver`,
> que no es una apuesta sobre cuánto tarda.

### La nota de privacidad

Nace **detrás** de la caja, para que se vea sin JavaScript, y el JS la recoloca
bajo el editor si Artalk ha montado. Si Artalk cambiara el nombre de
`.atk-main-editor`, la nota se queda donde estaba en vez de desaparecer.

> ⚠️ **ENLAZA A `/privacidad/`, QUE TODAVÍA NO EXISTE.** Hoy ese enlace da 404.
> Está puesto a propósito, para no tener que acordarse de añadirlo después,
> pero **hay que crear la página antes de abrir los comentarios al público**.

### El estilo: se remapean sus variables, no se pelea con sus selectores

Artalk declara dieciocho `--at-color-*` sobre `.artalk` y todo su CSS las usa.
Redefinirlas tiñe el widget entero con los tokens del sitio **sin tocar ni una
de sus reglas**, así que una actualización suya no se lleva el tema por delante.
Solo dos reglas tocan clases `.atk-*`: el nombre de quien comenta y la fecha.

⚠️ **La clase `artalk` acaba EN LA PROPIA CAJA**, no en un hijo: el selector es
`.comentarios .artalk` y `caja.classList.contains('artalk')`, no
`caja.querySelector('.artalk')`.

### Qué pasa si el servidor no responde

| | |
|---|---|
| El `<script>` no carga | `script.onerror` escribe un párrafo en la caja. Sin esto se quedaría en blanco para siempre |
| Carga pero la API falla | Artalk enseña su propio error dentro de la caja |
| Sin JavaScript | se ve el `<noscript>`, con salida a `contacto/` |

**En los tres casos el artículo se lee entero.** La sección no puede romperlo
porque no contiene nada del artículo.

### En el PDF no sale

`.comentarios` está en la lista de `imprimir.css`. Se oculta la sección entera
—no solo la caja— para que se vayan también el `<h2>`, la nota y el
`<noscript>`. Un PDF con los comentarios del día que se descargó sería un
documento que envejece solo, y además `pdf.mjs` no espera a que Artalk monte:
lo único que saldría es un título sobre un hueco.

**Verificado**: el PDF sigue en 13 páginas y 543 730 bytes, los mismos que
antes de esto, y la palabra «Comentarios» no aparece en su texto.

### La plantilla de correo: `servidor/artalk/correo.html`

Artalk manda dos avisos —uno al autor por cada comentario nuevo y otro a un
lector cuando le responden— y por defecto usa una plantilla **en chino**, con un
botón «回复» y «Powered By Artalk Go» al pie.

La propia está en **`servidor/artalk/correo.html`**.

> ⚠️ **ESE ARCHIVO NO LO SIRVE LA WEB NI LO LEE NINGÚN NAVEGADOR.** Vive en el
> repositorio solo para tenerlo versionado; quien lo usa es el servidor de
> comentarios, que lo lee de su carpeta de datos. **Copiarlo al repositorio no
> lo instala**: hay que subirlo al servidor, y los pasos están abajo.
>
> ⚠️ **Y NO PUEDE LLEVAR NI UN SECRETO.** El repositorio es público y GitHub
> Pages sirve la raíz, así que es descargable en
> `/servidor/artalk/correo.html`. Hoy son textos y colores; quien lo edite que
> no meta claves ni direcciones privadas.

#### Las variables, verificadas y con su fuente

De la documentación oficial de Artalk, [Email
Notifications](https://artalk.js.org/en/guide/backend/email):

| Variable | Qué es |
|---|---|
| `{{nick}}` | apodo de quien comenta |
| `{{content}}` | contenido del comentario |
| `{{reply_nick}}` | apodo del destino de la respuesta |
| `{{reply_content}}` | contenido de la respuesta |
| `{{page_title}}` | título de la página |
| `{{page_url}}` | URL de la página |
| `{{link_to_reply}}` | enlace al comentario |
| `{{site_name}}` | nombre del sitio |
| `{{site_url}}` | URL del sitio |

Y dos espacios de nombres completos, `{{comment.*}}` —el comentario que dispara
el aviso— y `{{parent_comment.*}}` —al que responde—, con estos campos:
`badge_color`, `badge_name`, `content`, `content_raw`, `date`, `datetime`,
`email`, `email_encrypted`, `id`, `is_allow_reply`, `is_collapsed`,
`is_pending`, `link`, `nick`, `page_key`, `page_title`, `rid`, `site_name`,
`time`, `ua`, `visible`, `vote_down`, `vote_up`, más `page.*` y `site.*`.

> ⚠️ **LA PLANTILLA USA `{{comment.*}}` Y NO LAS SUELTAS, A PROPÓSITO.** Cuál es
> cuál en el par `{{nick}}` / `{{reply_nick}}` depende de si el correo avisa de
> una respuesta o de un comentario nuevo, y la documentación no lo deja cerrado:
> lo único que lo desambigua es el asunto por defecto —«You have received a
> reply from @{{reply_nick}}»—, de donde se deduce que `reply_nick` es **quien
> responde** y `nick` **quien recibe**.
>
> `{{comment.nick}}` y `{{comment.content}}` son siempre el comentario que ha
> disparado el aviso, valga para el caso que valga. Es menos que fiarse de una
> deducción.

> ⚠️ **NO SE MUESTRA EL COMENTARIO AL QUE SE RESPONDE, y es una limitación
> conocida, no un olvido.** Haría falta un condicional —algo como
> `{{#parent_comment}}…{{/parent_comment}}`— para no pintar un bloque vacío en
> los avisos de comentario nuevo, que no tienen padre.
>
> **No he podido verificar que el motor admita condicionales.** La documentación
> dice «sintaxis Mustache» pero lista las variables anidadas con **punto**
> —`{{comment.page.admin_only}}`—, que es lo que hace un mapa aplanado con
> reemplazo simple, no un Mustache de verdad. Y un Mustache de verdad anidaría
> objetos.
>
> La plantilla de hoy **es correcta en los dos casos** sin condicionales. Si
> alguien confirma que las secciones funcionan, el bloque del comentario
> original se añade con `{{parent_comment.nick}}` y `{{parent_comment.content}}`.
> **Hasta entonces no se añaden**: un `{{#…}}` que no se interprete sale impreso
> en el correo.

#### Cómo se instala en el servidor

```sh
# 1. Subir el archivo desde el Mac
scp servidor/artalk/correo.html \
    TU_USUARIO@comentarios.elderechoescrito.es:/opt/comentarios/elderechoescrito/data/

# 2. En el docker-compose.yml de Artalk, dentro de `environment:`
#    La ruta es la de DENTRO del contenedor, no la del host.
      - ATK_EMAIL_MAIL_TPL=/data/correo.html

# 3. Recargar
docker compose up -d
```

> ⚠️ **LA RUTA DE LA VARIABLE ES LA DE DENTRO DEL CONTENEDOR.** `scp` deja el
> archivo en el host, en `/opt/comentarios/elderechoescrito/data/`; lo que ve
> Artalk es el punto de montaje. Con el montaje habitual
> —`/opt/comentarios/elderechoescrito/data:/data`— eso es `/data/correo.html`.
> **Hay que comprobar el `volumes:` del compose antes de dar el valor por
> bueno**: si el montaje fuera otro, la variable apunta a un archivo que no
> existe y Artalk cae a su plantilla en chino **sin dar ningún error**.

El nombre de la variable sale de la convención documentada —[Environment
Variables](https://artalk.js.org/en/guide/env): «*Environment variable names
start with `ATK_`, in all uppercase, corresponding to each node in the
configuration file*»— aplicada a la clave `email.mail_tpl`.

> **Pendiente, y es otra tarea:** los ASUNTOS siguen en chino. Son dos claves
> aparte, `email.mail_subject` —aviso al lector— y `admin_notify.mail_subject`
> —aviso al autor—, y son las que hacen que un comentario nuevo se anuncie como
> «has recibido una respuesta». La plantilla no las toca.
>
> ⚠️ **Sus nombres como variable de entorno NO están verificados.** La
> convención daría `ATK_EMAIL_MAIL_SUBJECT`, pero la de `admin_notify` no se ha
> podido confirmar. Conviene ponerlas en el archivo de configuración, donde las
> claves sí están documentadas, en vez de adivinar el nombre de la variable.

### Cómo se modera

Está en `PARA-EL-CLIENTE.md` con sus pasos. En resumen: el panel vive en
`https://comentarios.elderechoescrito.es/admin`, la publicación es inmediata
—no hay cola de aprobación salvo que un comentario caiga en el filtro de
palabras— y el autor responde desde la propia web escribiendo su nombre y su
correo, momento en el que Artalk le pide la contraseña y le pone la etiqueta
«Autor».

---

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
