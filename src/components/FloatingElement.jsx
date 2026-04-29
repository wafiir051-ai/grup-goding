import { motion } from 'framer-motion';
export default function FloatingElement({ children, delay=0, duration=3, className="" }) {
  return <motion.div className={className} animate={{ y:[0,-15,0] }} transition={{ duration, repeat:Infinity, repeatType:"reverse", ease:"easeInOut", delay }}>{children}</motion.div>;
}
