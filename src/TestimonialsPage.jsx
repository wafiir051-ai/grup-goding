import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { ArrowLeft } from 'lucide-react';
import MagneticButton from './components/MagneticButton';

export default function TestimonialsPage() {
  const [tests, setTests] = useState([]);
  useEffect(() => {
    supabase.from('testimonials').select('*').then(({ data }) => setTests(data || []));
  }, []);
  const goBack = () => window.location.href = '/';
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={goBack}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-semibold text-xl text-gray-800">goding</span>
          </div>
          <MagneticButton onClick={goBack} className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </MagneticButton>
        </div>
      </nav>
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl text-center mb-10">Semua Testimonial</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {tests.map(t => (
            <div key={t.id} className="bg-gray-100 p-6 rounded-xl">
              <div className="font-bold">{t.name}</div>
              <p className="mt-2 italic">"{t.content}"</p>
              <div className="mt-1 text-yellow-500">{'★'.repeat(t.rating)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
