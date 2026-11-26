// Música y efectos sintetizados con Web Audio (obra propia, sin archivos).
// La música usa la escala pentatónica andina; los efectos se generan al vuelo.
// El navegador solo permite sonar después de un gesto del jugador, por eso
// iniciarAudio() se llama en el primer clic o tecla.

const CLAVE_SILENCIO = 'guardianes-inti-silencio';

let ctx = null;
let maestro = null;
let busMusica = null;
let busEfectos = null;
let silenciado = leerSilencio();

let temporizador = null;
let pista = null;
let indice = 0;
let siguienteTiempo = 0;
let urgencia = false;

function leerSilencio() {
  try {
    return localStorage.getItem(CLAVE_SILENCIO) === '1';
  } catch {
    return false;
  }
}

export function iniciarAudio() {
  if (!ctx) {
    try {
      const Contexto = window.AudioContext || window.webkitAudioContext;
      ctx = new Contexto();
      maestro = ctx.createGain();
      maestro.gain.value = silenciado ? 0 : 1;
      maestro.connect(ctx.destination);
      busMusica = ctx.createGain();
      busMusica.gain.value = 0.16;
      busMusica.connect(maestro);
      busEfectos = ctx.createGain();
      busEfectos.gain.value = 0.32;
      busEfectos.connect(maestro);
    } catch {
      ctx = null;
      return;
    }
  }
  if (ctx.state === 'suspended') ctx.resume();
}

export function estaSilenciado() {
  return silenciado;
}

export function alternarSilencio() {
  silenciado = !silenciado;
  try {
    localStorage.setItem(CLAVE_SILENCIO, silenciado ? '1' : '0');
  } catch {
    // Sin almacenamiento: dura solo la sesión.
  }
  if (maestro) maestro.gain.setTargetAtTime(silenciado ? 0 : 1, ctx.currentTime, 0.02);
  return silenciado;
}

// ---------- Síntesis básica ----------

function tono(frecuencia, duracion, { tipo = 'square', volumen = 0.5, hasta = null, retraso = 0, destino = busEfectos, vibrato = 0 } = {}) {
  if (!ctx) return;
  const t0 = ctx.currentTime + retraso;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, t0);
  if (hasta) osc.frequency.exponentialRampToValueAtTime(hasta, t0 + duracion);
  if (vibrato) {
    const lfo = ctx.createOscillator();
    const profundidad = ctx.createGain();
    lfo.frequency.value = 5.5;
    profundidad.gain.value = vibrato;
    lfo.connect(profundidad).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + duracion + 0.05);
  }
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(volumen, t0 + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion);
  osc.connect(env).connect(destino);
  osc.start(t0);
  osc.stop(t0 + duracion + 0.02);
}

function ruido(duracion, { volumen = 0.4, frecuencia = 800, retraso = 0, destino = busEfectos } = {}) {
  if (!ctx) return;
  const t0 = ctx.currentTime + retraso;
  const muestras = Math.floor(ctx.sampleRate * duracion);
  const buffer = ctx.createBuffer(1, muestras, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;
  const fuente = ctx.createBufferSource();
  fuente.buffer = buffer;
  const filtro = ctx.createBiquadFilter();
  filtro.type = 'bandpass';
  filtro.frequency.value = frecuencia;
  const env = ctx.createGain();
  env.gain.setValueAtTime(volumen, t0);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion);
  fuente.connect(filtro).connect(env).connect(destino);
  fuente.start(t0);
}

// ---------- Efectos ----------

const EFECTOS = {
  salto: () => tono(420, 0.14, { hasta: 760, volumen: 0.35 }),
  dobleSalto: () => tono(640, 0.12, { tipo: 'triangle', hasta: 1150, volumen: 0.4 }),
  fragmento: () => {
    tono(1318, 0.09, { tipo: 'triangle', volumen: 0.5 });
    tono(1760, 0.22, { tipo: 'triangle', volumen: 0.45, retraso: 0.07 });
  },
  rebote: () => tono(170, 0.22, { tipo: 'sine', hasta: 520, volumen: 0.9 }),
  llave: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tono(f, 0.22, { tipo: 'triangle', volumen: 0.5, retraso: i * 0.11 }));
    [523.25, 659.25, 783.99].forEach((f) => tono(f, 0.9, { tipo: 'sine', volumen: 0.25, retraso: 0.48, vibrato: 4 }));
  },
  derrota: () => {
    ruido(1.3, { volumen: 0.35, frecuencia: 500 });
    tono(392, 1.1, { tipo: 'sawtooth', hasta: 110, volumen: 0.18 });
  },
  boton: () => {
    tono(880, 0.05, { tipo: 'sine', volumen: 0.35 });
    ruido(0.03, { volumen: 0.2, frecuencia: 2500 });
  },
  golpe: () => {
    ruido(0.45, { volumen: 0.5, frecuencia: 350 });
    tono(300, 0.3, { hasta: 120, volumen: 0.3 });
  },
  revelar: () => tono(587.33, 0.3, { tipo: 'sine', hasta: 880, volumen: 0.25 })
};

