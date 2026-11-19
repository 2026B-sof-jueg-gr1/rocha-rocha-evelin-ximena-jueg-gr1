// Los Guardianes del Inti: El Derrotero Perdido.
// Flujo: Inicio -> Mapa del Ecuador -> Carga del capítulo -> Nivel -> Resultado -> Mapa.
import Phaser from 'phaser';
import { EscenaInicio } from './escenas/EscenaInicio.js';
import { EscenaMapa } from './escenas/EscenaMapa.js';
import { EscenaCarga } from './escenas/EscenaCarga.js';
import { EscenaNivel } from './escenas/EscenaNivel.js';
import { EscenaResultado } from './escenas/EscenaResultado.js';

const juego = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#11182f',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 900 }, debug: false }
  },
  scene: [EscenaInicio, EscenaMapa, EscenaCarga, EscenaNivel, EscenaResultado]
});

if (import.meta.env.DEV) window.juego = juego;
