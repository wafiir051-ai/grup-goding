import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Pin/sticky hanya di layar yang cukup lega: mati di HP (lebar < 640px atau
// tinggi < 600px) dan untuk pengguna prefers-reduced-motion.
const SMALL = '(max-width: 639px), (max-height: 599px)';

export default function usePinEnabled() {
  const reduced = useReducedMotion();
  const [small, setSmall] = useState(() => window.matchMedia(SMALL).matches);
  useEffect(() => {
    const mq = window.matchMedia(SMALL);
    const onChange = () => setSmall(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return !reduced && !small;
}
