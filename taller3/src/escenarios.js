// Texturas y fondos de cada región, dibujados con Phaser Graphics.

export const ALTURA_SUELO = 540;

export function crearTexturasDeNivel(scene, nivel) {
  const t = nivel.tema;
  const claveSuelo = `suelo-${nivel.id}`;
  if (!scene.textures.exists(claveSuelo)) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(t.suelo).fillRect(0, 0, 64, 48);
    g.lineStyle(2, t.sueloBorde).strokeRect(0, 0, 64, 48);
    g.lineStyle(2, t.sueloDetalle);
    g.lineBetween(16, 0, 16, 24);
    g.lineBetween(48, 24, 48, 48);
    g.lineBetween(0, 24, 32, 24);
    if (t.cesped) g.fillStyle(t.cesped).fillRect(0, 0, 64, 8);
    g.generateTexture(claveSuelo, 64, 48);
    g.destroy();
  }

  const claveBloque = `bloque-${nivel.id}`;
  if (!scene.textures.exists(claveBloque)) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(t.bloque).fillRect(0, 0, 48, 48);
    g.lineStyle(3, t.bloqueBorde).strokeRect(0, 0, 48, 48);
    g.lineStyle(2, t.bloqueDetalle).strokeRect(5, 5, 38, 38);
    g.generateTexture(claveBloque, 48, 48);
    g.destroy();
  }

  if (!scene.textures.exists('bloque-oculto')) {
    // Piedra con una cruz escalonada andina (chakana) que Lino sabe leer.
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0x8a8577).fillRect(0, 0, 48, 48);
    g.lineStyle(3, 0x45423a).strokeRect(0, 0, 48, 48);
    g.fillStyle(0xf2b52b);
    g.fillRect(19, 8, 10, 32);
    g.fillRect(8, 19, 32, 10);
    g.fillRect(13, 13, 22, 22);
    g.fillStyle(0x8a8577).fillRect(21, 21, 6, 6);
    g.generateTexture('bloque-oculto', 48, 48);
    g.destroy();
  }

  if (!scene.textures.exists('hongo')) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xf3e6c4).fillRect(17, 12, 14, 12);
    g.fillStyle(0xd04a3a).fillEllipse(24, 11, 48, 22);
    g.fillStyle(0xffffff);
    g.fillCircle(12, 8, 3);
    g.fillCircle(25, 5, 3);
    g.fillCircle(36, 9, 3);
    g.generateTexture('hongo', 48, 24);
    g.destroy();
  }

  if (!scene.textures.exists('nube')) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xf4f7fb);
    g.fillEllipse(13, 13, 26, 20);
    g.fillEllipse(27, 10, 30, 20);
    g.fillEllipse(38, 14, 22, 18);
    g.fillRect(4, 12, 40, 10);
    g.fillStyle(0xc9d3e0).fillRect(6, 20, 36, 4);
    g.generateTexture('nube', 48, 24);
    g.destroy();
  }
}

function nubes(g, ancho, alfa = 0.85) {
  g.fillStyle(0xffffff, alfa);
  for (let x = 190; x < ancho; x += 560) {
    g.fillEllipse(x, 105, 48, 24);
    g.fillEllipse(x + 30, 105, 42, 28);
    g.fillEllipse(x - 25, 110, 38, 22);
  }
}

