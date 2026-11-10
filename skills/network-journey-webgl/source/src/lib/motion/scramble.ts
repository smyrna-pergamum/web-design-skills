const GLYPHS = '0123456789ABCDEF.:/';

/** Short "decoding" effect for mono labels. The final text is always the real text. */
export function scramble(el: HTMLElement, frames = 14) {
  const node = el as HTMLElement & { _scr?: boolean };
  if (node._scr) return;
  const text = (node.dataset.txt ??= node.textContent ?? '');
  node._scr = true;
  let f = 0;
  const step = () => {
    f++;
    node.textContent = [...text]
      .map((c, k) => (c === ' ' || k < (text.length * f) / frames ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
      .join('');
    if (f < frames) requestAnimationFrame(step);
    else {
      node.textContent = text;
      node._scr = false;
    }
  };
  step();
}

export function randomLine(n = 18) {
  return Array.from({ length: n }, (_, k) => (k % 4 === 3 ? '.' : GLYPHS[(Math.random() * 16) | 0])).join('');
}
