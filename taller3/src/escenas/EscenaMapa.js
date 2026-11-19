// Escenario 2: el mapa del derrotero. Representa el Ecuador continental con sus
// tres regiones (Costa, Sierra y Amazonía) y la ruta de la leyenda:
// Quito -> Latacunga -> Cuenca -> Tena -> Mitad del Mundo -> Llanganates.
// Cada ciudad es un nivel con su aliado; los niveles se desbloquean en orden
// porque la llave de cada capítulo trae grabada la pista hacia el siguiente.
import Phaser from 'phaser';
import { NIVELES, MITAD_DEL_MUNDO } from '../datos/niveles.js';
import {
  cargarProgreso, estaDesbloqueado, siguienteJugable, estadoDeLlaves, reiniciarProgreso
} from '../datos/progreso.js';
import { dibujarPersonaje } from '../personajes.js';
import {
  COLOR, ESTILO, con, crearBoton, crearTexturasBase, dibujarEstrellas
} from '../ui.js';

const ANCHO_PANEL = 250;

// Contorno aproximado del Ecuador continental (longitud/latitud convertidas a
// píxeles del mapa). Es un mapa ilustrado, no cartográfico.
const CONTORNO = [
  [-79.9, 1.1], [-78.8, 1.4], [-77.7, 0.8], [-77.4, 0.4], [-76.3, 0.3], [-75.3, -0.1],
  [-75.6, -0.9], [-75.6, -1.5], [-76.9, -2.4], [-78.0, -3.3], [-78.4, -3.8], [-78.7, -4.6],
  [-79.4, -4.9], [-80.2, -4.4], [-80.4, -3.5], [-79.9, -2.8], [-80.7, -2.3], [-80.9, -1.2],
  [-80.5, -0.6], [-80.1, 0.3]
].map(([lon, lat]) => ({ x: 240 + (lon + 81.2) * 92, y: 40 + (1.6 - lat) * 82 }));

export class EscenaMapa extends Phaser.Scene {
  constructor() {
    super('Mapa');
  }

  create(data = {}) {
    crearTexturasBase(this);
    this.progreso = cargarProgreso();
    const pedido = Number.isInteger(data.seleccion) ? data.seleccion : siguienteJugable(this.progreso);
    this.seleccion = Phaser.Math.Clamp(pedido, 0, NIVELES.length - 1);

    this.dibujarMar();
    this.dibujarPais();
    this.dibujarRuta();
    this.nodos = NIVELES.map((nivel, i) => this.crearNodo(nivel, i));
    this.dibujarMarcadorRoco();
    this.dibujarBarraSuperior();
    this.crearPanelFijo();

    this.anillo = this.add.circle(0, 0, 31).setStrokeStyle(3, 0xffffff).setDepth(5);
    this.tweens.add({ targets: this.anillo, scale: 1.15, duration: 650, yoyo: true, repeat: -1 });
    this.seleccionar(this.seleccion);

    this.input.keyboard.on('keydown-RIGHT', () => this.seleccionar((this.seleccion + 1) % NIVELES.length));
    this.input.keyboard.on('keydown-LEFT', () => this.seleccionar((this.seleccion + NIVELES.length - 1) % NIVELES.length));
    this.input.keyboard.on('keydown-ENTER', () => this.jugar(this.seleccion));
    this.input.keyboard.on('keydown-SPACE', () => this.jugar(this.seleccion));
  }

  dibujarMar() {
    this.add.rectangle(400, 300, 800, 600, 0x3d7fb8);
    const olas = this.add.graphics();
    olas.lineStyle(2, 0x8fc1e6, 0.45);
    for (let y = 80; y < 600; y += 70) {
      for (let x = ANCHO_PANEL + 20 + ((y / 70) % 2) * 30; x < 800; x += 90) {
        olas.beginPath();
        olas.arc(x, y, 8, Math.PI * 1.1, Math.PI * 1.9);
        olas.strokePath();
      }
    }
  }

