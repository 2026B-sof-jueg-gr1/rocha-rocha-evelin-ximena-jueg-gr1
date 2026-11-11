// Aventura de plataformas retro protagonizada por Mario.
// Todo se dibuja con Phaser: no se necesitan imágenes ni paquetes externos.

const ANCHO_MUNDO = 2400;
const ALTO_MUNDO = 600;
const TOTAL_MONEDAS = 15;
const VELOCIDAD_MARIO = 220;
const FUERZA_SALTO = 720;
const ALTURA_SUELO = 540;
const VENTANA_SALTO = 140;

let mario;
let dibujoMario;
let monedas;
let plataformas;
let teclas;
let textoMonedas;
let textoTiempo;
let textoVictoria;
let juegoTerminado = false;
let juegoIniciado = false;
let inicioJuego;
let pantallaInicio;
let botonJugar;
let pantallaVictoria;
let botonVolverAJugar;
let botonSalir;
let modoReinicio = 'inicio';
let saltoSolicitadoHasta = -Infinity;
let ultimoContactoConSuelo = -Infinity;
let pantallaCarga;
let barraCarga;
let textoCarga;
let cargaEnCurso = false;

const configuracion = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#5c91ed',
  parent: document.getElementById('game-container') ? 'game-container' : undefined,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  render: {
    clearBeforeRender: true,
    antialias: false
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: { preload, create, update }
};

new Phaser.Game(configuracion);

function preload() {
  // Las texturas se generan en create.
}

function create() {
  juegoTerminado = false;
  juegoIniciado = false;
  cargaEnCurso = false;
  saltoSolicitadoHasta = -Infinity;
  ultimoContactoConSuelo = -Infinity;
  inicioJuego = this.time.now;
  this.physics.world.setBounds(0, 0, ANCHO_MUNDO, ALTO_MUNDO);

  crearTexturas(this);
  dibujarFondo(this);

  plataformas = this.physics.add.staticGroup();
  crearSuelo(this);
  crearObstaculos(this);

  // El centro del cuerpo queda a 28 px del borde superior del suelo (540).
  mario = this.physics.add.sprite(90, ALTURA_SUELO - 30, 'fisica');
  mario.setCollideWorldBounds(true);
  mario.setDepth(3);
  // La caja física mide 56 px: su borde inferior coincide con el suelo.
  mario.body.setSize(44, 56).setOffset(8, 2);
  mario.setVisible(false);
  mario.body.setMaxVelocity(400, 800);
  dibujoMario = this.add.graphics().setDepth(3);
  dibujarMario();

  teclas = this.input.keyboard.addKeys({
    izquierda: Phaser.Input.Keyboard.KeyCodes.A,
    derecha: Phaser.Input.Keyboard.KeyCodes.D,
    flechaIzquierda: Phaser.Input.Keyboard.KeyCodes.LEFT,
    flechaDerecha: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    salto: Phaser.Input.Keyboard.KeyCodes.W,
    flechaArriba: Phaser.Input.Keyboard.KeyCodes.UP,
    espacio: Phaser.Input.Keyboard.KeyCodes.SPACE
  });

  monedas = this.physics.add.group();
  crearMonedas(this);
  this.physics.add.collider(mario, plataformas);
  this.physics.add.overlap(mario, monedas, recogerMoneda, null, this);

  const camara = this.cameras.main;
  camara.setBounds(0, 0, ANCHO_MUNDO, ALTO_MUNDO);
  camara.startFollow(mario, true, 0.08, 0.08);

  textoMonedas = this.add.text(20, 18, `MONEDAS: 0/${TOTAL_MONEDAS}`, estiloHUD);
  textoTiempo = this.add.text(20, 52, 'TIEMPO: 0.0 s', estiloHUD);
  textoMonedas.setScrollFactor(0);
  textoTiempo.setScrollFactor(0);
  textoVictoria = this.add.text(400, 300, '', estiloVictoria)
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(10);

  crearPantallaInicio(this);
  ocultarElementosDelJuego();
  this.input.on('pointerdown', (puntero) => manejarClickEnPantalla(this, puntero));

  if (modoReinicio === 'juego') {
    iniciarJuego();
  }
  modoReinicio = 'inicio';
}

