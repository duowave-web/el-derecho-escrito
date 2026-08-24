/* ==========================================================================
   El Derecho Escrito — JS mínimo.
   El contenido está escrito directamente en el HTML (mejor para SEO). Este
   script solo enriquece lo que ya existe: filtra el listado, arma el índice
   lateral y pinta el progreso de lectura. Sin JavaScript la página se lee
   entera igual; lo único que no aparece es el índice, que es navegación.

   Cada bloque comprueba sus propios elementos, así que una misma copia del
   archivo sirve para todas las páginas.
   ========================================================================== */

(function () {
  "use strict";

  // Año dinámico en el pie
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  buscadorDeArticulos();
  indiceDelArticulo();
  barraDeProgreso();

  /* ---------------------------------------------------- Buscador ------- */

  function buscadorDeArticulos() {
    const buscador = document.getElementById("buscador");
    const contenedor = document.getElementById("entradas");
    if (!buscador || !contenedor) return;

    const entradas = Array.prototype.slice.call(contenedor.querySelectorAll(".entrada"));
    const vacio = document.getElementById("vacio");
    const contador = document.getElementById("contador");

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
  }

  /* ------------------------------------------- Índice del artículo ----- */

  /* Se arma desde los <h2> del cuerpo para no tener que escribirlo a mano en
     cada artículo. Los <h2> que ya traen id lo conservan: así no se rompen los
     enlaces de artículos ya publicados ni los que apunten desde fuera. */

  function indiceDelArticulo() {
    const lista = document.getElementById("indice-lista");
    const cuerpo = document.querySelector(".articulo__cuerpo");
    if (!lista || !cuerpo) return;

    const titulos = Array.prototype.slice.call(cuerpo.querySelectorAll("h2"));
    const bloque = lista.closest(".indice");

    // Sin apartados no hay índice que mostrar: se quita el bloque entero en
    // lugar de dejar un rótulo colgando sobre una lista vacía.
    if (!titulos.length) {
      if (bloque) bloque.hidden = true;
      return;
    }

    // Se parte de los id que ya existen en la página para no duplicar ninguno.
    const usados = new Set(
      Array.prototype.map.call(document.querySelectorAll("[id]"), function (el) {
        return el.id;
      })
    );

    titulos.forEach(function (titulo) {
      if (!titulo.id) {
        titulo.id = idLibre(crearId(titulo.textContent), usados);
        usados.add(titulo.id);
      }

      const enlace = document.createElement("a");
      enlace.href = "#" + titulo.id;
      enlace.textContent = titulo.textContent.trim();

      const fila = document.createElement("li");
      fila.appendChild(enlace);
      lista.appendChild(fila);
    });
  }

  /* -------------------------------------------- Progreso de lectura ---- */

  function barraDeProgreso() {
    const barra = document.querySelector(".progreso__barra");
    const cuerpo = document.querySelector(".articulo__cuerpo");
    if (!barra || !cuerpo) return;

    const banda = barra.closest(".progreso");
    const cifra = document.querySelector(".progreso__cifra");

    // La lectura arranca en la cabecera del artículo, no en el primer párrafo:
    // así la barra ya avanza mientras se pasa el titular y la foto. Y termina
    // al acabar el texto, no al final de la página: lo que viene después
    // —referencias, continúa leyendo, pie— ya no es el artículo.
    const arranque = document.querySelector(".articulo__principal") || cuerpo;

    function actualizar() {
      const desde = arranque.getBoundingClientRect().top + window.scrollY;
      const hasta = cuerpo.getBoundingClientRect().bottom + window.scrollY;
      const recorrido = hasta - desde - window.innerHeight;

      // Si el artículo cabe entero en pantalla no hay nada que recorrer.
      const avance =
        recorrido > 0
          ? (window.scrollY - desde) / recorrido
          : window.scrollY >= desde
            ? 1
            : 0;
      const porcentaje = Math.round(Math.min(1, Math.max(0, avance)) * 100);

      barra.style.width = porcentaje + "%";
      if (cifra) cifra.textContent = porcentaje + "%";
      if (banda) banda.setAttribute("aria-valuenow", String(porcentaje));
    }

    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
  }

  /* ------------------------------------------------------ Utilidades --- */

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // ignora acentos
  }

  function crearId(texto) {
    return (
      normalizar(texto.trim())
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "apartado"
    );
  }

  function idLibre(base, usados) {
    let id = base;
    let n = 2;
    while (usados.has(id)) id = base + "-" + n++;
    return id;
  }
})();
