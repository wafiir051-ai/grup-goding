import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import PageShell from './components/PageShell';
import { fetchAlbums } from './lib/content';

const fmtDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const showDate = (s) => {
  if (!s) return '';
  const [y, m, d] = String(s).split('-').map(Number);
  return fmtDate.format(new Date(y, (m || 1) - 1, d || 1));
};

function Lightbox({ photos, index, onClose, onIndex }) {
  const photo = photos[index];
  const prev = useCallback(() => onIndex((index - 1 + photos.length) % photos.length), [index, photos.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % photos.length), [index, photos.length, onIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = old;
    };
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" role="dialog" aria-modal="true" onClick={onClose}>
      <button onClick={onClose} aria-label="Tutup" className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"><X className="w-6 h-6" /></button>
      {photos.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Foto sebelumnya" className="absolute left-3 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"><ChevronLeft className="w-6 h-6" /></button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Foto berikutnya" className="absolute right-3 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"><ChevronRight className="w-6 h-6" /></button>
        </>
      )}
      <figure className="max-w-[92vw] max-h-[88vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img src={photo.url} alt={photo.caption || 'Foto dokumentasi'} className="max-w-full max-h-[78vh] object-contain rounded-xl" />
        <figcaption className="mt-3 text-center text-sm text-zinc-300">
          {photo.caption && <p className="mb-1">{photo.caption}</p>}
          <span className="text-zinc-500">{index + 1} / {photos.length}</span>
        </figcaption>
      </figure>
    </div>
  );
}

function AlbumGrid({ albums }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {albums.map((al, i) => (
        <motion.a
          key={al.id}
          href={`/dokumentasi/${al.slug}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.05 }}
          className="group block bg-zinc-900/80 border border-white/10 hover:border-cyan-400/50 rounded-3xl overflow-hidden transition-colors"
        >
          <div className="aspect-[4/3] bg-zinc-800 overflow-hidden">
            {al.photos[0] ? (
              <img src={al.photos[0].url} alt={al.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600"><Images className="w-10 h-10" /></div>
            )}
          </div>
          <div className="p-5">
            <h2 className="text-lg font-bold leading-snug break-words">{al.title}</h2>
            <p className="mt-1 text-xs text-zinc-500 flex items-center gap-3 flex-wrap">
              {al.date && <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {showDate(al.date)}</span>}
              <span className="inline-flex items-center gap-1.5"><Images className="w-3.5 h-3.5" /> {al.photos.length} foto</span>
            </p>
            {al.description && <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-2">{al.description}</p>}
          </div>
        </motion.a>
      ))}
    </div>
  );
}

function AlbumView({ album }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <a href="/dokumentasi" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Semua dokumentasi
      </a>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 break-words">{album.title}</h1>
      <p className="text-sm text-zinc-500 flex items-center gap-4 flex-wrap mb-4">
        {album.date && <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {showDate(album.date)}</span>}
        <span className="inline-flex items-center gap-1.5"><Images className="w-4 h-4" /> {album.photos.length} foto</span>
      </p>
      {album.description && <p className="text-zinc-400 max-w-2xl leading-relaxed mb-8">{album.description}</p>}

      {album.photos.length === 0 ? (
        <p className="text-zinc-500 border border-dashed border-white/10 rounded-2xl px-5 py-12 text-center">Belum ada foto di album ini.</p>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 [&>button]:mb-3 sm:[&>button]:mb-4">
          {album.photos.map((ph, i) => (
            <button key={ph.id} onClick={() => setOpen(i)} className="block w-full break-inside-avoid overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 hover:border-cyan-400/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
              <img src={ph.url} alt={ph.caption || `Foto ${i + 1}`} loading="lazy" className="w-full h-auto block" />
            </button>
          ))}
        </div>
      )}
      {open !== null && <Lightbox photos={album.photos} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </div>
  );
}

export default function DocsPage({ path }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchAlbums().then((r) => alive && setState(r));
    return () => { alive = false; };
  }, []);

  let slug = '';
  try {
    slug = decodeURIComponent(path.replace(/^\/dokumentasi\/?/, '').split('/')[0] || '');
  } catch {
    slug = '';
  }
  const albums = state?.albums || [];
  const album = slug ? albums.find((a) => a.slug === slug) : null;
  const totalPhotos = albums.reduce((n, a) => n + a.photos.length, 0);
  const title = album ? `${album.title} — Dokumentasi Goding` : 'Dokumentasi — Goding';

  return (
    <PageShell title={title}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-24">
        {!album && (
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6 border bg-cyan-500/10 border-cyan-500/20 text-cyan-400">
              <Images className="w-4 h-4" /> DOKUMENTASI
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Momen &amp; Kegiatan Goding</h1>
            <p className="text-zinc-400 max-w-xl mx-auto">Kumpulan foto dari kegiatan, acara, dan perjalanan kami.</p>
            {state && !state.error && albums.length > 0 && <p className="text-sm text-zinc-500 mt-4">{albums.length} album · {totalPhotos} foto</p>}
          </div>
        )}

        {state === null ? (
          <p className="text-center text-zinc-500 py-24">Memuat dokumentasi...</p>
        ) : state.error ? (
          <p className="text-center text-zinc-400 border border-dashed border-white/15 rounded-3xl px-6 py-16">Dokumentasi belum bisa dimuat. Coba lagi sebentar lagi.</p>
        ) : slug && !album ? (
          <div className="text-center border border-dashed border-white/15 rounded-3xl px-6 py-16">
            <h1 className="text-2xl font-bold mb-2">Album tidak ditemukan</h1>
            <p className="text-zinc-400 mb-6">Tidak ada album dengan alamat “{slug}”.</p>
            <a href="/dokumentasi" className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform">Lihat semua album</a>
          </div>
        ) : album ? (
          <AlbumView key={album.slug} album={album} />
        ) : albums.length === 0 ? (
          <div className="text-center border border-dashed border-white/15 rounded-3xl px-6 py-16">
            <h2 className="text-2xl font-bold mb-2">Belum ada dokumentasi</h2>
            <p className="text-zinc-400">Album foto akan tampil di sini setelah ditambahkan.</p>
          </div>
        ) : (
          <AlbumGrid albums={albums} />
        )}
      </div>
    </PageShell>
  );
}
