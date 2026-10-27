// Mode ringan otomatis untuk perangkat yang kewalahan. Mode ini dipilih lewat:
// 1. URL `?perf=lite` / `?perf=full` untuk memaksa, `?perf=auto` untuk kembali otomatis.
// 2. Ingatan dari kunjungan sebelumnya di perangkat yang sama (berlaku 7 hari).
// 3. Petunjuk perangkat: hemat data, memori/inti CPU sangat kecil, atau tanpa GPU.
// 4. Pemantauan frame saat scroll: kalau dua kali berturut-turut terlalu patah-patah,
//    halaman pindah ke mode ringan saat itu juga, tanpa reload.
// Mode ringan hanya mematikan efek mahal (lihat pemakai `isPerfLite` dan `usePerfLite`);
// tata letak dan isi halaman tidak berubah.

const KEY = 'goding-perf';
const REMEMBER_MS = 7 * 24 * 60 * 60 * 1000;
const listeners = new Set();
let lite = false;
let forced = false;

function apply(next, remember) {
  if (next === lite) return;
  lite = next;
  document.documentElement.dataset.perf = lite ? 'lite' : 'full';
  if (remember) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ mode: 'lite', at: Date.now() }));
    } catch { /* penyimpanan tidak tersedia */ }
  }
  listeners.forEach((fn) => fn());
}

export function isPerfLite() {
  return lite;
}

export function subscribePerf(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function readChoice() {
  const param = new URLSearchParams(window.location.search).get('perf');
  try {
    if (param === 'auto') localStorage.removeItem(KEY);
    if (param === 'lite' || param === 'full') {
      forced = true;
      return param === 'lite';
    }
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved?.mode === 'lite' && Date.now() - saved.at < REMEMBER_MS) return true;
  } catch { /* penyimpanan tidak tersedia */ }
  const nav = navigator;
  return !!(nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory <= 2) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2));
}

// Browser tanpa akselerasi GPU menggambar semuanya dengan CPU.
function softwareGpu() {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return true;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch {
    return false;
  }
}

// Pantau frame hanya saat halaman di-scroll dan terlihat, setelah masa muat awal lewat.
function watchFrames() {
  let scrollingUntil = 0;
  let samples = [];
  let badWindows = 0;
  let last = performance.now();
  const startAt = last + 2500;
  const onScroll = () => { scrollingUntil = performance.now() + 250; };
  window.addEventListener('scroll', onScroll, { passive: true });
  const tick = (now) => {
    const dt = now - last;
    last = now;
    if (lite) {
      window.removeEventListener('scroll', onScroll);
      return;
    }
    if (now > startAt && now < scrollingUntil && document.visibilityState === 'visible' && dt < 250) {
      samples.push(dt);
      if (samples.length >= 60) {
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        const slow = samples.filter((d) => d > 50).length / samples.length;
        badWindows = avg > 26 || slow > 0.2 ? badWindows + 1 : 0;
        samples = [];
        if (badWindows >= 2) apply(true, true);
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initPerf() {
  document.documentElement.dataset.perf = 'full';
  apply(readChoice(), false);
  if (forced) return;
  const later = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  later(() => {
    if (!lite && softwareGpu()) apply(true, true);
    if (!lite) watchFrames();
  });
}
