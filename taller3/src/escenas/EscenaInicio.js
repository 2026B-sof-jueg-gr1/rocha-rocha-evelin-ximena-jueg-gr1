// Escenario 1: portada del juego. Lleva al mapa del Ecuador.
import Phaser from 'phaser';
import { ESTILO, con, crearBoton, crearTexturasBase, dibujarSol } from '../ui.js';
import { cargarProgreso, progresoDePrueba } from '../datos/progreso.js';

export class EscenaInicio extends Phaser.Scene {
  constructor() {
    super('Inicio');
  }

  create() {
    crearTexturasBase(this);
    if (this.atajoDeDesarrollo()) return;

    const g = this.add.graphics();
    g.fillGradientStyle(0x1b1630, 0x1b1630, 0xb85a35, 0xb85a35, 1);
    g.fillRect(0, 0, 800, 470);
    g.fillStyle(0xe9a24a).fillRect(0, 470, 800, 130);
    dibujarSol(this, 400, 360, 70);
    g.fillStyle(0xffffff, 0.8);
    [[90, 60], [210, 110], [330, 40], [520, 90], [650, 50], [740, 130], [60, 180]].forEach(([x, y]) => g.fillCircle(x, y, 1.5));

    const montes = this.add.graphics();
    montes.fillStyle(0x6a3b4f, 0.92).fillPoints([
      { x: 0, y: 470 }, { x: 90, y: 390 }, { x: 160, y: 430 }, { x: 250, y: 340 }, { x: 330, y: 420 },
      { x: 400, y: 380 }, { x: 490, y: 440 }, { x: 570, y: 350 }, { x: 650, y: 420 }, { x: 730, y: 370 },
      { x: 800, y: 410 }, { x: 800, y: 600 }, { x: 0, y: 600 }
    ], true);
    montes.fillStyle(0xf4e7d0).fillTriangle(250, 340, 272, 360, 228, 360).fillTriangle(570, 350, 590, 368, 550, 368);
    montes.fillStyle(0x3b2a40).fillPoints([
      { x: 0, y: 520 }, { x: 120, y: 470 }, { x: 230, y: 510 }, { x: 340, y: 465 }, { x: 460, y: 515 },
      { x: 580, y: 470 }, { x: 700, y: 510 }, { x: 800, y: 480 }, { x: 800, y: 600 }, { x: 0, y: 600 }
    ], true);
    montes.fillStyle(0x1f2a24).fillPoints([
      { x: 0, y: 560 }, { x: 160, y: 535 }, { x: 330, y: 555 }, { x: 500, y: 530 }, { x: 680, y: 555 },
      { x: 800, y: 540 }, { x: 800, y: 600 }, { x: 0, y: 600 }
    ], true);
    montes.lineStyle(3, 0xffd36b, 0.7);
    for (let y = 440; y < 600; y += 16) montes.lineBetween(400, y, 400, y + 8);

    this.add.rectangle(400, 24, 800, 48, 0xe5254f);
    this.add.text(400, 24, 'EL DERROTERO PERDIDO · UNA AVENTURA POR EL ECUADOR', ESTILO.franja).setOrigin(0.5);
    this.add.text(400, 108, 'LOS GUARDIANES\nDEL INTI', con(ESTILO.titulo, { fontSize: '46px', lineSpacing: 0 })).setOrigin(0.5);
    this.add.text(
      400,
      218,
      'La banda del Rey Brumario roba las reliquias sagradas del Ecuador.\n'
        + 'Recorre el mapa, une aliados en cada región y recupera\n'
        + 'las cuatro llaves del Disco Solar antes del equinoccio.',
      con(ESTILO.texto, { fontSize: '17px', align: 'center', stroke: '#000000', strokeThickness: 3 })
    ).setOrigin(0.5);

    const progreso = cargarProgreso();
    const empezado = progreso.completados.some(Boolean);
    crearBoton(this, 400, 305, empezado ? 'CONTINUAR AVENTURA' : 'COMENZAR AVENTURA', () => this.irAlMapa(), { ancho: 320, alto: 62 });
    this.add.text(400, 350, 'Pulsa ENTER o haz clic', con(ESTILO.texto, { fontSize: '13px', color: '#ffdf76' })).setOrigin(0.5);

    this.input.keyboard.once('keydown-ENTER', () => this.irAlMapa());
    this.input.keyboard.once('keydown-SPACE', () => this.irAlMapa());
  }

  irAlMapa() {
    this.scene.start('Mapa');
  }

  // En desarrollo (npm run dev) se puede saltar a cualquier escena:
  //   ?escena=Mapa&progreso=3   ?escena=Nivel&nivel=2   ?escena=Carga&nivel=1
  atajoDeDesarrollo() {
    if (!import.meta.env.DEV) return false;
    const q = new URLSearchParams(window.location.search);
    const escena = q.get('escena');
    if (!escena) return false;
    if (q.has('progreso')) progresoDePrueba(Number(q.get('progreso')));
    const nivel = Number(q.get('nivel') || 0);
    this.scene.start(escena, {
      nivel,
      gano: q.get('gano') !== '0',
      restante: 45.2,
      estrellas: 3,
      recogidas: q.get('gano') === '0' ? 9 : 15,
      total: 15
    });
    return true;
  }
}
