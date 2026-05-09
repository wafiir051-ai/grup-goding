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
    <section className="bg-zinc-50 py-16 md:py-24 overflow-hidden">
      <div className="w-full px-4 sm:px-6 max-w-3xl mx-auto">

        <RevealOnScroll componentName="process">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">PROSES KAMI</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-snug">
              Dari ide hingga live<br />dalam 4 langkah
            </h2>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <RevealOnScroll key={i} componentName="process">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-4 bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <span className="text-4xl sm:text-5xl font-bold text-blue-200 leading-none shrink-0 w-12 sm:w-16 text-center">
                  {step.num}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
