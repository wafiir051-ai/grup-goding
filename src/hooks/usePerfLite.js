import { useSyncExternalStore } from 'react';
import { isPerfLite, subscribePerf } from '../lib/perf';

// true kalau halaman sedang di mode ringan (lihat lib/perf.js).
export default function usePerfLite() {
  return useSyncExternalStore(subscribePerf, isPerfLite);
}