function update() {
  if (!juegoIniciado || juegoTerminado || cargaEnCurso) return;

  const izquierda = teclas.izquierda.isDown || teclas.flechaIzquierda.isDown;
  const derecha = teclas.derecha.isDown || teclas.flechaDerecha.isDown;
  const saltoPresionado =
    Phaser.Input.Keyboard.JustDown(teclas.salto) ||
    Phaser.Input.Keyboard.JustDown(teclas.flechaArriba) ||
    Phaser.Input.Keyboard.JustDown(teclas.espacio);

  mario.setVelocityX((derecha ? 1 : 0) * VELOCIDAD_MARIO - (izquierda ? 1 : 0) * VELOCIDAD_MARIO);
  if (mario.body.velocity.x !== 0) mario.setFlipX(mario.body.velocity.x < 0);
  dibujoMario.setPosition(mario.x - 30, mario.y - 30);
  dibujoMario.setScale(mario.flipX ? -1 : 1, 1);

  // Guardamos brevemente la pulsación para que el salto no se pierda al aterrizar.
  const estaEnElSuelo = mario.body.blocked.down || mario.body.touching.down || mario.body.onFloor();
  if (saltoPresionado) {
    saltoSolicitadoHasta = this.time.now + VENTANA_SALTO;
  }
  if (estaEnElSuelo) {
    ultimoContactoConSuelo = this.time.now;
  }
  const puedeSaltar =
    this.time.now <= ultimoContactoConSuelo + VENTANA_SALTO &&
    this.time.now <= saltoSolicitadoHasta;
  if (puedeSaltar) {
    mario.setVelocityY(-FUERZA_SALTO);
    saltoSolicitadoHasta = 0;
    ultimoContactoConSuelo = 0;
  }

  // La moneda se recoge únicamente cuando Mario está realmente cerca.
  monedas.getChildren().forEach((moneda) => {
    if (
      moneda.active &&
      Phaser.Math.Distance.Between(mario.x, mario.y, moneda.x, moneda.y) < 44
    ) {
      recogerMoneda(mario, moneda);
    }
  });

  textoTiempo.setText(`TIEMPO: ${((this.time.now - inicioJuego) / 1000).toFixed(1)} s`);
}

function crearTexturas(scene) {
  const fisicaGrafico = scene.make.graphics({ x: 0, y: 0, add: false });
  fisicaGrafico.fillStyle(0xffffff, 0);
  fisicaGrafico.fillRect(0, 0, 60, 60);
  fisicaGrafico.generateTexture('fisica', 60, 60);
  fisicaGrafico.destroy();

  const monedaGrafico = scene.make.graphics({ x: 0, y: 0, add: false });
  monedaGrafico.fillStyle(0xffd21f).fillCircle(16, 16, 13);
  monedaGrafico.lineStyle(3, 0xf28b00).strokeCircle(16, 16, 13);
  monedaGrafico.lineStyle(2, 0xffffa8).lineBetween(10, 8, 22, 8);
  monedaGrafico.generateTexture('moneda', 32, 32);
  monedaGrafico.destroy();

  const bloqueGrafico = scene.make.graphics({ x: 0, y: 0, add: false });
  bloqueGrafico.fillStyle(0x80683b).fillRect(0, 0, 48, 48);
  bloqueGrafico.lineStyle(3, 0x40331f).strokeRect(0, 0, 48, 48);
  bloqueGrafico.lineStyle(2, 0xd4bd67).strokeRect(5, 5, 38, 38);
  bloqueGrafico.generateTexture('bloque', 48, 48);
  bloqueGrafico.destroy();

  const sueloGrafico = scene.make.graphics({ x: 0, y: 0, add: false });
  sueloGrafico.fillStyle(0x5c3e2e).fillRect(0, 0, 64, 48);
  sueloGrafico.lineStyle(2, 0x2c211d).strokeRect(0, 0, 64, 48);
  sueloGrafico.lineStyle(2, 0x9e7747);
  sueloGrafico.lineBetween(16, 0, 16, 24);
  sueloGrafico.lineBetween(48, 24, 48, 48);
  sueloGrafico.lineBetween(0, 24, 32, 24);
  sueloGrafico.lineBetween(32, 0, 64, 0);
  sueloGrafico.generateTexture('suelo', 64, 48);
  sueloGrafico.destroy();
}

