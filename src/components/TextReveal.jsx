import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
export default function TextReveal({ text, delay=0, className="" }) {
  const [ref, inView] = useInView({ triggerOnce:false, threshold:0.1 });
  const words = text.split(' ');
  return (
    <motion.div ref={ref} className={`flex flex-wrap ${className}`} initial="hidden" animate={inView?"visible":"hidden"} variants={{
      hidden: { opacity:1 },
      visible: { opacity:1, transition: { staggerChildren:0.05, delayChildren:delay } }
    }}>
      {words.map((word,i)=> <motion.span key={i} variants={{ hidden: { y:40, opacity:0, rotateX:90, filter:"blur(5px)" }, visible: { y:0, opacity:1, rotateX:0, filter:"blur(0px)", transition:{ type:"spring", damping:12, stiffness:100 } } }} className="inline-block mr-2">{word}</motion.span>)}
    </motion.div>
  );
}
