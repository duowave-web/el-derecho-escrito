# El Derecho Escrito

Blog de análisis y artículos jurídicos. Proyecto de cliente: abogado de Derecho
Administrativo, Urbanismo y Jurisdicción Contencioso-Administrativa.

Dominio final previsto: `elderechoescrito.es`.

---

## Los textos visibles son del cliente — no se reescriben

El hero, la banda de suscripción, `sobre/`, `contacto/`, el aviso de cierre del
artículo y el bloque de suscripción del lateral llevan **textos definitivos
entregados por el cliente**. Se copiaron literalmente.

**No se reescriben, no se acortan y no se les corrige el estilo**, ni siquiera
para ajustar una línea que rompe mal. Si un texto no cabe, se cambia el diseño
—como se hizo con la columna del hero, que pasó de 556 a 620 px— o se pregunta.
Si hay una errata, se avisa; no se corrige por iniciativa propia.

Dos convenciones suyas que conviene no «arreglar»:

- **«El Derecho Escrito» va en cursiva cuando aparece dentro de un texto** y sin
  ella en los títulos de página. Así que `sobre/` se titula «Sobre El Derecho
  Escrito» en redonda, y el nombre va en `<em>` en la banda de suscripción, en
  la apertura de `sobre/`, en `contacto/` y en el lateral del artículo.
- **Escribe «Derecho administrativo» y «jurisdicción contencioso-administrativa»**,
  con minúscula tras «Derecho». La cabecera de este archivo las capitaliza; el
  criterio del cliente manda en los textos.

**Lo que NO venía en su documento y sigue como estaba**: las etiquetas de
sección de la portada, el artículo de ejemplo entero, el 404 y las etiquetas del
formulario de contacto. Está listado en la sección de deuda pendiente.

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
3. `index.html` — añadir la tarjeta a «Últimos artículos» de la portada, **y si
   la sección está apagada, encenderla**. Ver abajo: no es copiar y pegar sin
   más, porque esa sección **no lista el destacado** y hoy va con `hidden`.
4. `articulos/index.html` — añadir la entrada al listado completo, **con su
   `data-etiquetas`**.
5. **El índice del propio artículo** — un `<li>` por cada `<h2>`. Ver abajo.

Si no, el artículo existe pero es invisible para buscadores y lectores de RSS.
El paso 5 es la excepción: ese no se ve fuera, se ve dentro.

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

#### TODO artículo lleva índice, y se escribe a mano

Va en la **columna del artículo**, entre la entradilla y el primer apartado, y
es obligatorio en cada artículo nuevo. Se copia esta estructura:

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
   artículo.
2. **Cada `<h2>` necesita un `id`**: minúsculas, sin tildes, con guiones
   (`prohibicion-de-analogia`). **Si ya tiene uno, se respeta** — puede haber
   enlaces apuntando desde fuera y no se pueden reescribir.
3. **Los números no se escriben.** Los pone el CSS con un contador, igual que
   los del propio epígrafe.
4. **No se toca el CSS.** Todo el aspecto vive en `.indice`, en `styles.css`.

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

> **Se escribe a mano a propósito, y antes no era así.** Lo generaba
> `indiceDelArticulo()` en `js/main.js`, que leía los `<h2>` y hasta les ponía
> `id` al vuelo. Esa función ya no existe, ni sus dos ayudantes —`crearId()` e
> `idLibre()`—, que no usaba nadie más.
>
> El motivo es la regla dura del proyecto: **el contenido va en el HTML y el JS
> solo enriquece.** Un índice generado no existe sin JavaScript y no lo ve un
> buscador, y un índice es justo de las cosas que un buscador usa para entender
> la estructura de la página.
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
| 1440 | 72,2 | 102,2 | 118 | 15,8 |
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

### El destacado de la portada NO es un quinto paso del checklist

`index.html` abre con una sección **«La lectura recomendada»**, entre el hero y
«Últimos artículos», con un solo artículo. **Es una decisión editorial y se
cambia cuando se decide cambiarla**, no cada vez que se publica. Por eso está
aquí y no en la lista de arriba: publicar no obliga a tocarlo.

**No dice «el más leído» ni nada parecido, y no puede decirlo:** no hay
analítica en el proyecto, así que afirmar popularidad sería inventarse un dato.
El rótulo nombra a quien recomienda, no a cuánta gente ha leído.

