<script lang="ts">
  import type { Device } from '$lib/content/sample-network';
  let { device, onclose }: { device: Device | null; onclose: () => void } = $props();
  let closeBtn: HTMLButtonElement | undefined = $state();
  $effect(() => {
    if (device) closeBtn?.focus();
  });
</script>

{#if device}
  <aside class="panel" aria-labelledby="panel-name">
    <header>
      <div>
        <span class="eyebrow">Device · {device.status}</span>
        <h3 id="panel-name">{device.name}</h3>
      </div>
      <button class="x" bind:this={closeBtn} onclick={onclose} aria-label="Close device details">×</button>
    </header>
    <dl>
      <dt>IP</dt><dd>{device.ip}</dd>
      <dt>MAC / vendor</dt><dd>{device.vendor}</dd>
      <dt>Type</dt><dd>{device.type}</dd>
      <dt>Found via</dt><dd>{device.via}</dd>
      <dt>Open ports</dt><dd>{device.ports.length}</dd>
    </dl>
    {#if device.ports.length}
      <div class="chips">{#each device.ports as p (p)}<span>{p}</span>{/each}</div>
    {/if}
    <span class="sample">Sample data</span>
  </aside>
{/if}

<style>
  .panel {
    position: fixed; z-index: 40; right: var(--gr); top: 96px; width: min(360px, calc(100vw - 32px));
    background: rgba(12, 18, 15, 0.94); border: 1px solid var(--border); border-top: 2px solid var(--lime);
    backdrop-filter: blur(8px); padding: 20px; display: grid; gap: 14px;
  }
  header { display: flex; justify-content: space-between; align-items: start; gap: 12px; }
  h3 { font: 700 26px/1 var(--f-display); letter-spacing: -0.02em; text-transform: uppercase; }
  .x { min-width: 44px; min-height: 44px; margin: -12px -12px 0 0; color: var(--muted); font: 500 20px var(--f-mono); }
  .x:hover { color: var(--lime); }
  dl { margin: 0; display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 8px 12px; font: 400 13px/1.5 var(--f-mono); }
  dt { color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; font-size: 11px; padding-top: 2px; }
  dd { margin: 0; color: var(--text); overflow-wrap: anywhere; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips span { border: 1px solid var(--green); color: var(--lime); padding: 2px 8px; font: 500 11.5px var(--f-mono); }
  .sample { justify-self: start; }
  @media (max-width: 640px) {
    .panel { top: auto; bottom: 0; right: 0; left: 0; width: auto; max-height: 70vh; overflow: auto; border-left: 0; border-right: 0; padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px)); }
  }
</style>
