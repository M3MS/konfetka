# Konfetka

A creative agency website built with vanilla JavaScript and Vite. GSAP handles page animations, Lenis provides smooth scrolling, and Three.js renders the interactive WebGL scene. Styling combines Sass and Tailwind CSS.

## Local setup

Run commands from the Git repository root, the directory containing this README and `vite.config.js`.

The installed Vite 5 package declares Node.js support as `^18.0.0 || >=20.0.0`. The project does not pin a Node version; the production build has been verified with Node.js 22.23.0.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm ci` installs the versions recorded in `package-lock.json`.

## Commands

- `npm run dev` — start the development server.
- `npm run build` — compile and bundle the site into `dist/`.
- `npm run preview` — serve the built site locally; run the build first.

There are currently no test, lint, or formatting scripts. After changes, build the site and check responsive layouts, scrolling, animations, WebGL rendering, and the browser console.

## Project structure

```text
index.html              Page markup and JavaScript entry reference
src/
  js/
    main.js             Animation and scrolling setup; imports main.scss
    scene.js            Three.js scene and interaction logic
    assets/
      shaders.js        GLSL shader definitions
      utils.js          Shared JavaScript helpers
  scss/
    main.scss           Sass entry point and Tailwind directives
    _*.scss             Section styles, typography, and scrolling styles
  assets/               Images, textures, logos, and fonts
dist/                   Generated build output (ignored by Git)
```

## Configuration

### Vite and module resolution

`package.json` sets `"type": "module"`, so JavaScript uses ES modules. `vite.config.js` maps `@` to `src/`; `jsconfig.json` mirrors that alias for editor navigation and completion. Keep both mappings aligned when changing source paths.

Vite configuration currently defines only the alias. There are no custom server, deployment base-path, or build settings.

### Sass, Tailwind, and PostCSS

`src/scss/main.scss` loads the Sass partials and includes Tailwind's base, components, and utilities layers. Add shared or section styles to the appropriate partial and load new partials from this entry point.

`tailwind.config.cjs` scans `index.html` and `src/**/*.{js,ts,jsx,tsx}` for utility classes. It defines:

- `font-sans`: Beatrice, then Verdana and sans-serif.
- `font-serif`: Arsenica, then Georgia and serif.
- A `2xl` container width of `1700px`.

Font files live in `src/assets/fonts/`, with `@font-face` declarations in `src/scss/_typo.scss`.

`postcss.config.cjs` enables `postcss-import`, Tailwind CSS, and Autoprefixer. A `.sassrc` file declares `node_modules` as an include path, but `vite.config.js` does not explicitly load it; do not assume it configures Vite's Sass processing.

### Registry and runtime dependencies

`.npmrc` configures a registry for the `@gsap` scope and currently contains a hardcoded authentication token. Remove the credential and rotate it before sharing the repository; keep any required authentication outside committed files. The application imports the unscoped `gsap` package.

No application environment variables or backend service are configured. The WebGL scene loads a texture from Dropbox in `src/js/scene.js`, so that effect depends on the remote asset being accessible at runtime.

## Production build

```sh
npm run build
npm run preview
```

Publish the generated `dist/` directory with a static hosting service. No GitHub Pages workflow or other deployment automation is included. If hosting under a repository subpath, configure Vite's `base` and review root-relative links in `index.html` before deploying.

The verified build completes with warnings about Sass's legacy JavaScript API and a JavaScript chunk exceeding 500 kB. These warnings do not currently prevent the build from completing.
