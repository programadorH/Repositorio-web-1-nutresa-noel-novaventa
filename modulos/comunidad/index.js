(async function () {
  "use strict";

  const recetas = [
    { id: 1, nombre: "Pasta cremosa con Ranchera", calificacion: 4.6, valoraciones: 48 },
    { id: 2, nombre: "Arroz con pollo", calificacion: 4.8, valoraciones: 32 },
    { id: 3, nombre: "Pollo en salsa cremosa", calificacion: 4.7, valoraciones: 25 },
    { id: 4, nombre: "Lasaña casera", calificacion: 4.9, valoraciones: 61 }
  ];

  let favoritos = []; 

  const listaRecetas = document.getElementById("lista-recetas");
  const listaFavoritos = document.getElementById("lista-favoritos");
  const mensaje = document.getElementById("mensaje-comunidad");

  if (!listaRecetas || !listaFavoritos || !mensaje) return;

  function mostrarMensaje(texto, error = false) {
    mensaje.textContent = texto;
    const estado = document.getElementById("comunidad-estado");
    if (estado) estado.classList.toggle("estado-error", error);
  }

  function crearTarjeta(receta, registroFavorito) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-receta";

    const info = document.createElement("div");
    info.className = "receta-info";

    const titulo = document.createElement("h3");
    titulo.textContent = receta.nombre;

    const calificacion = document.createElement("p");
    calificacion.textContent = `⭐ ${receta.calificacion} · ${receta.valoraciones} valoraciones`;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn-favorito";
    boton.dataset.recetaId = receta.id;
    
    if (registroFavorito) {
      // Tomamos id_PK (tu atributo), pero si MockAPI fuerza 'id', lo toma como respaldo
      boton.dataset.favoritoId = registroFavorito.id_PK || registroFavorito.id;
    }
    
    const esFavorito = !!registroFavorito;
    boton.setAttribute("aria-pressed", String(esFavorito));

    const icono = document.createElement("span");
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = esFavorito ? "♥" : "♡";

    const texto = document.createElement("span");
    texto.textContent = esFavorito ? "Guardado" : "Agregar a favoritos";

    boton.append(icono, document.createTextNode(" "), texto);
    if (esFavorito) boton.classList.add("es-favorito");

    info.append(titulo, calificacion);
    tarjeta.append(info, boton);

    return tarjeta;
  }

  function renderizar() {
    listaRecetas.replaceChildren();
    listaFavoritos.replaceChildren();

    recetas.forEach(receta => {
      const registroFavorito = favoritos.find(fav => String(fav.id_receta) === String(receta.id));
      
      listaRecetas.appendChild(crearTarjeta(receta, registroFavorito));
      if (registroFavorito) {
        listaFavoritos.appendChild(crearTarjeta(receta, registroFavorito));
      }
    });

    if (favoritos.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "favoritos-vacios";
      vacio.textContent = "Todavía no tienes recetas favoritas. ¡Agrega una!";
      listaFavoritos.appendChild(vacio);
    }
  }

  async function cargarDatos() {
    try {
      mostrarMensaje("Cargando favoritos...");
      favoritos = await window.comunidadServicio.obtenerFavoritos();
      renderizar();
      mostrarMensaje("Comunidad cargada correctamente.");
    } catch (error) {
      console.error("Fallo al iniciar:", error);
      mostrarMensaje("Error al cargar los datos desde la API.", true);
    }
  }

  async function manejarClick(evento) {
    const boton = evento.target.closest("button[data-receta-id]");
    if (!boton) return;

    const recetaId = boton.dataset.recetaId;
    const favoritoId = boton.dataset.favoritoId; 

    try {
      // Bloqueamos el botón mientras la API responde
      boton.disabled = true; 
      mostrarMensaje("Procesando...");

      if (favoritoId) {
        await window.comunidadServicio.eliminarFavorito(favoritoId);
        mostrarMensaje("Receta eliminada de favoritos.");
      } else {
        await window.comunidadServicio.guardarFavorito(recetaId);
        mostrarMensaje("¡Receta agregada a favoritos!");
      }
      
      // Volvemos a pedir todo para mantener el estado sincronizado con el servidor
      favoritos = await window.comunidadServicio.obtenerFavoritos();
      renderizar();
      
    } catch (error) {
      console.error("Fallo al guardar/eliminar:", error);
      mostrarMensaje("Hubo un error al actualizar el favorito. Revisa la consola.", true);
      
      // Si ocurre un error, nos aseguramos de descongelar el botón para que el usuario pueda volver a intentar
      boton.disabled = false;
    }
  }

  listaRecetas.addEventListener("click", manejarClick);
  listaFavoritos.addEventListener("click", manejarClick);

  cargarDatos();
})();