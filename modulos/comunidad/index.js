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

  document.addEventListener("DOMContentLoaded", iniciarComunidad);
})();

import { obtenerVotos, registrarVoto, calcularPromedio } from "./servicios.js";

function renderizarResumen(votos) {
  const promedio = calcularPromedio(votos);
  const scoreElem = document.getElementById("averageScore");
  const counterElem = document.getElementById("votesCounter");
  const starsElem = document.getElementById("averageStars");

  if (scoreElem) scoreElem.textContent = promedio;
  if (counterElem) {
    counterElem.textContent = `${votos.length} ${votos.length === 1 ? "calificación" : "calificaciones en total"}`;
  }

  if (starsElem) {
    const rounded = Math.round(Number(promedio));
    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
      estrellas += i <= rounded ? "★" : "☆";
    }
    starsElem.textContent = estrellas;
  }
}

export function iniciarModuloCalificacion() {
  const botones = document.querySelectorAll("#starInputGroup .star-btn");
  const feedback = document.getElementById("feedbackMsg");
  const grupoEstrellas = document.getElementById("starInputGroup");

  
  const votosIniciales = obtenerVotos();
  renderizarResumen(votosIniciales);

  botones.forEach((btn) => {
  
    btn.addEventListener("mouseenter", () => {
      const valor = Number(btn.dataset.value);
      botones.forEach((b) => {
        b.classList.toggle("is-hover", Number(b.dataset.value) <= valor);
      });
    });

    btn.addEventListener("click", () => {
      const valor = Number(btn.dataset.value);
      const nuevosVotos = registrarVoto(valor);
      renderizarResumen(nuevosVotos);

      botones.forEach((b) => {
        b.classList.toggle("is-active", Number(b.dataset.value) <= valor);
      });

      if (feedback) {
        feedback.textContent = `¡Gracias por calificar con ${valor} ${valor === 1 ? "estrella" : "estrellas"}!`;
        setTimeout(() => {
          if (feedback) feedback.textContent = "";
        }, 3000);
      }
    });
  });

  if (grupoEstrellas) {
    grupoEstrellas.addEventListener("mouseleave", () => {
      botones.forEach((b) => b.classList.remove("is-hover"));
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarModuloCalificacion();
});
