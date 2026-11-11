# Aventura de Mario

Videojuego de plataformas retro creado con Phaser 3. Mario debe recorrer el nivel,
saltar obstáculos, recolectar 15 monedas y desbloquear la estrella final.

## Misión 1: El alma del juego

**Hook:** Mario debe reunir 15 monedas doradas y desbloquear la estrella final
antes de que el tiempo se agote, dominando saltos y plataformas en un reino
lleno de caminos secretos.

**Resonancia ludonarrativa:** cada salto, movimiento y moneda representa el
avance del héroe. La coordinación y los reflejos no son actividades separadas
de la historia: son las habilidades que permiten recuperar la estrella y salvar
el reino.

## Misión 2: Reglas del mundo real

**Clasificación E (Todo Público):** apto para cualquier persona con ganas de
jugar. Contiene saltos pixelados, plataformas y recolección de monedas, sin
violencia gráfica ni contenido sensible.

El **Muro de honor** de la landing reconoce que el proyecto usa código propio,
Phaser 3 bajo licencia MIT y recursos visuales creados para este proyecto.
Antes de añadir música, efectos o arte externo, debe registrarse su autor,
fuente y licencia (CC0, Creative Commons compatible o licencia comercial).

## Misión 3: Landing y GitHub Pages

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

La opción recomendada es **itch.io**, configurando el proyecto como **HTML5**.
Se debe crear una cuenta gratuita del estudio, crear una página del juego y
subir el contenido generado en `dist/taller3/` como un ZIP con `index.html` en
la raíz. En itch.io se debe activar **This file will be played in the browser**.

Como alternativa, la landing publicada en GitHub Pages funciona como escaparate
principal y enlaza directamente al juego Phaser.

## CI/CD opcional para itch.io

GitHub Pages ya queda automatizado con `.github/workflows/deploy-pages.yml`.
Para automatizar itch.io después de crear la cuenta:

1. Genera una API key en itch.io.
2. En GitHub crea los secrets `BUTLER_API_KEY` y `ITCH_GAME`
   (`usuario/proyecto`).
3. Añade un workflow de Butler que publique `dist/` después de `npm run build`.

La API key nunca debe escribirse en el repositorio ni en el código.

## Entrega en Teams

Comparte:

1. El enlace de GitHub Pages.
2. El enlace de la página de itch.io.
3. Una captura del workflow de GitHub Pages ejecutado correctamente.
4. Si se configura Butler, una captura adicional de su ejecución exitosa.
