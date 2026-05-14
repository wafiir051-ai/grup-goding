import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';

export default function ClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from('clients').select('*').eq('is_active', true).order('order_index', { ascending: true });
      if (data) setClients(data);
      setLoading(false);
    };
    fetchClients();
  }, []);

  if (loading || clients.length === 0) return null;

  return (
    <section id="clients" style={{background:"linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f8faff 100%)"}} className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll componentName="clients" direction="up" className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">Dipercaya Oleh</h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600">Brand & UMKM Terpercaya yang Telah Bekerja Sama dengan Kami</p>
        </RevealOnScroll>
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-12 md:gap-16 lg:gap-20">
          {clients.map((client) => (
            <div key={client.id} className="w-24 sm:w-32 md:w-40 lg:w-48 grayscale hover:grayscale-0 transition-all duration-300">
              <img src={client.logo_url} alt={client.name} className="w-full h-auto object-contain" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
