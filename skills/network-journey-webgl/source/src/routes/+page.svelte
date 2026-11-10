<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import Hud from '$lib/components/Hud.svelte';
  import DevicePanel from '$lib/components/DevicePanel.svelte';
  import FindingCard from '$lib/components/FindingCard.svelte';
  import Brackets from '$lib/components/Brackets.svelte';
  import { DEVICES, FINDINGS, NETWORK, type Device } from '$lib/content/sample-network';
  import { LINKS, META, RELEASE, SITE_URL } from '$lib/config';
  import { chapter } from '$lib/motion/state';
  import { randomLine, scramble } from '$lib/motion/scramble';
  import { setSound, tick } from '$lib/motion/audio';
  import { detectTier, type Tier } from '$lib/scene/quality';
  import type { Stage } from '$lib/scene/Stage';
  import type { FinalShape, ReportShape } from '$lib/scene/objects/particles';

  const NAMES = ['Hero', 'Discovery', 'Devices', 'Ports', 'Security', 'Reports', 'Local-first', 'Explore'];

  let current = $state(0);
  let tier = $state<Tier | null>(null);
  let device = $state<Device | null>(null);
  let probed = $state(0);
  let found = $state(0);
  let sound = $state(false);
  let reduced = $state(false);
  let loading = $state('');
  let report = $state<ReportShape>('pdf');
  let finalDest = $state<FinalShape>('github');
  let glitch = 0;

  let canvas: HTMLCanvasElement | undefined = $state();
  let tagLayer: HTMLElement | undefined = $state();
  let leaders: SVGSVGElement | undefined = $state();
  let lastFocus: HTMLElement | null = null;
  let stage: Stage | null = null;

  const REPORT_TEXT: Record<ReportShape, { cmd?: string; lines: string[] }> = {
    pdf: { lines: ['# PDF report', 'Summary · Devices · Open ports · Findings', 'one file per scan, in English, Turkish or German'] },
    xlsx: { lines: ['# Excel report, five sheets', 'Summary · Devices · Ports · Findings · Comparison'] },
    json: { cmd: 'lanora scan 192.168.1.0/24 --format json > result.json', lines: ['# exit code 3 with --fail-on high'] },
    csv: { cmd: 'lanora scan --format csv > result.csv', lines: ['# print a saved scan again: lanora show 3f9c1a2b --csv'] }
  };
  const FINAL: Record<FinalShape, { label: string; href: string }> = {
    github: { label: 'View GitHub repository', href: LINKS.repo },
    docs: { label: 'Read the documentation', href: LINKS.docs },
    releases: { label: 'See all releases', href: LINKS.releases },
    issues: { label: 'Open an issue or idea', href: LINKS.issues }
  };

  const hint = $derived(loading || (current === 0 ? 'Scroll to enter' : current === 7 ? 'End of the network' : 'Scroll to go deeper'));

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LANORA',
    alternateName: 'Local Area Network Observation & Risk Assessment',
    operatingSystem: 'Windows 10, Windows 11',
    applicationCategory: 'SecurityApplication',
    softwareVersion: RELEASE.version,
    license: 'https://www.gnu.org/licenses/gpl-3.0.html',
    downloadUrl: LINKS.latest,
    codeRepository: LINKS.repo,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: META.description
  }).replace(/</g, '\\u003c');

  function openDevice(id: string) {
    lastFocus = document.activeElement as HTMLElement | null;
    device = DEVICES.find((d) => d.id === id) ?? null;
  }
  function closeDevice() {
    device = null;
    lastFocus?.focus();
  }

  function onChapter(i: number) {
    current = i;
    document.querySelectorAll<HTMLElement>(`#${SECTION_IDS[i]} .eyebrow`).forEach((el) => {
      if (tier !== 'static') scramble(el);
    });
    tick();
  }
  const SECTION_IDS = ['hero', 'discovery', 'devices', 'ports', 'security', 'reports', 'local', 'final'];

  async function startStage() {
    if (!canvas || !tagLayer || !leaders || tier === 'static' || tier === null) return;
    let spin = true;
    const spinner = () => {
      if (!spin) return;
      loading = 'Loading ' + randomLine(15);
      setTimeout(spinner, 90);
    };
    spinner();
    try {
      const { createStage } = await import('$lib/scene/Stage');
      stage = await createStage({
        canvas,
        tagLayer,
        leaders,
        tier,
        chapter,
        openDevice,
        onCount: (p, f) => {
          if (p !== probed) probed = p;
          if (f !== found) found = f;
        },
        onGlitch: (g) => {
          if (Math.abs(g - glitch) > 0.01) {
            glitch = g;
            document.documentElement.style.setProperty('--g', g.toFixed(3));
          }
        },
        onLost: () => goStatic()
      });
      stage.setReport(report);
      stage.setFinal(finalDest);
    } catch (err) {
      console.warn('3D scene unavailable, using stills', err);
      goStatic();
    } finally {
      spin = false;
      loading = '';
    }
  }

  function goStatic() {
    stage?.destroy();
    stage = null;
    tier = 'static';
    document.documentElement.classList.add('tier-static');
    document.documentElement.style.setProperty('--g', '0');
  }

  function toggleReduce() {
    reduced = !reduced;
    if (reduced) goStatic();
    else {
      document.documentElement.classList.remove('tier-static');
      tier = detectTierIgnoringMotion();
      void startStage();
    }
  }
  function detectTierIgnoringMotion(): Tier {
    const w = innerWidth;
    return w < 768 ? 'mobile' : w < 1200 ? 'lite' : 'full';
  }

  onMount(() => {
    tier = detectTier();
    reduced = tier === 'static' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js', `tier-${tier}`);
    const sections = SECTION_IDS.map((id) => document.getElementById(id)!) as HTMLElement[];
    // GSAP, ScrollTrigger and Lenis load right after first paint, in their own chunk (spec §9.1)
    let scroll: { destroy: () => void } | null = null;
    let disposed = false;
    import('$lib/motion/scroll').then(({ initScroll }) => {
      if (!disposed) scroll = initScroll(sections, { smooth: tier !== 'static', onChange: onChapter });
    });

    // light per-frame HUD work that does not need the 3D scene
    let raf = 0;
    const hudLoop = () => {
      document.documentElement.style.setProperty('--prog', chapter.prog.toFixed(4));
      document.documentElement.classList.toggle('end', chapter.i === 7 && chapter.l > 0.45);
      if (tier === 'static') {
        probed = chapter.i >= 1 ? NETWORK.probed : 0;
        found = chapter.i >= 1 ? DEVICES.length : 0;
      }
      raf = requestAnimationFrame(hudLoop);
    };
    raf = requestAnimationFrame(hudLoop);

    // the scene loads after first paint (spec §9.1)
    const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 200));
    idle(() => void startStage());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      scroll?.destroy();
      stage?.destroy();
    };
  });

  function chooseReport(v: ReportShape) {
    report = v;
    stage?.setReport(v);
    tick();
  }
  function chooseFinal(v: FinalShape) {
    finalDest = v;
    stage?.setFinal(v);
    tick();
  }
