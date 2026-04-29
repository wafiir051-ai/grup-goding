import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
export default function AnimatedCursor() {
  const cursorX = useMotionValue(0); const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });
  useEffect(() => {
    const move = (e) => { cursorX.set(e.clientX - 8); cursorY.set(e.clientY - 8); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);
  return <motion.div className="fixed top-0 left-0 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-30 blur-sm pointer-events-none z-[9999] mix-blend-screen" style={{ x: springX, y: springY }} />;
}