  dibujarPais() {
    const sombra = this.add.graphics();
    sombra.fillStyle(0x1b3b5c, 0.5).fillPoints(CONTORNO.map((p) => ({ x: p.x + 6, y: p.y + 8 })), true);

    const forma = this.make.graphics({ add: false });
    forma.fillStyle(0xffffff).fillPoints(CONTORNO, true);
    const mascara = forma.createGeometryMask();

    // Las tres regiones naturales del Ecuador.
    const regiones = this.add.graphics();
    regiones.fillStyle(0xe3c77a).fillRect(240, 0, 172, 600);
    regiones.fillStyle(0xb39466).fillRect(412, 0, 133, 600);
    regiones.fillStyle(0x4f9a4a).fillRect(545, 0, 255, 600);
    regiones.setMask(mascara);

    const detalle = this.add.graphics();
    // Cordillera de los Andes.
    for (let y = 90; y < 560; y += 38) {
      const x = 440 + ((y / 38) % 2) * 40;
      detalle.fillStyle(0x7d6446).fillTriangle(x - 18, y + 16, x, y - 12, x + 18, y + 16);
      detalle.fillStyle(0xf4f7fb).fillTriangle(x - 6, y - 3, x, y - 12, x + 6, y - 3);
    }
    // Selva amazónica.
    for (let y = 150; y < 420; y += 34) {
      for (let x = 580 + ((y / 34) % 2) * 22; x < 790; x += 44) {
        detalle.fillStyle(0x2f7d3a).fillCircle(x, y, 10);
      }
    }
    // Ríos que bajan hacia el Amazonas.
    detalle.lineStyle(3, 0x5fb3d9);
    detalle.lineBetween(560, 250, 640, 300).lineBetween(640, 300, 760, 320);
    detalle.lineBetween(600, 200, 700, 230).lineBetween(700, 230, 780, 250);
    // Palmeras de la Costa.
    for (let y = 170; y < 460; y += 60) {
      const x = 330 + ((y / 60) % 2) * 26;
      detalle.fillStyle(0x6b8f3a).fillTriangle(x - 8, y, x + 8, y, x, y - 10);
      detalle.fillStyle(0x7a5a2a).fillRect(x - 1, y, 2, 8);
    }
    detalle.setMask(mascara);

    const borde = this.add.graphics();
    borde.lineStyle(4, COLOR.tinta).strokePoints(CONTORNO, true, true);

    const etiqueta = (x, y, texto, color = '#3a2716') =>
      this.add.text(x, y, texto, con(ESTILO.etiqueta, { color, fontSize: '13px', letterSpacing: 3 }))
        .setOrigin(0.5).setAlpha(0.75);
    etiqueta(330, 330, 'COSTA');
    etiqueta(445, 520, 'SIERRA');
    etiqueta(700, 215, 'AMAZONÍA', '#e9f5e1');
    etiqueta(620, 80, 'COLOMBIA', '#e3f0fb');
    etiqueta(700, 470, 'PERÚ', '#e3f0fb');
    this.add.text(300, 116, 'OCÉANO\nPACÍFICO', con(ESTILO.etiqueta, { color: '#e3f0fb', fontSize: '11px', align: 'center' }))
      .setOrigin(0.5).setAlpha(0.75);

    // Línea equinoccial (latitud 0°), el corazón de la leyenda.
    const linea = this.add.graphics();
    linea.lineStyle(2, 0xffd36b, 0.9);
    const yLinea = MITAD_DEL_MUNDO.y;
    for (let x = ANCHO_PANEL + 10; x < 800; x += 14) linea.lineBetween(x, yLinea, x + 7, yLinea);
    this.add.text(790, yLinea - 6, 'LÍNEA EQUINOCCIAL · 0°', con(ESTILO.etiqueta, { color: '#ffe9a8', fontSize: '10px' }))
      .setOrigin(1, 1);
  }

  puntosDeRuta() {
    const p = NIVELES.map((n) => ({ x: n.mapa.x, y: n.mapa.y }));
    // Tena -> Mitad del Mundo -> Llanganates.
    return [p[0], p[1], p[2], p[3], MITAD_DEL_MUNDO, p[4]];
  }

  dibujarRuta() {
    const puntos = this.puntosDeRuta();
    // Qué tramos ya se recorrieron: el tramo i sale del nivel i.
    const recorrido = [0, 1, 2, 3, 3].map((nivel) => this.progreso.completados[nivel]);
    const g = this.add.graphics();
    for (let i = 0; i < puntos.length - 1; i++) {
      const a = puntos[i];
      const b = puntos[i + 1];
      const dist = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
      const pasos = Math.floor(dist / 12);
      g.fillStyle(recorrido[i] ? 0xffd21f : 0xffffff, recorrido[i] ? 1 : 0.7);
      for (let s = 1; s < pasos; s++) {
        const t = s / pasos;
        g.fillCircle(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 2.6);
      }
    }

    // Parada de la Mitad del Mundo: el monumento bajo el sol del equinoccio.
    const { x, y } = MITAD_DEL_MUNDO;
    const m = this.add.graphics();
    m.fillStyle(0x000000, 0.25).fillEllipse(x, y + 12, 26, 7);
    m.fillStyle(0xcbb999).fillRect(x - 5, y - 10, 10, 20);
    m.fillStyle(0xffd21f).fillCircle(x, y - 14, 7);
    m.lineStyle(2, COLOR.tinta).strokeRect(x - 5, y - 10, 10, 20);
    this.add.text(x + 12, y - 30, 'Mitad del Mundo', con(ESTILO.ciudad, { fontSize: '11px' })).setOrigin(0, 0.5);
  }

