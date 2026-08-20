/* ==========================================================================
   Renderiza el listado de artículos y el buscador.
   ========================================================================== */

(function () {
  "use strict";

  const contenedor = document.getElementById("lista-articulos");
  const buscador = document.getElementById("buscador");
  if (!contenedor) return;

  const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];

  function formatearFecha(iso) {
    const partes = String(iso).split("-");
    if (partes.length !== 3) return iso;
    const [anio, mes, dia] = partes.map(Number);
    return Number(dia) + " de " + MESES[mes - 1] + " de " + anio;
  }

  function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  function plantilla(post) {
    return [
      '<article class="entrada">',
      '  <div class="entrada__meta">',
      '    <span class="etiqueta">' + escapar(post.categoria) + "</span>",
      '    <time datetime="' + escapar(post.fecha) + '">' + formatearFecha(post.fecha) + "</time>",
      "  </div>",
      '  <h2 class="entrada__titulo"><a href="' + escapar(post.url) + '">' + escapar(post.titulo) + "</a></h2>",
      '  <p class="entrada__extracto">' + escapar(post.extracto) + "</p>",
      "</article>",
    ].join("\n");
  }

  function pintar(lista) {
    if (!lista.length) {
      contenedor.innerHTML = '<p class="vacio">No hay artículos que coincidan con la búsqueda.</p>';
      return;
    }
    contenedor.innerHTML = lista.map(plantilla).join("\n");
  }

  const posts = (typeof ARTICULOS !== "undefined" ? ARTICULOS : [])
    .slice()
    .sort(function (a, b) {
      return b.fecha.localeCompare(a.fecha);
    });

  pintar(posts);

  if (buscador) {
    buscador.addEventListener("input", function (e) {
      const q = e.target.value.trim().toLowerCase();
      if (!q) return pintar(posts);
      pintar(
        posts.filter(function (p) {
          return (p.titulo + " " + p.extracto + " " + p.categoria).toLowerCase().includes(q);
        })
      );
    });
  }

  // Año dinámico en el pie
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
