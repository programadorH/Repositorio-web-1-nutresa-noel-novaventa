(function () {
  const CLAVE = "sazon-favoritos";

  window.comunidadServicio = {
    listarTodos() {
      return Promise.resolve(
        JSON.parse(localStorage.getItem(CLAVE) || "[]")
      );
    },

    guardar(idReceta) {
      const favoritos = JSON.parse(localStorage.getItem(CLAVE) || "[]");

      if (!favoritos.includes(idReceta)) {
        favoritos.push(idReceta);
      }

      localStorage.setItem(CLAVE, JSON.stringify(favoritos));
      return Promise.resolve(favoritos);
    },

    eliminar(idReceta) {
      const favoritos = JSON.parse(localStorage.getItem(CLAVE) || "[]")
        .filter(id => id !== idReceta);

      localStorage.setItem(CLAVE, JSON.stringify(favoritos));
      return Promise.resolve(favoritos);
    }
  };
})();