  crearNodo(nivel, i) {
    const { x, y, aliadoDx } = nivel.mapa;
    const abierto = estaDesbloqueado(this.progreso, i);
    const hecho = this.progreso.completados[i];

    const aliado = this.add.graphics();
    dibujarPersonaje(aliado, nivel.aliado, x + aliadoDx, y + 22, 0.55);
    aliado.setAlpha(abierto ? 1 : 0.5);

    this.add.ellipse(x, y + 20, 46, 12, 0x000000, 0.28);
    const color = hecho ? COLOR.oro : abierto ? COLOR.terracota : 0x7d7466;
    const disco = this.add.circle(x, y, 24, color).setStrokeStyle(3, abierto ? 0xfff1c2 : COLOR.tinta);

    if (abierto) {
      this.add.text(x, y, nivel.numero, con(ESTILO.boton, { fontSize: '20px' })).setOrigin(0.5);
    } else {
      const candado = this.add.graphics();
      candado.lineStyle(3, COLOR.tinta).strokeCircle(x, y - 5, 6);
      candado.fillStyle(COLOR.tinta).fillRect(x - 9, y - 3, 18, 13);
      candado.fillStyle(0xd9a42b).fillRect(x - 1.5, y + 1, 3, 5);
    }
    dibujarEstrellas(this, x, y + 33, this.progreso.estrellas[i], 7, 15);
    this.add.text(x, y + 50, nivel.ciudad, ESTILO.ciudad).setOrigin(0.5);

    disco.setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.seleccionar(i));
    return disco;
  }

  dibujarMarcadorRoco() {
    // Roco espera en el próximo capítulo por jugar.
    const actual = siguienteJugable(this.progreso);
    const { x, y, aliadoDx } = NIVELES[actual].mapa;
    const marcador = this.add.graphics().setDepth(6);
    dibujarPersonaje(marcador, 'roco', 0, 0, 0.5);
    marcador.setPosition(x - Math.sign(aliadoDx) * 44, y + 22);
    this.tweens.add({ targets: marcador, y: y + 16, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Tras la trampa de Cuenca, Brumario espera con Alba en el final.
    const llaves = estadoDeLlaves(this.progreso);
    if (llaves.brumario > 0) {
      const final = NIVELES[4].mapa;
      const villano = this.add.graphics().setDepth(4);
      dibujarPersonaje(villano, 'brumario', final.x - 48, final.y + 22, 0.55);
    }
  }

  dibujarBarraSuperior() {
    const llaves = estadoDeLlaves(this.progreso);
    const estrellas = this.progreso.estrellas.reduce((a, b) => a + b, 0);
    const fragmentos = NIVELES.reduce(
      (total, n, i) => total + (this.progreso.completados[i] ? n.fragmentos.length : 0), 0
    );
    const totalFragmentos = NIVELES.reduce((t, n) => t + n.fragmentos.length, 0);

    this.add.rectangle(525, 22, 550, 44, 0x1b1630, 0.88).setDepth(8);
    const llave = this.add.graphics().setDepth(9);
    llave.lineStyle(3, 0xffd21f).strokeCircle(272, 22, 6);
    llave.fillStyle(0xffd21f).fillRect(278, 20, 16, 4).fillRect(289, 24, 3, 5);
    this.add.text(300, 22, `Llaves ${llaves.equipo}/4`, ESTILO.etiquetaOro).setOrigin(0, 0.5).setDepth(9);
    this.add.star(440, 22, 5, 4, 9, 0xffd21f).setDepth(9);
    this.add.text(455, 22, `Estrellas ${estrellas}/${NIVELES.length * 3}`, ESTILO.etiquetaOro).setOrigin(0, 0.5).setDepth(9);
    this.add.image(608, 22, 'fragmento').setScale(0.7).setDepth(9);
    this.add.text(624, 22, `Fragmentos ${fragmentos}/${totalFragmentos}`, ESTILO.etiquetaOro).setOrigin(0, 0.5).setDepth(9);

    if (llaves.brumario > 0) {
      this.add.rectangle(525, 58, 550, 26, 0x5b2a86, 0.92).setDepth(8);
      this.add.text(525, 58, `El Rey Brumario tiene ${llaves.brumario} llaves y a Alba`, con(ESTILO.texto, { fontSize: '13px', fontStyle: 'bold' }))
        .setOrigin(0.5).setDepth(9);
    } else if (this.progreso.completados[4]) {
      this.add.rectangle(525, 58, 550, 26, 0x2f5d3a, 0.92).setDepth(8);
      this.add.text(525, 58, 'Leyenda completa: ahora todos son Guardianes del Inti', con(ESTILO.texto, { fontSize: '13px', fontStyle: 'bold' }))
        .setOrigin(0.5).setDepth(9);
    }
  }

  crearPanelFijo() {
    this.add.rectangle(ANCHO_PANEL / 2, 300, ANCHO_PANEL, 600, COLOR.pergamino).setStrokeStyle(4, COLOR.tinta);
    this.add.rectangle(ANCHO_PANEL / 2, 22, ANCHO_PANEL - 4, 40, COLOR.tinta);
    this.add.text(ANCHO_PANEL / 2, 22, 'MAPA DEL DERROTERO', con(ESTILO.franja, { color: '#ffe9a8' })).setOrigin(0.5);

    crearBoton(this, 66, 572, 'INICIO', () => this.scene.start('Inicio'), { ancho: 108, alto: 34, tamano: '14px', color: COLOR.tintaSuave });
    crearBoton(this, 184, 572, 'BORRAR', () => this.borrarProgreso(), { ancho: 108, alto: 34, tamano: '14px', color: COLOR.tintaSuave });
  }

  seleccionar(i) {
    this.seleccion = i;
    const { x, y } = NIVELES[i].mapa;
    this.anillo.setPosition(x, y);
    this.mostrarPanel(i);
  }

  mostrarPanel(i) {
    if (this.panel) this.panel.destroy();
    const nivel = NIVELES[i];
    const abierto = estaDesbloqueado(this.progreso, i);
    const centro = ANCHO_PANEL / 2;
    const ancho = ANCHO_PANEL - 34;
    const panel = this.add.container(0, 0);
    this.panel = panel;
    let y = 52;

    const poner = (objeto, espacio = 6) => {
      panel.add(objeto);
      y += objeto.height + espacio;
      return objeto;
    };

    poner(this.add.text(centro, y, nivel.etiqueta, ESTILO.etiqueta).setOrigin(0.5, 0), 4);
    poner(this.add.text(centro, y, nivel.titulo, con(ESTILO.tituloPanel, { wordWrap: { width: ancho } })).setOrigin(0.5, 0), 8);

    panel.add(this.add.circle(centro, y + 44, 44, COLOR.pergaminoClaro).setStrokeStyle(2, COLOR.tinta));
    const retrato = this.add.graphics();
    dibujarPersonaje(retrato, nivel.aliado, centro, y + 80, 1.15);
    if (!abierto) retrato.setAlpha(0.45);
    panel.add(retrato);
    y += 96;

    poner(this.add.text(centro, y, nivel.nombreAliado, con(ESTILO.textoTinta, { fontStyle: 'bold', fontSize: '14px', align: 'center', wordWrap: { width: ancho } })).setOrigin(0.5, 0), 2);
    poner(this.add.text(centro, y, nivel.habilidad, con(ESTILO.textoTintaItalica, { align: 'center', wordWrap: { width: ancho } })).setOrigin(0.5, 0), 10);

    const izquierda = 17;
    poner(this.add.text(izquierda, y, 'LO QUE ROBÓ LA BRUMA', ESTILO.etiqueta), 2);
    poner(this.add.text(izquierda, y, capitalizar(nivel.reliquia), con(ESTILO.textoTinta, { wordWrap: { width: ancho } })), 8);
    poner(this.add.text(izquierda, y, 'LA PISTA QUE TE TRAE', ESTILO.etiqueta), 2);
    const pista = i === 0 ? 'El robo en el museo: aquí empieza la leyenda.' : `«${NIVELES[i - 1].pista}»`;
    poner(this.add.text(izquierda, y, pista, con(ESTILO.textoTintaItalica, { wordWrap: { width: ancho } })), 10);

    const estrellas = dibujarEstrellas(this, centro, y + 8, this.progreso.estrellas[i], 10, 26);
    panel.add(estrellas);
    y += 30;

    const yBoton = Math.max(y + 26, 500);
    if (abierto) {
      const texto = this.progreso.completados[i] ? 'JUGAR DE NUEVO' : 'JUGAR';
      panel.add(crearBoton(this, centro, Math.min(yBoton, 520), texto, () => this.jugar(i), { ancho: 200, alto: 50 }));
    } else {
      panel.add(this.add.text(
        centro,
        Math.min(yBoton, 520),
        `Recupera la llave de ${NIVELES[i - 1].ciudad} para abrir este camino.`,
        con(ESTILO.textoTintaItalica, { align: 'center', wordWrap: { width: ancho } })
      ).setOrigin(0.5));
    }
  }

  jugar(i) {
    if (!estaDesbloqueado(this.progreso, i)) {
      this.cameras.main.shake(150, 0.004);
      return;
    }
    this.scene.start('Carga', { nivel: i });
  }

  borrarProgreso() {
    if (window.confirm('¿Borrar todo el progreso y empezar la leyenda desde Quito?')) {
      reiniciarProgreso();
      this.scene.restart({ seleccion: 0 });
    }
  }
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
