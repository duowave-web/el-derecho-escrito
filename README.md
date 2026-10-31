# El Derecho Escrito

Blog de análisis jurídico en HTML, CSS y JavaScript puro. Sin frameworks, sin build, sin dependencias. Optimizado para posicionamiento.

Producción: **https://elderechoescrito.es**, servida por **GitHub Pages** desde `main`. Cloudflare solo gestiona el DNS, **sin proxy**.

## Estructura

```
.
├── index.html                                   Portada — https://elderechoescrito.es/
├── articulos/
│   ├── index.html                               Listado — /articulos/
│   └── masc-requisito-procedibilidad/
│       ├── index.html                           Artículo — /articulos/masc-requisito-procedibilidad/
│       ├── portada.jpg                          Imagen optimizada, la escribe el generador
│       └── masc-requisito-procedibilidad.pdf    PDF descargable, lo escribe el generador
├── sobre/index.html                             /sobre/
├── contacto/index.html                          /contacto/
├── css/styles.css
├── js/main.js                                   Solo buscador y año del pie
├── sitemap.xml
├── robots.txt
├── feed.xml                                     RSS
├── 404.html
├── og.png                                       Imagen para redes (1200×630)
├── favicon.svg
├── _headers                                     Cabeceras para Cloudflare Pages. HOY NO SE APLICAN: GitHub Pages lo ignora
└── _redirects                                   301 para Cloudflare Pages. HOY NO SE APLICAN: GitHub Pages lo ignora
```

Cada página vive en su propia carpeta como `index.html`, así la URL queda limpia (`/articulos/mi-articulo/` en vez de `/articulos/mi-articulo.html`).

## Qué se ha hecho para posicionar

**Indexación**

- Una URL limpia y canónica por página, declarada con `<link rel="canonical">`.
- `sitemap.xml` con `lastmod` y prioridades, enlazado desde `robots.txt`.
- Feed RSS en `/feed.xml`, enlazado desde el `<head>` de todas las páginas.
- `404.html` con `noindex, follow`.
- `_redirects` con 301 desde la estructura antigua, para no perder nada.

**Contenido rastreable**

- El listado de artículos está escrito directamente en el HTML. Antes lo pintaba JavaScript, y eso es un riesgo: Google puede tardar en renderizar o directamente no hacerlo. Ahora el contenido está en la respuesta inicial.
- El buscador solo filtra lo que ya existe en la página. Sin JS, se siguen viendo todos los artículos.

**Datos estructurados (JSON-LD)**

- Portada: `WebSite` con `SearchAction`, `Organization` y `Blog`.
- Listado: `CollectionPage` + `ItemList` + `BreadcrumbList`.
- Artículo: `BlogPosting` completo (fechas, sección, keywords, wordCount, imagen, autor, editor) + `BreadcrumbList` + `FAQPage`.
- Acerca de: `AboutPage`. Contacto: `ContactPage`.

El `FAQPage` del artículo es el que puede darte resultados enriquecidos en Google. Merece la pena mantenerlo en artículos que respondan preguntas concretas.

**Metadatos sociales**

Open Graph y Twitter Cards completos en todas las páginas, con imagen de 1200×630 (`og.png`).

**Semántica y accesibilidad**

Un solo `<h1>` por página y jerarquía correcta de `<h2>`/`<h3>`; `<article>`, `<time datetime>`, `<nav aria-label>`; migas de pan visibles y en JSON-LD; enlace de salto al contenido; `aria-current` en el menú.

**Rendimiento**

Sin librerías, CSS y JS mínimos, JS con `defer`. Las tipografías se cargan de **Google Fonts**, con un `@import` en la primera línea de `css/styles.css`. Las cabeceras de caché de `_headers` **no se aplican**: GitHub Pages ignora ese archivo y usa las suyas.

## Publicar un artículo nuevo

> ⚠️ **ESTA SECCIÓN DESCRIBÍA SEIS PASOS A MANO Y YA NO VALE NINGUNO.** Decía
> que había que copiar el HTML de otro artículo, reescribir sus metadatos y el
> JSON-LD, añadir la tarjeta en dos sitios, tocar `sitemap.xml` y `feed.xml`,
> actualizar el `itemListElement` y hacer push. Y acababa con «Cloudflare Pages
> despliega solo», que tampoco es cierto: **despliega GitHub Pages desde `main`**.
>
> Todo eso lo hace ahora el generador. Lo que sigue es el flujo real.

**El cliente publica solo, desde GitHub.** No toca código ni ejecuta nada:

```
1. CLIENTE     sube el .docx y su imagen a una carpeta de Drive
2. n8n         lee Drive, monta articulo.json + portada.jpg
                 y abre un PR en GitHub
3. CHECK       contenido.yml: valida, genera, empuja lo generado AL PR
                 y comenta con el enlace de vista previa
4. TÚ          miras los avisos del comentario
5. CLIENTE     abre la vista previa y pulsa «Merge pull request»
6. PUBLICADO   GitHub Pages sirve lo que hay en main
```

