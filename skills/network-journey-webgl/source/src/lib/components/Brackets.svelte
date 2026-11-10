<script lang="ts" generics="T extends string">
  /** igloo-style bracket selector: the chosen item sits inside [ ]. A group of toggle buttons. */
  let { label, items, value, onchange }: { label: string; items: { value: T; label: string }[]; value: T; onchange: (v: T) => void } = $props();
</script>

<div class="brackets" role="group" aria-label={label}>
  {#each items as item (item.value)}
    <button type="button" aria-pressed={item.value === value} onclick={() => onchange(item.value)}>{item.label}</button>
  {/each}
</div>

<style>
  .brackets { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; font: 500 13px var(--f-mono); letter-spacing: 0.12em; text-transform: uppercase; }
  button { position: relative; padding: 10px 16px; min-height: 44px; color: var(--muted); transition: color 0.2s; }
  button:hover { color: var(--secondary); }
  button[aria-pressed='true'] { color: var(--lime); }
  button[aria-pressed='true']::before,
  button[aria-pressed='true']::after { content: ''; position: absolute; top: 6px; bottom: 6px; width: 7px; border: 1px solid var(--lime); }
  button[aria-pressed='true']::before { left: 0; border-right: 0; }
  button[aria-pressed='true']::after { right: 0; border-left: 0; }
</style>
