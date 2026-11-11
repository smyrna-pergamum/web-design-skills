# Components — broadsheet daily news

Copy-ready pieces from `example/index.html`.

## 1. Tokens and fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;0,6..72,800;1,6..72,400;1,6..72,600&family=Libre+Franklin:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
:root{
  --ink:#191919;--ink-2:#444;--muted:#666;--faint:#8a8780;--line:#d5d3ce;--line-strong:#222;
  --paper:#fffefa;--paper-2:#f0f1eb;--paper-3:#e9e6df;--brief-line:#e4e4dc;--accent:#285c53;--accent-soft:#dde9df;--on-ink:#fffefa;
  --serif:"Newsreader",Georgia,"Times New Roman",serif;--sans:"Libre Franklin",Arial,Helvetica,sans-serif;
  --article-size:18px;
}
body{background:var(--paper);color:var(--ink);font-family:var(--serif);font-optical-sizing:auto}
```

## 2. Masthead and nav

```html
<div class="masthead">
  <div class="dateblock"><strong id="today">Wednesday, 11 November 2026</strong><span>For making sense of today's world.</span></div>
  <div><a class="brand" href="#" id="home-logo">Today's Gazette</a><div class="tagline">A little closer to the world.</div></div>
  <div class="issue">DIGITAL EDITION<span>News, opinion and life</span></div>
</div>
<nav class="nav" id="nav" aria-label="Sections">
  <button class="active" data-category="All" aria-pressed="true">Front page</button>
  <button data-category="World" aria-pressed="false">World</button>
</nav>
```

```css
.masthead{text-align:center;padding:7px 0 23px;display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:15px}
.brand{font:800 clamp(40px,5.6vw,76px)/1 var(--serif);letter-spacing:-.045em;font-variation-settings:"opsz" 72}
.tagline{font:italic 13px var(--serif);margin-top:12px}
.nav{display:flex;justify-content:center;gap:29px;min-height:44px;border-top:1px solid var(--line-strong);
  border-bottom:3px double var(--line-strong);font:500 12px var(--sans);overflow:auto;scrollbar-width:none}
.nav button{white-space:nowrap;background:none;border:0;padding:14px 0 11px;position:relative}
.nav button.active{font-weight:700}
.nav button.active:after{content:'';position:absolute;left:0;right:0;bottom:5px;height:2px;background:var(--accent)}
@media(max-width:760px){
  .masthead{display:block}
  .nav{justify-content:flex-start;gap:24px}
  .nav.menu-open{flex-wrap:wrap;gap:0;overflow:visible}
  .nav.menu-open button{width:33.33%;text-align:left}
}
```

```js
document.querySelector('#today').textContent =
  new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
```

## 3. Front grid with rules

```css
.front-grid{display:grid;grid-template-columns:minmax(0,3.15fr) minmax(220px,1fr);gap:25px}
.main-column{padding-right:25px;border-right:1px solid var(--line)}
.lead{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.48fr);gap:25px}
.eyebrow{font:700 9px var(--sans);letter-spacing:1.3px;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
.headline{font-size:36px;line-height:1.06;letter-spacing:-.03em;margin:0 0 15px;font-weight:700;text-wrap:balance}
.deck{font-size:15px;line-height:1.55;color:var(--ink-2)}
.meta{display:block;font:9px var(--sans);letter-spacing:.45px;color:var(--muted);text-transform:uppercase;margin-top:13px}
.lead img{height:340px;filter:saturate(.74);transition:filter .3s}
.lead figure:hover img{filter:saturate(1)}
.secondary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:24px;border-top:1px solid var(--line-strong);padding-top:19px}
.secondary-grid article{padding:0 17px;border-right:1px solid var(--line)}
.secondary-grid article:first-child{padding-left:0}
.secondary-grid article:last-child{padding-right:0;border:0}
.section-rule{border-top:3px double var(--line-strong);margin-top:32px;padding-top:15px}
```

## 4. Opinion sidebar

```html
<article class="opinion">
  <div class="author">SELIN YILMAZ</div>
  <h3 class="story-title"><a href="#story/slow" data-story="slow">Slowing down is not falling behind the world.</a></h3>
  <div class="opinion-foot"><span class="meta">EVERYDAY LIFE · 4 MIN</span><span class="avatar" aria-hidden="true">SY</span></div>
