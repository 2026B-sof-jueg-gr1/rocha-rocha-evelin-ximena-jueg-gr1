// Escenario 3: el nivel de plataformas de cada capítulo.
// Roco recorre la región con su aliado, reúne los fragmentos del derrotero
// (cada uno revela un dato real) y recupera la llave antes del equinoccio.
// Las habilidades se acumulan según los aliados que ya se unieron, y los
// agentes de la Bruma patrullan para robarle tiempo.
import Phaser from 'phaser';
import { NIVELES, habilidadesDe, equipoDe } from '../datos/niveles.js';
import { guardarResultado, calcularEstrellas } from '../datos/progreso.js';
import { dibujarPersonaje } from '../personajes.js';
import { ESTILO, con, crearTexturasBase, crearBotonSonido } from '../ui.js';
import { ALTURA_SUELO, crearTexturasDeNivel, dibujarFondo } from '../escenarios.js';
import { iniciarAudio, efecto, musica, ponerUrgencia, detenerMusica } from '../audio.js';

const ANCHO_MUNDO = 2400;
const VELOCIDAD = 220;
const FUERZA_SALTO = 720;
const FUERZA_DOBLE_SALTO = 620;
const REBOTE_HONGO = 1050;
const VENTANA_SALTO = 140;
const DURACION_MENSAJE = 4000;
const VELOCIDAD_BRUMA = 80;
const CASTIGO_BRUMA = 5000;
const INVULNERABLE = 1500;

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
    this.transcurrido = 0;
    this.saltoPedidoHasta = -Infinity;
    this.ultimoSuelo = -Infinity;
    this.saltosAereos = 0;
    this.recogidas = 0;
    this.total = nivel.fragmentos.length;
    this.direccion = 1;
    this.temporizadorMensaje = null;
    this.invulnerableHasta = 0;
    this.tactil = { izquierda: false, derecha: false, salto: false };

    crearTexturasBase(this);
    crearTexturasDeNivel(this, nivel);
    this.physics.world.setBounds(0, 0, ANCHO_MUNDO, 600);
    dibujarFondo(this, nivel, ANCHO_MUNDO);

    this.crearPlataformas();
    this.crearRoco();
    this.crearCompanero();
    this.crearFragmentos();
    this.crearBruma();
    this.crearNiebla();
    this.flecha = this.add.graphics().setDepth(4);

    this.cameras.main.setBounds(0, 0, ANCHO_MUNDO, 600);
    this.cameras.main.startFollow(this.roco, true, 0.08, 0.08);

    this.crearHUD();
    this.crearControlesTactiles();
    this.teclas = this.input.keyboard.addKeys({
      izquierda: Phaser.Input.Keyboard.KeyCodes.A,
      derecha: Phaser.Input.Keyboard.KeyCodes.D,
      flechaIzquierda: Phaser.Input.Keyboard.KeyCodes.LEFT,
      flechaDerecha: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      salto: Phaser.Input.Keyboard.KeyCodes.W,
      flechaArriba: Phaser.Input.Keyboard.KeyCodes.UP,
      espacio: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
    this.input.keyboard.on('keydown-ESC', () => this.pausar());
    this.input.keyboard.on('keydown-P', () => this.pausar());
    this.events.on('resume', () => musica('nivel'));

    iniciarAudio();
    musica('nivel');
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

  crearBruma() {
    // Agentes de la Bruma: patrullan un tramo de suelo de lado a lado. No se
    // les puede derrotar; si tocan a Roco le roban 5 s y lo envuelven en humo.
    this.agentes = this.physics.add.group({ allowGravity: false, immovable: true });
    (this.nivel.bruma || []).forEach(([desde, hasta], i) => {
      const agente = this.agentes.create(i % 2 ? hasta : desde, ALTURA_SUELO - 24, 'fisica').setVisible(false);
      agente.body.setAllowGravity(false);
      agente.body.setSize(34, 44, true);
      agente.setData({ desde, hasta, sentido: i % 2 ? -1 : 1 });
      const dibujo = this.add.graphics().setDepth(3);
      dibujarPersonaje(dibujo, 'agente', 0, 0, 0.8);
      agente.setData('dibujo', dibujo);
    });
    this.physics.add.overlap(this.roco, this.agentes, this.tocarBruma, null, this);

    this.humo = this.add.rectangle(400, 300, 800, 600, 0x6b5a8a, 0).setScrollFactor(0).setDepth(15);
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
    fijo(this.add.text(700, 18, `${this.nivel.etiqueta} · ${this.nivel.ciudad.toUpperCase()}`, ESTILO.hudChico).setOrigin(1, 0));

    // Botón de pausa y de sonido, arriba a la derecha.
    const pausa = fijo(this.add.circle(735, 30, 17, 0x1b1630, 0.85).setStrokeStyle(2, 0xffd21f));
    fijo(this.add.text(735, 30, 'II', con(ESTILO.boton, { fontSize: '15px', strokeThickness: 0 })).setOrigin(0.5));
    pausa.setInteractive({ useHandCursor: true }).on('pointerup', () => this.pausar());
    crearBotonSonido(this, 775, 30, 20);

    const habilidades = [];
    if (this.hab.detector) habilidades.push('Vara del Inti');
    if (this.hab.dobleSalto) habilidades.push('Salto doble');
    if (this.hab.revelar) habilidades.push('Símbolos');
    if (this.hab.hongos) habilidades.push('Hongos');
    if (this.hab.niebla) habilidades.push('Nubes');
    fijo(this.add.text(12, 590, `Equipo: ${equipoDe(this.indice).join(', ')}  ·  ${habilidades.join(' · ')}`, ESTILO.hudChico).setOrigin(0, 1));
    fijo(this.add.text(788, 590, 'ESC: pausa', ESTILO.hudChico).setOrigin(1, 1));

    this.panelMensaje = fijo(this.add.container(400, 128)).setVisible(false);
    const fondo = this.add.rectangle(0, 0, 760, 74, 0x3a2716, 0.92).setStrokeStyle(2, 0xd9a42b);
    this.textoMensaje = this.add.text(0, 0, '', ESTILO.dato).setOrigin(0.5);
    this.panelMensaje.add([fondo, this.textoMensaje]);
  }

  crearControlesTactiles() {
    // Solo en pantallas táctiles: flechas a la izquierda y salto a la derecha.
    if (!this.sys.game.device.input.touch) return;
    const boton = (x, y, texto, al, alSoltar) => {
      const circulo = this.add.circle(x, y, 44, 0x1b1630, 0.35).setStrokeStyle(3, 0xffd21f, 0.7)
        .setScrollFactor(0).setDepth(25).setInteractive();
      this.add.text(x, y, texto, con(ESTILO.boton, { fontSize: '30px' })).setOrigin(0.5).setScrollFactor(0).setDepth(26).setAlpha(0.85);
      circulo.on('pointerdown', al);
      circulo.on('pointerup', alSoltar);
      circulo.on('pointerout', alSoltar);
    };
    boton(70, 500, '◀', () => { this.tactil.izquierda = true; }, () => { this.tactil.izquierda = false; });
    boton(175, 500, '▶', () => { this.tactil.derecha = true; }, () => { this.tactil.derecha = false; });
    boton(725, 500, '▲', () => { this.tactil.salto = true; }, () => {});
  }

  update(_tiempo, delta) {
    if (this.terminado) return;
    this.transcurrido += delta;
    const ahora = this.transcurrido;
    const cuerpo = this.roco.body;
    const t = this.teclas;
    const izquierda = t.izquierda.isDown || t.flechaIzquierda.isDown || this.tactil.izquierda;
    const derecha = t.derecha.isDown || t.flechaDerecha.isDown || this.tactil.derecha;
    const salto = Phaser.Input.Keyboard.JustDown(t.salto)
      || Phaser.Input.Keyboard.JustDown(t.flechaArriba)
      || Phaser.Input.Keyboard.JustDown(t.espacio)
      || this.tactil.salto;
    this.tactil.salto = false;

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
      efecto('salto');
    } else if (salto && !enSuelo && this.hab.dobleSalto && this.saltosAereos < 1) {
      // Salto doble de Brin.
      this.roco.setVelocityY(-FUERZA_DOBLE_SALTO);
      this.saltosAereos += 1;
      this.saltoPedidoHasta = -Infinity;
      efecto('dobleSalto');
    }

    // Balanceo al caminar.
    const camina = enSuelo && cuerpo.velocity.x !== 0;
    const balanceo = camina ? -Math.abs(Math.sin(ahora / 70)) * 3 : 0;
    this.dibujoRoco.setPosition(this.roco.x, this.roco.y + 28 + balanceo);
    this.dibujoRoco.setScale(this.direccion, 1);
    this.dibujoRoco.setAlpha(ahora < this.invulnerableHasta ? 0.45 + 0.4 * Math.abs(Math.sin(ahora / 60)) : 1);

    this.moverCompanero(ahora);
    this.moverBruma(ahora);
    this.revelarSimbolos();
    this.disiparNiebla();
    this.apuntarVara();

    const restante = Math.max(0, this.nivel.tiempo - ahora / 1000);
    this.textoTiempo.setText(`EQUINOCCIO: ${restante.toFixed(1)} s`);
    const urgente = restante <= 15;
    this.textoTiempo.setBackgroundColor(urgente ? '#a8231c' : '#17458f');
    ponerUrgencia(urgente);
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

  moverBruma(ahora) {
    this.agentes.getChildren().forEach((agente) => {
      let sentido = agente.getData('sentido');
      if (agente.x <= agente.getData('desde')) sentido = 1;
      if (agente.x >= agente.getData('hasta')) sentido = -1;
      agente.setData('sentido', sentido);
      agente.setVelocityX(sentido * VELOCIDAD_BRUMA);
      const dibujo = agente.getData('dibujo');
      dibujo.setPosition(agente.x, agente.y + 24 - Math.abs(Math.sin(ahora / 120)) * 2);
      dibujo.setScale(sentido, 1);
    });
  }

  tocarBruma() {
    if (this.terminado || this.transcurrido < this.invulnerableHasta) return;
    // Primero el castigo y luego la invulnerabilidad: si no, el salto del
    // reloj dejaría a Roco expuesto otra vez en el mismo instante.
    this.transcurrido += CASTIGO_BRUMA;
    this.invulnerableHasta = this.transcurrido + INVULNERABLE;
    efecto('golpe');
    this.cameras.main.shake(180, 0.006);
    this.humo.setAlpha(0.7);
    this.tweens.add({ targets: this.humo, alpha: 0, duration: 1000, ease: 'Sine.easeIn' });
    this.mostrarMensaje('¡Un agente de la Bruma te robó 5 segundos! Sáltalos por encima o espera a que se alejen.');
  }

  revelarSimbolos() {
    // Lino lee los símbolos cañaris y las piedras ocultas aparecen.
    if (!this.hab.revelar) return;
    this.ocultos.forEach((bloque) => {
      if (!bloque.getData('revelado') && Math.abs(bloque.x - this.roco.x) < 230) {
        bloque.setData('revelado', true);
        this.tweens.add({ targets: bloque, alpha: 1, duration: 450 });
        efecto('revelar');
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
    efecto('rebote');
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
    efecto('fragmento');
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

  pausar() {
    if (this.terminado || !this.scene.isActive()) return;
    this.tactil = { izquierda: false, derecha: false, salto: false };
    detenerMusica();
    this.scene.pause();
    this.scene.launch('Pausa', { nivel: this.indice });
  }

  terminar(gano) {
    if (this.terminado) return;
    this.terminado = true;
    this.roco.setVelocity(0, 0);
    this.roco.body.moves = false;
    this.agentes.setVelocityX(0);
    this.panelMensaje.setVisible(false);
    this.flecha.clear();
    detenerMusica();
    efecto(gano ? 'llave' : 'derrota');
    const restante = Math.max(0, this.nivel.tiempo - this.transcurrido / 1000);
    const estrellas = gano ? calcularEstrellas(restante, this.nivel.tiempo) : 0;
    if (gano) guardarResultado(this.indice, estrellas);
    this.scene.pause();
    this.scene.launch('Resultado', {
      nivel: this.indice, gano, restante, estrellas, recogidas: this.recogidas, total: this.total
    });
  }
}
