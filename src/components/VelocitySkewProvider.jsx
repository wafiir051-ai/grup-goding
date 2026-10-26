import { useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { SkewContext } from '../lib/velocityContext';

// Kartu sedikit miring mengikuti kecepatan scroll (makin cepat, makin miring, maksimal 3
// derajat), lalu kembali lurus dengan pegas saat scroll berhenti. Diam = 0 derajat.
export default function VelocitySkewProvider({ children }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 220, damping: 30, mass: 0.5 });
  const skew = useTransform(smooth, [-1400, 0, 1400], [3, 0, -3], { clamp: true });
  return <SkewContext.Provider value={reduced ? null : skew}>{children}</SkewContext.Provider>;
}
