import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "../lib/supabase";
import RevealOnScroll from "./RevealOnScroll";

const DEFAULTS = {
  plans: [
    {
      id: "1", name: "BASIC", price: 3000000, period: "3 Bulan",
      description: "Starter Plan untuk pemula",
      features: ["Template Dasar","3 Halaman","Responsive Design","Hosting 3 Bulan","Support 3 Bulan"],
      tech_stack: ["HTML5","CSS3","JavaScript","Tailwind CSS"],
      popular: false
    },
    {
      id: "2", name: "PROFESSIONAL", price: 8000000, period: "Tahun",
      description: "Untuk bisnis yang ingin tampil premium",
      features: ["Unlimited Pages","Custom Domain 1 Tahun","Luxury Design + Motion","Priority Support 1 Tahun"],
      tech_stack: ["React.js","Next.js","Tailwind CSS","Framer Motion","Supabase"],
      popular: false
    },
    {
      id: "3", name: "PESANTREN MADANI", price: 10000000, period: "Tahun",
      description: "Paket Untuk Pondok Pesantren",
      features: ["Profil Digital Eksklusif","Google Search & Indexing","WhatsApp Direct Chat","Google Analytics Dashboard"],
      tech_stack: ["React.js + Next.js","Supabase + Realtime","Vercel Edge Ready","Tailwind CSS"],
      popular: false
    },
    {
      id: "4", name: "ESSENTIAL", price: 20000000, period: "Tahun",
      description: "Paket paling laris untuk UMKM",
      features: ["5 Halaman Custom","Custom Domain 1 Tahun","Premium UI/UX","Hosting 1 Tahun","Support 6 Bulan"],
      tech_stack: ["React.js","Tailwind CSS","Framer Motion","Supabase","SEO Friendly"],
      popular: true
    },
    {
      id: "5", name: "ENTERPRISE", price: 30000000, period: "3 Tahun",
      description: "Solusi lengkap untuk perusahaan",
      features: ["Google Search Console & Indexing","Custom Admin Dashboard","Integrasi WhatsApp Business","Multi-Language Support","Google Analytics Integration"],
      tech_stack: ["React.js + Next.js","TypeScript","Tailwind CSS","Framer Motion","Supabase + Realtime"],
      popular: false
    }
  ]
};

function TechSlide({ name }) {
  return (
    <div className="flex-shrink-0 mx-1.5">
      <div className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 hover:border-cyan-500/40 transition-all duration-300 cursor-default">
        <span className="text-xs font-medium text-zinc-400 hover:text-cyan-300 transition-colors whitespace-nowrap">
          {name}
        </span>
      </div>
    </div>
  );
}

function Card3D({ children, isPopular, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 100, damping: 20 });
  const sy = useSpring(y, { stiffness: 100, damping: 20 });
  const rotX = useTransform(sy, [-100, 100], [8, -8]);
  const rotY = useTransform(sx, [-100, 100], [-8, 8]);

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className={`relative rounded-2xl border p-6 backdrop-blur-md transition-shadow duration-300 ${
        isPopular
          ? "border-cyan-500/40 bg-zinc-900/80 shadow-lg shadow-cyan-500/10"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      } ${className}`}
    >
      <div style={{ transform: "translateZ(40px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

function EmblaCarousel({ slides, options }) {
  const [emblaRef] = useEmblaCarousel(
    { ...options, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((tech, i) => (
          <TechSlide key={i} name={tech} />
        ))}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [plans, setPlans] = useState(DEFAULTS.plans);

  useEffect(() => {
    supabase
      .from("pricing_plans")
      .select("*")
      .order("price", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setPlans(data);
      })
      .catch(() => {});
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <section id="pricing" className="relative py-20 px-4 sm:px-6 bg-[#0a0a0a] overflow-hidden">
      <RevealOnScroll>
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 rounded-full mb-4">
            Pilihan Paket
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Investasi Digital untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Bisnis Anda
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg">
            Setiap paket dibangun dengan teknologi modern, animasi premium, dan performa super cepat.
          </p>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <RevealOnScroll key={plan.id} delay={index * 0.1}>
            <Card3D isPopular={plan.popular} className="flex flex-col h-full group">
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                  PALING LARIS
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-zinc-500">/{plan.period}</span>
                  )}
                </div>
                {plan.description && (
                  <p className="text-zinc-500 text-sm mt-2">{plan.description}</p>
                )}
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features?.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <svg className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {plan.tech_stack?.length > 0 && (
                <div className="border-t border-zinc-800 pt-4 mt-auto">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Teknologi
                  </p>
                  <EmblaCarousel slides={plan.tech_stack} options={{ dragFree: true, loop: true }} />
                </div>
              )}

              <motion.a
                href={"https://wa.me/6281234567890?text=Halo%20Goding,%20saya%20tertarik%20paket%20" + encodeURIComponent(plan.name)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-6 inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                Pilih Paket
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </Card3D>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}