> ⚠️ **El bloque COPIA datos del artículo, y ese es el precio de tenerlo en el
> HTML.** No se genera solo. Si el artículo destacado cambia, hay que revisar a
> mano: titular, entradilla, categoría —texto y clave del `href`—, fecha —texto
> y `datetime`—, minutos, `src` de la imagen y **los dos `href` de destino**,
> que son el del titular y el de la imagen.
>
> **Nada de esto da error si se queda desfasado**: la portada seguiría
> enseñando un titular viejo con un enlace que funciona. Se nota leyendo, no
> probando. El `index.html` lleva la lista completa en un comentario, junto al
> bloque, con el artículo del que procede escrito arriba.

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

### Las tarjetas de ejemplo de la portada — BORRAR AL PUBLICAR

> ⚠️ **«Últimos artículos» se ve, y las TRES TARJETAS que hay dentro son
> ATREZO.** Sus artículos no existen: «La discrecionalidad técnica de la
> Administración», «El interés legítimo en el recurso contencioso-administrativo»
> y «El control judicial de los planes parciales». Están solo para que el
> cliente vea la sección con contenido.
>
> **Se borran cuando se publiquen artículos reales.** Si se publican y no se
> borran, la portada enseñará artículos inventados junto a los de verdad, y
> **nada dará error**: se ve leyendo, no probando.

**Cómo quitarlas, en un paso:** en `index.html` se borra todo lo que hay entre
las dos marcas de caja dentro de `.tarjetas`:

```
╔════════════════════════════════════════════════╗
║  EJEMPLO — BORRAR CUANDO HAYA ARTÍCULOS REALES ║   ← desde aquí
...las tres <article class="… tarjeta--ejemplo">...
║  FIN EJEMPLO — hasta aquí lo que hay que borrar ║   ← hasta aquí
╚════════════════════════════════════════════════╝
```

También se puede localizar por clase, que es más rápido:

```sh
grep -n 'tarjeta--ejemplo\|EJEMPLO' index.html
```

Y hay que borrar **la regla `.tarjeta--ejemplo`** de `styles.css`, que se queda
sin uso. Es una sola —el apagado del zoom— y está rotulada como tal.

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
> tercera, `fondo-cabecera.jpg`, es un lavado casi blanco que en un hueco de
> 365×205 se lee como una imagen que no ha cargado, y la cuarta es el retrato
> del autor—. Con dos fotos para tres tarjetas, **cualquier reparto deja una
> desparejada o dos gemelas contiguas**:
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

> **Balance por artículo, para tenerlo en un sitio:** la categoría se repite en
> **9** puntos, la autoría en **8** —más **2** en `sobre/`, que no son por
> artículo— y cada etiqueta en **3**. Las etiquetas son las más baratas de las
> tres y las únicas cuyo despiste degrada en silencio a «no filtra» en vez de a
> «se ve mal».

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
| Botón pulsado | **«Ensayo»** encendido | «Todos» |
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
| `?categoria=fundamento` (4 de 4) | 4 artículos publicados ✗ | **4 resultados** |
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

## Autoría — 8 sitios por artículo, más 2 en `sobre/`

> ✅ **El nombre YA ESTÁ CONFIRMADO por el cliente, y esta sección decía lo
> contrario.** Aquí se avisaba de que «Juan Contera Miranda» y su bio venían de
> la maqueta de referencia y estaban pendientes de confirmar. Los textos
> definitivos del cliente traen el nombre y una biografía propia —colegio,
> despacho, formación—, así que el nombre es real.
>
> ⚠️ **Lo que NO coincide es la bio.** La del lateral del artículo sigue siendo
> la de la maqueta: «Abogado especializado en Derecho Administrativo, Urbanismo
> y Jurisdicción Contencioso-Administrativa». La de `sobre/` es la nueva, de
> tres párrafos. El documento no daba una bio corta para el lateral, así que se
> dejó la vieja — **hay que pedírsela al cliente.**

Sin build no hay una sola fuente de verdad: cada artículo repite el nombre, la
bio y el retrato a mano. Al publicar —o al cambiar de autor— hay que tocar los
ocho.

