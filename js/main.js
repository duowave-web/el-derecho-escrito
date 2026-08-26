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
  buscadorDeCabecera();
  lineaDeCabecera();
  indiceDelArticulo();
  barraDeProgreso();
  fondoDePortada();
  copiarEnlace();

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

  /* ------------------------------------------ Buscador de cabecera ----- */

  /* En el HTML la lupa es un enlace al listado, para que sin JavaScript siga
     llevando a algún sitio útil. Aquí se sustituye por un <button> de verdad:
     un enlace que despliega algo no es un enlace, y aria-expanded sobre un
     enlace es semánticamente pobre. */

  function buscadorDeCabecera() {
    const form = document.querySelector(".busca");
    if (!form) return;

    const campo = form.querySelector(".busca__campo");
    const lupa = form.querySelector(".busca__lupa");
    if (!campo || !lupa) return;

    // Se guarda antes de sustituir el elemento: es el destino al que sigue
    // llevando la lupa en pantallas estrechas.
    const urlListado = lupa.getAttribute("href");

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = lupa.className;
    boton.setAttribute("aria-label", lupa.getAttribute("aria-label"));
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-controls", campo.id);
    boton.innerHTML = lupa.innerHTML;
    lupa.replaceWith(boton);

    // Debe coincidir con el corte que oculta .busca__campo en el CSS. Por
    // debajo de ese ancho el campo no cabe junto a la marca, así que la lupa
    // vuelve a comportarse como el enlace que era en el HTML.
    function estrecha() {
      return window.matchMedia("(max-width: 966px)").matches;
    }

    function abierta() {
      return form.classList.contains("busca--abierta");
    }

    function abrir() {
      form.classList.add("busca--abierta");
      boton.setAttribute("aria-expanded", "true");
      // Fuerza el recálculo de estilo antes de enfocar: el campo venía con
      // visibility: hidden y focus() no surte efecto sobre algo aún invisible.
      void campo.offsetWidth;
      campo.focus();
    }

    function cerrar(devolverFoco) {
      form.classList.remove("busca--abierta");
      boton.setAttribute("aria-expanded", "false");
      if (devolverFoco) boton.focus();
    }

    boton.addEventListener("click", function () {
      // Por debajo de 600px la cabecera ya va en dos filas y el campo está
      // oculto: la lupa se comporta como el enlace que era.
      if (estrecha()) {
        window.location.href = urlListado;
        return;
      }
      if (abierta()) cerrar(true);
      else abrir();
    });

    // En el formulario y no en el campo, para que Escape también funcione
    // con el foco puesto en la lupa.
    form.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && abierta()) {
        e.preventDefault();
        cerrar(true);
      }
    });

    // Clic fuera. Sin devolver el foco: quien ha pulsado en otro sitio no
    // espera que el foco salte a la lupa.
    document.addEventListener("click", function (e) {
      if (!abierta()) return;
      if (form.contains(e.target)) return;
      cerrar(false);
    });

    // Enviar en vacío llevaría a articulos/?q= sin filtrar nada; mejor ir al
    // listado limpio.
    form.addEventListener("submit", function (e) {
      if (!campo.value.trim()) {
        e.preventDefault();
        window.location.href = urlListado;
      }
    });
  }

  /* -------------------------------------- Línea de la cabecera --------- */

  /* Solo actúa en el inicio, que es la única página con franja de portada. En
     el resto la línea es estática y viene del CSS.

     Se observa la franja con el borde superior de la zona de observación
     recortado justo el alto de la cabecera. Así el disparo cae exactamente
     cuando la franja deja de estar por debajo de la cabecera, y no cuando ha
     salido entera de pantalla.

     Ese alto se MIDE, no se escribe: la cabecera pasa de 73px a 104px al
     plegarse en dos filas por debajo de 748px, y un número fijo aquí se
     desincronizaría igual que se desincronizaría un umbral de scroll con el
     alto de la franja. Por eso se rehace el observador si el alto cambia. */

  function lineaDeCabecera() {
    const cabecera = document.querySelector(".cabecera");
    const franja = document.querySelector(".portada--video");
    if (!cabecera || !franja || !("IntersectionObserver" in window)) return;

    let observador = null;
    let altoMontado = -1;

    function montar() {
      const alto = Math.ceil(cabecera.getBoundingClientRect().height);
      if (alto === altoMontado) return;
      altoMontado = alto;

      if (observador) observador.disconnect();
      observador = new IntersectionObserver(
        function (entradas) {
          cabecera.classList.toggle("cabecera--con-linea", !entradas[0].isIntersecting);
        },
        { rootMargin: "-" + alto + "px 0px 0px 0px", threshold: 0 }
      );
      observador.observe(franja);
    }

    montar();
    window.addEventListener("resize", montar);
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

    let pendiente = false;
    let ultimoEntero = -1;

    // La lectura arranca en la cabecera del artículo, no en el primer párrafo:
    // así la barra ya avanza mientras se pasa el titular y la foto. Y termina
    // al acabar el texto, no al final de la página: lo que viene después
    // —referencias, continúa leyendo, pie— ya no es el artículo.
    const arranque = document.querySelector(".articulo__principal") || cuerpo;

    function actualizar() {
      pendiente = false;

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
      const fraccion = Math.min(1, Math.max(0, avance));

      // SIN redondear, y esto es lo que hace que la barra avance de forma
      // continua. Redondeando a entero solo existían 100 posiciones: en una
      // banda de 1440px eso son saltos de 14px cada 22px de scroll, que es
      // exactamente lo que se veía escalonado. Con dos decimales el paso baja
      // a 0.14px, por debajo del pixel.
      //
      // Una sola escritura: --avance gobierna a la vez el ancho del relleno y
      // el corte del degradado que colorea el rótulo. Escribir el ancho por un
      // lado y el corte por otro es lo que abriría la puerta a que se separen.
      if (banda) banda.style.setProperty("--avance", (fraccion * 100).toFixed(2) + "%");

      // La cifra y el aria sí van en enteros, y solo se tocan cuando el entero
      // cambia. Reescribirlos en cada fotograma repetiría el mismo texto 60
      // veces por segundo y haría que los lectores de pantalla anunciaran sin
      // parar un valor que no ha cambiado.
      const entero = Math.round(fraccion * 100);
      if (entero !== ultimoEntero) {
        ultimoEntero = entero;
        if (cifra) cifra.textContent = entero + "%";
        if (banda) banda.setAttribute("aria-valuenow", String(entero));
      }
    }

    // Un solo repintado por fotograma por muchos eventos de scroll que lleguen.
    // Sin esto, un scroll rápido puede disparar varios eventos entre dos
    // fotogramas y se recalcula geometría que nunca llega a pintarse.
    function pedirActualizacion() {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    }

    actualizar();
    window.addEventListener("scroll", pedirActualizacion, { passive: true });
    window.addEventListener("resize", pedirActualizacion);
  }

  /* ------------------------------------------- Fondo de la portada ----- */

  /* El <video> llega sin src a propósito. Ponerlo aquí es lo único que evita
     de verdad la descarga: ni display:none ni preload="none" la impiden,
     porque autoplay fuerza la carga igualmente. Si no se cumplen las
     condiciones, el elemento se queda mostrando su poster y no pesa nada. */

  function fondoDePortada() {
    const video = document.querySelector(".portada__video");
    if (!video || !video.dataset.src) return;

    // Dos motivos para no gastar el 1,1 MB: pantalla estrecha —el plano es
    // apaisado y en vertical se recorta a una banda que pierde la composición—
    // o petición explícita de menos movimiento.
    const estrecha = window.matchMedia("(max-width: 700px)").matches;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (estrecha || quieto) return;

    // Imprescindible, y como propiedad además de como atributo: sin esto los
    // navegadores bloquean la reproducción automática.
    video.muted = true;
    video.src = video.dataset.src;

    const intento = video.play();

    // Si el navegador bloquea el autoplay de todos modos, no hay nada que
    // rescatar: se deja el vídeo parado en su primer fotograma, que es
    // exactamente la misma imagen que el poster. Sin el catch, la promesa
    // rechazada saldría por consola como error no capturado.
    if (intento && typeof intento.catch === "function") {
      intento.catch(function () {
        video.removeAttribute("autoplay");
      });
    }
  }

  /* -------------------------------------------------- Copiar enlace ---- */

  /* El botón no está en el HTML: lo crea este bloque. Sin JavaScript no puede
     funcionar, y un botón que no hace nada es peor que no tenerlo. Los otros
     tres de la fila son <a> de verdad y funcionan sin esto.

     También se comprueba la API antes de pintarlo: navigator.clipboard no
     existe fuera de contextos seguros, así que en http:// el botón no llega a
     aparecer en vez de aparecer y fallar al pulsarlo. */

  function copiarEnlace() {
    const lista = document.querySelector(".compartir__lista");
    if (!lista || !navigator.clipboard) return;

    const canonica = document.querySelector('link[rel="canonical"]');
    const url = canonica ? canonica.href : location.href;

    const li = document.createElement("li");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "compartir__enlace compartir__enlace--copiar";

    const icono = document.createElement("span");
    icono.className = "compartir__icono compartir__icono--enlace";
    icono.setAttribute("aria-hidden", "true");

    const texto = document.createElement("span");
    texto.textContent = "Copiar enlace";

    boton.append(icono, texto);
    li.appendChild(boton);
    lista.appendChild(li);

    /* El aviso se anuncia por aria-live y no cambiando el nombre del botón:
       así el lector de pantalla dice que se ha copiado sin que el control
       pase a llamarse otra cosa a media interacción. */

    const aviso = document.createElement("span");
    aviso.className = "oculto";
    aviso.setAttribute("role", "status");
    lista.parentNode.appendChild(aviso);

    let temporizador;

    boton.addEventListener("click", function () {
      navigator.clipboard.writeText(url).then(
        function () {
          texto.textContent = "Enlace copiado";
          aviso.textContent = "Enlace copiado al portapapeles";
          clearTimeout(temporizador);
          temporizador = setTimeout(function () {
            texto.textContent = "Copiar enlace";
            aviso.textContent = "";
          }, 2400);
        },
        function () {
          aviso.textContent = "No se ha podido copiar el enlace";
        }
      );
    });
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
