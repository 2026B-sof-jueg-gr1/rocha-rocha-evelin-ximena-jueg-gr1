// Datos de los cinco capítulos de «Los Guardianes del Inti».
//
// Trazabilidad con la leyenda (ver NARRATIVA.md y la sección «La ruta» de la
// landing): cada capítulo sigue la estructura
//   1. Llegada   -> qué robó la Bruma en esa región        (llegada, reliquia)
//   2. Encuentro -> el aliado que se une y su habilidad     (aliado, encuentro, habilidad)
//   3. Nivel     -> 15 fragmentos del derrotero, cada uno con un dato real (datos)
//   4. Llave     -> la recompensa al reunirlos              (recompensa)
//   5. Pista     -> la frase grabada que abre el siguiente capítulo (pista)
//
// Bruma: tramos de suelo [xMin, xMax] que patrulla cada agente de la Bruma.
// Bloques: [x, bordeSuperior, tipo]. Tipos: 'bloque' (por defecto), 'oculto'
// (símbolos cañaris que Lino revela), 'hongo' (trampolín de Milo) y 'nube'
// (plataforma de Nuba). Fragmentos: [x, y].

export const NIVELES = [
  {
    id: 'quito',
    etiqueta: 'PRÓLOGO',
    numero: '0',
    ciudad: 'Quito',
    titulo: 'Prólogo: Quito',
    region: 'Sierra norte',
    reliquia: 'la máscara solar del museo de Quito',
    llegada: 'La Bruma entró al museo de Quito entre humo y niebla y robó la máscara solar. Roco, el mecánico que restaura sus mecanismos, lo vio todo.',
    aliado: 'alba',
    nombreAliado: 'Princesa Alba, la guardiana',
    encuentro: 'Alba, la última heredera de los Guardianes del Inti, le revela a Roco el secreto: dentro de la máscara se esconde la primera llave del Disco Solar.',
    habilidad: 'Vara del Inti: una flecha dorada señala el fragmento más cercano.',
    recompensa: 'PRIMERA LLAVE DEL DISCO SOLAR',
    pista: 'Busca a la reina que baila de negro',
    tiempo: 90,
    mapa: { x: 480, y: 215, aliadoDx: 46 },
    tema: {
      suelo: 0x5c3e2e, sueloBorde: 0x2c211d, sueloDetalle: 0x9e7747,
      bloque: 0x80683b, bloqueBorde: 0x40331f, bloqueDetalle: 0xd4bd67
    },
    datos: [
      'En 1978 la UNESCO declaró a Quito uno de los primeros Patrimonios Culturales de la Humanidad.',
      'Quito está a unos 2850 metros sobre el nivel del mar, en plena cordillera de los Andes.',
      'La ciudad se extiende a los pies del volcán Pichincha. El Guagua Pichincha hizo erupción en 1999.',
      'La Mitad del Mundo, sobre la línea ecuatorial, está a unos 25 km al norte de Quito.',
      'El interior de la iglesia de la Compañía de Jesús está cubierto de pan de oro.',
      'La Virgen del Panecillo mide más de 40 metros y está hecha con miles de piezas de aluminio.',
      'Las gárgolas de la Basílica del Voto Nacional representan animales del Ecuador, como tortugas e iguanas.',
      'La Quito española se fundó el 6 de diciembre de 1534 sobre una ciudad indígena anterior.',
      'Antes de los incas, pueblos como los quitus y los caras habitaron esta región.',
      '«Rumiñahui» significa «ojo de piedra» en kichwa.',
      '«Inti» significa «sol» en kichwa. El Inti Raymi, la fiesta del sol, se celebra en junio.',
      'El 10 de agosto de 1809 Quito dio el Primer Grito de Independencia de Hispanoamérica.',
      'La Batalla de Pichincha, el 24 de mayo de 1822, selló la independencia de Quito.',
      'En el equinoccio, al mediodía en la línea ecuatorial, el sol pasa casi sobre tu cabeza y apenas hay sombra.',
      'La Ronda es una de las calles más antiguas del Centro Histórico de Quito.'
    ],
    bloques: [
      [300, 426], [348, 426], [396, 426], [620, 376], [668, 376],
      [900, 426], [948, 426], [1130, 386], [1178, 386], [1226, 386],
      [1450, 336], [1498, 336], [1710, 406], [1758, 406],
      [1940, 366], [1988, 366], [2036, 366], [2200, 426], [2248, 426], [2296, 426]
    ],
    fragmentos: [
      [220, 465], [300, 390], [348, 390], [396, 390],
      [620, 340], [668, 340], [820, 465], [900, 395], [948, 395],
      [1080, 465], [1130, 350], [1178, 350], [1450, 300], [1758, 370],
      [2036, 330]
    ]
  },
  {
    id: 'latacunga',
    etiqueta: 'CAPÍTULO 1',
    numero: '1',
    ciudad: 'Latacunga',
    titulo: 'Latacunga y el páramo del Cotopaxi',
    region: 'Sierra centro',
    reliquia: 'un adorno del traje de la Mama Negra',
    llegada: 'En plena fiesta de la Mama Negra desaparece un adorno de su traje: la «reina que baila de negro» guardaba la segunda llave.',
    aliado: 'brin',
    nombreAliado: 'Brin, el zorro del páramo',
    encuentro: 'Brin siguió a la Bruma por el páramo del Cotopaxi. Nadie conoce mejor los caminos entre la nieve y el pajonal.',
    habilidad: 'Salto doble: pulsa saltar otra vez en el aire.',
    recompensa: 'SEGUNDA LLAVE DEL DISCO SOLAR',
    pista: 'Dentro del adorno aparece un símbolo cañari',
    tiempo: 90,
    bruma: [[950, 1300]],
    mapa: { x: 440, y: 292, aliadoDx: -48 },
    tema: {
      suelo: 0x6b5a3a, sueloBorde: 0x3b3122, sueloDetalle: 0x8f7a4f, cesped: 0xb9a24a,
      bloque: 0x7d7f8c, bloqueBorde: 0x3f414b, bloqueDetalle: 0xc9ccd6
    },
    datos: [
      'El Cotopaxi mide unos 5897 metros y es uno de los volcanes activos más altos del mundo.',
      'La Mama Negra se celebra en Latacunga en honor a la Virgen de la Merced.',
      'En la fiesta de la Mama Negra se mezclan tradiciones indígenas, españolas y africanas.',
      'En la comparsa salen personajes como el Ángel de la Estrella, el Rey Moro, los huacos y los ashangueros.',
      'Latacunga es la capital de la provincia de Cotopaxi.',
      'En 1877 una gran erupción del Cotopaxi envió flujos de lodo hasta los valles de Latacunga.',
      'El Parque Nacional Cotopaxi se creó en 1975.',
      'El páramo funciona como una esponja: guarda el agua que beben muchas ciudades andinas.',
      'El lobo de páramo, un zorro andino, vive en los pajonales del Cotopaxi.',
      'El cóndor andino es el ave nacional del Ecuador y aparece en su escudo.',
      'La laguna de Limpiopungo descansa a los pies del Cotopaxi.',
      'La laguna del Quilotoa, en Cotopaxi, llena con agua verde el cráter de un antiguo volcán.',
      'Alexander von Humboldt llamó a este valle andino la «Avenida de los Volcanes».',
      'La chugchucara, con cerdo, mote y maduro, es el plato típico de Latacunga.',
      'La paja del páramo es tan resistente que se usa para techar las casas tradicionales.'
    ],
    bloques: [
      [300, 426], [348, 426], [560, 330], [608, 330], [820, 250], [868, 250],
      [1100, 400], [1148, 400], [1340, 300], [1388, 300], [1600, 220], [1648, 220],
      [1880, 380], [1928, 380], [2150, 280], [2198, 280], [2246, 280]
    ],
    fragmentos: [
      [200, 465], [300, 390], [348, 390], [560, 294], [608, 294], [720, 380],
      [820, 214], [868, 214], [1000, 465], [1124, 364], [1340, 264], [1600, 184],
      [1648, 184], [1904, 344], [2198, 244]
    ]
  },
  {
    id: 'cuenca',
    etiqueta: 'CAPÍTULO 2',
    numero: '2',
    ciudad: 'Cuenca',
    titulo: 'Cuenca: las ruinas de Pumapungo',
    region: 'Sierra sur',
    reliquia: 'una piedra tallada cañari',
    llegada: 'El símbolo cañari lleva a Cuenca. La Bruma robó la piedra tallada que el cartógrafo Lino estudiaba en Pumapungo.',
    aliado: 'lino',
    nombreAliado: 'Lino, el explorador',
    encuentro: 'Lino descifra los símbolos y descubre que el Disco Solar es un mapa y también una máquina.',
    habilidad: 'Descifra símbolos: las plataformas ocultas aparecen cuando te acercas.',
    recompensa: 'TERCERA LLAVE DEL DISCO SOLAR',
    giro: '¡Era una trampa! El Rey Brumario secuestra a Alba y se lleva las tres llaves, porque solo una guardiana puede leer el disco.',
    pista: 'Donde nace el sol, el río baja verde',
    tiempo: 95,
    bruma: [[700, 1050], [1450, 1850]],
    mapa: { x: 420, y: 402, aliadoDx: 48 },
    tema: {
      suelo: 0x6e6a5e, sueloBorde: 0x3a3830, sueloDetalle: 0x9a9480,
      bloque: 0x8a8577, bloqueBorde: 0x45423a, bloqueDetalle: 0xd8cfb4
    },
    datos: [
      'En 1999 la UNESCO declaró a Cuenca Patrimonio Cultural de la Humanidad.',
      '«Pumapungo» significa «puerta del puma» en kichwa.',
      'Antes de los incas, aquí se levantaba Guapondélig, una ciudad del pueblo cañari.',
      'Sobre ella los incas construyeron Tomebamba, una de sus ciudades más importantes.',
      'Según la tradición, el inca Huayna Cápac nació en Tomebamba.',
      'Los cañaris contaban que descendían de dos guacamayas que salvaron a dos hermanos de un diluvio.',
      'Ingapirca, en la provincia de Cañar, es el mayor complejo arqueológico inca del Ecuador.',
      'En Ingapirca se conserva el Templo del Sol, una construcción de forma elíptica.',
      'El nombre completo de la ciudad es Santa Ana de los Cuatro Ríos de Cuenca.',
      'Cuatro ríos cruzan Cuenca: Tomebamba, Yanuncay, Tarqui y Machángara.',
      'La Catedral de la Inmaculada Concepción es famosa por sus cúpulas azules.',
      'El sombrero de paja toquilla, mal llamado «Panamá», es Patrimonio Inmaterial de la Humanidad desde 2012.',
      'La Cuenca española se fundó en 1557.',
      'El Qhapaq Ñan, el gran camino inca, unía el Cusco con Quito pasando por Tomebamba.',
      'En el parque arqueológico Pumapungo aún se ven terrazas y canales construidos por los incas.'
    ],
    bloques: [
      [280, 426], [328, 426], [376, 426], [600, 350, 'oculto'], [648, 350, 'oculto'],
      [880, 410], [928, 410], [1100, 300, 'oculto'], [1148, 300, 'oculto'],
      [1350, 380], [1398, 380], [1446, 380], [1650, 280, 'oculto'], [1698, 280, 'oculto'],
      [1900, 400], [1948, 400], [2150, 320, 'oculto'], [2198, 320, 'oculto'], [2246, 320, 'oculto']
    ],
    fragmentos: [
      [180, 465], [280, 390], [376, 390], [600, 314], [648, 314], [760, 465],
      [904, 374], [1100, 264], [1148, 264], [1398, 344], [1560, 465], [1650, 244],
      [1698, 244], [1924, 364], [2198, 284]
    ]
  },
  {
    id: 'tena',
    etiqueta: 'CAPÍTULO 3',
    numero: '3',
    ciudad: 'Tena',
    titulo: 'Amazonía: la selva del Napo',
    region: 'Amazonía',
    reliquia: 'las reliquias que la Bruma saca del país en canoa',
    llegada: '«Donde nace el sol» es el oriente. Sin Alba, Roco sigue el río verde hasta Tena, donde la Bruma saca reliquias del país por el río.',
    aliado: 'milo',
    nombreAliado: 'Milo, el guardián del bosque',
    encuentro: 'Milo sabe dónde crece cada cosa en la selva. Con él, el equipo puede recuperar la cuarta llave, la única que Brumario no tiene.',
    habilidad: 'Hongos-trampolín: salta sobre ellos para llegar muy alto.',
    nota: 'Alba no está: la Vara del Inti ya no señala los fragmentos.',
    recompensa: 'CUARTA LLAVE DEL DISCO SOLAR',
    pista: 'El disco completo apunta a la Mitad del Mundo',
    tiempo: 95,
    bruma: [[780, 1080], [1950, 2350]],
    mapa: { x: 650, y: 265, aliadoDx: 48 },
    tema: {
      suelo: 0x4a3426, sueloBorde: 0x2a1d15, sueloDetalle: 0x6b4a33, cesped: 0x3e8b3e,
      bloque: 0x8b5a2b, bloqueBorde: 0x4a2e15, bloqueDetalle: 0xc08a50
    },
    datos: [
      'Tena es la capital de la provincia de Napo.',
      'El río Napo nace en los Andes y desemboca en el Amazonas.',
      'En 1542 Francisco de Orellana bajó por los ríos de esta región y llegó al Amazonas.',
      'La Amazonía ocupa casi la mitad del territorio del Ecuador.',
      'El Parque Nacional Yasuní es uno de los lugares con más biodiversidad del planeta.',
      'En la Amazonía ecuatoriana viven nacionalidades como los kichwa, shuar, achuar, waorani y cofán.',
      'La guayusa es una planta que muchas familias kichwas toman en infusión antes del amanecer.',
      'La chicha de yuca es una bebida tradicional de los pueblos amazónicos.',
      'El maito es pescado envuelto en hojas de bijao y asado sobre las brasas.',
      'En los ríos amazónicos del Ecuador vive el delfín rosado.',
      'La ceiba es un árbol sagrado para muchos pueblos y puede superar los 50 metros de altura.',
      'Las cavernas de Jumandy recuerdan al líder que en 1578 se rebeló contra los españoles.',
      'El Ecuador tiene más de 1600 especies de aves, muchas de ellas en la Amazonía.',
      'La anaconda, una de las serpientes más grandes del mundo, vive en los ríos de la selva.',
      'Los árboles de la Amazonía producen una parte importante del oxígeno y la lluvia de la región.'
    ],
    bloques: [
      [300, 426], [348, 426], [520, 516, 'hongo'], [600, 200], [648, 200], [696, 200],
      [900, 400], [948, 400], [1150, 516, 'hongo'], [1230, 180], [1278, 180],
      [1500, 360], [1548, 360], [1750, 516, 'hongo'], [1830, 210], [1878, 210], [1926, 210],
      [2150, 400], [2198, 400]
    ],
    fragmentos: [
      [200, 465], [324, 390], [520, 430], [600, 164], [648, 164], [696, 164],
      [924, 364], [1050, 465], [1230, 144], [1278, 144], [1524, 324], [1650, 465],
      [1854, 174], [1926, 174], [2174, 364]
    ]
  },
  {
    id: 'llanganates',
    etiqueta: 'GRAN FINAL',
    numero: '★',
    ciudad: 'Llanganates',
    titulo: 'Mitad del Mundo → Llanganates',
    region: 'Entre la Sierra y la Amazonía',
    reliquia: 'a Alba y las tres llaves',
    llegada: 'En el equinoccio, Brumario obliga a Alba a leer el disco en la Mitad del Mundo. Roco llega con la cuarta llave y el camino verdadero aparece para todos: los Llanganates.',
    aliado: 'nuba',
    nombreAliado: 'Nuba, el espíritu de las nubes',
    encuentro: 'Nuba lleva 500 años escondiendo el tesoro bajo la niebla. Al ver que el equipo viene a protegerlo, la disipa solo para ellos.',
    habilidad: 'Disipa la niebla a tu alrededor y forma nubes-plataforma.',
    nota: 'Rescata a Alba: reúne los fragmentos antes de que la Bruma llegue al tesoro.',
    recompensa: 'EL TESORO DE RUMIÑAHUI',
    final: 'El equipo rescata a Alba y encuentra el tesoro... pero no se lo lleva. Las reliquias vuelven a cada región, el oro sigue donde Rumiñahui lo escondió y Nuba vuelve a cubrirlo de niebla. Alba sonríe: ahora todos son Guardianes del Inti.',
    pista: null,
    tiempo: 100,
    niebla: true,
    bruma: [[900, 1250], [1650, 2050]],
    mapa: { x: 560, y: 340, aliadoDx: 50 },
    tema: {
      suelo: 0x3f4756, sueloBorde: 0x22262f, sueloDetalle: 0x5d6676, cesped: 0x6f8f6f,
      bloque: 0x5d6676, bloqueBorde: 0x2c313b, bloqueDetalle: 0xa9b3c2
    },
    datos: [
      'La línea ecuatorial divide la Tierra en hemisferio norte y hemisferio sur.',
      'El Ecuador es el único país que lleva el nombre de la línea ecuatorial.',
      'En 1736 llegó la Misión Geodésica Francesa para medir la forma de la Tierra en estas tierras.',
      'Sus mediciones ayudaron a demostrar que la Tierra está achatada en los polos.',
      'El monumento de la Ciudad Mitad del Mundo mide unos 30 metros de altura.',
      'Catequilla, un sitio anterior a los incas, se levanta casi exactamente sobre la línea ecuatorial.',
      'En la línea ecuatorial el día y la noche duran casi 12 horas durante todo el año.',
      'En el equinoccio el día y la noche duran casi lo mismo en todo el planeta.',
      'Los Llanganates se extienden entre Tungurahua, Cotopaxi, Napo y Pastaza.',
      'Los Llanganates son Parque Nacional desde 1996.',
      'El Cerro Hermoso es una de las cumbres más famosas de los Llanganates.',
      'La niebla de los Llanganates es casi permanente y ha perdido a exploradores durante siglos.',
      'El botánico inglés Richard Spruce dio a conocer el derrotero de Valverde en el siglo XIX.',
      'Durante el siglo XX muchas expediciones siguieron el derrotero, y ninguna halló el tesoro.',
      'El patrimonio pertenece a sus pueblos: protegerlo es tarea de todos.'
    ],
    bloques: [
      [300, 420, 'nube'], [348, 420, 'nube'], [560, 330, 'nube'], [608, 330, 'nube'],
      [820, 250, 'nube'], [868, 250, 'nube'], [1080, 380], [1128, 380],
      [1330, 290, 'nube'], [1378, 290, 'nube'], [1580, 210, 'nube'], [1628, 210, 'nube'],
      [1850, 340], [1898, 340], [2100, 260, 'nube'], [2148, 260, 'nube'], [2300, 420], [2348, 420]
    ],
    fragmentos: [
      [200, 465], [324, 384], [584, 294], [844, 214], [868, 214], [980, 465],
      [1104, 344], [1354, 254], [1580, 174], [1628, 174], [1750, 465], [1874, 304],
      [2000, 465], [2124, 224], [2324, 384]
    ]
  }
];

// La Mitad del Mundo es una parada del camino (no un nivel): el disco completo
// apunta allí y, bajo el sol del equinoccio, revela la ruta a los Llanganates.
export const MITAD_DEL_MUNDO = { x: 505, y: 171 };

// Habilidades disponibles en cada capítulo. Se acumulan con cada aliado y Alba
// desaparece del equipo después de la trampa de Cuenca (capítulo 2).
export function habilidadesDe(indice) {
  return {
    detector: indice <= 2,     // Alba y la Vara del Inti
    dobleSalto: indice >= 1,   // Brin
    revelar: indice >= 2,      // Lino
    hongos: indice >= 3,       // Milo
    niebla: indice === 4       // Nuba
  };
}

export function equipoDe(indice) {
  const equipo = ['Roco'];
  if (indice <= 2) equipo.push('Alba');
  if (indice >= 1) equipo.push('Brin');
  if (indice >= 2) equipo.push('Lino');
  if (indice >= 3) equipo.push('Milo');
  if (indice >= 4) equipo.push('Nuba');
  return equipo;
}
