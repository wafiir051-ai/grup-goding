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
    <section id="clients" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll componentName="clients" direction="up" className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Dipercaya Oleh</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Brand & UMKM Terpercaya yang Telah Bekerja Sama dengan Kami</p>
        </RevealOnScroll>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
          {clients.map((client) => (
            <div key={client.id} className="w-24 sm:w-28 md:w-32 lg:w-40 grayscale hover:grayscale-0 transition-all duration-300">
              <img src={client.logo_url} alt={client.name} className="w-full h-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
