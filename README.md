# Gravity Assist 🎨🪐

Gravity Assist is a simple browser-based game built with **HTML5 Canvas and Vanilla JavaScript**.  
You control a gravity field using your mouse to guide a particle, collect targets, and avoid obstacles.

No libraries, no build steps — just open `index.html` and play.

---

## 🎮 How to Play

- Move your **mouse** (or touch) to control the gravity field.
- The **white particle** is pulled toward your cursor.
- Touch the **colored circles** (targets) to collect them and gain points.
- Avoid the **red circles** (obstacles/repulsors) — they push the particle away.
- Collect **boosters** for special power-ups.
- The particle wraps around screen edges.
- Level up by reaching score milestones — difficulty increases with speed and entity spawning.

---

## 🧠 Game Mechanics

- **Gravity Field**:  
  The particle accelerates toward the mouse/touch position with physics-based movement.

- **Targets**:  
  - Randomly placed colored circles using `hsl(...)` colors  
  - Increase your score when collected  
  - Change the particle color on contact

- **Obstacles**:  
  - Red outlined circles  
  - Push the particle away when nearby

- **Boosters**:  
  - Special collectibles for power-ups
  - Track count in UI

- **Physics**:
  - Velocity-based Euler integration
  - Friction applied each frame (`vx *= 0.92`)
  - Screen wrap-around instead of walls

- **Level Progression**:
  - Triggered by `checkLevel()` 
  - Increases `scrollSpeed`, spawns more entities
  - UI updates in real-time

---

## 🚀 How to Run

1. Download or clone the project
2. Open `www/index.html` in any modern browser
3. Move your mouse and start playing

**Optional:** Use a local server to avoid CORS issues:
```bash
npx http-server www
```

### 🖼️ Icons & screenshots
SVG placeholders have been added to `www/icons/` for all PWA icon sizes and two app screenshots (`screenshot-540x720.svg` and `screenshot-1280x720.svg`). If you need raster (PNG) versions for older platforms you can generate them locally:

1. Install dev dependency (optional):
```bash
npm install --save-dev puppeteer
```
2. Run the provided script to render all `*.svg` to `*.png`:
```bash
node scripts/generate-pngs.js
```

This will write PNG files into `www/icons/` next to the SVGs. (Rendering requires `puppeteer` and may download a Chromium binary.)

---

## 📁 Project Structure

```
gravity-assist-main/
├── www/
│   ├── index.html          # Main game entry point
│   ├── manifest.json       # PWA manifest
│   ├── css/
│   │   └── style.css       # Game styling & modals
│   ├── js/
│   │   ├── spawn.js        # Entity spawning functions
│   │   ├── draw.js         # Canvas rendering
│   │   ├── update.js       # Game state updates
│   │   ├── collisions.js   # Collision detection
│   │   ├── main.js         # Main game loop & setup
│   │   └── version.js      # Version tracking
│   └── icon-*.png          # App icons
├── README.md               # This file
└── .github/
    └── copilot-instructions.md  # Developer guidelines
```

---

## 🛠️ Tech Stack

- **HTML5** — Structure & Canvas element
- **CSS3** — Styling, modals, responsive design
- **Vanilla JavaScript** — No dependencies, all global scope
- **Canvas API** — Game rendering & animation

---

## 🎯 Key Functions & Patterns

### Main Game Loop
- `animate()` — Called via `requestAnimationFrame`
- Flow: `updatePlayer()` → `updateWorld()` → `checkCollisions()` → render

### Entity Management
- **Arrays**: `targets`, `obstacles`, `boosterList`, `monsters`, `fireworks`
- **Respawn Pattern**: Off-screen entities reposition instead of despawn
  ```javascript
  if(t.x < -50) { t.x = W + 50; t.y = Math.random() * H; }
  ```

### Collision Detection
- Implemented in `collisions.js`
- Checks distance between player and each entity type
- Updates score, color, and state on collision

---

## 💡 Extending the Game

### Add a New Entity Type
1. Create a spawn function in `spawn.js`
2. Add a draw function in `draw.js`
3. Add update logic in `update.js`
4. Include collision checks in `collisions.js`
5. Wire into `animate()` loop in `main.js`

### Add Sound
1. Update UI markup in `index.html`
2. Add `soundsEnabled` flag
3. Call audio helpers on collision events (see `checkCollisions()`)

### Modify Physics
- Edit friction value in `update.js`: `vx *= 0.92`
- Adjust acceleration in `updatePlayer()`
- Keep Euler integration pattern for consistency

---

## 📌 Development Notes

This project follows **global scope, single-page architecture**:
- No modules or bundling
- All code runs in browser context
- Global variables: `W`, `H`, `player`, `level`, `score`, etc.
- When renaming globals, update all references across `index.html` and JS files

---

## 🎮 Features Included

✅ Mouse & Touch support  
✅ Progressive difficulty (levels)  
✅ Score & Booster tracking  
✅ Particle color changing on collision  
✅ Fireworks & visual effects  
✅ PWA manifest (installable)  
✅ Version tracking modal  
✅ Responsive canvas scaling  

---

## 📜 License & Credits

Built as an experimental game to explore Canvas rendering, physics simulation, and mouse-based interaction.

Feel free to fork, modify, and extend!

---

**Enjoy the gravity! 🌌✨**