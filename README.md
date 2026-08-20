# El Derecho Escrito

Blog de análisis jurídico en HTML, CSS y JavaScript puro. Sin frameworks, sin build, sin dependencias. Optimizado para posicionamiento.

Producción: **https://elderechoescrito.es** (Cloudflare Pages)

## Estructura

```
.
├── index.html                                   Portada — https://elderechoescrito.es/
├── articulos/
│   ├── index.html                               Listado — /articulos/
│   └── principio-de-legalidad-penal/
│       └── index.html                           Artículo — /articulos/principio-de-legalidad-penal/
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
- Sobre mí: `AboutPage`. Contacto: `ContactPage`.

El `FAQPage` del artículo es el que puede darte resultados enriquecidos en Google. Merece la pena mantenerlo en artículos que respondan preguntas concretas.

**Metadatos sociales**

Open Graph y Twitter Cards completos en todas las páginas, con imagen de 1200×630 (`og.png`).

**Semántica y accesibilidad**

Un solo `<h1>` por página y jerarquía correcta de `<h2>`/`<h3>`; `<article>`, `<time datetime>`, `<nav aria-label>`; migas de pan visibles y en JSON-LD; enlace de salto al contenido; `aria-current` en el menú.

**Rendimiento**

Sin fuentes externas (tipografías del sistema), sin librerías, CSS y JS mínimos, JS con `defer`, cabeceras de caché en `_headers`.

## Publicar un artículo nuevo

1. Crea `articulos/<slug>/index.html` copiando el artículo existente. El slug en minúsculas, sin acentos y con guiones — es parte de la URL, así que que contenga la palabra clave.

2. Dentro del archivo, actualiza: `<title>` (50-60 caracteres), `meta description` (150-160), `canonical`, todas las URLs de Open Graph y Twitter, las fechas `article:published_time` y `article:modified_time`, el bloque JSON-LD entero y el contenido.

3. Añade la tarjeta del artículo **en dos sitios**, entre los comentarios `INICIO LISTADO` / `FIN LISTADO`:
   - `articulos/index.html` — arriba del todo
   - `index.html` — arriba del todo, y borra la última si ya hay tres

```html
<article class="entrada">
  <div class="entrada__meta">
    <span class="etiqueta">Derecho civil</span>
    <time datetime="2026-09-01">1 de septiembre de 2026</time>
    <span class="lectura">6 min de lectura</span>
  </div>
  <h2 class="entrada__titulo">
    <a href="/articulos/mi-slug/">Título del artículo</a>
  </h2>
  <p class="entrada__extracto">Dos o tres frases que resuman de qué va.</p>
</article>
```

En `index.html` usa `<h3>` en vez de `<h2>` para el título de la tarjeta (allí el `<h2>` es «Últimos artículos»).

4. Añade la URL a `sitemap.xml` y un `<item>` a `feed.xml`.

5. Actualiza `numberOfItems` y el `itemListElement` del JSON-LD de `articulos/index.html`.

6. Commit y push. Cloudflare Pages despliega solo.

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
