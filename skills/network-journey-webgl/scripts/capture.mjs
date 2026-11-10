// Headless Chrome over the DevTools Protocol, no dependencies (Node 22+ and an installed Chrome).
//   node scripts/capture.mjs review   [url] [outDir]  -> screenshots of every chapter, desktop + mobile, and console/CSP errors
//   node scripts/capture.mjs fallback [url]           -> canvas-only stills for the Static tier: static/fallback/0N.png + static/og.png
// Run against `npm run preview` (http://localhost:4173/). WebGL is rendered with SwiftShader.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const [, , mode = 'review', url = 'http://localhost:4173/', outArg] = process.argv;
const outDir = resolve(outArg ?? (mode === 'fallback' ? 'static/fallback' : '.captures'));
mkdirSync(outDir, { recursive: true });
const CHROME =
  process.env.CHROME ||
  { win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe', darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }[process.platform] ||
  'google-chrome';
const PORT = 9335;
const chrome = spawn(
  CHROME,
  ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'lanora-'))}`, '--hide-scrollbars', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-first-run', 'about:blank'],
  { stdio: 'ignore' }
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let targets = [];
for (let k = 0; k < 60; k++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
    if (targets.find((t) => t.type === 'page')) break;
  } catch {}
  await sleep(200);
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
const logs = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
  if (m.method === 'Runtime.exceptionThrown') logs.push('exception: ' + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).slice(0, 300));
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) logs.push(m.params.type + ': ' + m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
  if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) logs.push('log ' + m.params.entry.level + ': ' + m.params.entry.text.slice(0, 300));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const viewport = (w, h, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });

async function load() {
  await send('Page.navigate', { url });
  await sleep(4500);
  await evalJs('document.fonts.ready.then(() => 1)');
}
const at = (id, f) => `(()=>{const s=document.getElementById('${id}');return s.offsetTop+s.offsetHeight*${f}-innerHeight*0.35})()`;
async function scrollTo(expr) {
  await evalJs(`(async()=>{window.scrollTo(0,${expr});window.dispatchEvent(new Event('scroll'));await new Promise(r=>setTimeout(r,1800));return 1})()`);
}
async function shot(name, expr, clip) {
  await scrollTo(expr);
  const params = { format: 'png' };
  if (clip) params.clip = { ...clip, scale: 1 };
  const { result } = await send('Page.captureScreenshot', params);
  writeFileSync(join(outDir, name + '.png'), Buffer.from(result.data, 'base64'));
  console.log('saved', name);
}

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
const chapters = [['hero', 0], ['discovery', 0.6], ['devices', 0.5], ['ports', 0.6], ['security', 0.55], ['reports', 0.6], ['local', 0.6], ['final', 0.6]];

if (mode === 'fallback') {
  await viewport(1600, 1000);
  await load();
  // hide every HTML layer through the CSSOM (allowed by the page's CSP), keep only the canvas
  await evalJs(`(()=>{document.querySelectorAll('main,footer,.hud,.drawer,.tags,.leaders,.vignette,.fx,.skip').forEach(e=>e.style.visibility='hidden');return 1})()`);
  for (const [k, [sec, f]] of chapters.entries()) await shot(`0${k + 1}`, k === 0 ? '0' : at(sec, f));
  await viewport(1200, 630);
  await shot('og-raw', '0');
} else {
  await viewport(1440, 900);
  await load();
  for (const [k, [sec, f]] of chapters.entries()) await shot(`d${k + 1}-${sec}`, k === 0 ? '0' : at(sec, f));
  await evalJs(`(()=>{document.querySelector('#discovery .devlist button')?.click();return 1})()`);
  await shot('d9-panel', at('discovery', 0.6));
  await viewport(390, 844, true);
  await load();
  for (const [k, [sec, f]] of [chapters[0], chapters[3], chapters[4], chapters[7]].entries()) await shot(`m${k + 1}-${sec}`, k === 0 ? '0' : at(sec, f));
}
console.log(logs.length ? logs.join('\n') : 'no console errors or CSP violations');
ws.close();
chrome.kill();
