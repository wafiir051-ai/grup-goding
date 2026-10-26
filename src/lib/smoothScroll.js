import { SMOOTH_SCROLL, easeOutCubic } from './scrollMotion';

// Satu instance Lenis untuk seluruh situs, dipakai juga oleh navigasi anchor
// supaya lompatan ke section ikut meluncur dengan inersia yang sama.
let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export function smoothScrollTo(target, { offset = 0, immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, duration: SMOOTH_SCROLL.anchorDuration, easing: easeOutQuart });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
}

// Lenis hanya menghaluskan roda mouse dan trackpad. Tombol panah, Page Up/Down, Spasi,
// Home, dan End dialihkan ke sini supaya meluncur dengan kurva yang sama, bukan
// melompat dengan scroll bawaan browser.
const PAGE = () => window.innerHeight * 0.85;
const KEY_DELTA = {
  ArrowDown: () => SMOOTH_SCROLL.keyStep,
  ArrowUp: () => -SMOOTH_SCROLL.keyStep,
  PageDown: PAGE,
  PageUp: () => -PAGE(),
  ' ': (e) => (e.shiftKey ? -PAGE() : PAGE()),
};

export function enableSmoothKeys(instance) {
  const onKeyDown = (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target instanceof Element ? e.target : null;
    if (t?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return;
    if (e.key === ' ' && t?.closest('button, a, [role="button"]')) return;
    const glide = { duration: SMOOTH_SCROLL.duration, easing: easeOutCubic };
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      instance.scrollTo(e.key === 'Home' ? 0 : instance.limit, { ...glide, duration: SMOOTH_SCROLL.anchorDuration });
      return;
    }
    const delta = KEY_DELTA[e.key];
    if (!delta) return;
    e.preventDefault();
    let to = instance.targetScroll + delta(e);
    // Saat tombol panah ditahan, tujuan tidak boleh terlalu jauh di depan posisi sekarang,
    // jadi kecepatannya tetap tenang dan konstan.
    if (e.key.startsWith('Arrow')) {
      const now = instance.animatedScroll;
      to = Math.min(now + SMOOTH_SCROLL.keyMaxLead, Math.max(now - SMOOTH_SCROLL.keyMaxLead, to));
    }
    instance.scrollTo(to, glide);
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}