> ⚠️ **Y desde que `sobre/` tiene retrato, la cuenta ya no acaba en el
> artículo.** Esa página añade **dos** puntos más: el `src` del `<img>` dentro
> de `.sobre__retrato` y su `alt`, que también lleva el nombre escrito. Son los
> puntos 9 y 10, y no salen en los `grep` de abajo porque esos buscan dentro de
> `articulos/`.
>
> El retrato de `sobre/` reutiliza **el mismo archivo** que el del lateral,
> `img/juanconteramiranda.jpeg`, y comparte la clase `.autor__retrato`. Así que
> el nombre del autor está dentro del nombre del archivo y cambiarlo arrastra
> los dos `src` a la vez. Para encontrarlos todos:
>
> ```sh
> grep -rn 'juanconteramiranda' --include='*.html' .
> ```

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
| **944 px** | se oculta el campo del buscador | hasta ahí cabe la fila con el campo desplegado; por debajo, abrirlo partiría la marca en dos líneas |
| **724 px** | la cabecera pasa a dos filas | lo mismo con el buscador cerrado. Ahí ya no hay nada que ocultar y la única salida es apilar |
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

**Lo que el rediseño NO toca, por encargo expreso:** `--papel`, `--papel-alt`,
`--ancho-amplio`, los textos del hero y su altura de 520 px. El fondo sigue
siendo **blanco puro** y la banda de suscripción sigue en `--papel-alt` frío,
que es una petición del cliente. Si algún día se pide el fondo crema de la
maqueta, hay que releer antes la sección del color.

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
| **Filete del rótulo** | sale del texto de «LA LECTURA RECOMENDADA» y «ÚLTIMOS ARTÍCULOS» hasta el borde | **se queda** |
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
> rótulo más largo —«La lectura recomendada»— pide **322,5 px** en Cormorant 20
> versales, y eso no baja porque el cuerpo es fijo. Con los 20 del hueco y un
> mínimo de 40 para que la línea se lea como filete y no como un guion, hacen
> falta 430,5 px de ventana. Lo que sobra para la línea:
>
> | Ventana | 375 | 400 | 430 | 431 | 480 | 600 |
> |---|---|---|---|---|---|---|
> | Filete | **−15,5** | 9,5 | 39,5 | **40,5** | 89,5 | 209,5 |
>
> Con el negativo pasaba algo peor que quedarse sin línea: **el texto envolvía a
> dos líneas** —64 px en vez de 32— porque el hueco y el `::after` le robaban
> sitio. Volviendo a `display: block` el texto recupera su única línea, porque
> 322,5 caben en los 327 de la columna a 375. **Quitar el filete es lo que
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

El bloque de la portada es **antetítulo, titular, subtítulo y dos botones**.

> ⚠️ **EL ANTETÍTULO VOLVIÓ, y esta sección decía que no había.** Aquí se
> explicaba que el bloque iba «sin antetítulo encima», que llevó uno —«BLOG
> JURÍDICO»— y se retiró, y que por eso se había retirado también
> `.portada--video .portada__antetitulo`.
>
> Los textos definitivos del cliente traen una **línea de áreas** en ese sitio:
> «Derecho administrativo · Urbanismo · Jurisdicción contencioso-administrativa».
>
> **Con ella ha vuelto la regla de contraste, y no es opcional.** Sobre el vídeo
> `--acento` se queda en **2,50:1** y no llega a AA; `--acento-oscuro` lo
> arregla. Medido con el antetítulo puesto: **5,24–5,44:1** entre 932 y 1440 px.
> Si alguien vuelve a quitar la línea de áreas, la regla se va con ella; si
> alguien la pone sin la regla, el rótulo se publica ilegible y nada avisa.
>
> **`.portada__antetitulo` también la sigue usando `404.html`** para el rótulo
> «Error 404». Allí va sobre blanco, donde `--acento` da 5,91:1 y no hace falta
> oscurecerlo.

> **La línea de áreas se escribe en caja normal, no en mayúsculas.** Las
> versales las pone `text-transform` en el CSS, igual que en las categorías.
> Escribirla en mayúsculas en el HTML haría que algunos lectores de pantalla la
> deletrearan letra a letra. El documento del cliente la traía en caps, pero eso
> era una indicación de estilo, no el contenido.

