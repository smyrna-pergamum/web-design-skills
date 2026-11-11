// Takes section screenshots of the example page with headless Chrome over the DevTools Protocol.
// No dependencies: Node 22+ (global fetch + WebSocket) and an installed Chrome/Chromium/Edge.
// Serves the example folder over a tiny local HTTP server so the CSS imports, fonts and videos load like on a real site.
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
const PORT = 9337, HTTP = 8737;
const TYPES = { '.html': 'text/html', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.m4a': 'audio/mp4', '.css': 'text/css', '.woff2': 'font/woff2' };

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
async function load() {
  await send('Page.navigate', { url: `http://127.0.0.1:${HTTP}/` });
  await sleep(2500);
  await evalJs(`(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';
    return 1})()`);
}
async function shot(name, scrollExpr, wait = 900) {
  await evalJs(`(async()=>{window.scrollTo(0,${scrollExpr});return 1})()`);
  await sleep(wait);
  const { result } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(outDir, name + '.png'), Buffer.from(result.data, 'base64'));
  console.log('saved', name);
}
const top = sel => `document.querySelector('${sel}').getBoundingClientRect().top+scrollY`;
const within = (sel, p) => `${top(sel)}+(document.querySelector('${sel}').offsetHeight-innerHeight)*${p}`;
const move = (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
const errs = [];
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });

await send('Page.enable'); await send('Runtime.enable');

// desktop 1440x900
await viewport(1440, 900);
await load();
await evalJs(`(()=>{const r=document.querySelector('#ba input');r.value=62;r.dispatchEvent(new Event('input'));return 1})()`);
await shot('01-hero', '0', 1400);
await shot('02-rail', top('#everything') + '-40', 1400);
await shot('03-try-edit', top('#try') + '-20', 1000);
await evalJs(`(()=>{document.querySelector('#t-ocr').click();['Turkish','German'].forEach(n=>[...document.querySelectorAll('.lang')].find(b=>b.textContent===n).click());return 1})()`);
await shot('04-try-ocr', top('#try') + '-20', 900);
await evalJs(`(()=>{document.querySelector('#t-redact').click();[...document.querySelectorAll('.rd')].slice(1,3).forEach(b=>b.click());return 1})()`);
await shot('05-try-redact', top('#try') + '-20', 900);
await evalJs(`(()=>{const i=document.querySelector('#specText');i.value='Seite drei, fertig.';i.dispatchEvent(new Event('input'));document.querySelectorAll('#dots button')[9].click();return 1})()`);
await shot('06-fonts', top('#type') + '-60', 1000);
await shot('07-bench', top('#bench') + '+40', 1400);
await shot('08-cards', top('.cards') + '-80', 1400);
await shot('09-close', top('#get'), 1200);

// mobile 390x844
await viewport(390, 844, true);
await load();
await shot('10-mobile-hero', '0', 1400);
await shot('11-mobile-rail', top('#everything') + '+80', 1200);
await shot('12-mobile-try', top('#try'), 1000);
await shot('13-mobile-fonts', top('#type') + '-40', 1000);
await shot('14-mobile-cards', top('.cards'), 1400);
const sw = await evalJs('document.documentElement.scrollWidth');
console.log('mobile scrollWidth', sw, 'errors', JSON.stringify(errs));
if (sw > 390) errs.push('horizontal scroll at 390px: ' + sw);
ws.close(); chrome.kill(); server.close(); process.exit(errs.length ? 1 : 0);
