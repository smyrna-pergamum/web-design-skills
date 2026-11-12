# Components: live globe flight film

Copy-ready pieces from `example/index.html`. Names match the reference build.

## 1. Tokens

```css
:root {
  --color-paper: oklch(13% 0.035 262);
  --color-ink: oklch(95% 0.02 85); --color-ink-2: oklch(84% 0.025 80); --color-muted: oklch(72% 0.03 250);
  --color-rule: oklch(95% 0.02 85 / 0.22);
  --color-accent: oklch(82% 0.14 72); --color-accent-2: oklch(88% 0.12 78); --color-accent-ink: oklch(16% 0.04 262);
  --color-shade: oklch(10% 0.03 262 / 0.62);
  --color-sun: oklch(80% 0.17 60); --color-sun-2: oklch(62% 0.16 40 / 0.6); --color-night: oklch(14% 0.05 270);
  --color-glass: oklch(13% 0.035 262 / 0.35); --color-gate: oklch(11% 0.03 262 / 0.82);
  --font-display: "Archivo", ui-sans-serif, system-ui, sans-serif;
}
/* Google Fonts: family=Archivo:ital,wdth,wght@0,62..125,200..600;1,62..125,200..500 */
.chapter__head { font: italic 200 clamp(1.875rem, 4.2vw, 3.75rem)/1.18 var(--font-display); font-stretch: 125%;
  text-transform: uppercase; text-shadow: 0 2px 30px var(--color-shade); }
```

## 2. Layers

```html
<div class="world" id="world" aria-hidden="true"></div>   <!-- Cesium draws here -->
<div class="sunset" aria-hidden="true"></div>              <!-- soft-light amber wash, opacity = --sun -->
<div class="dusk" aria-hidden="true"></div>                <!-- navy from the top, opacity = --night -->
<div class="veil" aria-hidden="true"></div>                <!-- shade behind the words -->
```

```css
.world { position: fixed; inset: 0; z-index: 0; background: var(--color-paper) url("assets/img/fallback.jpg") center / cover; }
.world .cesium-viewer, .world .cesium-viewer-cesiumWidgetContainer, .world .cesium-widget,
.world .cesium-widget canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.js.gl .world { background: var(--color-paper); }
.sunset { position: fixed; inset: 0; z-index: 1; pointer-events: none; mix-blend-mode: soft-light; opacity: var(--sun, .6);
  background: radial-gradient(90% 45% at 50% 42%, var(--color-sun) 0%, var(--color-sun-2) 40%, transparent 75%); }
.dusk { position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: calc(var(--night, 0) * .55);
  background: linear-gradient(to bottom, var(--color-night) 0%, transparent 45%); }
```

The Cesium widgets stylesheet is not needed; the four sizing rules above replace it.

## 3. Viewer, imagery and light

```js
const viewer = new Cesium.Viewer('world', {
  baseLayer: false, animation: false, timeline: false, baseLayerPicker: false, geocoder: false, homeButton: false,
  sceneModePicker: false, navigationHelpButton: false, fullscreenButton: false, infoBox: false, selectionIndicator: false,
  shouldAnimate: false, creditContainer: document.getElementById('credits'), msaaSamples: 4,
});
viewer.scene.screenSpaceCameraController.enableInputs = false;
const day = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  maximumLevel: 17, credit: new Cesium.Credit('Imagery © Esri, Maxar, Earthstar Geographics') }));
const night = viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
  url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png',
  maximumLevel: 8, credit: new Cesium.Credit('City lights: NASA Black Marble') }));
night.alpha = 0; night.brightness = 1.15;
viewer.scene.globe.enableLighting = false;          // graded by hand instead (see update)
viewer.scene.highDynamicRange = false;              // avoids white glare after sunset
viewer.scene.fog.density = 0.00018;
```

Per frame, with `u` the route position 0..1:

```js
Cesium.JulianDate.addSeconds(T0, span * smooth(u), viewer.clock.currentTime); // sky and sun follow the flight
const dusk = smooth(clamp((u - 0.2) / 0.6, 0, 1));
day.brightness = lerp(1.0, 0.16, dusk); day.saturation = lerp(1.1, 0.55, dusk); day.gamma = lerp(1, 1.25, dusk);
night.alpha = 0.55 * smooth(clamp((u - 0.55) / 0.35, 0, 1));
root.style.setProperty('--sun', Math.sin(Math.PI * clamp(u * 1.25 + 0.15, 0, 1)));
root.style.setProperty('--night', dusk);
```

