import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchSponsors } from '../lib/content';

const ORDER = ['platinum', 'gold', 'silver', 'supporter'];
const SIZE = {
  platinum: 'h-20 sm:h-24 min-w-[9rem] sm:min-w-[11rem]',
  gold: 'h-16 sm:h-20 min-w-[7.5rem] sm:min-w-[9rem]',
  silver: 'h-14 sm:h-16 min-w-[6.5rem] sm:min-w-[7.5rem]',
  supporter: 'h-12 sm:h-14 min-w-[5.5rem] sm:min-w-[6.5rem]',
};

// Deretan logo sponsor di footer. Tidak tampil sama sekali kalau belum ada sponsor,
// dan disembunyikan di halaman /sponsor karena daftarnya sudah ada di halaman itu.
export default function SponsorStrip() {
  const [list, setList] = useState([]);

  useEffect(() => {
    let alive = true;
    fetchSponsors().then((l) => alive && setList(l));
    return () => { alive = false; };
  }, []);

  if (!list.length || window.location.pathname.startsWith('/sponsor')) return null;
  const sorted = [...list].sort((a, b) => ORDER.indexOf(a.tier) - ORDER.indexOf(b.tier));

  return (
    <section aria-label="Sponsor" className="mt-12 md:mt-16 text-center">
      <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-6">Didukung oleh</p>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {sorted.map((s) => {
          const box = (
            <div className={`${SIZE[s.tier] || SIZE.supporter} rounded-2xl bg-white flex items-center justify-center px-4 py-2 overflow-hidden`}>
              {s.logo ? (
                <img src={s.logo} alt={s.name} loading="lazy" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-sm font-bold text-zinc-800">{s.name}</span>
              )}
            </div>
          );
          return s.website ? (
            <a key={s.id || s.name} href={s.website} target="_blank" rel="noopener noreferrer sponsored" title={s.name} className="block hover:scale-105 transition-transform duration-300">{box}</a>
          ) : (
            <div key={s.id || s.name} title={s.name}>{box}</div>
          );
        })}
      </div>
      <a href="/sponsor" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
        Lihat semua sponsor <ArrowRight className="w-4 h-4" />
      </a>
    </section>
  );
}
