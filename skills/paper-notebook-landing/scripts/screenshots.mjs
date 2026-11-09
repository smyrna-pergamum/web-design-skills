// Takes section screenshots of the example page with headless Chrome over the DevTools Protocol.
// No dependencies: Node 22+ (global fetch + WebSocket) and an installed Chrome/Chromium/Edge.
// Usage: node scripts/screenshots.mjs example/index.html screenshots
//        CHROME="/path/to/chrome" node scripts/screenshots.mjs ...
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [,, htmlArg = 'example/index.html', outArg = 'screenshots'] = process.argv;
const htmlPath = resolve(htmlArg), outDir = resolve(outArg);
const CHROME = process.env.CHROME || {
  win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}[process.platform] || 'google-chrome';
const PORT = 9333;
const profile = mkdtempSync(join(tmpdir(), 'shots-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let targets;
for (let i = 0; i < 50; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (targets.find(t => t.type === 'page')) break; } catch {}
  await sleep(200);
}
const page = targets.find(t => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

async function viewport(w, h, mobile = false) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
}
async function load(lang) {
  await send('Page.navigate', { url: pathToFileURL(htmlPath).href });
  await sleep(1500);
  await evalJs(`(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';document.getElementById('lang-${lang}').click();return 1})()`);
  await sleep(400);
}
async function shot(name, scrollExpr) {
  await evalJs(`(async()=>{window.scrollTo(0,${scrollExpr});await new Promise(r=>setTimeout(r,500));return 1})()`);
  await sleep(300);
  const { result } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(outDir, name + '.png'), Buffer.from(result.data, 'base64'));
  console.log('saved', name);
}
const top = sel => `document.querySelector('${sel}').getBoundingClientRect().top+scrollY`;
const op = f => `${top('#opener')}+(document.getElementById('opener').offsetHeight-innerHeight)*${f}`;

await send('Page.enable');
await viewport(1440, 900);
await load('tr');
await shot('01-hero', '0');
await shot('02-notebook-travel', `${top('#opener')}*0.5`);
await shot('03-notebook-opening', op(0.3));
await shot('04-notebook-open', op(0.85));
await shot('05-sticky-notes', top('.stickies'));
await shot('06-scene-desk-panel', top('#platform'));
await shot('07-scene-sky-four-stages', top('#adimlar'));
await shot('08-scene-campus-advisor', top('#danisman'));
await shot('09-doodle-offers', top('#pazar') + '+40');
await shot('10-visa-lined-paper', top('#vize'));
await shot('11-guide-notebooks', top('#rehber') + '+40');
await shot('12-journey-comic', top('#hikaye') + '+20');
await shot('13-faq-footer', 'document.body.scrollHeight-innerHeight');
await load('en');
await shot('14-hero-en', '0');
await load('de');
await shot('15-hero-de', '0');
await shot('16-comic-de', top('#hikaye') + '+20');
await viewport(390, 844, true);
await load('tr');
await shot('17-mobile-hero', '0');
await shot('18-mobile-notebook-open', op(0.85));
await shot('19-mobile-comic', top('#hikaye') + '+20');
await evalJs(`(()=>{try{localStorage.removeItem('atlasio-lang')}catch(e){}return 1})()`);
ws.close(); chrome.kill();
