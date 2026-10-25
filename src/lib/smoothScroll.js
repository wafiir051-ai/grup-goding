// Satu instance Lenis untuk seluruh situs, dipakai juga oleh navigasi anchor
// supaya lompatan ke section ikut meluncur dengan inersia yang sama.
let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export function smoothScrollTo(target, { offset = 0, immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, duration: 1.4, easing: easeOutQuart });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
}
