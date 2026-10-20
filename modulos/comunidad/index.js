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



  document.addEventListener("DOMContentLoaded", iniciarComunidad);
  document.addEventListener("DOMContentLoaded", iniciarEstrellas);
})();