# El Derecho Escrito

Blog de artículos y análisis jurídico. HTML, CSS y JavaScript puro — sin frameworks, sin build, sin dependencias.

## Estructura

```
.
├── index.html                 Portada (no aparece en el menú)
├── articulos.html             Listado completo + buscador
├── sobre.html                 Sobre mí
├── contacto.html              Formulario y datos de contacto
├── css/styles.css             Estilos
├── js/posts.js                Índice de artículos (lo editas al publicar)
├── js/main.js                 Renderiza el listado y el buscador
└── articulos/                 Un archivo HTML por artículo
    └── principio-de-legalidad-penal.html
```

El menú de navegación es: **Artículos · Sobre mí · Contacto**. A la portada se llega desde el nombre del blog arriba a la izquierda.

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

4. Guarda, haz commit y push. La portada muestra automáticamente los 3 más recientes y `articulos.html` los muestra todos.

## Cosas que tienes que rellenar

- **`sobre.html`** — los párrafos marcados entre corchetes.
- **`contacto.html`** — tu email real (busca `hola@elderechoescrito.com`) y el endpoint del formulario.

### Activar el formulario de contacto

El sitio es estático, así que el formulario necesita un servicio externo. La opción más rápida es [Formspree](https://formspree.io):

1. Crea una cuenta gratuita.
2. Copia el endpoint que te dan (tipo `https://formspree.io/f/abcdefgh`).
3. Pégalo en el atributo `action` del `<form>` de `contacto.html`, sustituyendo `TU_ENDPOINT_AQUI`.

Mientras no lo hagas, el enlace de email sí funciona.

## Ver el sitio en local

Abre `index.html` directamente en el navegador. No necesita servidor.

## Licencia

El código es libre de usar. El contenido de los artículos es propiedad del autor.
