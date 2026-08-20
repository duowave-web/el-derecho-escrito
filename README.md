# El Derecho Escrito

Blog de artículos y análisis jurídico. HTML, CSS y JavaScript puro — sin frameworks, sin build, sin dependencias.

## Estructura

```
.
├── index.html                 Portada con listado y buscador
├── sobre.html                 Página "Sobre el blog"
├── css/styles.css             Estilos
├── js/posts.js                Índice de artículos (lo editas al publicar)
├── js/main.js                 Renderiza el listado y el buscador
└── articulos/                 Un archivo HTML por artículo
    └── principio-de-legalidad-penal.html
```

## Cómo publicar un artículo nuevo

1. Duplica `articulos/principio-de-legalidad-penal.html` y renómbralo con el slug del nuevo artículo (minúsculas, sin acentos, guiones en vez de espacios).
2. Cambia el `<title>`, la `<meta name="description">`, la categoría, la fecha y el contenido.
3. Añade la entrada al principio del array en `js/posts.js`:

```js
{
  titulo: "Título del artículo",
  extracto: "Dos o tres frases que resuman de qué va.",
  fecha: "2026-09-01",
  categoria: "Derecho civil",
  url: "articulos/slug-del-articulo.html",
},
```

4. Guarda, haz commit y push. GitHub Pages actualiza el sitio en un par de minutos.

## Ver el sitio en local

Abre `index.html` directamente en el navegador. No necesita servidor.

## Licencia

El código es libre de usar. El contenido de los artículos es propiedad del autor.