export function efecto(nombre) {
  if (!ctx || silenciado) return;
  EFECTOS[nombre]?.();
}

// ---------- Música (pentatónica andina en La menor) ----------

const N = {
  G3: 196, A3: 220, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392, A4: 440,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880
};

// Cada nota: [frecuencia de la quena o null, frecuencia del bajo o null, pulsos].
const PISTAS = {
  mapa: {
    bpm: 84,
    bombo: false,
    notas: [
      [N.E5, N.A3, 1], [N.D5, null, 0.5], [N.C5, null, 0.5], [N.A4, N.E4, 1], [null, null, 0.5], [N.C5, null, 0.5],
      [N.D5, N.D4, 1], [N.E5, null, 1], [N.G5, N.C4, 0.5], [N.E5, null, 0.5], [N.D5, null, 1], [null, N.G3, 1],
      [N.C5, N.A3, 0.5], [N.A4, null, 0.5], [N.G4, null, 1], [N.A4, N.A3, 2], [null, null, 2]
    ]
  },
  nivel: {
    bpm: 112,
    bombo: true,
    notas: [
      [N.A4, N.A3, 0.5], [N.C5, null, 0.5], [N.D5, null, 0.5], [N.E5, null, 0.5], [N.D5, N.D4, 0.5], [N.C5, null, 0.5], [N.A4, null, 1],
      [N.E5, N.C4, 0.5], [N.G5, null, 0.5], [N.A5, null, 0.5], [N.G5, null, 0.5], [N.E5, N.G3, 1], [N.D5, null, 1],
      [N.C5, N.A3, 0.5], [N.D5, null, 0.5], [N.E5, null, 0.5], [N.C5, null, 0.5], [N.D5, N.E4, 1], [N.E5, null, 1],
      [N.G5, N.C4, 0.5], [N.E5, null, 0.5], [N.D5, null, 0.5], [N.C5, null, 0.5], [N.A4, N.A3, 2]
    ]
  }
};

function programarNota(nota, inicio, pulso) {
  const [quena, bajo, pulsos] = nota;
  const duracion = pulsos * pulso;
  const destino = busMusica;
  if (quena) {
    tono(quena, duracion * 0.95, { tipo: 'sine', volumen: 0.55, retraso: inicio - ctx.currentTime, destino, vibrato: 6 });
    tono(quena * 2, duracion * 0.6, { tipo: 'sine', volumen: 0.08, retraso: inicio - ctx.currentTime, destino });
  }
  if (bajo) tono(bajo / 2, duracion * 0.9, { tipo: 'triangle', volumen: 0.45, retraso: inicio - ctx.currentTime, destino });
  if (pista.bombo) {
    for (let b = 0; b < pulsos; b += 1) {
      tono(70, 0.18, { tipo: 'sine', hasta: 45, volumen: 0.9, retraso: inicio + b * pulso - ctx.currentTime, destino });
    }
  }
}

function planificador() {
  if (!ctx || !pista) return;
  const pulso = 60 / (pista.bpm * (urgencia ? 1.3 : 1));
  while (siguienteTiempo < ctx.currentTime + 0.2) {
    const nota = pista.notas[indice];
    programarNota(nota, siguienteTiempo, pulso);
    siguienteTiempo += nota[2] * pulso;
    indice = (indice + 1) % pista.notas.length;
  }
}

export function musica(nombre) {
  if (!ctx) return;
  if (pista === PISTAS[nombre] && temporizador) return;
  detenerMusica();
  pista = PISTAS[nombre];
  indice = 0;
  urgencia = false;
  siguienteTiempo = ctx.currentTime + 0.1;
  temporizador = setInterval(planificador, 50);
}

export function detenerMusica() {
  if (temporizador) clearInterval(temporizador);
  temporizador = null;
  pista = null;
}

export function ponerUrgencia(activa) {
  urgencia = activa;
}
