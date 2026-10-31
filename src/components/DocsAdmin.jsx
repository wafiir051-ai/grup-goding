import { useEffect, useState } from 'react';
import { Edit2, Trash2, Save, Upload, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { explainError, shrinkImage, slugify } from '../lib/content';

const BUCKET = 'dokumentasi';
const EMPTY = { title: '', slug: '', description: '', event_date: '', order_index: 0, is_published: true };
const input = 'p-4 bg-zinc-800 rounded-2xl text-white';
const MAX_UPLOAD = 5 * 1024 * 1024;

const removeFiles = async (rows) => {
  const paths = rows.map((r) => r.storage_path).filter(Boolean);
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
};

export default function DocsAdmin() {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [openAlbum, setOpenAlbum] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => {
    const [a, p] = await Promise.all([
      supabase.from('doc_albums').select('*').order('order_index').order('event_date', { ascending: false }),
      supabase.from('doc_photos').select('*').order('order_index').order('created_at'),
    ]);
    const err = a.error || p.error;
    if (err) setMsg({ type: 'err', text: explainError(err) });
    setAlbums(a.data || []);
    setPhotos(p.data || []);
  };
  useEffect(() => { load(); }, []);

  const photosOf = (id) => photos.filter((p) => p.album_id === id);
  const reset = () => { setForm(EMPTY); setEditing(null); };

  const submitAlbum = async (e) => {
    e.preventDefault();
    const slug = slugify(form.slug || form.title);
    if (!slug) return setMsg({ type: 'err', text: 'Judul album tidak valid.' });
    setBusy(true);
    setMsg({ type: '', text: '' });
    const payload = {
      title: form.title.trim(),
      slug,
      description: form.description.trim() || null,
      event_date: form.event_date || null,
      order_index: parseInt(form.order_index, 10) || 0,
      is_published: form.is_published,
    };
    const q = editing ? supabase.from('doc_albums').update(payload).eq('id', editing.id) : supabase.from('doc_albums').insert([payload]);
    const { error } = await q;
    setBusy(false);
    if (error) return setMsg({ type: 'err', text: explainError(error) });
    setMsg({ type: 'ok', text: editing ? 'Album diperbarui.' : 'Album dibuat. Klik "Kelola foto" untuk mengunggah foto.' });
    reset();
    load();
  };

  const editAlbum = (a) => {
    setEditing(a);
    setForm({ title: a.title, slug: a.slug, description: a.description || '', event_date: a.event_date || '', order_index: a.order_index, is_published: a.is_published });
    window.scrollTo(0, 0);
  };

  const deleteAlbum = async (a) => {
    if (!confirm(`Hapus album "${a.title}" beserta ${photosOf(a.id).length} fotonya?`)) return;
    await removeFiles(photosOf(a.id));
    const { error } = await supabase.from('doc_albums').delete().eq('id', a.id);
    setMsg(error ? { type: 'err', text: explainError(error) } : { type: 'ok', text: 'Album dihapus.' });
    if (openAlbum === a.id) setOpenAlbum(null);
    load();
  };

  const [dragging, setDragging] = useState(false);

  const onPick = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    uploadFiles(files);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files || []));
  };

  const uploadFiles = async (files) => {
    if (!files.length || !openAlbum || busy) return;
    setBusy(true);
    setMsg({ type: '', text: '' });
    let done = 0;
    const failed = [];
    let order = photosOf(openAlbum).reduce((m, p) => Math.max(m, p.order_index), -1) + 1;
    for (const original of files) {
      setProgress(`Mengunggah ${done + failed.length + 1} dari ${files.length}...`);
      try {
        if (!/^image\/(png|jpeg|webp)$/.test(original.type)) throw new Error('format bukan PNG/JPG/WEBP');
        const blob = await shrinkImage(original);
        if (blob.size > MAX_UPLOAD) throw new Error('lebih dari 5 MB');
        const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg';
        const path = `${openAlbum}/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: blob.type });
        if (up.error) throw up.error;
        const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
        const ins = await supabase.from('doc_photos').insert([{ album_id: openAlbum, image_url: url, storage_path: path, order_index: order++ }]);
        if (ins.error) {
          await supabase.storage.from(BUCKET).remove([path]);
          throw ins.error;
        }
        done++;
      } catch (err) {
        failed.push(`${original.name}: ${explainError(err) || err.message}`);
      }
    }
    setBusy(false);
    setProgress('');
    setMsg(failed.length
      ? { type: 'err', text: `${done} foto terunggah, ${failed.length} gagal. ${failed.slice(0, 3).join(' | ')}` }
      : { type: 'ok', text: `${done} foto terunggah.` });
    load();
  };

  const saveCaption = async (photo, caption) => {
    if ((photo.caption || '') === caption) return;
    const { error } = await supabase.from('doc_photos').update({ caption: caption.trim() || null }).eq('id', photo.id);
    setMsg(error ? { type: 'err', text: explainError(error) } : { type: 'ok', text: 'Keterangan disimpan.' });
    load();
  };

  const deletePhoto = async (photo) => {
    if (!confirm('Hapus foto ini?')) return;
    await removeFiles([photo]);
    const { error } = await supabase.from('doc_photos').delete().eq('id', photo.id);
    setMsg(error ? { type: 'err', text: explainError(error) } : { type: 'ok', text: 'Foto dihapus.' });
    load();
  };

  const banner = msg.text && (
    <div className={`${msg.type === 'err' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'} p-4 rounded-2xl mb-6`}>{msg.text}</div>
  );

  if (openAlbum) {
    const album = albums.find((a) => a.id === openAlbum);
    const list = photosOf(openAlbum);
    return (
      <>
        <button onClick={() => { setOpenAlbum(null); setMsg({ type: '', text: '' }); }} className="flex items-center gap-2 text-cyan-400 mb-4"><ArrowLeft size={18} /> Kembali ke daftar album</button>
        <h2 className="text-2xl font-bold text-white mb-1">{album?.title}</h2>
        <p className="text-zinc-500 text-sm mb-6">{list.length} foto · tampil di /dokumentasi/{album?.slug}. Foto pertama jadi sampul album.</p>
        {banner}
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-3xl p-10 mb-8 cursor-pointer text-zinc-300 transition-colors ${dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-zinc-700 hover:border-cyan-500'} ${busy ? 'opacity-60 pointer-events-none' : ''}`}>
          <Upload size={28} />
          <span className="font-semibold">{busy ? progress || 'Memproses...' : dragging ? 'Lepaskan foto di sini' : 'Seret foto dari Finder ke sini, atau klik untuk memilih'}</span>
          <span className="text-xs text-zinc-500">PNG / JPG / WEBP. Otomatis dikecilkan ke maks 1800 px.</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={onPick} className="hidden" />
        </label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((ph) => (
            <div key={ph.id} className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
              <img src={ph.image_url} alt={ph.caption || ''} loading="lazy" className="w-full aspect-[4/3] object-cover" />
              <div className="p-3 flex gap-2 items-center">
                <input defaultValue={ph.caption || ''} placeholder="Keterangan (opsional)" onBlur={(e) => saveCaption(ph, e.target.value)} className="flex-1 min-w-0 p-3 bg-zinc-800 rounded-xl text-white text-sm" />
                <button onClick={() => deletePhoto(ph)} className="p-3 bg-red-900/40 rounded-xl shrink-0"><Trash2 size={16} className="text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && <p className="text-zinc-500 text-center py-10">Belum ada foto.</p>}
      </>
    );
  }

  return (
    <>
      {banner}
      <form onSubmit={submitAlbum} className="bg-zinc-900 p-8 rounded-3xl mb-12">
        <h2 className="text-2xl mb-2 text-white font-bold">{editing ? 'Edit Album' : 'Buat Album Dokumentasi'}</h2>
        <p className="text-zinc-500 text-sm mb-6">Satu album = satu kegiatan/acara. Foto diunggah setelah album dibuat.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <input placeholder="Judul album *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} required />
          <input placeholder="Alamat/slug (otomatis dari judul)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={input} />
          <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={input} />
          <input placeholder="Urutan (kecil = lebih atas)" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: e.target.value })} className={input} />
          <textarea placeholder="Deskripsi singkat (opsional)" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${input} md:col-span-2`} />
          <label className="flex gap-3 text-white items-center"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Tampilkan di halaman</label>
        </div>
        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={busy} className="px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2 disabled:opacity-60"><Save size={20} /> {editing ? 'Simpan' : 'Buat Album'}</button>
          {editing && <button type="button" onClick={reset} className="px-6 py-4 bg-zinc-800 text-zinc-300 rounded-2xl">Batal</button>}
        </div>
      </form>

      <h3 className="text-xl font-bold text-white mb-4">Daftar Album ({albums.length})</h3>
      <div className="grid gap-4">
        {albums.map((a) => {
          const list = photosOf(a.id);
          return (
            <div key={a.id} className="bg-zinc-900 p-5 rounded-3xl flex justify-between items-center gap-4 border border-zinc-800">
              <div className="flex items-center gap-4 min-w-0">
                {list[0] ? <img src={list[0].image_url} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0" /> : <div className="w-16 h-16 rounded-2xl bg-zinc-800 shrink-0" />}
                <div className="min-w-0">
                  <h4 className="text-lg font-semibold text-white truncate">{a.title}</h4>
                  <p className="text-zinc-500 text-sm">{list.length} foto{a.event_date ? ` · ${a.event_date}` : ''} · /dokumentasi/{a.slug} {!a.is_published && <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full ml-1">Disembunyikan</span>}</p>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => { setOpenAlbum(a.id); setMsg({ type: '', text: '' }); window.scrollTo(0, 0); }} className="px-4 py-3 bg-cyan-700 text-white rounded-2xl text-sm font-semibold">Kelola foto</button>
                <button onClick={() => editAlbum(a)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={18} className="text-white" /></button>
                <button onClick={() => deleteAlbum(a)} className="p-3 bg-red-900/40 rounded-2xl"><Trash2 size={18} className="text-red-400" /></button>
              </div>
            </div>
          );
        })}
        {albums.length === 0 && <p className="text-zinc-500 text-center py-12">Belum ada album.</p>}
      </div>
    </>
  );
}
