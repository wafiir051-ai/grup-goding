import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
export default function MagneticButton({ children, className="", as="button", ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const springX = useSpring(x, { damping:15, stiffness:150 });
  const springY = useSpring(y, { damping:15, stiffness:150 });
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left+rect.width/2);
    const dy = e.clientY - (rect.top+rect.height/2);
    const max = 30;
    x.set(Math.min(Math.max(dx*0.3, -max), max));
    y.set(Math.min(Math.max(dy*0.3, -max), max));
  };
  const handleLeave = () => { x.set(0); y.set(0); };
  const Comp = motion[as];
  return <Comp ref={ref} style={{ x:springX, y:springY }} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`cursor-pointer ${className}`} {...props}>{children}</Comp>;
}
