import { motion } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';

const steps = [
  { num: "01", title: "Discovery", desc: "Memahami visi, audiens, dan tujuan bisnis Anda" },
  { num: "02", title: "Design", desc: "Wireframe ke High-fidelity mockup dengan motion prototype" },
  { num: "03", title: "Code", desc: "Development premium dengan Framer Motion dan clean code" },
  { num: "04", title: "Launch", desc: "Testing, deployment, dan hand-over dengan training" },
];

export default function ProcessSticky() {
  return (
    <section className="bg-zinc-50 py-10 md:py-20 w-full overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto px-4">

        <RevealOnScroll componentName="process">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">PROSES KAMI</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-snug">
              Dari ide hingga live<br />dalam 4 langkah
            </h2>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <RevealOnScroll key={i} componentName="process">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="flex items-start gap-3 bg-white rounded-xl shadow-sm p-3 w-full box-border overflow-hidden"
              >
                <span className="text-2xl font-bold text-blue-200 leading-none shrink-0 w-8 text-center pt-0.5">
                  {step.num}
                </span>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className="text-base font-bold text-gray-800 mb-0.5">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed break-words">{step.desc}</p>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
