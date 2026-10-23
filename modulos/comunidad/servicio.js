(function () {
  window.comunidadServicio = {
    async listarTodos() {
      return Promise.resolve([]);
    }
  };
})();
/**
 * app.js - Creación de API Fetch individual y Manipulación del DOM
 * Proyecto Sa-zón · Célula 6 (Comunidad y Valoraciones)
 * Historia de Usuario 6.2.1 · Rama: feature/comunidad/G6-COM-F01-listado
 */

// 1. Datos de la API para la Receta #128 ("Pasta cremosa con Ranchera") en UTF-8
const DATOS_API_COMUNIDAD = {
  128: [
    {
      id: 1,
      idReceta: 128,
      usuario: "Carolina R.",
      calificacion: 5,
      fecha: "Hace 2 días",
      comentario:
        "¡Quedó deliciosa! Preparé esta Pasta cremosa con Ranchera para la cena familiar y el toque doradito con crema de leche y queso parmesano le dio una sazón espectacular."
    },
    {
      id: 2,
      idReceta: 128,
      usuario: "Andrés M.",
      calificacion: 4,
      fecha: "Hace 5 días",
      comentario:
        "Muy buena receta para salir de la rutina entre semana. Le agregué una pizca de pimienta recién molida, cebolla pequeñita y orégano al final; la salsa espesa muy bien."
    },
    {
      id: 3,
      idReceta: 128,
      usuario: "Valeria Muñoz Peña",
      calificacion: 5,
      fecha: "Hace 1 semana",
      comentario:
        "A los niños les encantó en el almuerzo. Las porciones están muy bien calculadas y con ingredientes fáciles de tener en la despensa."
    },
    {
      id: 4,
      idReceta: 128,
      usuario: "Sebastián Ñáñez",
      calificacion: 5,
      fecha: "Hace 2 semanas",
      comentario:
        "Excelente combinación. La guardé en mi colección de pastas favoritas porque en menos de 20 minutos tienes un plato con auténtico sabor casero."
    }
  ]
};

