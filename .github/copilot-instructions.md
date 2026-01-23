## Repo snapshot

This is a single-page HTML5 Canvas game. All game logic is in [index.html](../www/index.html). Styling is in [www/css/style.css](../www/css/style.css). Game logic is split across multiple JS files in [www/js/](../www/js). There are no build steps, tests, or external dependencies — open `index.html` in a browser to run.

## Big picture

- Single-page app: UI + game loop + entities all live in `index.html`.
- Main runtime flow: `animate()` -> `updatePlayer()` -> `updateWorld()` -> `checkCollisions()` -> render functions.
- Entities are plain JS objects in arrays: `targets`, `obstacles`, `boosterList`, `monsters`, `fireworks`.
- Level progression is driven by `checkLevel()` which increases `scrollSpeed`, spawns more entities and updates `level`.

## Where to change things (examples)

- Add a new entity type: follow existing pattern in `spawnTargets()` / `spawnObstacles()` — create an array, spawn function, draw function, and include in `updateWorld()` and collision checks.
- Tweak player input: modify the pointer handlers (`mousemove` / `touchmove`) and `updatePlayer()` which applies acceleration toward `mouse.x, mouse.y`.
- Visual/style changes: edit [www/css/style.css](../www/css/style.css) and the UI `#ui` markup at the top of `index.html`.

## Project-specific conventions & patterns

- No modules: code is global and inline. Avoid renaming globals without updating all uses in `index.html` and JS files.
- Respawn pattern: off-screen entities are repositioned (e.g., `if(t.x<-50){ t.x=W+... }`). Follow this pattern for consistent behavior.
- Colors use `hsl(...)` for targets. Fireworks and color-changes reuse that pattern.
- Physics: simple Euler integration with friction (e.g., vx *= 0.92). Keep changes compatible with this lightweight loop to avoid unstable motion.

## Debugging and developer workflow

- Run: open [index.html](../www/index.html) in a desktop or mobile browser (no server required). For local file CORS issues, use a lightweight local server (e.g., `npx http-server .`) but typically not needed.
- Inspect: use browser DevTools console. Helpful places to add logs: `updatePlayer()`, `checkCollisions()`, and `checkLevel()`.
- Hot edits: editing files and refreshing the page is the normal iteration loop.

## Safety notes for automated edits

- Keep all entity arrays and the main `animate()` loop intact; accidental removal will break the runtime.
- If extracting code into modules, do it in [www/js/](../www/js/) and wire it in `<script>` tags in `index.html` — don't assume an existing bundler.

## Suggested small-first tasks for agents

- Add a `sound` toggle: update UI markup, add a `soundsEnabled` flag, call an audio helper on collisions (search `checkCollisions()` for places to hook).
- Add a compact settings pane: minimal CSS + toggle to reduce screen clutter.

## Reference locations

- Game entry & logic: [index.html](../www/index.html)
- Styling: [www/css/style.css](../www/css/style.css)
- JavaScript modules: [www/js/](../www/js/)
- Overview: [README.md](../README.md)

If anything here is unclear or you want examples merged into the file (e.g., exact code snippets for adding a new entity), tell me which area and I will expand.