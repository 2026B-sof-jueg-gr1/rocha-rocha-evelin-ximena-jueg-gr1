# Los Guardianes del Inti: El Derrotero Perdido

Videojuego de plataformas creado con Phaser 3, inspirado en la leyenda del
tesoro de los Llanganates. La narrativa completa (personajes, ruta, actos y
justificación de cada elemento) está en [NARRATIVA.md](./NARRATIVA.md).

## Misión 1: El alma del juego

**Hook:** Cuando la banda del Rey Brumario roba las reliquias sagradas del
Ecuador, Roco, un mecánico quiteño, y Alba, la última heredera de los
Guardianes del Inti, deben reunir aliados en cada región, descifrar el
derrotero secreto de Rumiñahui y recuperar las cuatro llaves del Disco Solar
antes de que el sol del equinoccio revele el tesoro de los Llanganates a quien
solo quiere venderlo.

**Resonancia ludonarrativa:** recoger los 15 fragmentos del derrotero es
reconstruir el mapa robado, y la cuenta regresiva representa la carrera hacia
el equinoccio. Cada aliado (Brin, Lino, Milo y Nuba) aporta el conocimiento de
su región, que el equipo necesita para avanzar. El conocimiento no es un
examen: es la herramienta para ganar.

**Jugable ahora: los cinco capítulos.** Al pulsar JUGAR se abre el **mapa del
Ecuador** (Costa, Sierra y Amazonía) con la ruta Quito → Latacunga → Cuenca →
Tena → Mitad del Mundo → Llanganates. Cada ciudad es un nivel con su aliado y
su habilidad; la pista grabada en cada llave abre el siguiente. Cada uno de
los 75 fragmentos muestra un dato real de su región: aprender es literalmente
reconstruir el mapa. La trazabilidad completa leyenda → juego está en
[NARRATIVA.md](./NARRATIVA.md#8-estado-actual-del-desarrollo).

### Estructura del código

```text
taller3/
├── index.html
└── src/
    ├── main.js               configuración de Phaser y lista de escenas
    ├── datos/niveles.js      los 5 capítulos: robo, aliado, habilidad, pista, datos y plataformas
    ├── datos/progreso.js     llaves, estrellas y desbloqueos (localStorage)
    ├── escenas/              Inicio, Mapa, Carga, Nivel y Resultado
    ├── escenarios.js         fondos y texturas de cada región
    ├── personajes.js         personajes dibujados con código
    └── ui.js                 estilos, botones e iconos
```

En `npm run dev` se puede saltar directo a una escena para probarla:
`?escena=Mapa&progreso=3`, `?escena=Nivel&nivel=2` o `?escena=Carga&nivel=4`.

## Misión 2: Reglas del mundo real

**Clasificación E (ESRB) / PEGI 3:** apto para cualquier explorador o
exploradora con ganas de saltar. Contiene villanos con sombrero que huyen a toda
velocidad y una cantidad peligrosa de datos curiosos sobre el Ecuador. Sin
violencia gráfica.

La clasificación es creativa y autoevaluada (no es una certificación oficial
de ESRB/PEGI; para tiendas se usa el cuestionario gratuito de IARC).

El **Muro de honor** de la landing acredita el código y los gráficos del juego
(propios), los retratos generados con IA (declarando que los de Roco, Alba y
Milo son bocetos provisionales con un estilo inspirado en personajes de
Nintendo), Phaser 3 y Vite (MIT) y las tipografías Cinzel y Lora (SIL OFL 1.1). Antes de
añadir música, efectos o arte externo, debe registrarse su autor, fuente y
licencia (CC0, Creative Commons compatible o licencia comercial).

## Misión 3: Landing y GitHub Pages

La landing ([index.html](./index.html)) tiene la estética de un derrotero de
explorador. Incluye el logline, la leyenda, la ruta de ciudades, los
personajes, las características, la sección legal, la plataforma indie elegida,
el flujo de CI/CD y un botón **JUGAR** que abre el juego en
[taller3/index.html](./taller3/index.html).

## Desarrollo con Node.js

El juego utiliza Vite para el desarrollo y Phaser 3 como motor 2D instalado desde
npm. Para trabajar localmente:

```bash
npm install
npm run dev
```

Para generar una versión optimizada:

```bash
npm run build
```

El resultado se genera en `dist/` e incluye la landing page y el juego en
`dist/taller3/`, manteniendo rutas relativas para GitHub Pages.
La carpeta `node_modules/` no debe subirse al repositorio; GitHub Actions debe
ejecutar `npm ci` antes de construir.

- **Landing Page:** al publicar la rama `main` con GitHub Pages, la página principal
  será `https://<usuario>.github.io/<repositorio>/`.
- **Juego:** el botón **JUGAR AHORA** de la landing abre
  [`taller3/index.html`](./taller3/index.html), una página separada donde se ejecuta
  el canvas de Phaser.
- **Plataforma indie recomendada:** publicar una copia HTML5 en
  [itch.io](https://itch.io/), configurando el proyecto como jugable en el navegador.

## Publicar en GitHub Pages

1. Sube los cambios a la rama `main`.
2. En GitHub abre **Settings > Pages**.
3. En **Build and deployment**, selecciona **GitHub Actions** como fuente.
4. Espera a que termine el workflow **Deploy landing and game to GitHub Pages**.
5. Abre la URL mostrada en el environment `github-pages` y prueba el botón
   **JUGAR** desde una ventana privada.

La URL esperada para este repositorio es:

```text
https://2026B-sof-jueg-gr1.github.io/rocha-rocha-evelin-ximena-jueg-gr1/
```

El workflow construye `dist/` y publica tanto la landing como
`dist/taller3/index.html`, por lo que las rutas relativas de imágenes y del
juego se conservan.

## Misión 4: Plataforma indie

La plataforma elegida es **itch.io**, con el proyecto configurado como **HTML5**.

- **Estudio:** [EveRocha11](https://everocha11.itch.io/)
- **Página del juego:** <https://everocha11.itch.io/los-guardianes-del-inti>

1. Cuenta del estudio creada: `EveRocha11`.
2. Ve a **Dashboard > Create new project**:
   - **Title:** Los Guardianes del Inti.
   - **Project URL:** `los-guardianes-del-inti` (debe coincidir con `ITCH_GAME`).
   - **Kind of project:** HTML.
   - **Pricing:** No payments (o "donaciones").
   - **Visibility:** Draft mientras pruebas y Public al terminar.
3. Para la primera subida manual (opcional si usas el CI/CD):
   ```bash
   npm run build:itch
   ```
   Comprime el **contenido** de `dist-itch/` (no la carpeta) en un ZIP, súbelo y
   marca **This file will be played in the browser**. Tamaño de viewport
   recomendado: 800 × 600.

> `dist/taller3/` **no sirve** para itch.io: su `index.html` carga
> `../assets/…`, que queda fuera del ZIP. Por eso existe `build:itch`, que
> genera el juego con `index.html` y `assets/` juntos en la raíz.

✅ Página publicada y enlazada desde el botón `#itch-link` de la landing
([index.html](./index.html)).

## Misión legendaria: CI/CD a itch.io con Butler

El workflow [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)
tiene tres jobs que se ejecutan con cada push a `main`:

| Job | Qué hace |
|---|---|
| `build` | `npm ci` + `npm run build` y sube `dist/` como artefacto de Pages |
| `deploy` | Publica la landing y el juego en GitHub Pages |
| `itch` | `npm run build:itch`, instala Butler (CLI oficial) y ejecuta `butler push dist-itch usuario/juego:html5` |

Para activar el job `itch`:

1. En itch.io genera una API key en **Settings > API keys**.
2. En GitHub abre **Settings > Secrets and variables > Actions**:
   - Pestaña **Secrets**: crea `BUTLER_API_KEY` con la API key.
   - Pestaña **Variables**: crea `ITCH_GAME` con el valor
     `everocha11/los-guardianes-del-inti`.
3. Haz un push a `main` o ejecuta el workflow a mano desde **Actions > Run workflow**.

Mientras `ITCH_GAME` no exista, el job `itch` se omite y GitHub Pages sigue
funcionando. La API key nunca se escribe en el repositorio: solo vive en los
Secrets de GitHub. Se usa el CLI oficial de itch.io (descargado de
`broth.itch.zone`) en lugar de una acción de terceros, para que la API key solo
la maneje código de itch.io.

## Entrega en Teams

Comparte:

1. El enlace de GitHub Pages.
2. El enlace de la página de itch.io.
3. Una captura del workflow ejecutado correctamente (jobs `deploy` e `itch`).
4. **Mención de honor:** el archivo
   [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)
   para que otros equipos lo usen de modelo.
