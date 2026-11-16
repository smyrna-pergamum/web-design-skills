// Takes section screenshots of the example page with headless Chrome over the DevTools Protocol.
// No dependencies: Node 22+ (global fetch + WebSocket) and an installed Chrome/Chromium/Edge.
// Serves the example folder over a tiny local HTTP server so the photos load like on a real site.
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
const PORT = 9334, HTTP = 8734;
const TYPES = { '.html': 'text/html', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

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
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
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
async function load(hash = '#en') {
  await send('Page.navigate', { url: `http://127.0.0.1:${HTTP}/${hash}` });
  await sleep(2500);
  await evalJs(`(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';
    document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));return 1})()`);
}
async function shot(name, scrollExpr, wait = 900) {
  await evalJs(`(async()=>{window.scrollTo(0,${scrollExpr});return 1})()`);
  await sleep(wait);
  const { result } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(outDir, name + '.png'), Buffer.from(result.data, 'base64'));
  console.log('saved', name);
}
const top = sel => `document.querySelector('${sel}').getBoundingClientRect().top+scrollY`;
const click = sel => evalJs(`(()=>{document.querySelector('${sel}').click();return 1})()`);
const move = (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });

await send('Page.enable');
await viewport(1440, 900);
await load('#en');
await shot('02-consent', '0', 300);
await click('#ckNecBtn'); await move(820, 300); await sleep(900);
await shot('01-hero', '0');
await click('[data-face="2"]'); await move(600, 520); await sleep(1200);
await shot('03-cube-turned', '0');
await click('[data-face="0"]');
await evalJs(`(()=>{window.scrollTo(0,${top('#wege')}-40);document.querySelector('[data-pass="1"]').click();return 1})()`); await sleep(900);
await shot('04-learning-pass', top('#wege') + '-40');
await shot('05-week', top('#woche') + '+40');
await shot('06-finder-chat', top('#finder') + '+120');
await evalJs(`(()=>{const s=document.getElementById('f-program');s.value='p2';s.dispatchEvent(new Event('change'));return 1})()`);
await shot('07-application', top('#anmelden') + '+20');
await shot('08-faq', top('#faq') + '-20');
await shot('09-footer', 'document.body.scrollHeight-innerHeight');
await evalJs(`(()=>{window.scrollTo(0,0);document.querySelector('.app-chip').click();return 1})()`); await sleep(500);
await shot('10-app-dialog', '0', 300);
await click('#appClose');
await load('#ar'); await move(700, 350); await sleep(700);
await shot('11-rtl-arabic', '0');
await viewport(390, 844, true);
await load('#tr');
await shot('14-mobile-consent', '0', 300);
await click('#ckNecBtn'); await sleep(600);
await shot('12-mobile-hero', '0');
await shot('13-mobile-passes', top('#wege') + '-20');
await evalJs(`(()=>{try{localStorage.removeItem('ls-consent');localStorage.removeItem('ls-lang')}catch(e){}return 1})()`);
ws.close(); chrome.kill(); server.close();