</article>
```

```css
.opinion{padding:0 0 18px;margin-bottom:18px;border-bottom:1px solid var(--line)}
.opinion .story-title{font-size:23px;font-style:italic;font-weight:600}
.opinion-foot{display:flex;align-items:center;justify-content:space-between;gap:10px}
.avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--paper-3);font:italic 15px var(--serif)}
.brief{padding:15px;background:var(--paper-2);border:1px solid var(--brief-line)}
```

## 5. Numbered reading list

```html
<ol class="ranked">
  <li class="rank-item"><h3><a href="#story/ai" data-story="ai">What is left for people in the age of AI?</a></h3></li>
</ol>
```

```css
.ranked{display:grid;grid-template-columns:1fr 1fr;gap:0 28px;margin:0;padding:0;list-style:none;counter-reset:rank}
.rank-item{display:flex;gap:15px;padding:0 0 14px;margin-bottom:14px;border-bottom:1px solid var(--line);counter-increment:rank}
.rank-item:before{content:counter(rank,decimal-leading-zero);font:italic 34px/1 var(--serif);color:var(--faint);width:26px;flex-shrink:0}
```

## 6. Stories as data, one click router

```js
const photos = { city: 'assets/city.jpg', culture: 'assets/library.jpg' };
const stories = [
  { id: 'cities', category: 'News', title: 'Cities are changing. What about the way we live together?',
    deck: 'Greener streets, walkable neighbourhoods…', author: 'Deniz Aksoy', minutes: 8, image: 'city',
    paragraphs: ['…', '…'] },
  /* … */
];
document.addEventListener('click', (e) => {
  const story = e.target.closest('[data-story]'); if (story) { e.preventDefault(); openStory(story.dataset.story); return; }
  const cat = e.target.closest('[data-category]'); if (cat) filterCategory(cat.dataset.category);
  const filter = e.target.closest('[data-filter]'); if (filter) filterCategory(filter.dataset.filter);
  const query = e.target.closest('[data-query]'); if (query) search(query.dataset.query);
});
```

Search with a highlighted match (escape first, then mark):

```js
function escapeHTML(t) { return String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function highlight(text, q) {
  const i = text.toLowerCase().indexOf(q); if (!q || i < 0) return escapeHTML(text);
  return escapeHTML(text.slice(0, i)) + '<mark>' + escapeHTML(text.slice(i, i + q.length)) + '</mark>' + escapeHTML(text.slice(i + q.length));
}
function search(query) {
  const q = query.trim().toLowerCase(); if (!q) return showHome();
  renderResults(stories.filter((s) => [s.title, s.deck, s.category, s.author, s.tags || ''].join(' ').toLowerCase().includes(q)),
    'SEARCH: ' + query.trim(), q);
}
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !dialog.open && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); toggleSearch(true); }
});
```

## 7. Reader dialog with progress, text size and hash routing

```html
<dialog id="article-dialog" aria-labelledby="article-title">
  <div class="modal-toolbar">
    <span class="brand-mini">Today's Gazette</span>
    <div class="modal-actions">
      <button class="icon-btn" id="text-smaller" aria-label="Smaller text">A−</button>
      <button class="icon-btn" id="text-larger" aria-label="Larger text">A+</button>
      <button class="icon-btn" id="copy-link">Copy link</button>
      <button class="icon-btn" id="save-story" aria-pressed="false">Save +</button>
      <button class="icon-btn" id="close-dialog" aria-label="Close the story">Close ×</button>
    </div>
    <span class="progress" id="progress" aria-hidden="true"></span>
  </div>
  <article id="article-content" class="article-body"></article>
