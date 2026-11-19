// Presentación de cada capítulo: llegada (qué robó la Bruma), encuentro (el
// aliado que se une y su habilidad) y controles. Se puede saltar con un clic.
import Phaser from 'phaser';
import { NIVELES, habilidadesDe } from '../datos/niveles.js';
import { dibujarPersonaje } from '../personajes.js';
import { COLOR, ESTILO, con } from '../ui.js';

const DURACION = 4500;

export class EscenaCarga extends Phaser.Scene {
  constructor() {
    super('Carga');
  }

  create(data = {}) {
    this.indice = data.nivel ?? 0;
    const nivel = NIVELES[this.indice];
    const hab = habilidadesDe(this.indice);
    this.iniciado = false;

    this.add.rectangle(400, 300, 800, 600, COLOR.noche);
    this.add.rectangle(400, 24, 800, 48, 0xe5254f);
    this.add.text(400, 24, `${nivel.etiqueta} · ${nivel.ciudad.toUpperCase()}`, ESTILO.franja).setOrigin(0.5);
    this.add.text(400, 80, nivel.titulo.toUpperCase(), con(ESTILO.titulo, { fontSize: '30px', wordWrap: { width: 740 } })).setOrigin(0.5);
    if (this.indice > 0) {
      this.add.text(400, 118, `La pista que te trajo: «${NIVELES[this.indice - 1].pista}»`, con(ESTILO.pista, { fontSize: '15px' }))
        .setOrigin(0.5);
    }

    // Llegada y encuentro.
    this.add.rectangle(245, 268, 430, 250, 0x202947).setStrokeStyle(2, COLOR.oroBrillante);
    this.add.text(45, 152, 'LLEGADA', ESTILO.etiquetaOro);
    const llegada = this.add.text(45, 174, nivel.llegada, con(ESTILO.texto, { fontSize: '14px', wordWrap: { width: 395 } }));
    const yEncuentro = Math.max(270, llegada.y + llegada.height + 14);
    this.add.text(45, yEncuentro, 'ENCUENTRO', ESTILO.etiquetaOro);
    this.add.text(45, yEncuentro + 22, nivel.encuentro, con(ESTILO.texto, { fontSize: '14px', wordWrap: { width: 395 } }));

    // Retrato del aliado.
    this.add.rectangle(610, 268, 300, 250, 0x202947).setStrokeStyle(2, COLOR.oroBrillante);
    this.add.circle(610, 225, 70, 0x2d3a63);
    const retrato = this.add.graphics();
    dibujarPersonaje(retrato, nivel.aliado, 610, 285, 2);
    this.add.text(610, 318, nivel.nombreAliado, con(ESTILO.etiquetaOro, { align: 'center' })).setOrigin(0.5);
    this.add.text(610, 350, nivel.habilidad, con(ESTILO.texto, { fontSize: '13px', align: 'center', wordWrap: { width: 270 } }))
      .setOrigin(0.5);

    // Controles y habilidades activas.
    const lineas = ['Moverse: A/D o flechas   ·   Saltar: W, ↑ o Espacio   ·   ESC: volver al mapa'];
    if (hab.dobleSalto) lineas.push('Salto doble (Brin): pulsa saltar otra vez en el aire.');
    if (hab.hongos) lineas.push('Hongos de Milo: cae sobre ellos para rebotar muy alto.');
    if (nivel.nota) lineas.push(nivel.nota);
    lineas.push(`Meta: reúne los ${nivel.fragmentos.length} fragmentos del derrotero en ${nivel.tiempo} segundos.`);
    this.add.text(400, 448, lineas.join('\n'), con(ESTILO.texto, { fontSize: '14px', color: '#ffdf76', align: 'center', lineSpacing: 4 }))
      .setOrigin(0.5);

    // Barra de carga.
    this.add.rectangle(400, 540, 610, 22, 0x263154).setStrokeStyle(3, 0xffffff);
    const barra = this.add.rectangle(100, 540, 0, 16, COLOR.oroBrillante).setOrigin(0, 0.5);
    const texto = this.add.text(400, 572, 'PREPARANDO LA MISIÓN... 0%   (clic o ENTER para empezar ya)', con(ESTILO.texto, { fontSize: '14px', fontStyle: 'bold' }))
      .setOrigin(0.5);
    this.tweens.add({
      targets: barra,
      width: 600,
      duration: DURACION,
      onUpdate: (tween) => texto.setText(`PREPARANDO LA MISIÓN... ${Math.round(tween.progress * 100)}%   (clic o ENTER para empezar ya)`),
      onComplete: () => this.empezar()
    });

    this.input.once('pointerup', () => this.empezar());
    this.input.keyboard.once('keydown-ENTER', () => this.empezar());
    this.input.keyboard.once('keydown-ESC', () => this.scene.start('Mapa', { seleccion: this.indice }));
  }

  empezar() {
    if (this.iniciado) return;
    this.iniciado = true;
    this.scene.start('Nivel', { nivel: this.indice });
  }
}
