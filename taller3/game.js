// Juego lineal de plataformas inspirado en los niveles clásicos de Mario.
// Todo se dibuja con Phaser: no se necesitan imágenes ni paquetes externos.

const ANCHO_MUNDO = 2400;
const ALTO_MUNDO = 600;
const TOTAL_MONEDAS = 15;
const VELOCIDAD_MARIO = 220;
const FUERZA_SALTO = 720;
const ALTURA_SUELO = 540;

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

const configuracion = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#5c91ed',
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
  inicioJuego = this.time.now;
  this.physics.world.setBounds(0, 0, ANCHO_MUNDO, ALTO_MUNDO);

  crearTexturas(this);
  dibujarFondo(this);

  plataformas = this.physics.add.staticGroup();
  crearSuelo(this);
  crearObstaculos(this);

  mario = this.physics.add.sprite(90, ALTURA_SUELO - 60, 'fisica');
  mario.setCollideWorldBounds(true);
  mario.setDepth(3);
  mario.body.setSize(28, 48).setOffset(16, 8);
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
  if (!juegoIniciado || juegoTerminado) return;

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

  // Solo permitimos saltar cuando Mario está tocando una plataforma.
  const estaEnElSuelo = mario.body.blocked.down || mario.body.touching.down || mario.body.onFloor();
  if (saltoPresionado && estaEnElSuelo) {
    mario.setVelocityY(-FUERZA_SALTO);
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
  fisicaGrafico.fillRect(0, 0, 2, 2);
  fisicaGrafico.generateTexture('fisica', 2, 2);
  fisicaGrafico.destroy();

  const monedaGrafico = scene.make.graphics({ x: 0, y: 0, add: false });
  monedaGrafico.fillStyle(0xffd21f).fillCircle(16, 16, 13);
  monedaGrafico.lineStyle(3, 0xf28b00).strokeCircle(16, 16, 13);
  monedaGrafico.lineStyle(3, 0xffffa8).lineBetween(13, 7, 13, 25);
  monedaGrafico.generateTexture('moneda', 32, 32);
  monedaGrafico.destroy();

  const bloqueGrafico = scene.make.graphics({ x: 0, y: 0, add: false });
  bloqueGrafico.fillStyle(0xb65d2a).fillRect(0, 0, 48, 48);
  bloqueGrafico.lineStyle(3, 0x713414).strokeRect(0, 0, 48, 48);
  bloqueGrafico.lineStyle(2, 0xe19a4e).strokeRect(5, 5, 38, 38);
  bloqueGrafico.generateTexture('bloque', 48, 48);
  bloqueGrafico.destroy();

  const sueloGrafico = scene.make.graphics({ x: 0, y: 0, add: false });
  sueloGrafico.fillStyle(0x9b492a).fillRect(0, 0, 64, 48);
  sueloGrafico.lineStyle(2, 0x4a2118).strokeRect(0, 0, 64, 48);
  sueloGrafico.lineStyle(2, 0xd4773d);
  sueloGrafico.lineBetween(16, 0, 16, 24);
  sueloGrafico.lineBetween(48, 24, 48, 48);
  sueloGrafico.lineBetween(0, 24, 32, 24);
  sueloGrafico.lineBetween(32, 0, 64, 0);
  sueloGrafico.generateTexture('suelo', 64, 48);
  sueloGrafico.destroy();
}

function dibujarMario() {
  dibujoMario.clear();
  dibujoMario.fillStyle(0xe52521).fillRect(12, 2, 36, 12);
  dibujoMario.fillStyle(0xf5bd8c).fillRect(16, 14, 28, 19);
  dibujoMario.fillStyle(0x2d65c4).fillRect(12, 31, 36, 19);
  dibujoMario.fillStyle(0xe52521).fillRect(8, 25, 9, 19);
  dibujoMario.fillStyle(0xe52521).fillRect(43, 25, 9, 19);
  dibujoMario.fillStyle(0x633b20).fillRect(14, 47, 13, 9);
  dibujoMario.fillStyle(0x633b20).fillRect(33, 47, 13, 9);
  dibujoMario.fillStyle(0x171717).fillRect(29, 18, 4, 4);
}

function dibujarFondo(scene) {
  const fondo = scene.add.graphics().setDepth(-2);
  fondo.fillStyle(0x5c91ed).fillRect(0, 0, ANCHO_MUNDO, ALTO_MUNDO);
  fondo.fillStyle(0xffffff, 0.8);
  [190, 690, 1250, 1850].forEach((x) => {
    fondo.fillEllipse(x, 105, 48, 24);
    fondo.fillEllipse(x + 30, 105, 42, 28);
    fondo.fillEllipse(x - 25, 110, 38, 22);
  });
  fondo.fillStyle(0x48b83d);
  for (let x = 0; x < ANCHO_MUNDO; x += 160) {
    fondo.fillCircle(x + 35, ALTURA_SUELO - 20, 28);
    fondo.fillCircle(x + 75, ALTURA_SUELO - 22, 35);
  }
}

function crearSuelo(scene) {
  for (let x = 32; x < ANCHO_MUNDO; x += 64) {
    plataformas.create(x, ALTURA_SUELO + 24, 'suelo').refreshBody();
  }
}

function crearObstaculos(scene) {
  const posiciones = [
    [300, 450], [348, 450], [396, 450], [620, 400], [668, 400],
    [900, 450], [948, 450], [1130, 410], [1178, 410], [1226, 410],
    [1450, 360], [1498, 360], [1710, 430], [1758, 430],
    [1940, 390], [1988, 390], [2036, 390], [2200, 450], [2248, 450], [2296, 450]
  ];
  posiciones.forEach(([x, y]) => plataformas.create(x, y, 'bloque').refreshBody());
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
  const fondo = scene.add.rectangle(0, 0, 800, 600, 0x102a56, 0.96);
  const titulo = scene.add.text(0, -145, 'AVENTURA DE MONEDAS', estiloTitulo).setOrigin(0.5);
  const instrucciones = scene.add.text(
    0,
    -45,
    'Recolecta todas las monedas\npara completar el nivel',
    estiloInstrucciones
  ).setOrigin(0.5);
  botonJugar = crearBoton(scene, 0, 95, 'JUGAR', iniciarJuego);
  pantallaInicio.add([fondo, titulo, instrucciones, botonJugar]);
}

function iniciarJuego() {
  juegoIniciado = true;
  inicioJuego = mario.scene.time.now;
  pantallaInicio.setVisible(false);
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
  const titulo = scene.add.text(0, -150, '¡GANASTE!', estiloVictoria).setOrigin(0.5);
  const tiempo = scene.add.text(0, -65, `Tiempo: ${tiempoTotal} s`, estiloInstrucciones).setOrigin(0.5);
  
  botonVolverAJugar = crearBoton(scene, 0, 45, 'VOLVER A JUGAR', reiniciarJuego);
  botonSalir = crearBoton(scene, 0, 135, 'SALIR', volverAlInicio);
  
  pantallaVictoria.add([fondo, titulo, tiempo, botonVolverAJugar, botonSalir]);
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