<script lang="ts">
  // Self-hosted fonts (spec §4.2): bundled by Vite, served from the same origin, no third-party request.
  import '@fontsource/space-grotesk/500.css';
  import '@fontsource/space-grotesk/700.css';
  import '@fontsource/inter/400.css';
  import '@fontsource/inter/500.css';
  import '@fontsource/inter/600.css';
  import '@fontsource/ibm-plex-mono/400.css';
  import '@fontsource/ibm-plex-mono/500.css';
  import '../app.css';

  let { children } = $props();
</script>

{@render children()}
