/** Optional ambience: off by default, starts only from the visitor's click. */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

export function setSound(on: boolean) {
  enabled = on;
  try {
    if (on && !ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 420;
      lp.connect(master);
      [55, 82.4, 110.3].forEach((f, k) => {
        const o = ctx!.createOscillator();
        o.type = k ? 'sine' : 'triangle';
        o.frequency.value = f;
        const g = ctx!.createGain();
        g.gain.value = k ? 0.18 : 0.28;
        o.connect(g);
        g.connect(lp);
        o.start();
      });
    }
    if (ctx && master) {
      void ctx.resume();
      master.gain.setTargetAtTime(on ? 0.05 : 0, ctx.currentTime, 0.4);
    }
  } catch {
    /* audio is decoration; ignore failures */
  }
}

export function tick() {
  if (!enabled || !ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 1320;
    g.gain.value = 0.025;
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.09);
  } catch {
    /* ignore */
  }
}
