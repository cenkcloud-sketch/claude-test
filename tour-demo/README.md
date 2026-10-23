# Scroll Tour Demo

One-page demo: a scroll-driven 3D walkthrough (Three.js) of four rooms, with a section below that embeds a real 360° tour by link.

- Open `index.html` in a browser (no server needed). `tour.js` is the bundled build.
- Edit `src/main.js`, then rebuild: `npm i && npx esbuild src/main.js --bundle --minify --outfile=tour.js --target=es2019`
- Check screenshots: `node shoot.mjs ./shots` (needs Chromium + `playwright-core`).
- Skill used: `.claude/skills/3d-virtual-tour` (MengTo/Skills, MIT).
