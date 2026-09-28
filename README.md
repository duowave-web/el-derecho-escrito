# El Derecho Escrito

Blog de análisis jurídico en HTML, CSS y JavaScript puro. Sin frameworks, sin build, sin dependencias. Optimizado para posicionamiento.

Producción: **https://elderechoescrito.es** (Cloudflare Pages)

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
├── _headers                                     Cabeceras de Cloudflare Pages
└── _redirects                                   301 desde las URLs antiguas
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

Sin fuentes externas (tipografías del sistema), sin librerías, CSS y JS mínimos, JS con `defer`, cabeceras de caché en `_headers`.

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

## Cosas que tienes que rellenar

| Dónde | Qué |
|---|---|
| `sobre/index.html` | Los párrafos entre corchetes. Firmar con nombre real ayuda al E-E-A-T |
| `contacto/index.html` | Tu email y el endpoint de Formspree |
| Todos los JSON-LD | Cambiar el `author` de `Organization` a `Person` con tu nombre, cuando lo tengas |

### Formulario de contacto

1. Cuenta gratuita en [Formspree](https://formspree.io).
2. Copia el endpoint (`https://formspree.io/f/abcdefgh`).
3. Pégalo en el `action` del `<form>` de `contacto/index.html`.

Lleva ya una trampa antispam (`_gotcha`) que Formspree entiende.

## Después de desplegar

1. Da de alta el sitio en [Google Search Console](https://search.google.com/search-console) y envía `sitemap.xml`.
2. Lo mismo en [Bing Webmaster Tools](https://www.bing.com/webmasters).
3. Comprueba los datos estructurados en el [test de resultados enriquecidos](https://search.google.com/test/rich-results).
4. Pasa un [PageSpeed Insights](https://pagespeed.web.dev/).
5. En Cloudflare, fuerza HTTPS y decide si el dominio canónico es con o sin `www` (redirige uno al otro; ahora mismo todo apunta a la versión sin `www`).

## Ver el sitio en local

Las rutas son absolutas, así que necesitas un servidor:

```bash
python3 -m http.server 8000
```

Y abre `http://localhost:8000`.

## Licencia

El código es libre de usar. El contenido de los artículos es propiedad del autor.
