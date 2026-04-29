import RevealOnScroll from './RevealOnScroll';
const steps = [
  { num: "01", title: "Discovery", desc: "Memahami visi, audiens, dan tujuan bisnis Anda" },
  { num: "02", title: "Design", desc: "Wireframe → High-fidelity mockup dengan motion prototype" },
  { num: "03", title: "Code", desc: "Development premium dengan Framer Motion & clean code" },
  { num: "04", title: "Launch", desc: "Testing, deployment, dan hand-over dengan training" },
];
export default function ProcessSticky() {
  return (
    <section className="bg-zinc-50 py-24"><div className="max-w-7xl mx-auto px-6"><div className="grid md:grid-cols-2 gap-12 items-start"><RevealOnScroll componentName="process"><div><div className="text-sm font-semibold uppercase text-blue-600 mb-4">PROSES KAMI</div><h2 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">Dari ide <br /> hingga live <br /> dalam 4 langkah</h2></div></RevealOnScroll><div className="space-y-20">{steps.map((step,i)=><RevealOnScroll key={i} componentName="process"><div className="flex gap-6 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all"><div className="text-6xl font-bold text-blue-200">{step.num}</div><div><h3 className="text-3xl font-bold mb-3 text-gray-800">{step.title}</h3><p className="text-gray-600">{step.desc}</p></div></div></RevealOnScroll>)}</div></div></div></section>
  );
}
