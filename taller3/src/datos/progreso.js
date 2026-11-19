// Progreso del jugador: qué capítulos completó y su mejor puntuación en
// estrellas. Se guarda en el navegador; si el almacenamiento no está
// disponible (modo privado, iframe bloqueado), el juego sigue funcionando
// con el progreso en memoria durante la sesión.

import { NIVELES } from './niveles.js';

const CLAVE = 'guardianes-inti-progreso-v1';
const TOTAL = NIVELES.length;

let estado = null;

function vacio() {
  return {
    completados: Array(TOTAL).fill(false),
    estrellas: Array(TOTAL).fill(0)
  };
}

function persistir() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // Sin almacenamiento: el progreso vive solo en memoria.
  }
}

export function cargarProgreso() {
  if (estado) return estado;
  estado = vacio();
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    if (guardado) {
      for (let i = 0; i < TOTAL; i++) {
        estado.completados[i] = Boolean(guardado.completados?.[i]);
        estado.estrellas[i] = Math.min(3, Math.max(0, Number(guardado.estrellas?.[i]) || 0));
      }
    }
  } catch {
    // Datos corruptos o almacenamiento bloqueado: se empieza de cero.
  }
  return estado;
}

export function guardarResultado(indice, estrellas) {
  const p = cargarProgreso();
  p.completados[indice] = true;
  p.estrellas[indice] = Math.max(p.estrellas[indice], estrellas);
  persistir();
}

export function reiniciarProgreso() {
  estado = vacio();
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // Nada que borrar.
  }
}

// Solo para pruebas en desarrollo: marca como completados los primeros n niveles.
export function progresoDePrueba(n) {
  estado = vacio();
  for (let i = 0; i < Math.min(n, TOTAL); i++) {
    estado.completados[i] = true;
    estado.estrellas[i] = 3 - (i % 3);
  }
}

export function estaDesbloqueado(p, indice) {
  return indice === 0 || p.completados[indice - 1];
}

export function siguienteJugable(p) {
  const pendiente = p.completados.findIndex((hecho) => !hecho);
  return pendiente === -1 ? TOTAL - 1 : pendiente;
}

export function calcularEstrellas(restante, tiempo) {
  const proporcion = restante / tiempo;
  if (proporcion >= 0.45) return 3;
  if (proporcion >= 0.2) return 2;
  return 1;
}

// Llaves del Disco Solar. Tras la trampa de Cuenca, Brumario se lleva las
// tres primeras; el equipo solo conserva la cuarta (Tena) hasta el final.
export function estadoDeLlaves(p) {
  if (p.completados[4]) return { equipo: 4, brumario: 0 };
  if (p.completados[2]) return { equipo: p.completados[3] ? 1 : 0, brumario: 3 };
  return { equipo: p.completados.slice(0, 2).filter(Boolean).length, brumario: 0 };
}
