(function () {
  window.comunidadServicio = {
    async listarTodos() {
      return Promise.resolve([]);
    }
  };
})();
const STORAGE_KEY = "sazon_recipe_votes_hu06";
const defaultVotes = [5, 4, 5, 5, 4, 3, 5];

export function obtenerVotos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVotes));
    return [...defaultVotes];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [...defaultVotes];
  }
}

export function registrarVoto(puntuacion) {
  const votos = obtenerVotos();
  votos.push(Number(puntuacion));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votos));
  return votos;
}

export function calcularPromedio(votos) {
  if (!votos || votos.length === 0) return "0.0";
  const suma = votos.reduce((acc, curr) => acc + curr, 0);
  return (suma / votos.length).toFixed(1);
}