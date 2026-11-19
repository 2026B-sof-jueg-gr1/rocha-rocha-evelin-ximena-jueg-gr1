// Escenario 3: el nivel de plataformas de cada capítulo.
// Roco recorre la región con su aliado, reúne los fragmentos del derrotero
// (cada uno revela un dato real) y recupera la llave antes del equinoccio.
// Las habilidades se acumulan según los aliados que ya se unieron.
import Phaser from 'phaser';
import { NIVELES, habilidadesDe, equipoDe } from '../datos/niveles.js';
import { guardarResultado, calcularEstrellas } from '../datos/progreso.js';
import { dibujarPersonaje } from '../personajes.js';
import { ESTILO, crearTexturasBase } from '../ui.js';
import { ALTURA_SUELO, crearTexturasDeNivel, dibujarFondo } from '../escenarios.js';

const ANCHO_MUNDO = 2400;
const VELOCIDAD = 220;
const FUERZA_SALTO = 720;
const FUERZA_DOBLE_SALTO = 620;
const REBOTE_HONGO = 1050;
const VENTANA_SALTO = 140;
const DURACION_MENSAJE = 4000;

export class EscenaNivel extends Phaser.Scene {
  constructor() {
    super('Nivel');
  }

  init(data = {}) {
    this.indice = data.nivel ?? 0;
    this.nivel = NIVELES[this.indice];
    this.hab = habilidadesDe(this.indice);
  }

