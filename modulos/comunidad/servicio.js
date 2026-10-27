(function () {
  const BASE_URL = "https://6ada657e7512f497b3ffe9a3.mockapi.io/api/v1/favoritos";

  window.comunidadServicio = {
    async obtenerFavoritos() {
      const respuesta = await fetch(BASE_URL);
      if (!respuesta.ok) throw new Error(`Error GET: ${respuesta.status}`);
      const datos = await respuesta.json();
      // Aseguramos que siempre retorne un arreglo, incluso si la API falla o está vacía
      return Array.isArray(datos) ? datos : [];
    },

    async guardarFavorito(recetaId) {
      const respuesta = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_receta: recetaId })
      });
      if (!respuesta.ok) throw new Error(`Error POST: ${respuesta.status}`);
      return respuesta.json();
    },

    async eliminarFavorito(idRegistro) {
      if (!idRegistro) throw new Error("ID de registro inválido para eliminar.");
      
      const respuesta = await fetch(`${BASE_URL}/${idRegistro}`, {
        method: "DELETE"
      });
      if (!respuesta.ok) throw new Error(`Error DELETE: ${respuesta.status}`);
      return respuesta.json();
    }
  };
})();