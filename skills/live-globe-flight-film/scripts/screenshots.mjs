// Takes chapter screenshots of the example page with headless Chrome over the DevTools Protocol.
// The page streams real map tiles from the internet, so every shot waits for the globe to finish loading.
// No dependencies: Node 22+ (global fetch + WebSocket) and an installed Chrome/Chromium/Edge.
// Serves the example folder over a tiny local HTTP server so the photos, hash links and localStorage behave like on a real site.
// Usage: node scripts/screenshots.mjs example screenshots
//        CHROME="/path/to/chrome" node scripts/screenshots.mjs ...
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync, mkdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve, extname, normalize } from 'node:path';

const [,, rootArg = 'example', outArg = 'screenshots'] = process.argv;
const root = resolve(rootArg), outDir = resolve(outArg);
mkdirSync(outDir, { recursive: true });
const CHROME = process.env.CHROME || {
  win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}[process.platform] || 'google-chrome';
const PORT = 9341, HTTP = 8741;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.m4a': 'audio/mp4', '.css': 'text/css', '.woff2': 'font/woff2' };

// minimal static server (supports Range so <video> can seek and loop)
const server = createServer((req, res) => {
  let p = normalize(join(root, decodeURIComponent(req.url.split('?')[0])));
  if (!p.startsWith(root)) { res.writeHead(403).end(); return; }
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404).end(); return; }
  const buf = readFileSync(p), type = TYPES[extname(p)] || 'application/octet-stream';
  const m = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
  if (m) {
    const a = +m[1], b = m[2] ? +m[2] : buf.length - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${a}-${b}/${buf.length}`, 'Accept-Ranges': 'bytes', 'Content-Length': b - a + 1 });
    res.end(buf.subarray(a, b + 1));
  } else { res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': buf.length }); res.end(buf); }
}).listen(HTTP);

const profile = mkdtempSync(join(tmpdir(), 'shots-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--no-first-run', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', 'about:blank'], { stdio: 'ignore' });
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

const viewport = (w, h, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
const errs = [];
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });
await send('Page.enable'); await send('Runtime.enable');

async function load(hash = '#c') {
  await send('Page.navigate', { url: `http://127.0.0.1:${HTTP}/?lang=en&n=${Date.now()}${hash}` });
  await sleep(1500);
  await evalJs(`(async()=>{try{localStorage.setItem('skyroam.site.lang','en')}catch{}; await document.fonts.ready; return 1})()`);
}
// wait until the globe has drawn every tile in view (or give up after a while)
const settle = (min = 4000, max = 20000) => evalJs(`(async()=>{const t0=performance.now();
  await new Promise(r=>setTimeout(r,${min}));
  while(performance.now()-t0<${max}){ if(window.skyroamSite?.viewer.scene.globe.tilesLoaded) break; await new Promise(r=>setTimeout(r,300)); }
  await new Promise(r=>setTimeout(r,800)); return 1})()`);
async function snap(name) {
  const { result } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(outDir, name + '.png'), Buffer.from(result.data, 'base64'));
  console.log('saved', name);
}
// scroll to a point inside chapter n (1-5): f = 0..1 through that chapter
const go = (n, f) => evalJs(`(()=>{const s=document.querySelector('#ch${n}');scrollTo(0,s.offsetTop+s.offsetHeight*${f}-innerHeight*0.3);return 1})()`);

async function run(prefix, w, h, mobile, list) {
  await viewport(w, h, mobile);
  await load('');
  await evalJs(`(async()=>{for(let i=0;i<60&&!document.querySelector('.gate.is-ready');i++) await new Promise(r=>setTimeout(r,500));return 1})()`);
  await sleep(800);
  await snap(prefix + list[0]);
  await load('#c');
  for (const [name, n, f] of list.slice(1)) { await go(n, f); await settle(); await snap(prefix + name); }
}

await run('', 1440, 900, false, ['01-gate', ['02-take-off', 1, 0.35], ['03-century', 2, 0.45], ['04-cockpit', 3, 0.5], ['05-lights', 4, 0.55], ['06-take-off-anywhere', 5, 0.9]]);
await run('', 390, 844, true, ['11-mobile-gate', ['12-mobile-take-off', 1, 0.35], ['13-mobile-century', 2, 0.6], ['14-mobile-end', 5, 0.9]]);
const sw = await evalJs('document.documentElement.scrollWidth');
console.log('mobile scrollWidth', sw, 'errors', JSON.stringify(errs));
if (sw > 390) errs.push('horizontal scroll at 390px: ' + sw);
ws.close(); chrome.kill(); server.close(); process.exit(errs.length ? 1 : 0);
