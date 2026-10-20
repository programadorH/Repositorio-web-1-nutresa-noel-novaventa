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