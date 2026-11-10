<script lang="ts">
  import { LINKS } from '$lib/config';

  let {
    current,
    names,
    hint,
    sound,
    reduced,
    onsound,
    onreduce
  }: {
    current: number;
    names: string[];
    hint: string;
    sound: boolean;
    reduced: boolean;
    onsound: () => void;
    onreduce: () => void;
  } = $props();

  let drawerOpen = $state(false);
  let menuBtn: HTMLButtonElement | undefined = $state();
  let firstLink: HTMLAnchorElement | undefined = $state();

  const nav = [
    { href: '#local', label: 'Manifesto', active: (i: number) => i === 6 },
    { href: '#discovery', label: 'Features', active: (i: number) => i >= 1 && i <= 5 },
    { href: LINKS.docs, label: 'Documentation', active: () => false },
    { href: LINKS.repo, label: 'GitHub', active: () => false }
  ];

  function openDrawer() {
    drawerOpen = true;
    queueMicrotask(() => firstLink?.focus());
  }
  function closeDrawer() {
    drawerOpen = false;
    menuBtn?.focus();
  }
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && drawerOpen && closeDrawer()} />

<div class="hud tl">
  <a class="logo" href="#hero" aria-label="Lanora, back to top">
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <rect x="20" y="20" width="472" height="472" rx="112" fill="#173C33" />
      <path d="M256 100 384 151v94c0 76-56 129-128 166-72-37-128-90-128-166v-94Z" fill="none" stroke="#C6EEA3" stroke-width="24" stroke-linejoin="round" />
      <path d="m190 251 48 49 88-96" fill="none" stroke="#C6EEA3" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <b>LANORA</b>
  </a>
  <span class="sub">// local mode · <span>127.0.0.1</span></span>
</div>

<div class="hud tr">
  <nav aria-label="Main">
    {#each nav as n (n.label)}
      <a href={n.href} rel={n.href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-current={n.active(current) ? 'true' : undefined}>{n.label}</a>
    {/each}
  </nav>
  <button class="menu" bind:this={menuBtn} aria-expanded={drawerOpen} aria-controls="drawer" onclick={openDrawer}>Menu</button>
</div>

<div class="drawer" id="drawer" hidden={!drawerOpen}>
  <button class="close" onclick={closeDrawer}>Close</button>
  {#each nav as n, k (n.label)}
    {#if k === 0}
      <a bind:this={firstLink} href={n.href} rel={n.href.startsWith('http') ? 'noopener noreferrer' : undefined} onclick={() => (drawerOpen = false)}>{n.label}</a>
    {:else}
      <a href={n.href} rel={n.href.startsWith('http') ? 'noopener noreferrer' : undefined} onclick={() => (drawerOpen = false)}>{n.label}</a>
    {/if}
  {/each}
</div>

<div class="hud bc">
  <span aria-live="polite">{hint}</span>
  <button aria-pressed={sound} onclick={onsound}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" /><path d={sound ? 'M16 9c1.5 1.5 1.5 4.5 0 6M19 6.5c3 3 3 8 0 11' : 'M16 9l5 6M21 9l-5 6'} /></svg>
    Sound: {sound ? 'On' : 'Off'}
  </button>
  <button aria-pressed={reduced} onclick={onreduce}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M8 12h8" /></svg>
    Reduce motion
  </button>
</div>

<div class="hud br" aria-hidden="true">
  <div>
    <div class="count"><b>0{current + 1}</b> / 0{names.length}</div>
    <div>{names[current]}</div>
  </div>
  <div class="track"><i></i></div>
</div>

<style>
  .hud { position: fixed; z-index: 20; font: 500 11.5px/1.5 var(--f-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .tl { left: var(--gl); top: calc(20px + env(safe-area-inset-top, 0px)); display: grid; gap: 6px; }
  .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text); }
  .logo svg { width: 30px; height: 30px; }
  .logo b { font: 700 22px/1 var(--f-display); letter-spacing: 0.06em; }
  .sub span { color: var(--lime); }
  .tr { right: var(--gr); top: calc(24px + env(safe-area-inset-top, 0px)); }
  nav { display: flex; gap: 24px; }
  nav a { color: var(--secondary); text-decoration: none; padding: 6px 0; border-bottom: 1px solid transparent; }
  nav a:hover, nav a[aria-current='true'] { color: var(--lime); border-bottom-color: var(--lime); }
  .menu { display: none; color: var(--lime); border: 1px solid var(--border); padding: 10px 14px; min-height: 44px; font: 500 12px var(--f-mono); letter-spacing: 0.12em; }
  .drawer { position: fixed; inset: 0; z-index: 60; background: rgba(8, 11, 9, 0.97); display: grid; align-content: center; gap: 4px; padding-inline: var(--gl) var(--gr); }
  .drawer a { font: 700 clamp(32px, 9vw, 56px)/1.1 var(--f-display); text-transform: uppercase; text-decoration: none; padding: 8px 0; color: var(--text); }
  .drawer a:hover { color: var(--lime); }
  .close { position: absolute; right: var(--gr); top: 20px; color: var(--lime); border: 1px solid var(--border); padding: 10px 14px; min-height: 44px; font: 500 12px var(--f-mono); letter-spacing: 0.12em; }
  .bc { left: 50%; transform: translateX(-50%); bottom: calc(16px + env(safe-area-inset-bottom, 0px)); display: flex; align-items: center; gap: 26px; white-space: nowrap; transition: opacity 0.3s; }
  .bc button { display: flex; align-items: center; gap: 8px; min-height: 32px; color: var(--secondary); font: inherit; letter-spacing: inherit; text-transform: inherit; }
  .bc button[aria-pressed='true'] { color: var(--lime); }
  .bc svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.6; }
  .br { right: var(--gr); bottom: calc(20px + env(safe-area-inset-bottom, 0px)); display: flex; align-items: flex-end; gap: 12px; text-align: right; transition: opacity 0.3s; }
  .count { font: 500 13px var(--f-mono); color: var(--text); }
  .count b { color: var(--lime); font-weight: 500; }
  .track { width: 2px; height: 72px; background: var(--border); position: relative; }
  .track i { position: absolute; left: 0; right: 0; bottom: 0; height: calc(var(--prog, 0) * 100%); background: var(--lime); }
  :global(.end) .bc, :global(.end) .br { opacity: 0; pointer-events: none; }
  @media (max-width: 900px) {
    nav { display: none; }
    .menu { display: block; }
    .track { display: none; }
  }
  @media (max-width: 640px) {
    .sub, .bc, .br { display: none; }
  }
</style>