Pick `T0`/`T1` so the route flies **into** the sunset (in December the sun sets in the south-west).

## 4. Route with even speed

```js
const ROUTE = [[41.175, 29.085, 700], /* … */ [39.133, 27.184, 650]];   // lat, lon, metres
function crPoint(i, f) { /* Catmull-Rom between ROUTE[i] and ROUTE[i+1] */ }
const SAMPLES = []; // 1600 samples with cumulative length → s.u = len / total
function at(u) { /* binary search SAMPLES by u, lerp */ }
function headingAt(u) { const a = at(u - .0015), b = at(u + .0015);
  return Math.atan2((b[1] - a[1]) * Math.cos(a[0] * D2R), b[0] - a[0]); }   // compass radians
```

Chapters own fixed shares of the route (`CH_ROUTE = [0, .16, .5, .7, .86, 1]`), so a place line is always true.

## 5. Chase camera

```js
const back = sp * 1.9 + 16, up = sp * 0.38 + 4;           // sp = wingspan (m)
const dN = -Math.cos(h) * back - Math.sin(h) * side, dE = -Math.sin(h) * back + Math.cos(h) * side;
camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(lon + dE / (111320 * Math.cos(lat * D2R)), lat + dN / 111320, alt + up),
  orientation: new Cesium.HeadingPitchRoll(h, -0.13, roll * 0.3),
});
```

Lerp `back` to a negative value (inside the nose) for the point-of-view chapter and hide the model once past 40 %.

## 6. Golden trail

```js
viewer.entities.add({ polyline: { positions, width: 9, arcType: Cesium.ArcType.NONE,
  material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.22, taperPower: 1,
    color: Cesium.Color.fromCssColorString('#ffbe5c').withAlpha(0.95) }) } });
```

## 7. Gate with a real loading figure

```js
let loadedFrames = 0;
function gateProgress() {                                   // call every frame until ready
  const el = (performance.now() - bootAt) / 1000;
  loadedFrames = globe.tilesLoaded ? loadedFrames + 1 : 0;
  const est = loadedFrames > 20 && el > 1.5 ? 100 : Math.min(94, Math.round(94 * (1 - Math.exp(-el / 2.2))));
  if (est > shownPct) show(est);
  if (est === 100) setTimeout(setReady, 350);
}
setTimeout(setReady, 14000);                                // never keep anyone at the door
```

`globe.tileLoadProgressEvent` does not fire reliably with these providers; `globe.tilesLoaded` does.

```html
<script>document.documentElement.classList.add('js'); if (!location.hash) document.documentElement.classList.add('gated');</script>
```

```css
.js.gated main, .js.gated .strip, .js.gated .top { visibility: hidden; }
.js .gate.is-gone { opacity: 0; visibility: hidden; transition: opacity 900ms, visibility 0s 900ms; }
```

## 8. Chapter fade

```js
sections.forEach((s, i) => {
  const r = s.getBoundingClientRect(), vh = innerHeight;
  const enter = clamp((vh - r.top) / (vh * .5), 0, 1);
  const leave = i === last ? 1 : clamp((r.bottom - vh * .55) / (vh * .45), 0, 1);
  const off = r.top >= vh || r.bottom <= 0;                 // out of view: leave it visible
  s.querySelector('.chapter__text').style.setProperty('--o', off ? 1 : Math.min(enter, leave));
});
```

```css
.chapter { min-height: 220vh; }
.chapter__text { position: sticky; top: clamp(88px, 15vh, 160px); text-align: center; }
.js.gl .chapter__text { opacity: var(--o, 1); transform: translateY(calc((1 - var(--o, 1)) * -10px)); }
```

## 9. Sound from scroll speed

```js
const v = Math.abs(shown - lastShown) / dt;                  // route units per second
rush = lerp(rush, clamp(v * 18, 0, 1), 1 - Math.exp(-dt * 3));
loops.prop.g.gain.setTargetAtTime(0.35 + rush * 0.4, t, 0.3);
loops.prop.src.playbackRate.setTargetAtTime(0.85 + rush * 0.35, t, 0.3);
loops.wind.g.gain.setTargetAtTime(0.12 + rush * 0.5, t, 0.3);
```

Loops start silent; the master gain rises only after *Enter the sky* or *Sound on*.
