// Galería del derrotero: los datos reales de cada región se desbloquean al
// completar su capítulo, para repasarlos cuando se quiera.
import Phaser from 'phaser';
import { NIVELES } from '../datos/niveles.js';
import { cargarProgreso } from '../datos/progreso.js';
import { COLOR, ESTILO, con, crearBoton } from '../ui.js';

export class EscenaGaleria extends Phaser.Scene {
  constructor() {
    super('Galeria');
  }

  create(data = {}) {
    this.progreso = cargarProgreso();
    this.region = data.region ?? 0;
    const desbloqueados = NIVELES.reduce(
      (total, n, i) => total + (this.progreso.completados[i] ? n.datos.length : 0), 0
    );
    const totales = NIVELES.reduce((total, n) => total + n.datos.length, 0);

    this.add.rectangle(400, 300, 800, 600, COLOR.pergamino);
    this.add.rectangle(400, 24, 800, 48, COLOR.tinta);
    this.add.text(400, 24, `GALERÍA DEL DERROTERO · ${desbloqueados}/${totales} DATOS`, con(ESTILO.franja, { color: '#ffe9a8' })).setOrigin(0.5);

    NIVELES.forEach((nivel, i) => {
      const elegido = i === this.region;
      const abierto = this.progreso.completados[i];
      const x = 88 + i * 156;
      const pestana = this.add.rectangle(x, 78, 148, 40, elegido ? COLOR.terracota : COLOR.pergaminoClaro)
        .setStrokeStyle(2, COLOR.tinta)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', () => this.scene.restart({ region: i }));
      this.add.text(x, 78, `${abierto ? '' : '🔒 '}${nivel.ciudad}`, con(ESTILO.textoTinta, {
        fontStyle: 'bold', fontSize: '14px', color: elegido ? '#ffffff' : '#3a2716'
      })).setOrigin(0.5);
      pestana.setData('i', i);
    });

    const nivel = NIVELES[this.region];
    this.add.text(400, 122, nivel.titulo, ESTILO.tituloPanel).setOrigin(0.5);

    if (!this.progreso.completados[this.region]) {
      this.add.text(400, 300, `Completa el capítulo de ${nivel.ciudad} para descubrir sus ${nivel.datos.length} datos.`,
        con(ESTILO.textoTintaItalica, { fontSize: '18px', align: 'center', wordWrap: { width: 600 } })).setOrigin(0.5);
    } else {
      const mitad = Math.ceil(nivel.datos.length / 2);
      [nivel.datos.slice(0, mitad), nivel.datos.slice(mitad)].forEach((columna, c) => {
        let y = 150;
        columna.forEach((dato, j) => {
          const numero = c * mitad + j + 1;
          const texto = this.add.text(30 + c * 380, y, `${numero}. ${dato}`, con(ESTILO.textoTinta, { fontSize: '12.5px', wordWrap: { width: 360 } }));
          y += texto.height + 7;
        });
      });
    }

    crearBoton(this, 400, 568, 'VOLVER AL MAPA', () => this.scene.start('Mapa'), { ancho: 240, alto: 40, tamano: '16px' });
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('Mapa'));
    this.input.keyboard.on('keydown-RIGHT', () => this.scene.restart({ region: (this.region + 1) % NIVELES.length }));
    this.input.keyboard.on('keydown-LEFT', () => this.scene.restart({ region: (this.region + NIVELES.length - 1) % NIVELES.length }));
  }
}