const FONDOS = {
  quito(g, ancho) {
    g.fillStyle(0x6da4e8).fillRect(0, 0, ancho, 600);
    g.fillStyle(0x52699a);
    for (let x = -120; x < ancho; x += 420) {
      g.fillTriangle(x, 430, x + 150, 245, x + 285, 430);
    }
    for (let x = 70; x < ancho; x += 650) {
      g.fillStyle(0x344c73).fillTriangle(x, 450, x + 170, 205, x + 330, 450);
      g.fillStyle(0xe9f3f5).fillTriangle(x + 125, 270, x + 170, 205, x + 220, 270);
    }
    [360, 1030, 1740, 2230].forEach((x) => {
      g.fillStyle(0x261f3b).fillTriangle(x - 115, 448, x, 230, x + 115, 448);
      g.fillStyle(0x3e2940).fillTriangle(x - 25, 300, x + 25, 300, x, 230);
      g.fillStyle(0xff7b24, 0.75).fillTriangle(x - 8, 285, x + 8, 285, x, 242);
    });
    nubes(g, ancho);
    // Casas coloniales blancas con tejas rojas.
    for (let x = 120; x < ancho; x += 260) {
      g.fillStyle(0xf4efe6).fillRect(x, 470, 70, 70);
      g.fillStyle(0xb8432a).fillTriangle(x - 6, 472, x + 76, 472, x + 35, 444);
      g.fillStyle(0x2f5d8a).fillRect(x + 10, 488, 12, 16).fillRect(x + 48, 488, 12, 16);
      g.fillStyle(0x6b4a2a).fillRect(x + 29, 508, 12, 32);
    }
    g.fillStyle(0x2d713f);
    for (let x = 0; x < ancho; x += 260) {
      g.fillCircle(x + 35, ALTURA_SUELO - 25, 28);
      g.fillCircle(x + 75, ALTURA_SUELO - 27, 35);
    }
  },

  latacunga(g, ancho) {
    g.fillStyle(0x9cc3e6).fillRect(0, 0, ancho, 600);
    g.fillStyle(0x7d8db0);
    for (let x = -100; x < ancho; x += 300) g.fillTriangle(x, 440, x + 150, 300, x + 300, 440);
    // El Cotopaxi: un cono casi perfecto con su glaciar.
    [520, 1450, 2250].forEach((cx) => {
      g.fillStyle(0x5f6680).fillPoints([
        { x: cx - 300, y: 455 }, { x: cx - 40, y: 170 }, { x: cx + 40, y: 170 }, { x: cx + 300, y: 455 }
      ], true);
      g.fillStyle(0xf4f7fb).fillPoints([
        { x: cx - 40, y: 170 }, { x: cx + 40, y: 170 }, { x: cx + 92, y: 250 }, { x: cx + 58, y: 238 },
        { x: cx + 30, y: 262 }, { x: cx, y: 244 }, { x: cx - 30, y: 262 }, { x: cx - 58, y: 240 },
        { x: cx - 92, y: 250 }
      ], true);
    });
    nubes(g, ancho, 0.75);
    g.lineStyle(3, 0x2b2b35);
    [[300, 120], [1100, 90], [1900, 130]].forEach(([x, y]) => {
      g.lineBetween(x - 14, y - 4, x, y + 2);
      g.lineBetween(x, y + 2, x + 14, y - 4);
    });
    g.fillStyle(0xa8953f);
    for (let x = 0; x < ancho; x += 140) g.fillEllipse(x + 70, 540, 220, 100);
    g.fillStyle(0xd8c46c);
    for (let x = 10; x < ancho; x += 47) g.fillTriangle(x, 540, x + 8, 510, x + 16, 540);
  },

  cuenca(g, ancho) {
    g.fillStyle(0x86b9e6).fillRect(0, 0, ancho, 600);
    g.fillStyle(0x7aa86a);
    for (let x = 0; x < ancho; x += 380) g.fillEllipse(x + 190, 470, 520, 240);
    nubes(g, ancho);
    // Catedral de la Inmaculada Concepción y sus cúpulas azules.
    for (let x = 260; x < ancho; x += 760) {
      g.fillStyle(0xd8c9b0).fillRect(x, 330, 120, 210);
      g.fillStyle(0xcbb999).fillRect(x - 12, 300, 26, 240).fillRect(x + 106, 300, 26, 240);
      g.fillStyle(0x3d6fb8).fillCircle(x + 60, 330, 40).fillCircle(x + 1, 300, 14).fillCircle(x + 119, 300, 14);
      g.fillStyle(0xf2b52b).fillRect(x + 57, 282, 6, 12);
      g.fillStyle(0x6b5134).fillRect(x + 48, 470, 24, 70);
    }
    // Terrazas incas de Pumapungo.
    for (let x = 620; x < ancho; x += 760) {
      g.fillStyle(0x9a8f7a).fillRect(x, 500, 260, 40).fillRect(x + 30, 470, 200, 30).fillRect(x + 60, 445, 140, 25);
      g.lineStyle(2, 0x7a705d).strokeRect(x, 500, 260, 40).strokeRect(x + 30, 470, 200, 30).strokeRect(x + 60, 445, 140, 25);
    }
  },

  tena(g, ancho) {
    g.fillStyle(0xa6dcc8).fillRect(0, 0, ancho, 600);
    g.fillStyle(0x3f8f5a);
    for (let x = 0; x < ancho + 120; x += 120) g.fillCircle(x, 410, 95);
    // Ceibas gigantes con lianas.
    for (let x = 200; x < ancho; x += 450) {
      g.fillStyle(0x6b4a2a).fillRect(x, 230, 24, 310);
      g.fillStyle(0x2f7d4a).fillEllipse(x + 12, 230, 230, 80).fillEllipse(x - 40, 250, 120, 50);
      g.lineStyle(2, 0x2f6b35).lineBetween(x + 50, 250, x + 54, 390).lineBetween(x - 30, 255, x - 26, 340);
    }
    g.fillStyle(0x2c7346);
    for (let x = 60; x < ancho + 120; x += 140) g.fillCircle(x, 470, 70);
    // El río Napo.
    g.fillStyle(0x3f9aa0).fillRect(0, 492, ancho, 48);
    g.fillStyle(0x8fd3d0);
    for (let x = 20; x < ancho; x += 90) g.fillRect(x, 506, 34, 3);
  },

  llanganates(g, ancho) {
    g.fillStyle(0x6e7f96).fillRect(0, 0, ancho, 600);
    g.fillStyle(0xffd36b, 0.45).fillCircle(ancho - 260, 110, 44);
    g.fillStyle(0x55657d);
    for (let x = -80; x < ancho; x += 260) g.fillTriangle(x, 460, x + 130, 250 + ((x / 260) % 3) * 30, x + 260, 460);
    // Cerro Hermoso.
    const cx = Math.round(ancho * 0.72);
    g.fillStyle(0x3e4b61).fillTriangle(cx - 260, 470, cx, 170, cx + 260, 470);
    g.fillStyle(0xf4f7fb).fillTriangle(cx - 52, 230, cx, 170, cx + 52, 230);
    g.fillStyle(0x3e4b61);
    for (let x = 0; x < ancho; x += 330) g.fillTriangle(x, 480, x + 165, 330, x + 330, 480);
    g.fillStyle(0x7fa7b8).fillEllipse(700, 525, 260, 26).fillEllipse(1700, 525, 200, 22);
    g.fillStyle(0xffffff, 0.18).fillRect(0, 300, ancho, 60).fillRect(0, 420, ancho, 40);
  }
};

export function dibujarFondo(scene, nivel, ancho) {
  const g = scene.add.graphics().setDepth(-2);
  (FONDOS[nivel.id] || FONDOS.quito)(g, ancho);
  return g;
}
