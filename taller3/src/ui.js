// Estilos de texto, botones e iconos compartidos por todas las escenas.
import Phaser from 'phaser';
import { iniciarAudio, efecto, alternarSilencio, estaSilenciado } from './audio.js';

export const COLOR = {
  tinta: 0x3a2716,
  tintaSuave: 0x6b5134,
  pergamino: 0xf3e6c4,
  pergaminoClaro: 0xfbf3dc,
  oro: 0xd9a42b,
  oroBrillante: 0xffd21f,
  terracota: 0xa8432a,
  noche: 0x11182f,
  rojo: 0xe52521
};

const BASE = { fontFamily: 'Arial, Helvetica, sans-serif' };
const SERIF = { fontFamily: 'Georgia, "Times New Roman", serif' };

export const ESTILO = {
  titulo: { ...SERIF, fontSize: '40px', color: '#fff3a1', fontStyle: 'bold', align: 'center', stroke: '#000000', strokeThickness: 5 },
  tituloPanel: { ...SERIF, fontSize: '19px', color: '#3a2716', fontStyle: 'bold', align: 'center' },
  franja: { ...BASE, fontSize: '15px', color: '#ffffff', fontStyle: 'bold', letterSpacing: 2 },
  etiqueta: { ...BASE, fontSize: '13px', color: '#a8432a', fontStyle: 'bold', letterSpacing: 2 },
  etiquetaOro: { ...BASE, fontSize: '15px', color: '#ffd21f', fontStyle: 'bold', letterSpacing: 1 },
  texto: { ...BASE, fontSize: '15px', color: '#ffffff', lineSpacing: 5 },
  textoTinta: { ...BASE, fontSize: '13px', color: '#3a2716', lineSpacing: 3 },
  textoTintaItalica: { ...BASE, fontSize: '13px', color: '#6b5134', fontStyle: 'italic', lineSpacing: 3 },
  hud: { ...BASE, fontSize: '22px', color: '#ffffff', backgroundColor: '#17458f', padding: { x: 8, y: 5 }, stroke: '#000000', strokeThickness: 3 },
  hudChico: { ...BASE, fontSize: '14px', color: '#ffffff', backgroundColor: '#1b1630cc', padding: { x: 7, y: 4 } },
  dato: { ...BASE, fontSize: '16px', color: '#f3e6c4', align: 'center', lineSpacing: 4, wordWrap: { width: 720 } },
  boton: { ...BASE, fontSize: '22px', color: '#ffffff', fontStyle: 'bold', align: 'center', stroke: '#000000', strokeThickness: 3 },
  ciudad: { ...BASE, fontSize: '13px', color: '#ffffff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 },
  pista: { ...SERIF, fontSize: '17px', color: '#f3e6c4', fontStyle: 'italic', align: 'center' }
};

export function con(estilo, extra) {
  return { ...estilo, ...extra };
}

// Botón interactivo: el área de clic es el propio rectángulo, así que sigue
// funcionando aunque se mueva o se escale el lienzo.
export function crearBoton(scene, x, y, texto, accion, opciones = {}) {
  const { ancho = 260, alto = 58, color = COLOR.rojo, tamano = '22px' } = opciones;
  const claro = Phaser.Display.Color.ValueToColor(color).lighten(12).color;
  const boton = scene.add.container(x, y);
  const fondo = scene.add.rectangle(0, 0, ancho, alto, color).setStrokeStyle(3, COLOR.oroBrillante);
  const etiqueta = scene.add.text(0, 0, texto, con(ESTILO.boton, { fontSize: tamano })).setOrigin(0.5);
  boton.add([fondo, etiqueta]);
  fondo.setInteractive({ useHandCursor: true })
    .on('pointerover', () => fondo.setFillStyle(claro))
    .on('pointerout', () => fondo.setFillStyle(color))
    .on('pointerup', () => {
      iniciarAudio();
      efecto('boton');
      accion();
    });
  return boton;
}

// Botón de sonido (también responde a la tecla M).
export function crearBotonSonido(scene, x, y, profundidad = 30) {
  const fondo = scene.add.circle(x, y, 17, 0x1b1630, 0.85).setStrokeStyle(2, COLOR.oroBrillante)
    .setScrollFactor(0).setDepth(profundidad);
  const icono = scene.add.text(x, y, '', con(ESTILO.boton, { fontSize: '16px', strokeThickness: 0 }))
    .setOrigin(0.5).setScrollFactor(0).setDepth(profundidad + 1);
  const pintar = () => icono.setText(estaSilenciado() ? '✕' : '♪').setColor(estaSilenciado() ? '#f2a07b' : '#ffd21f');
  const alternar = () => {
    iniciarAudio();
    alternarSilencio();
    pintar();
  };
  pintar();
  fondo.setInteractive({ useHandCursor: true }).on('pointerup', alternar);
  scene.input.keyboard.on('keydown-M', alternar);
  return fondo;
}

export function crearTexturasBase(scene) {
  if (scene.textures.exists('fragmento')) return;

  const fisica = scene.make.graphics({ add: false });
  fisica.fillStyle(0xffffff, 0).fillRect(0, 0, 60, 60);
  fisica.generateTexture('fisica', 60, 60);
  fisica.destroy();

  // Fragmento del derrotero: pergamino rasgado con el sello solar de los Guardianes.
  const g = scene.make.graphics({ add: false });
  const borde = [
    { x: 4, y: 5 }, { x: 11, y: 3 }, { x: 17, y: 6 }, { x: 24, y: 2 }, { x: 29, y: 6 },
    { x: 27, y: 14 }, { x: 30, y: 21 }, { x: 26, y: 29 }, { x: 18, y: 27 },
    { x: 11, y: 30 }, { x: 3, y: 27 }, { x: 5, y: 18 }, { x: 2, y: 11 }
  ];
  g.fillStyle(0xf3e6c4).fillPoints(borde, true);
  g.lineStyle(2, 0xa8761a).strokePoints(borde, true);
  g.lineStyle(2, 0x6b5134);
  g.lineBetween(8, 11, 18, 11);
  g.lineBetween(8, 16, 22, 16);
  g.lineBetween(8, 21, 16, 21);
  g.fillStyle(0xf2b52b).fillCircle(23, 22, 4);
  g.generateTexture('fragmento', 32, 32);
  g.destroy();
}

export function dibujarLlave(scene, x, y, escala = 1) {
  const llave = scene.add.graphics({ x, y }).setScale(escala);
  llave.lineStyle(8, 0xffd21f).strokeCircle(-30, 0, 16);
  llave.fillStyle(0xffd21f).fillRect(-14, -4, 56, 8);
  llave.fillRect(26, 4, 6, 12);
  llave.fillRect(36, 4, 6, 8);
  llave.fillStyle(0xf28b00).fillCircle(-30, 0, 5);
  return llave;
}

export function dibujarSol(scene, x, y, radio) {
  const sol = scene.add.graphics({ x, y });
  sol.fillStyle(0xffd36b, 0.6);
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    const c = Math.cos(a);
    const s = Math.sin(a);
    sol.fillTriangle(
      c * radio * 1.15 - s * radio * 0.08, s * radio * 1.15 + c * radio * 0.08,
      c * radio * 1.15 + s * radio * 0.08, s * radio * 1.15 - c * radio * 0.08,
      c * radio * 1.55, s * radio * 1.55
    );
  }
  sol.fillStyle(0xf7b844).fillCircle(0, 0, radio);
  sol.lineStyle(3, 0xc9841f).strokeCircle(0, 0, radio * 0.72);
  return sol;
}

export function dibujarEstrellas(scene, x, y, cantidad, radio = 8, separacion = 20) {
  return [0, 1, 2].map((i) =>
    scene.add.star(x + (i - 1) * separacion, y, 5, radio * 0.45, radio, i < cantidad ? 0xffd21f : 0x4a3a2a)
      .setStrokeStyle(1.5, 0x3a2716)
  );
}
