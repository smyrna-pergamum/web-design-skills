// Takes section screenshots of the example page with headless Chrome over the DevTools Protocol.
// No dependencies: Node 22+ (global fetch + WebSocket) and an installed Chrome/Chromium/Edge.
// Usage (from the skill folder): node scripts/screenshots.mjs example/index.html screenshots
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
const PORT = 9334;
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
async function load(lang, query = '') {
  await send('Page.navigate', { url: pathToFileURL(htmlPath).href + query });
  await sleep(2400);
  await evalJs(`(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';document.querySelector('.lang [data-lang=${lang}]').click();document.querySelectorAll('.reveal').forEach(r=>r.classList.add('in'));return 1})()`);
  await sleep(500);
}
async function shot(name, scrollExpr, wait = 900) {
  await evalJs(`(async()=>{window.scrollTo(0,${scrollExpr});await new Promise(r=>setTimeout(r,${wait}));return 1})()`);
  await sleep(300);
  const { result } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(outDir, name + '.png'), Buffer.from(result.data, 'base64'));
  console.log('saved', name);
}
const top = sel => `document.querySelector('${sel}').getBoundingClientRect().top+scrollY`;
// scroll position for a given progress of the aperture story
const at = p => `(document.getElementById('how').offsetTop+(document.getElementById('how').offsetHeight-innerHeight)*${p})`;

await send('Page.enable');
await viewport(1440, 900);
await load('en');
await shot('01-hero', '0');
await shot('02-aperture-open', at(.06));
await shot('03-target', at(.27));
await shot('04-findings', at(.5));
await shot('05-analysis', at(.75));
await shot('06-report', at(.9));
await shot('07-close', at(.995));
await shot('08-editions-android', top('#editions') + '-64');
await evalJs(`(()=>{document.querySelector('[data-ed=windows]').click();return 1})()`);
await shot('09-editions-windows', top('#editions') + '+150');
await shot('10-ai', top('#ai') + '-64');
await shot('11-sources', top('#sources') + '-64');
await shot('12-scope', top('#scope') + '-64');
await shot('13-install', top('.dl') + '-40');
await shot('14-footer', 'document.body.scrollHeight-innerHeight');
await load('tr');
await shot('15-hero-tr', '0');
await shot('16-analysis-tr', at(.75));
await load('en', '?motion=reduce');
await shot('17-reduced-motion', top('#how') + '+20');
await viewport(390, 844, true);
await load('en');
await shot('18-mobile-hero', '0');
await shot('19-mobile-findings', at(.55));
await shot('20-mobile-analysis', at(.76));
await shot('21-mobile-report', at(.9));
await shot('22-mobile-editions', top('#edDiagram') + '-120');
ws.close(); chrome.kill();