El bloque se centra solo: `.portada` es flex con `align-items: center`, así que
los elementos se recolocan sin tocar nada. Verificado que la franja sigue en
520 px en 1440, 1084, 1000, 960 y 932 —lo garantiza el `min-height`— y que el
desvío respecto al reparto del padding es 0.

#### La columna del hero mide 620 px, y los textos del cliente la fijaron

La rejilla del hero estuvo en `1fr 1fr`, que a 1440 reparte **556** a cada lado.
Con los textos definitivos eso **no cabía en la franja de 520**: la línea de
áreas se partía en dos, el titular se iba a 3 líneas y el subtítulo a 6.

| Ancho | Con 556 | Con 620 |
|---|---|---|
| 1440 | 605,7 px | **520 exactos** |
| 1000 | 635,2 px | **520 exactos** |
| 375 | 746,8 px | 686,6 px (una columna) |

**620 es el mínimo, y lo fija la línea de áreas**: pide **619 px** para ir en
una sola línea. La casualidad útil es que ese mismo ancho baja el titular a 2
líneas y el subtítulo a 5. Por debajo de 620 se rompe lo primero.

Va en `minmax(0, 620px) 1fr` y no en una fracción porque el ancho que hace falta
es **absoluto** —lo pide un texto— y no una proporción del contenedor. La
segunda columna se queda con lo que sobre, que es el hueco por donde se ve la
figura: 492 px a 1440 y 292 a 1000.

> ⚠️ **Si se alarga el texto de la línea de áreas, este número hay que volver a
> medirlo.** Sale del contenido, no del diseño.

> ⚠️ **En móvil el hero crece y se acepta.** A 375 ocupa **686,6 px**, el 84,6 %
> de una pantalla de 812. No se corta nada —para eso es `min-height`— pero llena
> casi toda la pantalla. Lo que lo recorta es el subtítulo, que baja a 16 px por
> debajo de 600: 18,4 daba 746,8 px y el 92 %. El resto del alto lo ponen el
> titular (4 líneas) y la línea de áreas (2), y esos se dejan al cuerpo que les
> toca.

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
> 166 px —«Artículos», «Acerca de» (165,6), «Contacto»—. Medido, hay sitio hasta
> unos **450 px** de título (12,71). A partir de ahí el texto empieza a invadir
> los bordes oscuros:
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
>
> **Y estuvo a punto de hacer falta.** `sobre/` se tituló un tiempo «Sobre El
> Derecho Escrito», que medía **417,8 px**: dentro del límite, pero a solo 32 px
> de él. Hoy dice «Acerca de» y baja a 165,6, con lo que el margen vuelve a ser
> amplio. Si algún día se alarga otra vez, el número a vigilar es ese 450.

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
- ~~`sobre/index.html` tiene texto de relleno entre corchetes.~~ **RESUELTO**
  con los textos definitivos del cliente: la página tiene apertura, «Contenido»,
  «Sobre el autor» con retrato, y los dos botones de salida. Ya no queda ningún
  corchete en el sitio.
- ~~La web no dice en qué materias ejerce~~ **RESUELTO, y con ello se cierra la
  contradicción que había aquí.** Los textos del cliente las nombran en cuatro
  sitios: la línea de áreas del hero, su subtítulo, la apertura de `sobre/` y su
  apartado «Contenido». Son Derecho administrativo, urbanismo y jurisdicción
  contencioso-administrativa, o sea las que la cabecera de este archivo daba por
  buenas.

  Ojo a la **grafía del cliente**, que no es la que usa este archivo: él escribe
  «Derecho administrativo» y «jurisdicción contencioso-administrativa», con
  minúscula después de «Derecho». Se respeta tal cual en los textos.
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
| Portada | «LA LECTURA RECOMENDADA», «ÚLTIMOS ARTÍCULOS», «VER TODOS LOS ARTÍCULOS →» | El documento los daba por buenos explícitamente |
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

> ⚠️ **El artículo de ejemplo NO cumple esta regla, y es a propósito.** Su
> `<title>` mide 61, su `description` 184 y sus `keywords` son de Derecho penal.
> No se tocó porque se borra al entregar. Si alguien lo usa de plantilla, tiene
> que ajustar esos tres campos.

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
