import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
export default function RevealOnScroll({ children, componentName, once = false, className = '', customDelay = null }) {
  const [settings, setSettings] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: once, threshold: 0.2, rootMargin: '-50px' });
  useEffect(() => {
    const fetchAnim = async () => {
      const { data } = await supabase.from('animation_settings').select('animation_type, speed, delay, intensity, direction').eq('component', componentName).maybeSingle();
      if (data) setSettings(data);
    };
    fetchAnim();
  }, [componentName]);
  if (!settings) return <div className={className}>{children}</div>;
  const delay = customDelay !== null ? customDelay : settings.delay;
  const variants = {
    hidden: { opacity: 0, filter: 'blur(4px)' },
    visible: { opacity: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 120, damping: 15, delay, duration: settings.speed } }
  };
  if (settings.direction === 'up') variants.hidden.y = 60 * settings.intensity;
  if (settings.direction === 'down') variants.hidden.y = -60 * settings.intensity;
  if (settings.direction === 'left') variants.hidden.x = 60 * settings.intensity;
  if (settings.direction === 'right') variants.hidden.x = -60 * settings.intensity;
  if (settings.animation_type === 'scale') variants.hidden.scale = 0.7;
  if (settings.animation_type === 'rotate') variants.hidden.rotate = -10;
  return <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={variants} className={className}>{children}</motion.div>;
}
