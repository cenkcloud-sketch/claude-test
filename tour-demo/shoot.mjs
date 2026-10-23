import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const out = process.argv[2] || '/tmp/shots';
import { mkdirSync } from 'fs'; mkdirSync(out, { recursive: true });
for (const [name, vp] of [['desktop', { width: 1280, height: 720 }], ['phone', { width: 390, height: 844 }]]) {
  const pg = await b.newPage({ viewport: vp });
  const errs = []; pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + process.cwd() + '/index.html');
  for (const p of [0, 0.33, 0.66, 1]) {
    await pg.evaluate(p => { const t = document.getElementById('tour'); scrollTo(0, p * (t.offsetHeight - innerHeight)); __tour.setProgress(p); }, p);
    await pg.waitForTimeout(500);
    await pg.screenshot({ path: `${out}/${name}-${Math.round(p * 100)}.png` });
  }
  console.log(name, 'errors:', errs.length ? errs : 'none');
}
await b.close();
