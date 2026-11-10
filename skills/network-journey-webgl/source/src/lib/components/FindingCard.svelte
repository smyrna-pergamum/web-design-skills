<script lang="ts">
  import type { FINDINGS } from '$lib/content/sample-network';
  let { f }: { f: (typeof FINDINGS)[number] } = $props();
</script>

<article class="card">
  <header>
    {#if f.severity === 'medium'}
      <span class="sev med"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>Medium</span>
    {:else}
      <span class="sev info"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></svg>Info</span>
    {/if}
    <span>{f.id} · {f.where}</span>
  </header>
  <h3>{f.title}</h3>
  <dl>
    <dt>Observed</dt><dd>{f.observed}</dd>
    <dt>What it means</dt><dd>{f.meaning}</dd>
    <dt>What to do</dt><dd>{f.action}</dd>
    <dt>How to verify</dt><dd>{f.verify}</dd>
  </dl>
</article>

<style>
  .card { background: rgba(17, 23, 19, 0.82); border: 1px solid var(--border); backdrop-filter: blur(6px); padding: 18px 20px; display: grid; gap: 12px; }
  header { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; font: 500 11.5px var(--f-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .sev { display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border: 1px solid; }
  .sev svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2; }
  .med { color: var(--warning); border-color: rgba(220, 139, 64, 0.6); }
  .info { color: var(--secondary); border-color: var(--border); }
  h3 { font: 600 18px/1.3 var(--f-body); }
  dl { margin: 0; display: grid; grid-template-columns: 118px minmax(0, 1fr); gap: 8px 14px; font-size: 14px; line-height: 1.5; }
  dt { font: 500 11px/1.6 var(--f-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--lime); }
  dd { margin: 0; color: var(--secondary); }
  @media (max-width: 640px) {
    dl { grid-template-columns: 1fr; gap: 2px 0; }
    dd { margin-bottom: 8px; }
  }
</style>
