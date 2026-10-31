import { supabase } from './supabase';
import { SPONSORS as STATIC_SPONSORS } from '../data/sponsors';

const toSponsor = (r) => ({
  id: r.id,
  name: r.name,
  tier: r.tier,
  logo: r.logo_url,
  website: r.website,
  since: r.since,
  note: r.note,
});

export async function fetchSponsors() {
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('name', { ascending: true });
  if (error) {
    console.warn('Sponsor: gagal baca Supabase, pakai data statis.', error.message);
    return STATIC_SPONSORS;
  }
  return (data || []).map(toSponsor);
}

// Dokumentasi = album foto.
export async function fetchAlbums() {
  const [a, p] = await Promise.all([
    supabase.from('doc_albums').select('*').eq('is_published', true).order('order_index').order('event_date', { ascending: false }),
    supabase.from('doc_photos').select('*').order('order_index').order('created_at'),
  ]);
  const error = a.error || p.error;
  if (error) {
    console.warn('Dokumentasi: gagal baca Supabase.', error.message);
    return { albums: [], error: true };
  }
  const byAlbum = {};
  (p.data || []).forEach((r) => {
    (byAlbum[r.album_id] ||= []).push({ id: r.id, url: r.image_url, caption: r.caption || '' });
  });
  const albums = (a.data || []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description || '',
    date: r.event_date,
    photos: byAlbum[r.id] || [],
  }));
  return { albums, error: false };
}

// Kecilkan foto di browser sebelum upload (maks 1800px, WEBP) supaya hemat kuota.
export async function shrinkImage(file, maxSide = 1800, quality = 0.85) {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', quality));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export function explainError(error) {
  if (!error) return '';
  if (error.code === '42501' || /row-level security/i.test(error.message || '')) {
    return 'Ditolak: akun ini bukan admin. Tambahkan email-nya ke tabel admin_users.';
  }
  if (error.code === '23505') return 'Data sudah ada (alamat/slug kembar).';
  if (error.code === '42P01') return 'Tabel belum dibuat. Jalankan migrasi SQL dulu.';
  return error.message || 'Terjadi kesalahan.';
}

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