  create() {
    const nivel = this.nivel;
    this.terminado = false;
    this.saltoPedidoHasta = -Infinity;
    this.ultimoSuelo = -Infinity;
    this.saltosAereos = 0;
    this.recogidas = 0;
    this.total = nivel.fragmentos.length;
    this.direccion = 1;
    this.temporizadorMensaje = null;

    crearTexturasBase(this);
    crearTexturasDeNivel(this, nivel);
    this.physics.world.setBounds(0, 0, ANCHO_MUNDO, 600);
    dibujarFondo(this, nivel, ANCHO_MUNDO);

    this.crearPlataformas();
    this.crearRoco();
    this.crearCompanero();
    this.crearFragmentos();
    this.crearNiebla();
    this.flecha = this.add.graphics().setDepth(4);

    this.cameras.main.setBounds(0, 0, ANCHO_MUNDO, 600);
    this.cameras.main.startFollow(this.roco, true, 0.08, 0.08);

    this.crearHUD();
    this.teclas = this.input.keyboard.addKeys({
      izquierda: Phaser.Input.Keyboard.KeyCodes.A,
      derecha: Phaser.Input.Keyboard.KeyCodes.D,
      flechaIzquierda: Phaser.Input.Keyboard.KeyCodes.LEFT,
      flechaDerecha: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      salto: Phaser.Input.Keyboard.KeyCodes.W,
      flechaArriba: Phaser.Input.Keyboard.KeyCodes.UP,
      espacio: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('Mapa', { seleccion: this.indice }));

    this.inicio = this.time.now;
    const presentacion = nivel.nota
      ? nivel.nota
      : `${nivel.nombreAliado} se une al equipo. ${nivel.habilidad}`;
    this.mostrarMensaje(presentacion);
  }

  crearPlataformas() {
    this.plataformas = this.physics.add.staticGroup();
    this.hongos = this.physics.add.staticGroup();
    this.ocultos = [];

    for (let x = 32; x < ANCHO_MUNDO; x += 64) {
      this.plataformas.create(x, ALTURA_SUELO + 24, `suelo-${this.nivel.id}`).refreshBody();
    }
    this.nivel.bloques.forEach(([x, bordeSuperior, tipo = 'bloque']) => {
      if (tipo === 'hongo') {
        this.hongos.create(x, bordeSuperior + 12, 'hongo').refreshBody();
      } else if (tipo === 'nube') {
        this.plataformas.create(x, bordeSuperior + 12, 'nube').refreshBody();
      } else if (tipo === 'oculto') {
        const bloque = this.plataformas.create(x, bordeSuperior + 24, 'bloque-oculto').refreshBody();
        bloque.setAlpha(0.12);
        this.ocultos.push(bloque);
      } else {
        this.plataformas.create(x, bordeSuperior + 24, `bloque-${this.nivel.id}`).refreshBody();
      }
    });
  }

  crearRoco() {
    // Cuerpo físico invisible de 44 x 56 px; el dibujo se coloca encima.
    this.roco = this.physics.add.sprite(90, ALTURA_SUELO - 30, 'fisica').setVisible(false);
    this.roco.body.setSize(44, 56).setOffset(8, 2);
    this.roco.body.setMaxVelocity(400, 1100);
    this.roco.setCollideWorldBounds(true);
    this.dibujoRoco = this.add.graphics().setDepth(3);
    dibujarPersonaje(this.dibujoRoco, 'roco', 0, 0, 1);

    this.physics.add.collider(this.roco, this.plataformas);
    this.physics.add.collider(this.roco, this.hongos, this.rebotar, null, this);
  }

  crearCompanero() {
    this.companero = this.add.graphics().setDepth(2);
    dibujarPersonaje(this.companero, this.nivel.aliado, 0, 0, 0.7);
    this.companero.setPosition(40, ALTURA_SUELO);
  }

  crearFragmentos() {
    this.fragmentos = this.physics.add.group({ allowGravity: false, immovable: true });
    this.nivel.fragmentos.forEach(([x, y]) => {
      const f = this.fragmentos.create(x, y, 'fragmento').setDepth(2);
      f.body.setAllowGravity(false);
      f.body.setSize(28, 28).setOffset(2, 2);
    });
    // La Vara del Inti de Alba hace brillar los fragmentos.
    if (this.hab.detector) {
      this.tweens.add({ targets: this.fragmentos.getChildren(), scale: 1.15, duration: 600, yoyo: true, repeat: -1 });
    }
    this.physics.add.overlap(this.roco, this.fragmentos, this.recoger, null, this);
  }

  crearNiebla() {
    // La niebla de los Llanganates: Nuba la disipa alrededor del equipo.
    this.niebla = [];
    if (!this.nivel.niebla) return;
    let semilla = 7;
    const azar = () => {
      semilla = (semilla * 9301 + 49297) % 233280;
      return semilla / 233280;
    };
    for (let x = 260; x < ANCHO_MUNDO; x += 120) {
      [170 + azar() * 120, 330 + azar() * 140].forEach((y) => {
        this.niebla.push(this.add.ellipse(x, y, 240, 170, 0xdfe6ee, 0.88).setDepth(6));
      });
    }
  }

  crearHUD() {
    const fijo = (objeto) => objeto.setScrollFactor(0).setDepth(20);
    this.textoFragmentos = fijo(this.add.text(20, 18, '', ESTILO.hud));
    this.textoTiempo = fijo(this.add.text(20, 52, '', ESTILO.hud));
    this.actualizarContador();
    fijo(this.add.text(780, 18, `${this.nivel.etiqueta} · ${this.nivel.ciudad.toUpperCase()}`, ESTILO.hudChico).setOrigin(1, 0));

    const habilidades = [];
    if (this.hab.detector) habilidades.push('Vara del Inti');
    if (this.hab.dobleSalto) habilidades.push('Salto doble');
    if (this.hab.revelar) habilidades.push('Símbolos');
    if (this.hab.hongos) habilidades.push('Hongos');
    if (this.hab.niebla) habilidades.push('Nubes');
    fijo(this.add.text(12, 590, `Equipo: ${equipoDe(this.indice).join(', ')}  ·  ${habilidades.join(' · ')}`, ESTILO.hudChico).setOrigin(0, 1));
    fijo(this.add.text(788, 590, 'ESC: mapa', ESTILO.hudChico).setOrigin(1, 1));

    this.panelMensaje = fijo(this.add.container(400, 128)).setVisible(false);
    const fondo = this.add.rectangle(0, 0, 760, 74, 0x3a2716, 0.92).setStrokeStyle(2, 0xd9a42b);
    this.textoMensaje = this.add.text(0, 0, '', ESTILO.dato).setOrigin(0.5);
    this.panelMensaje.add([fondo, this.textoMensaje]);
  }

  update() {
    if (this.terminado) return;
    const ahora = this.time.now;
    const cuerpo = this.roco.body;
    const t = this.teclas;
    const izquierda = t.izquierda.isDown || t.flechaIzquierda.isDown;
    const derecha = t.derecha.isDown || t.flechaDerecha.isDown;
    const salto = Phaser.Input.Keyboard.JustDown(t.salto)
      || Phaser.Input.Keyboard.JustDown(t.flechaArriba)
      || Phaser.Input.Keyboard.JustDown(t.espacio);

    this.roco.setVelocityX((derecha ? VELOCIDAD : 0) - (izquierda ? VELOCIDAD : 0));
    if (cuerpo.velocity.x !== 0) this.direccion = cuerpo.velocity.x > 0 ? 1 : -1;

    // Salto con margen: se recuerda la pulsación un instante y se permite
    // saltar justo después de salir de un borde.
    const enSuelo = cuerpo.blocked.down || cuerpo.touching.down;
    if (enSuelo) {
      this.ultimoSuelo = ahora;
      this.saltosAereos = 0;
    }
    if (salto) this.saltoPedidoHasta = ahora + VENTANA_SALTO;
    if (ahora <= this.ultimoSuelo + VENTANA_SALTO && ahora <= this.saltoPedidoHasta) {
      this.roco.setVelocityY(-FUERZA_SALTO);
      this.saltoPedidoHasta = -Infinity;
      this.ultimoSuelo = -Infinity;
    } else if (salto && !enSuelo && this.hab.dobleSalto && this.saltosAereos < 1) {
      // Salto doble de Brin.
      this.roco.setVelocityY(-FUERZA_DOBLE_SALTO);
      this.saltosAereos += 1;
      this.saltoPedidoHasta = -Infinity;
    }

    this.dibujoRoco.setPosition(this.roco.x, this.roco.y + 28);
    this.dibujoRoco.setScale(this.direccion, 1);
    this.moverCompanero(ahora);
    this.revelarSimbolos();
    this.disiparNiebla();
    this.apuntarVara();

    const restante = Math.max(0, this.nivel.tiempo - (ahora - this.inicio) / 1000);
    this.textoTiempo.setText(`EQUINOCCIO: ${restante.toFixed(1)} s`);
    this.textoTiempo.setBackgroundColor(restante <= 15 ? '#a8231c' : '#17458f');
    if (restante <= 0) this.terminar(false);
  }

  moverCompanero(ahora) {
    const flota = this.nivel.aliado === 'nuba';
    const objetivoX = this.roco.x - this.direccion * 46;
    const objetivoY = flota ? this.roco.y - 20 + Math.sin(ahora / 300) * 6 : this.roco.y + 28;
    this.companero.x += (objetivoX - this.companero.x) * 0.1;
    this.companero.y += (objetivoY - this.companero.y) * (flota ? 0.1 : 0.25);
    this.companero.setScale(this.direccion, 1);
  }

  revelarSimbolos() {
    // Lino lee los símbolos cañaris y las piedras ocultas aparecen.
    if (!this.hab.revelar) return;
    this.ocultos.forEach((bloque) => {
      if (!bloque.getData('revelado') && Math.abs(bloque.x - this.roco.x) < 230) {
        bloque.setData('revelado', true);
        this.tweens.add({ targets: bloque, alpha: 1, duration: 450 });
      }
    });
  }

  disiparNiebla() {
    this.niebla.forEach((nube) => {
      const d = Phaser.Math.Distance.Between(nube.x, nube.y, this.roco.x, this.roco.y);
      nube.setAlpha(Phaser.Math.Clamp((d - 110) / 240, 0.04, 0.88));
    });
  }

  apuntarVara() {
    this.flecha.clear();
    if (!this.hab.detector) return;
    let cercano = null;
    let mejor = Infinity;
    this.fragmentos.getChildren().forEach((f) => {
      const d = Phaser.Math.Distance.Between(this.roco.x, this.roco.y, f.x, f.y);
      if (d < mejor) {
        mejor = d;
        cercano = f;
      }
    });
    if (!cercano || mejor < 80) return;
    const a = Phaser.Math.Angle.Between(this.roco.x, this.roco.y - 10, cercano.x, cercano.y);
    const cx = this.roco.x + Math.cos(a) * 54;
    const cy = this.roco.y - 10 + Math.sin(a) * 54;
    const px = -Math.sin(a);
    const py = Math.cos(a);
    this.flecha.fillStyle(0xf2b52b, 0.95).fillTriangle(
      cx + Math.cos(a) * 11, cy + Math.sin(a) * 11,
      cx + px * 7, cy + py * 7,
      cx - px * 7, cy - py * 7
    );
  }

  rebotar(roco, hongo) {
    if (!roco.body.touching.down && !roco.body.blocked.down) return;
    roco.setVelocityY(-REBOTE_HONGO);
    this.saltosAereos = 0;
    this.tweens.add({ targets: hongo, scaleY: 0.7, duration: 80, yoyo: true });
  }

  recoger(_roco, fragmento) {
    if (this.terminado || !fragmento.active) return;
    fragmento.destroy();
    this.recogidas += 1;
    this.actualizarContador();
    if (this.recogidas >= this.total) {
      this.terminar(true);
      return;
    }
    const dato = this.nivel.datos[(this.recogidas - 1) % this.nivel.datos.length];
    this.mostrarMensaje(`Fragmento ${this.recogidas}: ${dato}`);
  }

  actualizarContador() {
    this.textoFragmentos.setText(`FRAGMENTOS: ${this.recogidas}/${this.total}`);
  }

  mostrarMensaje(texto) {
    this.textoMensaje.setText(texto);
    this.panelMensaje.setVisible(true);
    if (this.temporizadorMensaje) this.temporizadorMensaje.remove(false);
    this.temporizadorMensaje = this.time.delayedCall(DURACION_MENSAJE, () => {
      this.panelMensaje.setVisible(false);
      this.temporizadorMensaje = null;
    });
  }

  terminar(gano) {
    if (this.terminado) return;
    this.terminado = true;
    this.roco.setVelocity(0, 0);
    this.roco.body.moves = false;
    this.panelMensaje.setVisible(false);
    this.flecha.clear();
    const restante = Math.max(0, this.nivel.tiempo - (this.time.now - this.inicio) / 1000);
    const estrellas = gano ? calcularEstrellas(restante, this.nivel.tiempo) : 0;
    if (gano) guardarResultado(this.indice, estrellas);
    this.scene.pause();
    this.scene.launch('Resultado', {
      nivel: this.indice, gano, restante, estrellas, recogidas: this.recogidas, total: this.total
    });
  }
}
