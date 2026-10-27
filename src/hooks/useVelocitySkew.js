import { useContext } from 'react';
import { SkewContext } from '../lib/velocityContext';
import usePerfLite from './usePerfLite';

// Style tambahan untuk elemen yang ikut miring saat scroll cepat. Mati di mode ringan.
export default function useVelocitySkew() {
  const skew = useContext(SkewContext);
  const lite = usePerfLite();
  return skew && !lite ? { skewY: skew } : {};
}
