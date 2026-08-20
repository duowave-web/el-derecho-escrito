/* ==========================================================================
   El Derecho Escrito — JS mínimo.
   El listado de artículos está escrito directamente en el HTML (mejor para
   SEO). Este script solo filtra lo que ya existe en la página; si el usuario
   tiene JavaScript desactivado, sigue viendo todos los artículos.
   ========================================================================== */

(function () {
  "use strict";

  // Año dinámico en el pie
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  const buscador = document.getElementById("buscador");
  const contenedor = document.getElementById("entradas");
  if (!buscador || !contenedor) return;

  const entradas = Array.prototype.slice.call(contenedor.querySelectorAll(".entrada"));
  const vacio = document.getElementById("vacio");
  const contador = document.getElementById("contador");

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // ignora acentos
  }

  // Índice de texto precalculado
  const indice = entradas.map(function (el) {
    return normalizar(el.textContent);
  });

  function actualizarContador(n) {
    if (!contador) return;
    contador.textContent =
      n === entradas.length
        ? n + (n === 1 ? " artículo publicado" : " artículos publicados")
        : n + (n === 1 ? " resultado" : " resultados");
  }

  function filtrar(consulta) {
    const q = normalizar(consulta.trim());
    let visibles = 0;

    entradas.forEach(function (el, i) {
      const coincide = !q || indice[i].indexOf(q) !== -1;
      el.hidden = !coincide;
      if (coincide) visibles++;
    });

    if (vacio) vacio.hidden = visibles !== 0;
    actualizarContador(visibles);
  }

  buscador.addEventListener("input", function (e) {
    filtrar(e.target.value);
  });

  // Permite enlazar búsquedas: /articulos/?q=penal
  const parametro = new URLSearchParams(window.location.search).get("q");
  if (parametro) {
    buscador.value = parametro;
    filtrar(parametro);
  } else {
    actualizarContador(entradas.length);
  }
})();
