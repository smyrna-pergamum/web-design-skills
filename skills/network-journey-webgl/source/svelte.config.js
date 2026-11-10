import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** GitHub Pages serves a project site under /<repo>; the deploy workflow sets BASE_PATH. */
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: undefined, strict: true }),
    paths: { base, relative: false },
    // no leading underscore, so Jekyll-based GitHub Pages hosts publish it too
    appDir: 'app',
    prerender: { handleHttpError: 'fail', handleMissingId: 'fail' },
    // Strict CSP as a <meta> tag (GitHub Pages cannot send headers). SvelteKit hashes its own inline scripts.
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'script-src': ['self'],
        // 'self' plus exactly one inline style: SvelteKit's visually hidden route announcer
        'style-src': ['self', 'unsafe-hashes', 'sha256-S8qMpvofolR8Mpjy4kQvEm7m1q8clzU4dfDH0AmvZjo='],
        'img-src': ['self', 'data:'],
        'font-src': ['self'],
        'connect-src': ['self'],
        'media-src': ['none'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['none']
      }
    }
  }
};

export default config;
