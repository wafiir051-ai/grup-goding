import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RevealOnScroll from './RevealOnScroll';
export default function EnvelopeTestimonials() {
  const [tests, setTests] = useState([]);
  useEffect(() => { supabase.from('testimonials').select('*').then(({ data }) => setTests(data || [])); }, []);
  return (
    <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-6"><RevealOnScroll componentName="testimonials"><h2 className="text-5xl font-bold text-center text-gray-800 mb-12">Apa Kata Klien Kami</h2></RevealOnScroll>
    <RevealOnScroll componentName="testimonials"><div className="relative bg-white/90 rounded-3xl shadow-2xl p-8 border border-gray-200"><div className="text-center text-gray-400 mb-6">📩 surat dari klien</div><div className="grid md:grid-cols-3 gap-6">{tests.map((t)=> (<div key={t.id} className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">{t.avatar || t.name.charAt(0)}</div><div><div className="font-bold text-gray-800">{t.name}</div>{t.role && <div className="text-xs text-gray-500">{t.role}</div>}</div></div><div className="text-yellow-500 mt-2">{'★'.repeat(t.rating)}</div><p className="mt-3 italic text-gray-600">"{t.content}"</p></div>))}</div></div></RevealOnScroll></div></section>
  );
}