function dibujarMario() {
  dibujoMario.clear();
  dibujoMario.fillStyle(0xe52521).fillRect(8, 0, 44, 10);
  dibujoMario.fillStyle(0xe52521).fillRect(15, 8, 30, 8);
  dibujoMario.fillStyle(0xf5bd8c).fillRect(17, 16, 26, 17);
  dibujoMario.fillStyle(0x20172b).fillRect(23, 21, 4, 4);
  dibujoMario.fillStyle(0x20172b).fillRect(35, 21, 4, 4);
  dibujoMario.fillStyle(0x2d65c4).fillRect(12, 33, 36, 17);
  dibujoMario.fillStyle(0xe52521).fillRect(8, 35, 9, 18);
  dibujoMario.fillStyle(0xe52521).fillRect(43, 35, 9, 18);
  dibujoMario.fillStyle(0x633b20).fillRect(12, 50, 15, 7);
  dibujoMario.fillStyle(0x633b20).fillRect(33, 50, 15, 7);
}

function dibujarFondo(scene) {
  const fondo = scene.add.graphics().setDepth(-2);
  fondo.fillStyle(0x6da4e8).fillRect(0, 0, ANCHO_MUNDO, ALTO_MUNDO);

  // Silueta andina lejana y volcanes que identifican el paisaje.
  fondo.fillStyle(0x52699a);
  for (let x = -120; x < ANCHO_MUNDO; x += 420) {
    fondo.fillPoints([
      { x, y: 430 },
      { x: x + 150, y: 245 },
      { x: x + 285, y: 430 }
    ], true);
  }
  fondo.fillStyle(0x344c73);
  for (let x = 70; x < ANCHO_MUNDO; x += 650) {
    fondo.fillPoints([
      { x, y: 450 },
      { x: x + 170, y: 205 },
      { x: x + 330, y: 450 }
    ], true);
    fondo.fillStyle(0xe9f3f5);
    fondo.fillPoints([
      { x: x + 125, y: 270 },
      { x: x + 170, y: 205 },
      { x: x + 220, y: 270 }
    ], true);
    fondo.fillStyle(0x344c73);
  }

  fondo.fillStyle(0x261f3b);
  [360, 1030, 1740, 2230].forEach((x) => {
    fondo.fillPoints([
      { x: x - 115, y: 448 },
      { x, y: 230 },
      { x: x + 115, y: 448 }
    ], true);
    fondo.fillStyle(0x3e2940);
    fondo.fillTriangle(x - 25, 300, x + 25, 300, x, 230);
    fondo.fillStyle(0xff7b24, 0.75);
    fondo.fillTriangle(x - 8, 285, x + 8, 285, x, 242);
    fondo.fillStyle(0x261f3b);
  });

  fondo.fillStyle(0xffffff, 0.85);
  [190, 690, 1250, 1850].forEach((x) => {
    fondo.fillEllipse(x, 105, 48, 24);
    fondo.fillEllipse(x + 30, 105, 42, 28);
    fondo.fillEllipse(x - 25, 110, 38, 22);
  });
  fondo.fillStyle(0x2d713f);
  for (let x = 0; x < ANCHO_MUNDO; x += 160) {
    fondo.fillCircle(x + 35, ALTURA_SUELO - 25, 28);
    fondo.fillCircle(x + 75, ALTURA_SUELO - 27, 35);
  }
}

function crearSuelo(scene) {
  // Cada pieza mide 64x48 y su cara superior queda exactamente en y=540.
  for (let x = 32; x < ANCHO_MUNDO; x += 64) {
    plataformas.create(x, ALTURA_SUELO + 24, 'suelo').refreshBody();
  }
}

function crearObstaculos(scene) {
  // Se expresa la posición por fila superior para que ningún bloque quede
  // flotando por error y todas sus caras sean coherentes con su colisión.
  const bloques = [
    [300, 426], [348, 426], [396, 426], [620, 376], [668, 376],
    [900, 426], [948, 426], [1130, 386], [1178, 386], [1226, 386],
    [1450, 336], [1498, 336], [1710, 406], [1758, 406],
    [1940, 366], [1988, 366], [2036, 366], [2200, 426], [2248, 426], [2296, 426]
  ];
  bloques.forEach(([x, bordeSuperior]) => {
    plataformas.create(x, bordeSuperior + 24, 'bloque').refreshBody();
  });
}

function crearMonedas(scene) {
  const posiciones = [
    [220, 465], [300, 390], [348, 390], [396, 390], [540, 465],
    [620, 340], [668, 340], [820, 465], [900, 395], [948, 395],
    [1080, 465], [1130, 350], [1178, 350], [1450, 300], [1820, 465]
  ];
  posiciones.forEach(([x, y]) => {
    const moneda = monedas.create(x, y, 'moneda');
    moneda.setActive(true).setVisible(true).setDepth(2);
    moneda.body.setSize(28, 28).setOffset(2, 2);
    moneda.body.setAllowGravity(false);
  });
}