**El merge es la publicación.** `contenido.yml` empuja lo generado a la rama del
PR, así que al mergear esos archivos entran en `main` ya hechos. **No hay ningún
workflow que escuche `push` a `main`**, y así se evita el bucle.

### Si publicas tú, a mano

Un archivo y un comando:

```sh
contenido/articulos/<slug>/articulo.json   # el texto
contenido/articulos/<slug>/portada.jpg     # la imagen

cd scripts && npm run publicar             # build + PDF
```

De ahí salen la página, la imagen optimizada, el PDF, las siete regiones
generadas —portada, listado, `ItemList`, sitemap y feed— y nada más que tocar.

El contrato del `articulo.json` está entero en `CLAUDE.md`.

### Lo que sigue siendo manual

- **Borrar** un artículo: el build no lo hace. Hay que quitar su carpeta de
  `contenido/` **y** la de `articulos/`.
- **Las tarjetas de atrezo** de la portada y el listado: viven fuera de las
  regiones y se borran antes de entregar.

## Lo que había que rellenar, y ya está

| Dónde | Qué | Estado |
|---|---|---|
| `sobre/index.html` | Los textos de la página, con nombre real | ✅ Hecho: textos del cliente, sin corchetes, firmados por Juan Contera Miranda |
| `contacto/index.html` | El correo y el endpoint de Formspree | ✅ Hecho: `jcontera@icam.es` y `https://formspree.io/f/xoeennvv` |
| JSON-LD | `author` como `Person` | ✅ Hecho en los artículos. La portada, el listado y las páginas de sección declaran `El Derecho Escrito` a propósito: son páginas del sitio, no artículos firmados |

### Formulario de contacto

Ya está configurado: envía a `https://formspree.io/f/xoeennvv`, en la cuenta de
Formspree de Juan, que reenvía cada mensaje a `jcontera@icam.es`.

Con JavaScript se envía por `fetch` y responde en la misma página; sin
JavaScript, el envío normal del navegador sigue funcionando. Lleva una trampa
antispam (`_gotcha`) que Formspree entiende, y el asunto lo fija el campo
oculto `_subject`. Para cambiar de endpoint basta con tocar el `action` del
`<form>`: el JS lo lee de ahí.

## Después de desplegar

1. Da de alta el sitio en [Google Search Console](https://search.google.com/search-console) y envía `sitemap.xml`.
2. Lo mismo en [Bing Webmaster Tools](https://www.bing.com/webmasters).
3. Comprueba los datos estructurados en el [test de resultados enriquecidos](https://search.google.com/test/rich-results).
4. Pasa un [PageSpeed Insights](https://pagespeed.web.dev/).
5. En GitHub, **Settings → Pages** del repositorio, activa **Enforce HTTPS**. El dominio canónico es sin `www`: GitHub Pages ya redirige `www` y `http://` a `https://elderechoescrito.es/` con un 301.

> ⚠️ **El proxy de Cloudflare tiene que seguir APAGADO** («Solo DNS», la nube
> gris) en todos los registros del dominio. En España se bloquean IP de
> Cloudflare los fines de semana de fútbol, por la lucha de LaLiga contra la
> piratería, y mientras la web pasó por Cloudflare dejaba de cargar esos días.
> Está razonado en `CLAUDE.md`, en «Rutas».

### `_headers` y `_redirects` se quedan, aunque hoy no hagan nada

Son de Cloudflare Pages y GitHub Pages no los lee. Se conservan por si algún día
se vuelve a Cloudflare Pages.

**`_redirects` no tiene páginas-puente en GitHub Pages, y es a propósito.** Sus
cinco reglas llevan de URLs con `.html` a las limpias:

| Regla | Hoy en `elderechoescrito.es` | Por qué no hay puente |
|---|---|---|
| `/index.html` → `/` | **200** | GitHub Pages ya la sirve: es la portada |
| `/articulos.html`, `/sobre.html`, `/contacto.html` | 404 | existieron **26 minutos** el 20/08/2026 —de `ce0db5d` a `ed95fed`—, en la demo de `github.io` y antes de que hubiera dominio. Nunca se publicaron aquí |
| `/articulos/principio-de-legalidad-penal.html` | 404 | además, el **destino tampoco existe**: era el artículo de ejemplo y se borró |

Si alguna vez hiciera falta un puente, el equivalente en GitHub Pages es un
`.html` en esa misma ruta —`sobre.html` en la raíz, no `sobre.html/index.html`—
con `<meta http-equiv="refresh">`, `canonical` a la URL nueva, `noindex` y un
enlace visible.

## Ver el sitio en local

Las rutas son relativas —salvo en `404.html`, que va con rutas desde la raíz—,
pero aun así hace falta un servidor: el listado y «Continúa leyendo» usan
`fetch`, y eso no funciona abriendo los archivos con `file://`.

```bash
python3 -m http.server 8000
```

Y abre `http://localhost:8000`.

## Licencia

El código es libre de usar. El contenido de los artículos es propiedad del autor.