// 2. Creación de la API simulada para responder a la petición fetch() individual
const fetchOriginal = window.fetch.bind(window);
window.fetch = async function (url, opciones) {
  if (typeof url === "string" && url.includes("/api/v1/comunidad/recetas/")) {
    // Simula 400ms de red para ver las barras .skel antes de renderizar
    await new Promise((resolve) => setTimeout(resolve, 400));

    const partes = url.split("/");
    const idReceta = partes[partes.indexOf("recetas") + 1];

    if (idReceta === "999") {
      return new Response(
        JSON.stringify({ mensaje: "Error 503 en el servidor de Comunidad" }),
        { status: 503, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const lista = DATOS_API_COMUNIDAD[idReceta] || [];
    return new Response(JSON.stringify(lista), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  return fetchOriginal(url, opciones);
};

// 3. Criterio de Aceptación #1: Servicio comunidadService.listarComentarios(idReceta)
const comunidadService = {
  async listarComentarios(idReceta) {
    const endpoint = `/api/v1/comunidad/recetas/${encodeURIComponent(idReceta)}/comentarios`;
    const respuesta = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json; charset=utf-8"
      }
    });

    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar el servicio (HTTP ${respuesta.status})`);
    }

    return await respuesta.json();
  }
};

// 4. Convertir calificación numérica (1 a 5) en estrellas (★★★★★ / ★★★★☆)
function generarEstrellasTexto(calificacion) {
  const activas = Math.max(0, Math.min(5, Math.round(Number(calificacion) || 0)));
  return "★".repeat(activas) + "☆".repeat(5 - activas);
}

// 5. Estado de carga inicial con las barras .skel del prototipo de Sa-zón
function mostrarEsqueletoCarga(contenedor) {
  contenedor.innerHTML = `
    <article class="comunidad-comentario-card mk-card" aria-busy="true">
      <div class="comunidad-comentario-header">
        <span class="comunidad-comentario-usuario">Carolina R.</span>
        <span class="mk-star small">★★★★★</span>
      </div>
      <div class="skel mt-2" style="width:90%"></div>
      <div class="skel mt-1" style="width:70%"></div>
    </article>
    <article class="comunidad-comentario-card mk-card" aria-busy="true">
      <div class="comunidad-comentario-header">
        <span class="comunidad-comentario-usuario">Andrés M.</span>
        <span class="mk-star small">★★★★☆</span>
      </div>
      <div class="skel mt-2" style="width:80%"></div>
      <div class="skel mt-1" style="width:55%"></div>
    </article>
  `;
}

// 6. Criterios #2 y #3: Crear tarjeta semántica (.comunidad-comentario-card) en el DOM con UTF-8
function crearTarjetaComentarioDOM(item) {
  const article = document.createElement("article");
  article.className = "comunidad-comentario-card mk-card";

  const header = document.createElement("header");
  header.className = "comunidad-comentario-header";

  const nombreUsuario = document.createElement("h3");
  nombreUsuario.className = "comunidad-comentario-usuario";
  nombreUsuario.textContent = item.usuario; // Soporta tildes y eñes en UTF-8

  const estrellas = document.createElement("span");
  estrellas.className = "comunidad-comentario-estrellas mk-star small";
  estrellas.setAttribute("aria-label", `Calificación: ${item.calificacion} de 5 estrellas`);
  estrellas.textContent = generarEstrellasTexto(item.calificacion);

  header.appendChild(nombreUsuario);
  header.appendChild(estrellas);

  const parrafoTexto = document.createElement("p");
  parrafoTexto.className = "comunidad-comentario-texto";
  parrafoTexto.textContent = item.comentario;

  const fecha = document.createElement("time");
  fecha.className = "comunidad-comentario-fecha";
  fecha.textContent = item.fecha;

  article.appendChild(header);
  article.appendChild(parrafoTexto);
  article.appendChild(fecha);

  return article;
}

// 7. Consumo asíncrono usando await y try/catch (Criterio de Aceptación #1)
async function cargarComentariosComunidad(idReceta) {
  const contenedorLista = document.getElementById("comunidad-lista-comentarios");
  const contenedorError = document.getElementById("comunidad-alerta-error");
  const urlBar = document.getElementById("app-bar-url");
  const badgeEstado = document.getElementById("estado-servicio-badge");

  urlBar.textContent = `sazon.app/recetas/${idReceta}/comentarios`;
  contenedorError.hidden = true;
  badgeEstado.textContent = "Cargando fetch...";
  mostrarEsqueletoCarga(contenedorLista);

  try {
    const comentarios = await comunidadService.listarComentarios(idReceta);

    contenedorLista.innerHTML = "";
    const fragmento = document.createDocumentFragment();

    comentarios.forEach((comentario) => {
      const tarjeta = crearTarjetaComentarioDOM(comentario);
      fragmento.appendChild(tarjeta);
    });

    contenedorLista.appendChild(fragmento);
    badgeEstado.textContent = "API Fetch Activa · UTF-8";
  } catch (error) {
    console.error("Error capturado en try/catch:", error);
    contenedorLista.innerHTML = "";
    contenedorError.hidden = false;
    contenedorError.textContent = `Ocurrió un problema al cargar las reseñas: ${error.message}`;
    badgeEstado.textContent = "Error capturado (try/catch)";
  }
}

// 8. Inicializar eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  const selectorReceta = document.getElementById("selector-receta");
  const btnRecargar = document.getElementById("btn-recargar");

  cargarComentariosComunidad(selectorReceta.value);

  selectorReceta.addEventListener("change", (evento) => {
    cargarComentariosComunidad(evento.target.value);
  });

  btnRecargar.addEventListener("click", () => {
    cargarComentariosComunidad(selectorReceta.value);
  });
});