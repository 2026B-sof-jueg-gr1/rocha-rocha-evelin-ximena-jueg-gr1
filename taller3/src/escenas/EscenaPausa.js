// Menú de pausa: se abre con Esc, P o el botón II del HUD.
// El nivel queda congelado (también su reloj) hasta que se continúe.
import Phaser from 'phaser';
import { NIVELES } from '../datos/niveles.js';
import { ESTILO, con, crearBoton, crearBotonSonido } from '../ui.js';

export class EscenaPausa extends Phaser.Scene {
  constructor() {
    super('Pausa');
  }

  create(data = {}) {
    this.indice = data.nivel ?? 0;
    const nivel = NIVELES[this.indice];

    this.add.rectangle(400, 300, 800, 600, 0x11182f, 0.82);
    this.add.text(400, 130, 'PAUSA', con(ESTILO.titulo, { fontSize: '48px' })).setOrigin(0.5);
    this.add.text(400, 180, `${nivel.etiqueta} · ${nivel.ciudad}`, ESTILO.etiquetaOro).setOrigin(0.5);
    this.add.text(400, 212, 'El sol del equinoccio también se detiene… por ahora.', ESTILO.pista).setOrigin(0.5);

    crearBoton(this, 400, 290, 'CONTINUAR', () => this.continuar(), { ancho: 280 });
    crearBoton(this, 400, 365, 'REINTENTAR', () => this.reintentar(), { ancho: 280, color: 0x6b5134 });
    crearBoton(this, 400, 440, 'VOLVER AL MAPA', () => this.irAlMapa(), { ancho: 280, color: 0x6b5134 });
    crearBotonSonido(this, 400, 510);
    this.add.text(400, 545, 'Esc o P: continuar  ·  M: sonido', con(ESTILO.texto, { fontSize: '13px', color: '#ffdf76' })).setOrigin(0.5);

    this.input.keyboard.once('keydown-ESC', () => this.continuar());
    this.input.keyboard.once('keydown-P', () => this.continuar());
  }

  continuar() {
    this.scene.stop();
    this.scene.resume('Nivel');
  }

  reintentar() {
    this.scene.stop('Nivel');
    this.scene.start('Carga', { nivel: this.indice });
  }

  irAlMapa() {
    this.scene.stop('Nivel');
    this.scene.start('Mapa', { seleccion: this.indice });
  }
}
