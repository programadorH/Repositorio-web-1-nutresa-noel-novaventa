(function () {
  window.comunidadServicio = {
    async listarTodos() {
      return Promise.resolve([]);
    }
  };
})();

(function () {
  const CONFIG = {
    urlBase: "https://6ada65937512f497b3ffea29.mockapi.io/api/v1",
    rutaFavoritos: "/favoritos"
  };
 
 
  async function requestApi(ruta, opciones) {
    const respuesta = await fetch(CONFIG.urlBase + ruta, opciones);
    if (!respuesta.ok) {
      const error = new Error("Error en API de comunidad: " + respuesta.status);
      error.status = respuesta.status;
      throw error;
    }
    if (respuesta.status === 204) {
      return null;
    }
    return respuesta.json();
  }
 
  
  function coincide(favorito, idUsuario, idReceta) {
    return Number(favorito.idUsuario) === Number(idUsuario) &&
      Number(favorito.idReceta) === Number(idReceta);
  }
 
  
  async function consultarFavorito(idUsuario, idReceta) {
    const filtros = new URLSearchParams({ idUsuario, idReceta });
    try {
      const lista = await requestApi(
        CONFIG.rutaFavoritos + "?" + filtros.toString(),
        { method: "GET" }
      );
      
      return lista.find((item) => coincide(item, idUsuario, idReceta)) || null;
    } catch (error) {
      
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async function agregarFavorito(idUsuario, idReceta) {
    return requestApi(CONFIG.rutaFavoritos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idUsuario: Number(idUsuario),
        idReceta: Number(idReceta),
        guardadoEn: new Date().toISOString()
      })
    });
  }
 
  
  async function eliminarFavorito(idFavorito) {
    return requestApi(CONFIG.rutaFavoritos + "/" + idFavorito, {
      method: "DELETE"
    });
  }

    Object.assign(window.comunidadServicio, {
    consultarFavorito,
    agregarFavorito,
    eliminarFavorito
  });
})();