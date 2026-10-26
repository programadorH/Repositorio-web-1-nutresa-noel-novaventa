(function () {
  async function iniciarComunidad() {
    var estado = document.getElementById("comunidad-estado");
    if (!estado) {
      return;
    }
    try {
      await window.comunidadServicio.listarTodos();
      estado.textContent = "Estructura base del módulo comunidad cargada.";
    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base de comunidad.";
      console.error(error);
    }
  }

  let calificacion = 0;

  const pintarEstrellas = (estrellas, valor) => {
    estrellas.forEach((estrella) => {
      const valorEstrella = Number(estrella.dataset.valor);
      estrella.classList.toggle("activa", valorEstrella <= valor);
    });
  };

  const iniciarEstrellas = () => {
    const contenedorDiv = document.querySelector("#estrellas");
    const valorTexto = document.querySelector("#puntuacion-texto");
    if (!contenedorDiv || !valorTexto) {
      return;
    }

    const estrellas = contenedorDiv.querySelectorAll(".estrella");

    estrellas.forEach((estrella) => {
      estrella.addEventListener("click", () => {
        calificacion = Number(estrella.dataset.valor);
        pintarEstrellas(estrellas, calificacion);
        valorTexto.textContent = calificacion + " de 5";
      });
    });
  };

  document.addEventListener("DOMContentLoaded", iniciarComunidad);
  document.addEventListener("DOMContentLoaded", iniciarEstrellas);
})();


(function () {
  const CLASE_ACTIVO = "comunidad-btn-favorito--activo";
  const TEXTO_INACTIVO = "Guardar";
  const TEXTO_ACTIVO = "Guardado";
 
  function pintarBoton(boton, texto, esFavorito) {
    boton.classList.toggle(CLASE_ACTIVO, esFavorito);
    texto.textContent = esFavorito ? TEXTO_ACTIVO : TEXTO_INACTIVO;
  }
 
  function mostrarMensaje(contenedor, texto, esError) {
    contenedor.setAttribute("role", esError ? "alert" : "status");
    contenedor.textContent = texto;
  }
 
  async function iniciarFavorito() {
    const boton = document.querySelector("#btn-favorito");
    const texto = document.querySelector("#btn-favorito .comunidad-btn-favorito__texto");
    const mensaje = document.querySelector("#favorito-mensaje");
    if (!boton || !texto || !mensaje) {
      return;
    }
 
    const idUsuario = Number(boton.dataset.idUsuario);
    const idReceta = Number(boton.dataset.idReceta);
    if (!Number.isInteger(idUsuario) || !Number.isInteger(idReceta)) {
      boton.disabled = true;
      mostrarMensaje(mensaje, "Los datos del botón de favorito no son válidos.", true);
      return;
    }
 
    let favoritoActual = null;
 
    boton.disabled = true;
    try {
      favoritoActual = await window.comunidadServicio.consultarFavorito(idUsuario, idReceta);
      pintarBoton(boton, texto, favoritoActual !== null);
      boton.disabled = false;
    } catch (error) {
      // Sin saber el estado real, el botón queda deshabilitado para no duplicar favoritos.
      mostrarMensaje(mensaje, "No fue posible consultar tus favoritos.", true);
      console.error(error);
      return;
    }
 
    boton.addEventListener("click", async () => {
      boton.disabled = true; 
      try {
        if (favoritoActual === null) {
          favoritoActual = await window.comunidadServicio.agregarFavorito(idUsuario, idReceta);
          mostrarMensaje(mensaje, "Receta guardada en tus favoritos.", false);
        } else {
          await window.comunidadServicio.eliminarFavorito(favoritoActual.id);
          favoritoActual = null;
          mostrarMensaje(mensaje, "Receta quitada de tus favoritos.", false);
        }
        pintarBoton(boton, texto, favoritoActual !== null);
      } catch (error) {
        mostrarMensaje(mensaje, "No fue posible actualizar tus favoritos. Intenta de nuevo.", true);
        console.error(error);
      } finally {
        boton.disabled = false;
      }
    });
  }
 
  document.addEventListener("DOMContentLoaded", iniciarFavorito);
})();