</dialog>
```

```css
dialog{padding:0;border:1px solid var(--faint);background:var(--paper);max-width:760px;width:calc(100% - 32px);max-height:90vh;overscroll-behavior:contain}
dialog::backdrop{background:rgba(20,20,20,.62)}
.modal-toolbar{position:sticky;top:0;z-index:1;display:flex;justify-content:space-between;align-items:center;background:var(--paper);border-bottom:1px solid var(--line);padding:10px 16px 10px 22px}
.progress{position:absolute;left:0;bottom:-1px;width:100%;height:2px;background:var(--accent);transform-origin:left;transform:scaleX(0)}
.article-body p{font-size:var(--article-size);line-height:1.7}
.article-body .first:first-letter{float:left;font-size:4.2em;line-height:.8;padding:.06em .08em 0 0;font-weight:700}
```

```js
function openStory(id, fromHash) {
  const s = stories.find((x) => x.id === id); if (!s) return;
  if (!dialog.open) returnFocus = document.activeElement;
  /* fill #article-content with escaped strings, first paragraph gets class="first" */
  if (!dialog.open) dialog.showModal();
  document.body.style.overflow = 'hidden'; dialog.scrollTop = 0; updateProgress(); closeBtn.focus();
  if (!fromHash && location.hash !== '#story/' + id) history.pushState(null, '', '#story/' + id);
}
function closeStory(fromHash) {
  if (!dialog.open) return;
  dialog.close(); document.body.style.overflow = '';
  if (!fromHash && location.hash.startsWith('#story/')) history.pushState(null, '', location.pathname + location.search);
  returnFocus?.focus();
}
function updateProgress() {
  const max = dialog.scrollHeight - dialog.clientHeight;
  progress.style.transform = 'scaleX(' + (max > 0 ? dialog.scrollTop / max : 1) + ')';
}
function route() { const m = location.hash.match(/^#story\/([\w-]+)$/); if (m) openStory(m[1], true); else closeStory(true); }
dialog.addEventListener('scroll', updateProgress, { passive: true });
dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeStory(); });
addEventListener('popstate', route); route();
function setArticleSize(n) {
  articleSize = Math.min(24, Math.max(15, n)); dialog.style.setProperty('--article-size', articleSize + 'px');
  try { localStorage.setItem('gazette-text-size', articleSize); } catch (e) {}
}
```

## 8. Saved stories with a count

```js
let saved = [];
try { const v = JSON.parse(localStorage.getItem('gazette-saved') || '[]'); if (Array.isArray(v)) saved = v.filter((x) => typeof x === 'string'); } catch (e) {}
saveBtn.onclick = () => {
  const i = saved.indexOf(currentStory.id); if (i >= 0) saved.splice(i, 1); else saved.push(currentStory.id);
  try { localStorage.setItem('gazette-saved', JSON.stringify(saved)); notify(i >= 0 ? 'Removed from your reading list.' : 'Added to the reading list in this browser.'); }
  catch (e) { notify('Saved for this visit. The browser does not allow lasting storage.'); }
  savedCount.textContent = saved.length || '';
};
```

```css
.count{display:inline-grid;place-items:center;min-width:17px;height:17px;margin-left:6px;padding:0 4px;border-radius:9px;background:var(--accent);color:var(--on-ink);font-size:9px}
.count:empty{display:none}
```

## 9. Print

```css
@media print{
  .topline,.nav,.trend,.newsletter,.modal-toolbar,.toast,.search-panel{display:none!important}
  dialog[open]{position:static;max-width:100%;max-height:none;width:100%;border:0}
  body:has(dialog[open])>.shell{display:none}
  img{break-inside:avoid;filter:none!important}
}
```
