import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { chapter } from './state';

type Options = { smooth: boolean; onChange: (i: number) => void };

export function initScroll(sections: HTMLElement[], opts: Options) {
  gsap.registerPlugin(ScrollTrigger);
  let lenis: Lenis | null = null;
  const raf = (t: number) => lenis?.raf(t * 1000);
  if (opts.smooth) {
    lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  }
  // A chapter is "current" while its top has passed 35% of the viewport and its bottom has not.
  const triggers = sections.map((el, k) =>
    ScrollTrigger.create({
      trigger: el,
      start: 'top 35%',
      end: 'bottom 35%',
      onUpdate: (s) => {
        if (chapter.i === k) chapter.l = s.progress;
      },
      onToggle: (s) => {
        if (s.isActive && chapter.i !== k) {
          chapter.i = k;
          chapter.l = s.progress;
          opts.onChange(k);
        }
      }
    })
  );
  const page = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => (chapter.prog = s.progress) });
  ScrollTrigger.refresh();
  return {
    destroy() {
      triggers.forEach((t) => t.kill());
      page.kill();
      if (lenis) {
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
    }
  };
}