function crearPantallaInicio(scene) {
  pantallaInicio = scene.add.container(400, 300).setScrollFactor(0).setDepth(20);
  const fondo = scene.add.rectangle(0, 0, 800, 600, 0x11182f, 0.97);
  const franja = scene.add.rectangle(0, -276, 800, 48, 0xe5254f);
  const subtitulo = scene.add.text(0, -276, 'UNA AVENTURA ANDINA DE PLATAFORMAS', estiloFranja)
    .setOrigin(0.5);
  const titulo = scene.add.text(0, -205, 'AVENTURA DE MARIO', estiloTitulo).setOrigin(0.5);
  const separador = scene.add.rectangle(0, -155, 560, 3, 0xffd21f);
  const historia = scene.add.text(-330, -125, 'LA MISIÓN', estiloEtiqueta);
  const historiaTexto = scene.add.text(
    -330,
    -95,
    'Mario debe reunir las monedas doradas del reino.\n'
      + 'Guíalo por las plataformas y los bloques\n'
      + 'antes de que el tiempo se termine.',
    estiloPanel
  );
  const descripcion = scene.add.text(
    0,
    28,
    'Recolecta las monedas y consigue la estrella final.',
    estiloInstruccionesInicio
  ).setOrigin(0.5);
  botonJugar = crearBoton(scene, 0, 125, 'COMENZAR AVENTURA', iniciarJuego);
  pantallaInicio.add([
    fondo, franja, subtitulo, titulo, separador, historia, historiaTexto,
    descripcion, botonJugar
  ]);
}

function iniciarJuego() {
  pantallaInicio.setVisible(false);
  iniciarPresentacionDeCarga();
}

function iniciarPresentacionDeCarga() {
  const escena = mario.scene;
  cargaEnCurso = true;
  juegoIniciado = false;
  ocultarElementosDelJuego();

  pantallaCarga = escena.add.container(400, 300).setScrollFactor(0).setDepth(200);
  const fondo = escena.add.rectangle(0, 0, 800, 600, 0x11182f, 0.98);
  const cinta = escena.add.rectangle(0, -260, 800, 48, 0xe5254f);
  const cintaTexto = escena.add.text(0, -260, 'PRESENTACIÓN DE LA AVENTURA', estiloFranja)
    .setOrigin(0.5);
  const titulo = escena.add.text(0, -202, 'PREPARA TU MISIÓN', estiloTitulo).setOrigin(0.5);
  const panelInstrucciones = escena.add.rectangle(0, -70, 700, 150, 0x202947)
    .setStrokeStyle(2, 0xffd21f);
  const texto = escena.add.text(
    0,
    -70,
    '📜 INSTRUCCIONES\n\n'
      + '1. Muévete: usa A/D o las flechas.\n'
      + '2. Salta: usa W, ↑ o Espacio.\n'
      + '3. Explora: recorre las plataformas.\n'
      + '4. Completa: recoge las 15 monedas.\n\n'
      + 'Meta: consigue todas las monedas y desbloquea la estrella final.',
    estiloCargaInstrucciones
  ).setOrigin(0.5);

  const tarjetaMision = crearTarjetaCarga(
    escena,
    -235,
    110,
    '01  EXPLORA',
    'Recorre las plataformas\ny descubre el camino.',
    0xff8a00
  );
  const tarjetaSalto = crearTarjetaCarga(
    escena,
    0,
    110,
    '02  SALTA',
    'Usa W, ↑ o Espacio\npara superar obstáculos.',
    0xe5254f
  );
  const tarjetaTesoro = crearTarjetaCarga(
    escena,
    235,
    110,
    '03  RECUPERA',
    'Encuentra las 15 monedas\ny desbloquea la estrella.',
    0x7d3cff
  );

  barraCarga = escena.add.rectangle(-300, 210, 0, 16, 0xffd21f)
    .setOrigin(0, 0.5);
  const marcoBarra = escena.add.rectangle(0, 210, 610, 22)
    .setStrokeStyle(3, 0xffffff)
    .setFillStyle(0x263154, 1);
  barraCarga.setDepth(1);
  marcoBarra.setDepth(0);
  textoCarga = escena.add.text(0, 250, 'CARGANDO ESCENARIO... 0%', estiloCarga)
    .setOrigin(0.5);
  pantallaCarga.add([
    fondo, cinta, cintaTexto, titulo, panelInstrucciones, texto, tarjetaMision,
    tarjetaSalto, tarjetaTesoro, marcoBarra, barraCarga, textoCarga
  ]);

  escena.tweens.add({
    targets: barraCarga,
    width: 600,
    duration: 7000,
    ease: 'Linear',
    onUpdate: (tween) => {
      const porcentaje = Math.round(tween.progress * 100);
      textoCarga.setText(`CARGANDO ESCENARIO... ${porcentaje}%`);
    },
    onComplete: () => terminarPresentacionDeCarga()
  });
}

