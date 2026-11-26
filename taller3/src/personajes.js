// Personajes dibujados con Phaser Graphics (arte propio, sin imágenes).
// Cada dibujo ocupa una caja de 60 x 58 px y mira hacia la derecha.
// dibujarPersonaje(g, id, cx, base, escala) lo centra en cx con los pies en base.

const PIEL = 0xc98e62;
const OSCURO = 0x20172b;
const ORO = 0xf2b52b;

export function pintor(g, ox, oy, s) {
  const X = (x) => ox + x * s;
  const Y = (y) => oy + y * s;
  return {
    rect(x, y, w, h, c, a = 1) { g.fillStyle(c, a).fillRect(X(x), Y(y), w * s, h * s); return this; },
    circ(x, y, r, c, a = 1) { g.fillStyle(c, a).fillCircle(X(x), Y(y), r * s); return this; },
    elip(x, y, w, h, c, a = 1) { g.fillStyle(c, a).fillEllipse(X(x), Y(y), w * s, h * s); return this; },
    poli(puntos, c, a = 1) {
      g.fillStyle(c, a).fillPoints(puntos.map(([x, y]) => ({ x: X(x), y: Y(y) })), true);
      return this;
    },
    linea(x1, y1, x2, y2, w, c) { g.lineStyle(w * s, c).lineBetween(X(x1), Y(y1), X(x2), Y(y2)); return this; }
  };
}

