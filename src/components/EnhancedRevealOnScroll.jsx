import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function EnhancedRevealOnScroll({ children, delay = 0, direction = "up", type = "fade", once = false, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: once, amount: 0.2, margin: "-50px" });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: 0,
      scale: type === "scale" ? 0.7 : 1,
      rotate: type === "rotate" ? -10 : 0,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15, delay: delay, duration: 0.6 },
    },
  };
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
