import { motion } from 'framer-motion';
import RevealOnScroll from './RevealOnScroll';

// Data logo klien (sementara statis, nanti bisa dari database)
const clients = [
  { name: 'PT Maju Jaya', logo: 'https://placehold.co/200x100/1e3a8a/white?text=Maju+Jaya' },
  { name: 'CV Kreatif Abadi', logo: 'https://placehold.co/200x100/0d9488/white?text=Kreatif+Abadi' },
  { name: 'UD Berkah Sentosa', logo: 'https://placehold.co/200x100/ea580c/white?text=Berkah+Sentosa' },
  { name: 'PT Teknologi Nusantara', logo: 'https://placehold.co/200x100/2563eb/white?text=Teknologi+Nusantara' },
  { name: 'CV Digital Inovasi', logo: 'https://placehold.co/200x100/7c3aed/white?text=Digital+Inovasi' },
  { name: 'UD Karya Gemilang', logo: 'https://placehold.co/200x100/db2777/white?text=Karya+Gemilang' },
];

export default function TrustedClients() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll componentName="clients">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Telah Dipercaya Oleh</h2>
            <p className="text-lg text-gray-600">Lebih dari 50+ UMKM & Perusahaan</p>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {clients.map((client, idx) => (
            <RevealOnScroll key={idx} delay={idx * 0.05}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
