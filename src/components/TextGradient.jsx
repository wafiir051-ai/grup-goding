import { motion } from 'framer-motion';
export default function TextGradient({ children, className = '' }) {
  return <motion.span className={`inline-block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-[length:200%_auto] bg-clip-text text-transparent ${className}`} animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>{children}</motion.span>;
}
