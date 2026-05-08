import RevealOnScroll from './RevealOnScroll';

const steps = [
  { num: "01", title: "Discovery", desc: "Memahami visi, audiens, dan tujuan bisnis Anda" },
  { num: "02", title: "Design", desc: "Wireframe → High-fidelity mockup dengan motion prototype" },
  { num: "03", title: "Code", desc: "Development premium dengan Framer Motion & clean code" },
  { num: "04", title: "Launch", desc: "Testing, deployment, dan hand-over dengan training" },
];

export default function ProcessSticky() {
  return (
    <section className="bg-zinc-50 py-16 md:py-24 px-4 sm:px-6 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-start w-full">
          
          <RevealOnScroll componentName="process">
            <div className="text-center lg:text-left w-full">
              <div className="text-xs font-semibold uppercase text-blue-600 mb-3">PROSES KAMI</div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight break-words w-full">
                Dari ide hingga live dalam 4 langkah
              </h2>
            </div>
          </RevealOnScroll>
          
          <div className="space-y-4 md:space-y-8 w-full">
            {steps.map((step, i) => (
              <RevealOnScroll key={i} componentName="process">
                <div className="flex gap-3 md:gap-6 p-4 md:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all w-full overflow-hidden">
                  <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-blue-200 shrink-0 w-12 sm:w-16">{step.num}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 md:mb-3 text-gray-800">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed break-words">{step.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
