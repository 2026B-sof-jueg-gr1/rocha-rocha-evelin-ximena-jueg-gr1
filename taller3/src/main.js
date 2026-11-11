import Phaser from 'phaser';

// El juego actual se conserva mientras migramos sus escenas y entidades a módulos.
// Phaser pasa a ser una dependencia npm y no una variable descargada por CDN.
globalThis.Phaser = Phaser;
import('../game.js');
