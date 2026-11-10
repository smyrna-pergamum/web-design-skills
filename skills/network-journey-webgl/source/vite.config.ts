import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // three.js and the scene load after first paint, in their own chunk
        manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined)
      }
    }
  }
});
