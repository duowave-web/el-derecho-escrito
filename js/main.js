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

  /* El listado ya no tiene campo propio: el buscador vive en la cabecera y
     envía aquí por GET. Esta función es el otro extremo de ese formulario, así
     que aunque no haya nada que escribir en esta página, sigue haciendo falta:
     sin ella la lupa de la cabecera manda a una página que no le escucha. */

  function buscadorDeArticulos() {
    const contenedor = document.getElementById("entradas");
    if (!contenedor) return;

    /* Se excluye la tarjeta de espera: no es un artículo, así que ni se filtra
       ni la cuenta el contador. Se ve siempre, y lo único que hace más abajo es
       sumar uno a data-visibles. */

    const POR_PAGINA = 9;

    const proxima = contenedor.querySelector(".tarjeta--proxima");
    const vacio = document.getElementById("vacio");
    const contador = document.getElementById("contador");
    const aviso = document.getElementById("filtro-aviso");
    const navPaginas = document.getElementById("paginacion");

    /* El orden lo manda la fecha del <time>, no el orden del marcado, para que
       un despiste al publicar no cambie la portada del listado.

       Pero el marcado TAMBIÉN tiene que estar en orden, y no es redundante: sin
       JavaScript no hay quien reordene nada, así que ahí se ve tal cual está
       escrito. El sort protege el caso normal; la convención protege el
       respaldo. Está anotado en CLAUDE.md.

       Se reordena el DOM y no solo el array: así el orden visual, el de
       tabulación y el de lectura de un lector de pantalla siguen coincidiendo.

       La tarjeta de espera no tiene <time>, así que queda fuera y se vuelve a
       poner al final. */

    const entradas = Array.prototype.slice
      .call(contenedor.querySelectorAll(".tarjeta:not(.tarjeta--proxima)"))
      .sort(function (a, b) {
        const fa = a.querySelector("time");
        const fb = b.querySelector("time");
        return (fb ? fb.getAttribute("datetime") : "").localeCompare(
          fa ? fa.getAttribute("datetime") : ""
        );
      });

    entradas.forEach(function (el) {
      contenedor.appendChild(el);
    });
    if (proxima) contenedor.appendChild(proxima);

    // Índice de texto precalculado
    const indice = entradas.map(function (el) {
      return normalizar(el.textContent);
    });

    /* Cuenta el total que pasa los filtros, no lo que cabe en la página: quien
       lee «12 resultados» quiere saber cuántos hay, y cuántos ve a la vez se lo
       dice la paginación de abajo. */

    function actualizarContador(n) {
      if (!contador) return;
      contador.textContent =
        n === entradas.length
          ? n + (n === 1 ? " artículo publicado" : " artículos publicados")
          : n + (n === 1 ? " resultado" : " resultados");
    }

    /* Tres criterios que se acumulan, no se pisan: la búsqueda llega por ?q=
       desde la cabecera, la categoría por los botones o por ?categoria=, y la
       página por ?pagina=. Estado guardado aquí, en un sitio, para que el
       recuento no dependa de quién movió qué el último.

       El orden de las operaciones importa: primero se filtra, después se
       pagina. Así «Fundamento, página 2» es la página 2 DE LOS DE FUNDAMENTO.
       Al revés no querría decir nada. */

    let consultaActiva = "";
    let categoriaActiva = "todos";
    let paginaActiva = 1;

    function aplicar() {
      const q = normalizar(consultaActiva.trim());

      const coincidentes = entradas.filter(function (el, i) {
        const porTexto = !q || indice[i].indexOf(q) !== -1;
        const porCategoria =
          categoriaActiva === "todos" ||
          el.getAttribute("data-categoria") === categoriaActiva;
        return porTexto && porCategoria;
      });

      /* Una página que no existe no da una lista vacía: se ajusta a la última
         que sí existe. Y como entonces la URL estaría mintiendo, se corrige.
         Nunca un callejón sin salida. */

      const totalPaginas = Math.max(1, Math.ceil(coincidentes.length / POR_PAGINA));
      if (paginaActiva > totalPaginas) {
        paginaActiva = totalPaginas;
        sincronizarURL();
      }

      const desde = (paginaActiva - 1) * POR_PAGINA;
      const enPagina = coincidentes.slice(desde, desde + POR_PAGINA);

      entradas.forEach(function (el) {
        el.hidden = true;
      });
      enPagina.forEach(function (el) {
        el.hidden = false;
      });

      /* El mensaje sale SIEMPRE que no hay resultados, venga el vacío de la
         categoría o de la búsqueda, y ya no se alterna con nada.

         Antes solo salía en la búsqueda, y la categoría vacía se la dejaba a la
         tarjeta de «Próximamente», que decía algo mejor —aún no hay, pero
         vienen— y hacía de respuesta. Eso se cae solo desde que la tarjeta está
         siempre: si se ve igual con quince artículos que con ninguno, deja de
         significar «esto está vacío». Ya no informa, así que el vacío tiene que
         decirse aparte.

         Por eso el texto vuelve a ser general y no menciona la búsqueda. No
         hace falta que lo haga: cuando el vacío viene de un ?q=, el aviso de
         arriba ya nombra la consulta y ofrece salir de ella. */

      if (vacio) vacio.hidden = coincidentes.length !== 0;

      /* La tarjeta de espera ya no se esconde nunca. Dejó de ser una respuesta
         —que era lo que la ataba a un caso concreto— para ser lo que cierra la
         rejilla, y eso vale igual con filtro, con búsqueda y en cualquier
         página.

         Va en TODAS las páginas y no solo en la primera. Se sostuvo un tiempo
         que la primera era su sitio porque ahí está lo más reciente y
         «próximamente» apunta hacia delante, mientras que el final de la lista
         es lo más antiguo. Ese argumento vale mientras la tarjeta sea una pieza
         del contenido, y deja de valer en cuanto es mobiliario: restringir las
         páginas reintroduciría justo el tipo de condición que este cambio
         quita, y una tarjeta que aparece y desaparece según dónde estés no
         puede explicar por qué.

         Sigue sin ser un resultado: no lleva data-categoria, no entra en
         entradas[] y por tanto el contador no la ve. Lo único que suma es la
         cuenta de lo que hay a la vista, que es cosa del centrado. */

      let visiblesEnRejilla = enPagina.length;

      if (proxima) {
        proxima.hidden = false;
        visiblesEnRejilla++;
      }

      /* Cuántas tarjetas se ven de verdad, para que el centrado de la rejilla
         pueda contarlas. El CSS lo resuelve con :has(> :nth-child(2)), que
         cuenta hijos del DOM y no sabe nada de cuáles están ocultos: al filtrar
         una categoría vacía seguía creyendo que había dos y dejaba la tarjeta
         de espera descolocada en la columna izquierda.

         Sin JavaScript el atributo no existe, pero tampoco hace falta: allí se
         ven todas, así que contar hijos y contar visibles da lo mismo y el
         :has() acierta solo. */

      contenedor.setAttribute("data-visibles", String(visiblesEnRejilla));

      actualizarContador(coincidentes.length);
      montarPaginacion(totalPaginas);
    }

    /* Aquí hubo un filtrar(consulta) que envolvía a aplicar(). Tenía sentido
       cuando la consulta entraba por un campo con evento «input»; desde que
       solo llega por ?q= al cargar, se asigna la variable y se llama a aplicar()
       una vez, al final, con los dos criterios ya puestos. */

    /* El aviso se monta nodo a nodo y con textContent, nunca con innerHTML.
       La consulta sale de la URL, o sea que la controla quien construye el
       enlace: concatenarla en HTML sería una inyección de manual. */

    function mostrarAviso(consulta) {
      if (!aviso) return;
      aviso.textContent = "";

      aviso.appendChild(document.createTextNode("Resultados para "));

      const cita = document.createElement("strong");
      cita.textContent = "«" + consulta + "»";
      aviso.appendChild(cita);

      const limpiar = document.createElement("a");
      limpiar.className = "filtro-aviso__limpiar";
      limpiar.href = window.location.pathname;
      limpiar.textContent = "Ver todos";
      aviso.appendChild(limpiar);

      aviso.hidden = false;
    }

    /* La URL refleja siempre el filtro puesto, para que se pueda copiar de la
       barra de direcciones. Va con replaceState y no con pushState: con tres
       categorías, pushState llenaría el historial de pasos que nadie quiere
       deshacer y obligaría a escuchar popstate para reaplicarlos. Con
       replaceState el botón atrás sale de la página, que es lo esperable.

       Se edita el juego de parámetros existente en vez de reescribir la cadena,
       así ?q= sobrevive si estaba puesto. */

    function parametrosActuales() {
      const p = new URLSearchParams(window.location.search);
      if (categoriaActiva === "todos") p.delete("categoria");
      else p.set("categoria", categoriaActiva);
      // La página 1 no se escribe: es el estado por defecto y ensucia la URL
      if (paginaActiva <= 1) p.delete("pagina");
      else p.set("pagina", String(paginaActiva));
      return p;
    }

    /* El try/catch no es precaución de manual: replaceState lanza en contextos
       donde no se puede cambiar la dirección —un documento srcdoc, por ejemplo,
       cuyo origen es about:srcdoc—. Sin él, la excepción sube por el manejador
       del botón y se lleva por delante la llamada a aplicar() que viene
       después: el filtro se marcaba como pulsado y no filtraba nada.

       Se descubrió probando, y es justo la clase de fallo que no daría la cara
       en producción pero deja el control mudo si alguna vez se da. Reflejar la
       URL es un lujo; filtrar es la función. */

    function sincronizarURL() {
      if (!window.history || !window.history.replaceState) return;
      const cadena = parametrosActuales().toString();
      try {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + (cadena ? "?" + cadena : "")
        );
      } catch (e) {
        /* Si no se puede reescribir la URL, el filtro sigue funcionando: lo
           único que se pierde es que la dirección quede copiable. */
      }
    }

    /* La navegación la construye el JS y el <nav> vacío está en el HTML. Los
       números dependen de cuántos artículos pasen el filtro, así que no se
       pueden escribir a mano; la etiqueta accesible sí es contenido y va en el
       marcado.

       Sin JavaScript no aparece, y es lo correcto: unos números escritos en el
       HTML serían enlaces que recargan para enseñar exactamente lo mismo, ya
       que sin JS se ven todos los artículos de una vez.

       Son <a href> de verdad y NO se interceptan. Pediste que cada página fuera
       indexable, y para eso Google necesita un href real; de paso permite abrir
       en pestaña nueva y copiar la dirección. Recargan, y ahí hay una
       diferencia de fondo con los filtros: un filtro afina lo que ves, una
       página cambia dónde estás.

       Cada enlace arrastra los parámetros activos, así que paginar dentro de un
       filtro no lo pierde.

       Sin puntos suspensivos: con nueve por página harían falta más de 45
       artículos para que la fila moleste. A partir de unas 8 páginas conviene
       revisarlo. */

    function montarPaginacion(total) {
      if (!navPaginas) return;

      navPaginas.textContent = "";

      if (total <= 1) {
        navPaginas.hidden = true;
        return;
      }

      const lista = document.createElement("ol");
      lista.className = "paginacion__lista";

      for (let n = 1; n <= total; n++) {
        const li = document.createElement("li");
        const a = document.createElement("a");

        const p = parametrosActuales();
        if (n <= 1) p.delete("pagina");
        else p.set("pagina", String(n));
        const cadena = p.toString();
        a.href = window.location.pathname + (cadena ? "?" + cadena : "");

        a.className = "paginacion__numero";
        a.textContent = String(n);

        if (n === paginaActiva) {
          a.setAttribute("aria-current", "page");
        } else {
          /* El número solo no dice nada cuando un lector de pantalla enumera
             los enlaces. El prefijo oculto lo pone en contexto y deja el texto
             visible dentro del nombre, que es lo que necesita el control por
             voz. */
          const pre = document.createElement("span");
          pre.className = "oculto";
          pre.textContent = "Página ";
          a.insertBefore(pre, a.firstChild);
        }

        li.appendChild(a);
        lista.appendChild(li);
      }

      navPaginas.appendChild(lista);
      navPaginas.hidden = false;
    }

    /* Los filtros salen del HTML con hidden y es aquí donde se les quita: sin
       JavaScript no habría nada que los hiciera funcionar, y un control muerto
       es peor que ninguno. Sin JS la lista se ve entera, que es lo correcto.

       NINGUNO SE DESHABILITA. Los vacíos lo estuvieron, con el argumento de que
       dejar pulsar para no obtener nada es deshonesto. Se retira, y con ello la
       excepción que los revivía cuando la URL pedía esa categoría: hacían falta
       dos reglas para sostener un estado que la interfaz representaba a medias.

       El argumento se cae porque una categoría vacía SÍ dice algo: el contador
       marca cero y sale la tarjeta de espera. Deja de ser un callejón para
       convertirse en una respuesta. Un botón que lleva a una respuesta no tiene
       por qué estar apagado.

       Se va también el recuento de categorías con artículos, que solo servía
       para eso. */

    function montarFiltros(pedida) {
      const barra = document.getElementById("filtros");
      if (!barra) return;

      const botones = Array.prototype.slice.call(
        barra.querySelectorAll("[data-filtro]")
      );
      const claves = botones.map(function (b) {
        return b.getAttribute("data-filtro");
      });

      // Solo se acepta si es una de las claves reales: la URL la escribe quien
      // quiera, y un valor inventado dejaría la lista vacía sin explicación.
      const valida = pedida && claves.indexOf(pedida) !== -1 ? pedida : null;

      function marcar(clave) {
        botones.forEach(function (b) {
          b.setAttribute(
            "aria-pressed",
            String(b.getAttribute("data-filtro") === clave)
          );
        });
      }

      botones.forEach(function (b) {
        const clave = b.getAttribute("data-filtro");

        b.addEventListener("click", function () {
          categoriaActiva = clave;
          /* Vuelta a la primera página al cambiar de filtro. Sin esto te
             quedarías en una página que puede no existir en el conjunto nuevo:
             la 3 de «todos» no tiene por qué existir en «Fundamento». */
          paginaActiva = 1;
          marcar(clave);
          sincronizarURL();
          aplicar();
        });
      });

      if (valida && valida !== "todos") {
        categoriaActiva = valida;
        marcar(valida);
      }

      barra.hidden = false;
    }

    /* Tres entradas por URL que se acumulan, no se pisan: ?q= viene del
       buscador de la cabecera, ?categoria= de las etiquetas de las tarjetas y
       de la ficha del artículo, y ?pagina= de la navegación de abajo.

       La categoría se normaliza antes de compararla, así «Fundamento» y
       «fundamento» entran igual.

       La página se sanea aquí y se ajusta en aplicar(): un valor de texto, cero
       o negativo caen en la 1; uno demasiado alto se recorta a la última que
       exista, porque cuántas hay depende del filtro y aún no está aplicado. */

    const parametros = new URLSearchParams(window.location.search);
    const consulta = parametros.get("q");
    const categoria = parametros.get("categoria");
    const pagina = parseInt(parametros.get("pagina"), 10);

    paginaActiva = Number.isFinite(pagina) && pagina > 1 ? pagina : 1;

    montarFiltros(categoria ? normalizar(categoria.trim()) : null);

    if (consulta && consulta.trim()) {
      mostrarAviso(consulta.trim());
      consultaActiva = consulta;
    }

    aplicar();
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
      return window.matchMedia("(max-width: 934px)").matches;
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