const DIBUJOS = {
  // Roco, el mecánico quiteño: chullo andino, poncho verde y llave inglesa.
  roco(p) {
    p.circ(30, 3, 3, ORO)
      .rect(17, 4, 26, 9, 0xb8322a)
      .rect(17, 9, 26, 3, ORO);
    [20, 26, 32, 38].forEach((x) => p.rect(x, 6, 2, 2, 0x1f3b5c));
    p.rect(15, 11, 6, 12, 0xb8322a).rect(39, 11, 6, 12, 0xb8322a)
      .rect(17, 23, 2, 5, ORO).rect(41, 23, 2, 5, ORO)
      .rect(21, 12, 18, 14, PIEL)
      .rect(27, 16, 3, 3, OSCURO).rect(34, 16, 3, 3, OSCURO)
      .rect(29, 22, 7, 2, 0x7a3b22)
      .poli([[19, 26], [41, 26], [51, 45], [9, 45]], 0x2f7d5b)
      .rect(12, 36, 36, 3, ORO).rect(10, 41, 40, 2, 0xb8322a)
      .rect(26, 26, 8, 3, 0x1f5a40)
      .rect(6, 40, 5, 5, PIEL).rect(49, 40, 5, 5, PIEL)
      .linea(52, 41, 57, 31, 3, 0x9aa3ad).circ(57, 30, 3, 0x9aa3ad)
      .rect(17, 45, 11, 7, 0x4a3524).rect(32, 45, 11, 7, 0x4a3524)
      .rect(14, 51, 15, 7, 0x2c211d).rect(31, 51, 15, 7, 0x2c211d);
  },

  // Alba, la ñusta guardiana: trenza, diadema solar, anaco, chumbi y la Vara del Inti.
  alba(p) {
    p.rect(20, 4, 20, 8, 0x1d1a1a)
      .rect(17, 8, 5, 32, 0x1d1a1a)
      .circ(19, 41, 3, 0xb8322a)
      .rect(22, 6, 16, 2, ORO).circ(30, 4, 4, ORO).circ(30, 4, 2, 0xffe9a8)
      .rect(22, 10, 16, 14, PIEL)
      .rect(26, 15, 3, 3, OSCURO).rect(33, 15, 3, 3, OSCURO)
      .rect(29, 20, 5, 2, 0x9c3b2a)
      .rect(20, 24, 20, 10, 0xf4efe6)
      .rect(19, 24, 22, 5, 0x6b3fa0)
      .rect(19, 34, 22, 3, 0xc0392b);
    [22, 29, 36].forEach((x) => p.rect(x, 34, 2, 3, ORO));
    p.poli([[19, 37], [41, 37], [45, 54], [15, 54]], 0x1f3b5c)
      .rect(16, 50, 28, 2, 0x6b3fa0)
      .rect(20, 54, 8, 4, 0x2c211d).rect(33, 54, 8, 4, 0x2c211d)
      .rect(41, 26, 6, 4, PIEL)
      .rect(46, 18, 2, 38, 0x7a4a24)
      .circ(47, 15, 5, ORO).circ(47, 15, 2, 0xffe9a8);
  },

  // Brin, el zorro del páramo, con su bufanda morada.
  brin(p) {
    p.elip(12, 44, 18, 10, 0xd9752b).circ(5, 44, 4, 0xf4efe6)
      .elip(30, 40, 26, 22, 0xd9752b)
      .elip(31, 43, 12, 14, 0xf4efe6)
      .rect(22, 48, 5, 10, 0x5a3416).rect(34, 48, 5, 10, 0x5a3416)
      .poli([[21, 17], [25, 3], [30, 14]], 0xd9752b)
      .poli([[31, 14], [36, 3], [40, 17]], 0xd9752b)
      .poli([[24, 14], [25, 7], [28, 13]], 0x5a3416)
      .circ(30, 22, 11, 0xd9752b)
      .poli([[36, 20], [49, 25], [36, 30]], 0xf4efe6)
      .circ(49, 25, 2, OSCURO)
      .rect(33, 18, 3, 3, OSCURO)
      .rect(19, 30, 23, 5, 0x7d3cff)
      .rect(18, 33, 6, 11, 0x7d3cff)
      .rect(22, 30, 3, 5, 0xb48cff).rect(30, 30, 3, 5, 0xb48cff).rect(18, 38, 6, 2, 0xb48cff);
  },

  // Lino, el explorador cartógrafo de Cuenca.
  lino(p) {
    p.elip(30, 9, 36, 6, 0x5c6b2f)
      .rect(22, 0, 16, 9, 0x5c6b2f)
      .rect(22, 6, 16, 2, 0x7a4a24)
      .rect(23, 11, 14, 13, 0xf0c49a)
      .rect(27, 15, 3, 3, OSCURO).rect(33, 15, 3, 3, OSCURO)
      .rect(29, 20, 5, 2, 0x9c3b2a)
      .rect(20, 24, 20, 15, 0x7fa35b)
      .rect(20, 24, 6, 15, 0x7a4a24).rect(34, 24, 6, 15, 0x7a4a24)
      .rect(36, 28, 15, 11, 0xf3e6c4)
      .rect(38, 31, 11, 1, 0xa8761a).rect(38, 34, 8, 1, 0xa8761a)
      .rect(21, 39, 8, 13, 0x5c6b2f).rect(31, 39, 8, 13, 0x5c6b2f)
      .rect(19, 52, 11, 6, 0x5a3416).rect(30, 52, 11, 6, 0x5a3416);
  },

  // Milo, el guardián del bosque: capucha de hoja y bastón con hongo.
  milo(p) {
    p.poli([[13, 24], [30, 0], [47, 24]], 0x2f7d5b)
      .elip(30, 22, 36, 16, 0x2f7d5b)
      .rect(29, 3, 2, 18, 0x1f5a40)
      .circ(30, 27, 9, PIEL)
      .rect(26, 25, 3, 3, OSCURO).rect(32, 25, 3, 3, OSCURO)
      .rect(28, 31, 5, 2, 0x7a3b22)
      .rect(21, 35, 18, 15, 0x8b5a2b)
      .rect(21, 41, 18, 2, ORO)
      .rect(45, 24, 2, 32, 0x7a4a24)
      .elip(46, 22, 16, 9, 0xd04a3a)
      .circ(42, 21, 1.5, 0xffffff).circ(48, 20, 1.5, 0xffffff)
      .rect(39, 38, 6, 4, PIEL)
      .rect(24, 50, 5, 8, 0x5a3416).rect(32, 50, 5, 8, 0x5a3416);
  },

  // Nuba, el espíritu de las nubes de los Llanganates.
  nuba(p) {
    p.elip(30, 38, 46, 24, 0xf4f7fb)
      .circ(19, 31, 10, 0xf4f7fb).circ(32, 24, 13, 0xf4f7fb).circ(43, 32, 9, 0xf4f7fb)
      .rect(25, 31, 3, 4, OSCURO).rect(35, 31, 3, 4, OSCURO)
      .circ(22, 38, 2.5, 0xf2a0b0).circ(41, 38, 2.5, 0xf2a0b0)
      .rect(29, 39, 5, 2, 0x8a93a6)
      .elip(30, 50, 36, 6, 0xc9d3e0, 0.6);
  },

  // El Rey Brumario: sombrero de copa, antifaz y capa morada entre humo.
  brumario(p) {
    p.rect(22, 0, 16, 10, 0x2a1c3a).rect(18, 10, 24, 2, 0x2a1c3a)
      .rect(23, 12, 14, 12, 0xe0b48f)
      .rect(23, 15, 14, 4, 0x5b2a86)
      .rect(26, 16, 3, 2, 0xffffff).rect(32, 16, 3, 2, 0xffffff)
      .rect(28, 21, 6, 1, 0x7a3b22)
      .poli([[16, 24], [44, 24], [50, 52], [10, 52]], 0x5b2a86)
      .rect(22, 24, 16, 24, 0x3b2457)
      .rect(28, 26, 4, 4, ORO)
      .rect(23, 48, 6, 8, 0x2a1c3a).rect(31, 48, 6, 8, 0x2a1c3a)
      .elip(14, 55, 18, 7, 0x9a8fb5, 0.7).elip(46, 55, 18, 7, 0x9a8fb5, 0.7);
  }
};

// Agente de la Bruma: ladrón encapuchado que deja una estela de humo.
DIBUJOS.agente = (p) => {
  p.elip(8, 50, 16, 10, 0x9a8fb5, 0.55).elip(2, 42, 10, 8, 0x9a8fb5, 0.4)
    .poli([[18, 20], [30, 2], [42, 20], [44, 50], [16, 50]], 0x5b2a86)
    .circ(30, 22, 9, 0x3b2457)
    .rect(23, 19, 14, 5, 0x20172b)
    .rect(25, 20, 3, 2, 0xf2a07b).rect(32, 20, 3, 2, 0xf2a07b)
    .rect(20, 36, 20, 3, 0xf2b52b)
    .elip(44, 40, 12, 12, 0xcbb999)
    .rect(22, 50, 6, 8, 0x2a1c3a).rect(32, 50, 6, 8, 0x2a1c3a);
};

export function dibujarPersonaje(g, id, cx, base, escala = 1) {
  const dibujo = DIBUJOS[id];
  if (!dibujo) return;
  dibujo(pintor(g, cx - 30 * escala, base - 58 * escala, escala));
}
