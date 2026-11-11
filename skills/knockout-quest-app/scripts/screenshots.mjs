// Takes section screenshots of the example page with headless Chrome over the DevTools Protocol.
// No dependencies: Node 22+ (global fetch + WebSocket) and an installed Chrome/Chromium/Edge.
// Serves the example folder over a tiny local HTTP server so the video loops load like on a real site.
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
const PORT = 9336, HTTP = 8736;
const TYPES = { '.html': 'text/html', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.m4a': 'audio/mp4' };

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
const play = `(()=>{const b=document.querySelector('[data-act=walk]');for(let i=0;i<4;i++)b.click();document.querySelectorAll('.glass')[7].click();return 1})()`;

await send('Page.enable'); await send('Runtime.enable');

// desktop 1440x900
await viewport(1440, 900);
await load();
await move(900, 400); await sleep(300); await move(1060, 330);
await shot('01-knockout', '0', 1200);
await shot('02-zoom', within('#top', .3), 1200);
await shot('03-hero', within('#top', .9), 1400);
await shot('04-story-activity', within('#app', .1), 1300);
await shot('05-story-inner-peace', within('#app', .6), 1300);
await shot('06-story-rewards', within('#app', .92), 1300);
await evalJs(play);
await shot('07-quests', top('#quests') + '+260', 1800);
await shot('08-outside', top('#outside') + '+520', 1400);
await shot('09-rhythms', top('#rhythms') + '+300', 1400);
await shot('10-breathe', top('#breathe'), 1200);
await evalJs("(()=>{document.querySelector('.tile[data-sound=rain]').setAttribute('aria-pressed','true');document.querySelector('#music').classList.add('playing');document.querySelectorAll('#genres button')[6].click();return 1})()");
await shot('11-sound', top('#sound') + '+300', 1600);
await shot('12-inside', top('#inside') + '+40', 1600);
await shot('13-privacy', top('.privacy'), 1200);
await shot('14-get', top('#get'), 1400);

// mobile 390x844
await viewport(390, 844, true);
await load();
await shot('15-mobile-knockout', '0', 1200);
await shot('16-mobile-hero', within('#top', .9), 1400);
await shot('17-mobile-story', within('#app', .35), 1300);
await evalJs(play);
await shot('18-mobile-quests', top('#quests') + '+420', 1800);
await shot('19-mobile-outside', top('#outside') + '+380', 1400);
await shot('20-mobile-sound', top('#music') + '-90', 1400);
await shot('21-mobile-get', top('#get'), 1400);

// regression: the knockout plays once. After scrolling past it and back, the top shows the finished hero
// (no reverse zoom, no ghosted hero, no shrunken word), even with a resize on the way.
await load();
await evalJs('scrollTo(0, innerHeight*.9)'); await sleep(400);
await viewport(390, 760, true); await sleep(300); await viewport(400, 844, true); await sleep(300);
await evalJs('scrollTo(0, document.querySelector("#app").offsetTop)'); await sleep(600);
await evalJs('scrollTo(0,0)'); await sleep(600);
const st = JSON.parse(await evalJs('JSON.stringify({done:document.documentElement.classList.contains("intro-done"),hero:getComputedStyle(document.querySelector("#hero")).opacity,knock:getComputedStyle(document.querySelector("#knock")).display})'));
console.log('scroll-back state', JSON.stringify(st));
if (!st.done || st.hero !== '1' || st.knock !== 'none') errs.push('scroll-back state wrong: ' + JSON.stringify(st));
await shot('22-mobile-scroll-back', '0', 400);
const sw = await evalJs('document.documentElement.scrollWidth');
console.log('mobile scrollWidth', sw, 'errors', JSON.stringify(errs));
ws.close(); chrome.kill(); server.close(); process.exit(errs.length ? 1 : 0);
