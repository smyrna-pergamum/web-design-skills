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
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
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
  await sleep(2200);
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

// scroll position for a given progress of the scroll-to-lock sequence
const seqAt = p => `(document.getElementById('seq').offsetHeight-innerHeight)*${p}`;
const reduced = on => send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: on ? 'reduce' : 'no-preference' }] });

await send('Page.enable');
await viewport(1440, 900);
await load('en');
await shot('01-hero', '0');
await shot('02-lock-approach', seqAt(.38));
await shot('03-lock-closing', seqAt(.62));
await shot('04-lock-sealed', seqAt(.86));
await shot('05-values', top('#values') + '-68');
await shot('06-features', top('#features') + '-68');
await shot('07-how-it-works', top('#how') + '+40');
await shot('08-security', top('#security') + '+60');
await shot('09-security-spec', top('.spec') + '-160');
await evalJs(`(()=>{document.querySelectorAll('#tabs [role=tab]')[3].click();return 1})()`);
await shot('10-app-preview', top('#preview') + '+40');
await shot('11-download', top('#download') + '+40');
await evalJs(`(()=>{document.querySelectorAll('.faq details')[1].open=true;return 1})()`);
await shot('12-docs-faq', top('#docs') + '+40');
await shot('13-open-source-footer', 'document.body.scrollHeight-innerHeight');
await load('tr');
await shot('14-hero-tr', '0');
await shot('15-lock-sealed-tr', seqAt(.86));
await shot('16-security-tr', top('#security') + '+60');
await reduced(true); await load('en');
await shot('17-reduced-motion', '0');
await reduced(false);
await viewport(390, 844, true);
await load('en');
await shot('18-mobile-hero', '0');
await shot('19-mobile-sealed', seqAt(.86));
await shot('20-mobile-values', top('#values') + '-68');
await shot('21-mobile-download', top('#download') + '+20');
await evalJs(`(()=>{try{localStorage.removeItem('kilit-site-lang')}catch(e){}return 1})()`);
ws.close(); chrome.kill();
