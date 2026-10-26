import { useContext } from 'react';
import { SkewContext } from '../lib/velocityContext';

// Style tambahan untuk elemen yang ikut miring saat scroll cepat.
export default function useVelocitySkew() {
  const skew = useContext(SkewContext);
  return skew ? { skewY: skew } : {};
}