function crearTarjetaCarga(scene, x, y, titulo, descripcion, color) {
  const tarjeta = scene.add.container(x, y);
  const fondo = scene.add.rectangle(0, 0, 205, 190, 0x202947)
    .setStrokeStyle(3, color);
  const emblema = scene.add.circle(0, -45, 28, color);
  const numero = scene.add.text(0, -45, titulo.slice(0, 2), estiloNumeroTarjeta)
    .setOrigin(0.5);
  const encabezado = scene.add.text(0, 5, titulo.slice(3), estiloTarjetaTitulo)
    .setOrigin(0.5);
  const texto = scene.add.text(0, 58, descripcion, estiloTarjetaTexto)
    .setOrigin(0.5);
  tarjeta.add([fondo, emblema, numero, encabezado, texto]);
  return tarjeta;
}

function terminarPresentacionDeCarga() {
  cargaEnCurso = false;
  juegoIniciado = true;
  inicioJuego = mario.scene.time.now;
  pantallaCarga.destroy();
  pantallaCarga = null;
  mostrarElementosDelJuego();
}

function ocultarElementosDelJuego() {
  mario.setVisible(false);
  dibujoMario.setVisible(false);
  plataformas.getChildren().forEach((plataforma) => plataforma.setVisible(false));
  monedas.getChildren().forEach((moneda) => moneda.setVisible(false));
  textoMonedas.setVisible(false);
  textoTiempo.setVisible(false);
}

function mostrarElementosDelJuego() {
  mario.setVisible(true);
  dibujoMario.setVisible(true);
  plataformas.getChildren().forEach((plataforma) => plataforma.setVisible(true));
  monedas.getChildren().forEach((moneda) => moneda.setVisible(true));
  textoMonedas.setVisible(true);
  textoTiempo.setVisible(true);
}

function crearPantallaVictoria(scene, tiempoTotal) {
  // Aumentamos el depth a 100 para asegurarnos de que esté por encima de todo
  pantallaVictoria = scene.add.container(400, 300).setScrollFactor(0).setDepth(100);
  const fondo = scene.add.rectangle(0, 0, 800, 600, 0x102a56, 0.96);
  const titulo = scene.add.text(0, -180, '¡GANASTE!', estiloVictoria).setOrigin(0.5);
  const estrella = scene.add.star(0, -105, 5, 16, 32, 0xffd21f)
    .setStrokeStyle(3, 0xf28b00);
  const recompensa = scene.add.text(0, -55, '¡ESTRELLA DESBLOQUEADA!', estiloRecompensa)
    .setOrigin(0.5);
  const tiempo = scene.add.text(0, -15, `Tiempo: ${tiempoTotal} s`, estiloInstrucciones).setOrigin(0.5);
  
  botonVolverAJugar = crearBoton(scene, 0, 45, 'VOLVER A JUGAR', reiniciarJuego);
  botonSalir = crearBoton(scene, 0, 135, 'SALIR', volverAlInicio);
  
  pantallaVictoria.add([
    fondo, titulo, estrella, recompensa, tiempo, botonVolverAJugar, botonSalir
  ]);
}

function crearBoton(scene, x, y, texto, accion) {
  const boton = scene.add.container(x, y).setScrollFactor(0).setDepth(101);
  const fondo = scene.add.rectangle(0, 0, 260, 58, 0xe52521)
    .setStrokeStyle(3, 0xffd21f);
  const etiqueta = scene.add.text(0, 0, texto, estiloBoton).setOrigin(0.5);
  boton.add([fondo, etiqueta]);
  boton.setData('accion', accion);
  return boton;
}

