// Resultado de un capítulo: la llave recuperada y la pista grabada que abre el
// siguiente lugar del mapa, el giro de Cuenca o el final de la leyenda.
import Phaser from 'phaser';
import { NIVELES } from '../datos/niveles.js';
import { dibujarPersonaje } from '../personajes.js';
import {
  ESTILO, con, crearBoton, dibujarEstrellas, dibujarLlave, dibujarSol
} from '../ui.js';

export class EscenaResultado extends Phaser.Scene {
  constructor() {
    super('Resultado');
  }

  create(data = {}) {
    this.indice = data.nivel ?? 0;
    const nivel = NIVELES[this.indice];
    const gano = Boolean(data.gano);
    const esFinal = gano && this.indice === NIVELES.length - 1;

    this.add.rectangle(400, 300, 800, 600, gano ? 0x102a56 : 0x2a1430, 0.94);

    if (esFinal) {
      this.mostrarFinal(nivel, data);
      return;
    }

    const titulo = gano ? '¡LLAVE RECUPERADA!' : '¡LA BRUMA ESCAPÓ!';
    this.add.text(400, 70, titulo, con(ESTILO.titulo, { fontSize: '42px' })).setOrigin(0.5);

    if (gano) {
      dibujarLlave(this, 400, 140);
      this.add.text(400, 190, nivel.recompensa, con(ESTILO.etiquetaOro, { fontSize: '20px' })).setOrigin(0.5);
      dibujarEstrellas(this, 400, 232, data.estrellas, 18, 46);
      this.add.text(400, 272, `Te sobraron ${data.restante.toFixed(1)} s antes del equinoccio`, con(ESTILO.texto, { fontSize: '20px' }))
        .setOrigin(0.5);
      this.add.text(400, 312, `Pista grabada en la llave: «${nivel.pista}»`, con(ESTILO.pista, { wordWrap: { width: 680 } }))
        .setOrigin(0.5);
      if (nivel.giro) this.mostrarGiro(nivel.giro);
      const siguiente = NIVELES[this.indice + 1];
      this.add.text(400, nivel.giro ? 455 : 360, `Nuevo camino abierto en el mapa: ${siguiente.ciudad}`, con(ESTILO.texto, { fontSize: '15px', color: '#9be59b' }))
        .setOrigin(0.5);
      crearBoton(this, 270, 525, 'CONTINUAR', () => this.irAlMapa(this.indice + 1), { ancho: 230 });
      crearBoton(this, 530, 525, 'REINTENTAR', () => this.reintentar(), { ancho: 230, color: 0x6b5134 });
    } else {
      const nube = this.add.graphics({ x: 400, y: 150 });
      nube.fillStyle(0x9a8fb5, 0.9).fillEllipse(-22, 4, 50, 30).fillEllipse(8, -6, 56, 40).fillEllipse(32, 6, 44, 26);
      this.add.text(400, 215, `La Bruma se llevó ${nivel.reliquia}.`, con(ESTILO.etiquetaOro, { fontSize: '18px', align: 'center', wordWrap: { width: 680 } }))
        .setOrigin(0.5);
      this.add.text(400, 265, `Fragmentos reunidos: ${data.recogidas}/${data.total}`, con(ESTILO.texto, { fontSize: '20px' })).setOrigin(0.5);
      this.add.text(400, 310, 'Inténtalo de nuevo: el equinoccio no espera.', ESTILO.pista).setOrigin(0.5);
      crearBoton(this, 270, 470, 'REINTENTAR', () => this.reintentar(), { ancho: 230 });
      crearBoton(this, 530, 470, 'MAPA', () => this.irAlMapa(this.indice), { ancho: 230, color: 0x6b5134 });
    }

    this.input.keyboard.once('keydown-ENTER', () => (gano ? this.irAlMapa(this.indice + 1) : this.reintentar()));
  }

  mostrarGiro(texto) {
    this.add.rectangle(400, 395, 700, 74, 0x5b2a86, 0.95).setStrokeStyle(2, 0xf2a07b);
    const villano = this.add.graphics();
    dibujarPersonaje(villano, 'brumario', 90, 425, 0.95);
    this.add.text(420, 395, texto, con(ESTILO.texto, { fontSize: '15px', fontStyle: 'bold', wordWrap: { width: 580 } }))
      .setOrigin(0.5);
  }

  mostrarFinal(nivel, data) {
    dibujarSol(this, 400, 120, 46);
    this.add.text(400, 205, '¡TODOS SON GUARDIANES DEL INTI!', con(ESTILO.titulo, { fontSize: '32px' })).setOrigin(0.5);
    dibujarEstrellas(this, 400, 245, data.estrellas, 16, 42);
    const equipo = this.add.graphics();
    ['roco', 'alba', 'brin', 'lino', 'milo', 'nuba'].forEach((id, i) => {
      dibujarPersonaje(equipo, id, 175 + i * 90, 345, 1);
    });
    this.add.text(400, 410, nivel.final, con(ESTILO.texto, { fontSize: '16px', align: 'center', wordWrap: { width: 680 } }))
      .setOrigin(0.5, 0);
    crearBoton(this, 400, 545, 'VOLVER AL MAPA', () => this.irAlMapa(this.indice), { ancho: 280 });
    this.input.keyboard.once('keydown-ENTER', () => this.irAlMapa(this.indice));
  }

  irAlMapa(seleccion) {
    this.scene.stop('Nivel');
    this.scene.start('Mapa', { seleccion: Math.min(seleccion, NIVELES.length - 1) });
  }

  reintentar() {
    this.scene.stop('Nivel');
    this.scene.start('Carga', { nivel: this.indice });
  }
}