</script>

<svelte:head>
  <title>{META.title}</title>
  <meta name="description" content={META.description} />
  <link rel="canonical" href="{SITE_URL}/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={META.title} />
  <meta property="og:description" content={META.description} />
  <meta property="og:url" content="{SITE_URL}/" />
  <meta property="og:image" content="{SITE_URL}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={META.title} />
  <meta name="twitter:description" content={META.description} />
  <meta name="twitter:image" content="{SITE_URL}/og.png" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<svelte:window onkeydown={(e) => e.key === 'Escape' && device && closeDevice()} />

<a class="skip" href="#content">Skip to content</a>
<canvas id="gl" bind:this={canvas} aria-hidden="true"></canvas>
<div class="vignette" aria-hidden="true"></div>
<div class="fx" aria-hidden="true"></div>
<svg class="leaders" bind:this={leaders} aria-hidden="true"></svg>
<div class="tags" bind:this={tagLayer}></div>

<Hud {current} names={NAMES} {hint} {sound} {reduced} onsound={() => setSound((sound = !sound))} onreduce={toggleReduce} />

<main id="content">
  <section class="sec" id="hero">
    <img class="still" src="{base}/fallback/01.webp" alt="" loading="lazy" width="1600" height="1000" />
    <div class="copy">
      <span class="eyebrow">01 <span>/ into your network</span></span>
      <h1 class="big">Your network.<br /><em class="lime">Revealed.</em></h1>
      <p class="lead">Discover connected devices, inspect open ports and understand your network security posture.</p>
      <div class="cta">
        <a class="btn solid" href="#discovery">Explore Lanora <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></a>
        <a class="btn line" href={LINKS.repo} rel="noopener noreferrer">View on GitHub</a>
      </div>
      <div class="readout"><span>v<b>{RELEASE.version}</b></span><span>Windows <b>10/11 x64</b></span><span>License <b>{RELEASE.license}</b></span><span>Price <b>free</b></span></div>
    </div>
    <div class="manifesto" aria-label="Manifesto">
      <b>////// Manifesto</b>
      <span>Every network has a hidden structure. Lanora shows it to you in plain language, on your own computer.</span>
    </div>
  </section>

  <section class="sec" id="discovery">
    <img class="still" src="{base}/fallback/02.webp" alt="" loading="lazy" width="1600" height="1000" />
    <div class="copy">
      <span class="eyebrow">02 <span>/ network discovery</span></span>
      <h2 class="h2">Every network has a hidden structure.</h2>
      <p class="lead">Lanora finds what answers on your directly connected network: ICMP, the ARP neighbor table and limited TCP evidence, with offline vendor lookup.</p>
      <div class="readout" aria-live="polite"><span>Addresses probed <b>{probed}</b></span><span>Devices found <b>{found}</b></span><span class="sample">Sample data</span></div>
      <ul class="devlist" aria-label="Devices in the sample network">
        {#each DEVICES as d (d.id)}
          <li><button onclick={() => openDevice(d.id)}>{d.name} <span>{d.ip}</span></button></li>
        {/each}
      </ul>
    </div>
  </section>

  <section class="sec" id="devices">
    <img class="still" src="{base}/fallback/03.webp" alt="" loading="lazy" width="1600" height="1000" />
    <div class="copy">
      <span class="eyebrow">03 <span>/ device intelligence</span></span>
      <h2 class="h2">Know what is connected.</h2>
      <p class="lead">Name, IP address, MAC and vendor when available, a device type estimate and how it was found.</p>
      <p class="note">Random (privacy) MAC addresses get no vendor. Lanora marks them "uncertain" instead of guessing.</p>
    </div>
  </section>

  <section class="sec" id="ports">
    <img class="still" src="{base}/fallback/04.webp" alt="" loading="lazy" width="1600" height="1000" />
    <div class="copy">
      <span class="eyebrow">04 <span>/ port discovery</span></span>
      <h2 class="h2">See what is exposed.</h2>
      <p class="lead">Quick, Standard and Custom profiles check TCP ports, with HTTP, TLS and banner evidence. The advanced scan adds native UDP probes.</p>
      <div class="states" aria-label="Port states"><span><i></i>Open</span><span class="nr"><i></i>Open | filtered</span><span class="cl"><i></i>Closed</span></div>
      <p class="note">An open port is not automatically a problem. What matters is which service is behind it.</p>
    </div>
  </section>

  <section class="sec" id="security">
    <img class="still" src="{base}/fallback/05.webp" alt="" loading="lazy" width="1600" height="1000" />
    <div class="copy wide">
      <div class="left">
        <span class="eyebrow">05 <span>/ security intelligence</span></span>
        <h2 class="h2">Data is not enough. Understanding matters.</h2>
        <p class="lead">Every finding comes in four parts, in plain language.</p>
        <div class="score">
          <svg viewBox="0 0 120 120" role="img" aria-label="Network security indicator {NETWORK.score} out of 100">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#27312a" stroke-width="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#c6eea3" stroke-width="8" stroke-linecap="round" stroke-dasharray="{(NETWORK.score / 100) * 314.16} 314.16" transform="rotate(-90 60 60)" />
            <text x="60" y="66" text-anchor="middle" fill="#e6eee8" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="30">{NETWORK.score}</text>
            <text x="60" y="84" text-anchor="middle" fill="#8a948c" font-family="IBM Plex Mono, monospace" font-size="9">OF 100</text>
          </svg>
          <div class="t"><b>Small steps. A better understood network.</b><span>Coverage {NETWORK.coverage}% · 1 priority finding</span><span class="sample">Sample data</span></div>
        </div>
      </div>
      <div class="cards">
        {#each FINDINGS as f (f.id)}<FindingCard {f} />{/each}
      </div>
    </div>
  </section>

  <section class="sec" id="reports">
    <img class="still" src="{base}/fallback/06.webp" alt="" loading="lazy" width="1600" height="1000" />
    <div class="copy">
      <span class="eyebrow">06 <span>/ reports</span></span>
      <h2 class="h2">Turn discovery into intelligence.</h2>
      <p class="lead">Network overview, devices, open ports and findings, as a PDF or Excel report, or as text, JSON and CSV from the command line.</p>
      <Brackets label="Report format" value={report} onchange={chooseReport} items={[{ value: 'pdf', label: 'PDF' }, { value: 'xlsx', label: 'XLSX' }, { value: 'json', label: 'JSON' }, { value: 'csv', label: 'CSV' }]} />
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre class="term" aria-live="polite" tabindex="0" role="region" aria-label="Report output">{#if REPORT_TEXT[report].cmd}<span class="p">&gt;</span> {REPORT_TEXT[report].cmd}
{/if}{#each REPORT_TEXT[report].lines as line, k (k)}<span class={line.startsWith('#') ? 'c' : ''}>{line}</span>
{/each}</pre>
      <div class="cta"><a class="btn line" href={LINKS.cli} rel="noopener noreferrer">Explore the project</a></div>
    </div>
  </section>

  <section class="sec" id="local">
    <img class="still" src="{base}/fallback/07.webp" alt="" loading="lazy" width="1600" height="1000" />
    <div class="copy">
      <span class="eyebrow">07 <span>/ local-first</span></span>
      <h2 class="h2">Your network. Your data. <em class="lime">Your control.</em></h2>
      <ul class="facts">
        <li><b>The interface listens only on 127.0.0.1.</b><span>Nothing is reachable from other computers</span></li>
        <li><b>No account, no cloud, no telemetry.</b><span>Scan results never leave your computer</span></li>
        <li><b>Your data stays in %LOCALAPPDATA%\Lanora.</b><span>Retention setting · delete one scan or all data</span></li>
      </ul>
      <p class="note">Scanning sends probes to the addresses you choose. The standard scan stays inside your directly connected private network, at most 256 addresses. Only scan networks you own or are authorized to test.</p>
    </div>
  </section>

  <section class="sec" id="final">
    <img class="still" src="{base}/fallback/08.webp" alt="" loading="lazy" width="1600" height="1000" />
    <div class="copy center">
      <span class="eyebrow">08 <span>/ open source</span></span>
      <h2 class="big">Explore.<br />Understand.<br /><em class="lime">Secure.</em></h2>
      <Brackets label="Destination" value={finalDest} onchange={chooseFinal} items={[{ value: 'github', label: 'GitHub' }, { value: 'docs', label: 'Docs' }, { value: 'releases', label: 'Releases' }, { value: 'issues', label: 'Issues' }]} />
      <div class="cta">
        <a class="btn solid" href={FINAL[finalDest].href} rel="noopener noreferrer">{FINAL[finalDest].label} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
        <a class="btn line" href={LINKS.latest} rel="noopener noreferrer">Download for Windows</a>
      </div>
      <p class="note">{RELEASE.installer} or the portable ZIP. Not code-signed yet, so SmartScreen may warn; check the files against SHA256SUMS.txt in the release.</p>
    </div>
  </section>
</main>

<footer>
  <span>© Lanora contributors · {RELEASE.license}</span>
  <nav aria-label="Footer">
    <a href={LINKS.repo} rel="noopener noreferrer">GitHub</a>
    <a href={LINKS.docs} rel="noopener noreferrer">Documentation</a>
    <a href={LINKS.license} rel="noopener noreferrer">License</a>
    <a href={LINKS.privacy} rel="noopener noreferrer">Privacy</a>
    <a href={LINKS.issues} rel="noopener noreferrer">Contact</a>
  </nav>
  <span>This site uses no cookies and no analytics</span>
</footer>

<DevicePanel {device} onclose={closeDevice} />

<style>
  .skip { position: fixed; left: var(--gl); top: -60px; z-index: 100; background: var(--lime); color: #0a1a12; padding: 10px 14px; font: 600 14px var(--f-body); text-decoration: none; }
  .skip:focus { top: 12px; }
  #gl { position: fixed; inset: 0; width: 100%; height: 100%; display: block; z-index: 0; }
  :global(.tier-static) #gl, :global(.tier-static) .leaders, :global(.tier-static) .tags { display: none; }
  .fx {
    position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: var(--g, 0); mix-blend-mode: screen;
    background: repeating-linear-gradient(0deg, rgba(163, 255, 18, 0.08) 0 2px, transparent 2px 5px), linear-gradient(90deg, rgba(255, 77, 77, 0.08), transparent 30%, transparent 70%, rgba(163, 255, 18, 0.1));
    transform: translateX(calc(var(--g, 0) * 6px));
  }
  .vignette { position: fixed; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(120% 90% at 50% 45%, transparent 45%, rgba(5, 10, 8, 0.85) 100%); }
  .leaders { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none; }
  .leaders :global(line) { stroke: var(--lime); stroke-width: 1; opacity: 0.55; }
  .leaders :global(circle) { fill: var(--signal); }
  .tags { position: fixed; inset: 0; z-index: 3; pointer-events: none; }

  main { position: relative; z-index: 10; }
  .sec { position: relative; padding-left: var(--gl); padding-right: var(--gr); }
  .still { display: none; }
  :global(.tier-static) .still { display: block; position: sticky; top: 0; width: 100%; height: 100vh; object-fit: cover; margin-bottom: -100vh; opacity: 0.85; }
  .copy { position: sticky; top: 20vh; max-width: min(560px, 46vw); margin-left: clamp(0px, 6vw, 96px); display: grid; gap: 22px; padding-block: 8vh; }
  #hero { min-height: 150vh; }
  #hero .copy { top: 14vh; }
  #hero .big { font-size: clamp(44px, 6.2vw, 100px); }
  #discovery { min-height: 170vh; }
  #devices { min-height: 200vh; }
  #ports { min-height: 180vh; }
  #security { min-height: 210vh; }
  #reports { min-height: 180vh; }
  #local { min-height: 170vh; }
  #final { min-height: 140vh; }

  .manifesto { position: absolute; right: var(--gr); top: 22vh; max-width: 250px; text-align: right; display: grid; gap: 10px; font: 500 12px/1.55 var(--f-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--secondary); }
  .manifesto b { color: var(--lime); font-weight: 500; }

  .devlist { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
  .devlist button { border: 1px solid var(--border); padding: 6px 10px; min-height: 36px; font: 500 11.5px var(--f-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--secondary); background: rgba(8, 11, 9, 0.5); }
  .devlist button span { color: var(--muted); }
  .devlist button:hover { color: var(--lime); border-color: var(--lime); }

  .states { display: flex; flex-wrap: wrap; gap: 8px 18px; font: 500 11.5px var(--f-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); }
  .states i { display: inline-block; width: 18px; height: 0; border-top: 2px solid var(--signal); vertical-align: middle; margin-right: 6px; }
  .states .cl i { border-top: 1px solid #5d665f; }
  .states .nr i { border-top: 2px dashed var(--lime); }

  .copy.wide { max-width: min(1100px, 92vw); grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); column-gap: 48px; align-items: start; }
  .left { display: grid; gap: 22px; }
  .cards { display: grid; gap: 14px; }
  .score { display: flex; align-items: center; gap: 18px; }
  .score svg { width: 112px; height: 112px; flex: none; }
  .score .t { display: grid; gap: 4px; font: 500 12px/1.5 var(--f-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .score .t b { font: 700 20px var(--f-display); letter-spacing: -0.01em; text-transform: none; color: var(--text); }
  .score .sample { justify-self: start; }

  .term { margin: 0; background: rgba(5, 10, 8, 0.8); border: 1px solid var(--border); padding: 14px 16px; font: 400 13px/1.7 var(--f-mono); color: var(--secondary); overflow-x: auto; white-space: pre; max-width: 100%; }
  .term .p { color: var(--lime); }
  .term .c { color: var(--muted); }

  .facts { list-style: none; margin: 0; padding: 0; display: grid; border-top: 1px solid var(--border); }
  .facts li { display: grid; gap: 4px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .facts b { font: 600 16px/1.4 var(--f-body); }
  .facts span { font: 500 11px var(--f-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }

  .copy.center { margin-inline: auto; max-width: min(760px, 92vw); text-align: center; justify-items: center; top: 50vh; gap: 16px; padding-top: 0; }
  .copy.center .big { font-size: clamp(36px, 4.2vw, 64px); }
  .copy.center .cta { justify-content: center; }
  :global(.tier-static) .copy.center { top: 20vh; }

  footer { position: relative; z-index: 10; border-top: 1px solid var(--border); background: rgba(8, 11, 9, 0.92); padding: 28px var(--gr) calc(32px + env(safe-area-inset-bottom, 0px)) var(--gl); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px 32px; font: 500 12px/1.6 var(--f-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  footer nav { display: flex; flex-wrap: wrap; gap: 8px 22px; }
  footer a { color: var(--secondary); text-decoration: none; }
  footer a:hover { color: var(--lime); }

  @media (max-width: 900px) {
    .copy { max-width: none; margin-left: 0; }
    .copy.wide { grid-template-columns: 1fr; row-gap: 24px; }
    .manifesto { position: relative; right: auto; top: auto; text-align: left; max-width: none; padding-top: 8vh; }
  }
  @media (max-width: 640px) {
    :global(body)::after { content: ''; position: fixed; inset: 0 0 auto; height: calc(96px + env(safe-area-inset-top, 0px)); z-index: 15; pointer-events: none; background: linear-gradient(180deg, rgba(8, 11, 9, 0.95) 55%, rgba(8, 11, 9, 0)); }
    .sec { min-height: auto !important; padding-bottom: 30vh; }
    .copy, #hero .copy, .copy.center { position: relative; top: auto; padding-top: 44vh; padding-bottom: 0; padding-inline: 2px; background: linear-gradient(180deg, rgba(8, 11, 9, 0) 40%, rgba(8, 11, 9, 0.6) 52%, rgba(8, 11, 9, 0.6)); }
    .manifesto { padding-top: 24px; }
  }
</style>