function manejarClickEnPantalla(scene, puntero) {
  if (pantallaVictoria && pantallaVictoria.visible) {
    if (puntero.x >= 270 && puntero.x <= 530 && puntero.y >= 316 && puntero.y <= 374) {
      reiniciarJuego();
      return;
    }
    if (puntero.x >= 270 && puntero.x <= 530 && puntero.y >= 406 && puntero.y <= 464) {
      volverAlInicio();
      return;
    }
  }

  if (pantallaInicio && pantallaInicio.visible &&
      puntero.x >= 270 && puntero.x <= 530 && puntero.y >= 366 && puntero.y <= 424) {
    iniciarJuego();
  }
}

function reiniciarJuego() {
  modoReinicio = 'juego';
  mario.scene.scene.restart();
}

function volverAlInicio() {
  modoReinicio = 'inicio';
  mario.scene.scene.restart();
}

function recogerMoneda(_mario, moneda) {
  if (!moneda || !moneda.active) return;
  const escena = _mario.scene;
  moneda.destroy();
  const recogidas = TOTAL_MONEDAS - monedas.countActive();
  textoMonedas.setText(`MONEDAS: ${recogidas}/${TOTAL_MONEDAS}`);

  if (recogidas === TOTAL_MONEDAS) {
    juegoTerminado = true;
    mario.setVelocity(0, 0);
    mario.body.moves = false;
    const tiempoTotal = ((escena.time.now - inicioJuego) / 1000).toFixed(1);
    crearPantallaVictoria(escena, tiempoTotal);
  }
}

const estiloHUD = {
  fontFamily: 'Arial',
  fontSize: '22px',
  color: '#ffffff',
  backgroundColor: '#17458f',
  padding: { x: 8, y: 5 },
  stroke: '#000000',
  strokeThickness: 3
};

const estiloVictoria = {
  fontFamily: 'Arial',
  fontSize: '42px',
  color: '#fff3a1',
  align: 'center',
  padding: { x: 0, y: 0 }
};

const estiloTitulo = {
  fontFamily: 'Arial',
  fontSize: '38px',
  color: '#fff3a1',
  align: 'center',
  stroke: '#000000',
  strokeThickness: 5
};

const estiloFranja = {
  fontFamily: 'Arial',
  fontSize: '15px',
  color: '#ffffff',
  fontStyle: 'bold',
  letterSpacing: 2
};

const estiloEtiqueta = {
  fontFamily: 'Arial',
  fontSize: '18px',
  color: '#ffd21f',
  fontStyle: 'bold'
};

const estiloPanel = {
  fontFamily: 'Arial',
  fontSize: '17px',
  color: '#ffffff',
  lineSpacing: 7
};

const estiloInstruccionesInicio = {
  fontFamily: 'Arial',
  fontSize: '15px',
  color: '#ffdf76',
  fontStyle: 'italic',
  align: 'center',
  stroke: '#000000',
  strokeThickness: 2,
  lineSpacing: 4,
  wordWrap: { width: 700 }
};

const estiloCargaInstrucciones = {
  fontFamily: 'Arial',
  fontSize: '14px',
  color: '#ffdf76',
  fontStyle: 'bold',
  align: 'center',
  lineSpacing: 3,
  stroke: '#000000',
  strokeThickness: 1,
  wordWrap: { width: 650 }
};

const estiloCarga = {
  fontFamily: 'Arial',
  fontSize: '17px',
  color: '#ffffff',
  fontStyle: 'bold',
  stroke: '#000000',
  strokeThickness: 2
};

const estiloNumeroTarjeta = {
  fontFamily: 'Arial',
  fontSize: '18px',
  color: '#11182f',
  fontStyle: 'bold'
};

const estiloTarjetaTitulo = {
  fontFamily: 'Arial',
  fontSize: '17px',
  color: '#ffdf76',
  fontStyle: 'bold'
};

const estiloTarjetaTexto = {
  fontFamily: 'Arial',
  fontSize: '15px',
  color: '#ffffff',
  align: 'center',
  lineSpacing: 7
};

const estiloRecompensa = {
  fontFamily: 'Arial',
  fontSize: '20px',
  color: '#ffdf76',
  fontStyle: 'bold',
  stroke: '#000000',
  strokeThickness: 3
};

const estiloInstrucciones = {
  fontFamily: 'Arial',
  fontSize: '24px',
  color: '#ffffff',
  align: 'center',
  lineSpacing: 8,
  stroke: '#000000',
  strokeThickness: 3
};

const estiloBoton = {
  fontFamily: 'Arial',
  fontSize: '23px',
  color: '#ffffff',
  align: 'center',
  stroke: '#000000',
  strokeThickness: 3
};