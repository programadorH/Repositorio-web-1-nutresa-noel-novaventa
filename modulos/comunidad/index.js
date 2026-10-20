(function () {
  "use strict";

  const CLAVE_FAVORITOS = "sazon_favoritos_demo";

  const recetas = [
    {
      id: 1,
      nombre: "Pasta cremosa con Ranchera",
      calificacion: 4.6,
      valoraciones: 48
    },
    {
      id: 2,
      nombre: "Arroz con pollo",
      calificacion: 4.8,
      valoraciones: 32
    },
    {
      id: 3,
      nombre: "Pollo en salsa cremosa",
      calificacion: 4.7,
      valoraciones: 25
    },
    {
      id: 4,
      nombre: "Lasaña casera",
      calificacion: 4.9,
      valoraciones: 61
    }
  ];

  const listaRecetas = document.getElementById("lista-recetas");
  const listaFavoritos = document.getElementById("lista-favoritos");
  const mensaje = document.getElementById("mensaje-comunidad");

  if (!listaRecetas || !listaFavoritos || !mensaje) {
    console.error("No se encontraron los elementos de Comunidad.");
    return;
  }

  function obtenerFavoritos() {
    try {
      const datos = localStorage.getItem(CLAVE_FAVORITOS);
      const favoritos = datos ? JSON.parse(datos) : [];

      return Array.isArray(favoritos)
        ? favoritos.filter(id =>
            Number.isInteger(id) &&
            recetas.some(receta => receta.id === id)
          )
        : [];
    } catch (error) {
      console.error("No se pudieron leer los favoritos:", error);
      mostrarMensaje("No se pudieron cargar los favoritos.", true);
      return [];
    }
  }

  function guardarFavoritos(favoritos) {
    try {
      localStorage.setItem(
        CLAVE_FAVORITOS,
        JSON.stringify(favoritos)
      );
      return true;
    } catch (error) {
      console.error("No se pudieron guardar los favoritos:", error);
      mostrarMensaje("Error al guardar. Revisa el almacenamiento del navegador.", true);
      return false;
    }
  }

  function mostrarMensaje(texto, error = false) {
    mensaje.textContent = texto;

    const estado = document.getElementById("comunidad-estado");

    if (estado) {
      estado.classList.toggle("estado-error", error);
    }
  }

  function crearTarjeta(receta, esFavorito) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-receta";

    const info = document.createElement("div");
    info.className = "receta-info";

    const titulo = document.createElement("h3");
    titulo.textContent = receta.nombre;

    const calificacion = document.createElement("p");
    calificacion.textContent =
      `⭐ ${receta.calificacion} · ${receta.valoraciones} valoraciones`;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn-favorito";
    boton.dataset.recetaId = receta.id;
    boton.setAttribute("aria-pressed", String(esFavorito));

    const icono = document.createElement("span");
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = esFavorito ? "♥" : "♡";

    const texto = document.createElement("span");
    texto.textContent = esFavorito ? "Guardado" : "Agregar a favoritos";

    boton.append(icono, document.createTextNode(" "), texto);

    if (esFavorito) {
      boton.classList.add("es-favorito");
    }

    info.append(titulo, calificacion);
    tarjeta.append(info, boton);

    return tarjeta;
  }

  function renderizar() {
    const favoritos = obtenerFavoritos();

    listaRecetas.replaceChildren();
    listaFavoritos.replaceChildren();

    recetas.forEach(receta => {
      const guardada = favoritos.includes(receta.id);

      listaRecetas.appendChild(
        crearTarjeta(receta, guardada)
      );

      if (guardada) {
        listaFavoritos.appendChild(
          crearTarjeta(receta, true)
        );
      }
    });

    if (favoritos.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "favoritos-vacios";
      vacio.textContent = "Todavía no tienes recetas favoritas. ¡Agrega una!";
      listaFavoritos.appendChild(vacio);
    }
  }

  function cambiarFavorito(id) {
    const favoritos = obtenerFavoritos();
    const receta = recetas.find(item => item.id === id);

    if (!receta) {
      mostrarMensaje("No se encontró esa receta.", true);
      return;
    }

    const yaGuardada = favoritos.includes(id);

    const nuevosFavoritos = yaGuardada
      ? favoritos.filter(favoritoId => favoritoId !== id)
      : [...favoritos, id];

    if (!guardarFavoritos(nuevosFavoritos)) {
      return;
    }

    renderizar();

    mostrarMensaje(
      yaGuardada
        ? `Se eliminó "${receta.nombre}" de tus favoritos.`
        : `¡"${receta.nombre}" se agregó a tus favoritos!`
    );
  }

  function manejarClick(evento) {
    const boton = evento.target.closest("button[data-receta-id]");

    if (!boton) {
      return;
    }

    const id = Number(boton.dataset.recetaId);

    if (!Number.isInteger(id)) {
      return;
    }

    cambiarFavorito(id);
  }

  listaRecetas.addEventListener("click", manejarClick);
  listaFavoritos.addEventListener("click", manejarClick);

  renderizar();
  mostrarMensaje("Comunidad cargada correctamente.");
})();