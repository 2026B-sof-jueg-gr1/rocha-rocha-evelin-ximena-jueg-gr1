# Aventura de Monedas

Videojuego de plataformas retro creado con Phaser 3. Mario debe recorrer el nivel,
saltar obstáculos, recolectar 15 monedas y desbloquear la estrella final.

## Entrega

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
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Selecciona la rama `main` y la carpeta `/ (root)`, y pulsa **Save**.
5. Espera la publicación y prueba el enlace desde una ventana privada.

## Entrega en Teams

Comparte el enlace de GitHub Pages y el enlace de la página de itch.io.
Si se configura automatización posterior con GitHub Actions y Butler, adjunta
también una captura del workflow ejecutado correctamente.
