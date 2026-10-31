import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Handshake, Sparkles, Check } from 'lucide-react';
import PageShell from './components/PageShell';
import WhatsAppModal from './components/WhatsAppModal';
import { SPONSOR_TIERS } from './data/sponsors';
import { fetchSponsors } from './lib/content';

// Tampilan tiap tingkatan: lebar grid, tinggi kotak logo, dan warna aksen.
const TIER_STYLE = {
  platinum: { grid: 'grid-cols-1 sm:grid-cols-2', logoBox: 'h-36', accent: 'text-cyan-300 border-cyan-400/40 bg-cyan-400/10' },
  gold: { grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', logoBox: 'h-28', accent: 'text-amber-300 border-amber-400/40 bg-amber-400/10' },
  silver: { grid: 'grid-cols-2 lg:grid-cols-4', logoBox: 'h-24', accent: 'text-zinc-200 border-zinc-300/30 bg-zinc-300/10' },
  supporter: { grid: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4', logoBox: 'h-20', accent: 'text-emerald-300 border-emerald-400/40 bg-emerald-400/10' },
};
const FALLBACK_STYLE = TIER_STYLE.supporter;

function SponsorCard({ sponsor, tierId }) {
  const style = TIER_STYLE[tierId] || FALLBACK_STYLE;
  const letter = (sponsor.name || '?').trim().charAt(0).toUpperCase();
  const body = (
    <>
      <div className={`${style.logoBox} rounded-2xl bg-white flex items-center justify-center p-4 overflow-hidden`}>
        {sponsor.logo ? (
          <img src={sponsor.logo} alt={sponsor.name} loading="lazy" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-4xl font-black text-zinc-800 select-none">{letter}</span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-white text-base leading-snug break-words">{sponsor.name}</h3>
        {sponsor.since && <p className="text-xs text-zinc-500 mt-0.5">Mendukung sejak {sponsor.since}</p>}
        {sponsor.note && <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{sponsor.note}</p>}
        {sponsor.website && (
          <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
            Kunjungi website <ExternalLink className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </>
  );
  const cls = 'group block h-full bg-zinc-900/80 border border-white/10 rounded-3xl p-4 sm:p-5 transition-colors hover:border-cyan-400/50';
  return sponsor.website ? (
    <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default function SponsorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [sponsors, setSponsors] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchSponsors().then((list) => alive && setSponsors(list));
    return () => { alive = false; };
  }, []);
  const SPONSORS = sponsors || [];

  const openModal = (msg) => {
    setPendingMessage(msg);
    setIsModalOpen(true);
  };
  const handleSelectNumber = (phoneNumber, message) => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsModalOpen(false);
  };

  const tiersWithSponsors = SPONSOR_TIERS
    .map((tier) => ({ tier, items: SPONSORS.filter((s) => s.tier === tier.id) }))
    .filter((t) => t.items.length > 0);

  return (
    <PageShell title="Sponsor — Goding">
      <WhatsAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleSelectNumber} message={pendingMessage} />

      {/* Header */}
      <div className="pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full mb-8 border bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
          >
            <Handshake className="w-4 h-4" /> SPONSOR &amp; PARTNER
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
          >
            Didukung oleh
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Mereka yang Percaya</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto"
          >
            Terima kasih kepada semua pihak yang ikut mendukung Goding berkarya dan terus belajar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/10 rounded-2xl px-5 py-3">
              <span className="text-2xl font-bold text-cyan-400">{SPONSORS.length}</span>
              <span className="text-sm text-zinc-400">Sponsor</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Daftar sponsor per tingkatan */}
      <div className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto space-y-14">
          {sponsors === null ? (
            <p className="text-center text-zinc-500 py-16">Memuat sponsor...</p>
          ) : tiersWithSponsors.length === 0 ? (
            <div className="text-center rounded-3xl border border-dashed border-white/15 bg-zinc-900/40 px-6 py-16">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Slot sponsor pertama masih terbuka</h2>
              <p className="text-zinc-400 max-w-md mx-auto mb-7">
                Belum ada sponsor yang tampil di sini. Jadilah yang pertama dan logomu akan muncul di halaman ini.
              </p>
              <button
                onClick={() => openModal('Halo, saya tertarik menjadi sponsor Goding.')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-8 py-3.5 rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                Jadi Sponsor Pertama
              </button>
            </div>
          ) : (
            tiersWithSponsors.map(({ tier, items }) => {
              const style = TIER_STYLE[tier.id] || FALLBACK_STYLE;
              return (
                <div key={tier.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border ${style.accent}`}>{tier.name}</span>
                    <span className="text-sm text-zinc-500">{tier.tagline}</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div className={`grid gap-4 sm:gap-6 ${style.grid}`}>
                    {items.map((s) => (
                      <motion.div
                        key={s.id || s.name}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                        transition={{ duration: 0.45 }}
                      >
                        <SponsorCard sponsor={s} tierId={tier.id} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Paket sponsor */}
      <div className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Jadi Sponsor Goding</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">Pilih tingkatan yang cocok, lalu ngobrol langsung lewat WhatsApp untuk detailnya.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SPONSOR_TIERS.map((tier) => {
              const style = TIER_STYLE[tier.id] || FALLBACK_STYLE;
              return (
                <div key={tier.id} className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 flex flex-col">
                  <span className={`self-start text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border ${style.accent}`}>{tier.name}</span>
                  <p className="text-zinc-400 text-sm mt-3 mb-5">{tier.tagline}</p>
                  <ul className="space-y-2.5 mb-6">
                    {tier.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openModal(`Halo, saya tertarik menjadi sponsor Goding tingkat ${tier.name}.`)}
                    className="mt-auto w-full border border-white/15 hover:border-cyan-400/60 hover:text-cyan-300 rounded-xl py-3 text-sm font-semibold transition-colors"
                  >
                    Tanya {tier.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pb-24" />
    </PageShell>
  );
}
