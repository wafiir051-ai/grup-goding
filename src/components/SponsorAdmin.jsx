import { useEffect, useState } from 'react';
import { Edit2, Trash2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { explainError } from '../lib/content';
import DropZone from './DropZone';

const TIERS = [['platinum', 'Platinum'], ['gold', 'Gold'], ['silver', 'Silver'], ['supporter', 'Supporter']];
const EMPTY = { name: '', tier: 'supporter', logo_url: '', website: '', since: '', note: '', order_index: 0, is_active: true };
const MAX_BYTES = 2 * 1024 * 1024;
const input = 'p-4 bg-zinc-800 rounded-2xl text-white';

export default function SponsorAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => {
    const { data, error } = await supabase.from('sponsors').select('*').order('order_index').order('name');
    if (error) setMsg({ type: 'err', text: explainError(error) });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setForm(EMPTY); setEditing(null); setFile(null); setPreview(''); };

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(f.type)) return setMsg({ type: 'err', text: 'Logo harus PNG, JPG, WEBP, atau SVG.' });
    if (f.size > MAX_BYTES) return setMsg({ type: 'err', text: 'Ukuran logo maksimal 2 MB.' });
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const uploadLogo = async () => {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('sponsors').upload(path, file, { contentType: file.type });
    if (error) throw error;
    return supabase.storage.from('sponsors').getPublicUrl(path).data.publicUrl;
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: '', text: '' });
    try {
      let logo_url = form.logo_url || null;
      if (file) logo_url = await uploadLogo();
      const payload = {
        name: form.name.trim(),
        tier: form.tier,
        logo_url,
        website: form.website.trim() || null,
        since: form.since.trim() || null,
        note: form.note.trim() || null,
        order_index: parseInt(form.order_index, 10) || 0,
        is_active: form.is_active,
      };
      const q = editing ? supabase.from('sponsors').update(payload).eq('id', editing.id) : supabase.from('sponsors').insert([payload]);
      const { error } = await q;
      if (error) throw error;
      setMsg({ type: 'ok', text: editing ? 'Sponsor diperbarui.' : 'Sponsor ditambahkan.' });
      reset();
      load();
    } catch (err) {
      setMsg({ type: 'err', text: explainError(err) });
    } finally {
      setBusy(false);
    }
  };

  const edit = (s) => {
    setEditing(s);
    setForm({ name: s.name, tier: s.tier, logo_url: s.logo_url || '', website: s.website || '', since: s.since || '', note: s.note || '', order_index: s.order_index, is_active: s.is_active });
    setFile(null);
    setPreview(s.logo_url || '');
    window.scrollTo(0, 0);
  };

  const remove = async (s) => {
    if (!confirm(`Hapus sponsor "${s.name}"?`)) return;
    const { error } = await supabase.from('sponsors').delete().eq('id', s.id);
    setMsg(error ? { type: 'err', text: explainError(error) } : { type: 'ok', text: 'Sponsor dihapus.' });
    load();
  };

  return (
    <>
      {msg.text && (
        <div className={`${msg.type === 'err' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'} p-4 rounded-2xl mb-6`}>{msg.text}</div>
      )}
      <form onSubmit={submit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
        <h2 className="text-2xl mb-2 text-white font-bold">{editing ? 'Edit Sponsor' : 'Tambah Sponsor'}</h2>
        <p className="text-zinc-500 text-sm mb-6">Tampil di halaman /sponsor sesuai tingkatannya.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <input placeholder="Nama sponsor *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} required />
          <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })} className={input}>
            {TIERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input placeholder="Website (https://...)" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={input} />
          <input placeholder="Mendukung sejak (cth: 2026)" value={form.since} onChange={(e) => setForm({ ...form, since: e.target.value })} className={input} />
          <textarea placeholder="Catatan singkat (opsional)" rows="2" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={`${input} md:col-span-2`} />
          <div className="md:col-span-2">
            <label className="block text-zinc-400 text-sm mb-2">Logo (PNG/JPG/WEBP/SVG, maks 2 MB)</label>
            <DropZone accept="image/png,image/jpeg,image/webp,image/svg+xml" hint="PNG / JPG / WEBP / SVG, maks 2 MB" onFiles={(files) => pickFile({ target: { files } })} />
            {preview && <img src={preview} alt="preview" className="h-20 mt-3 object-contain bg-white p-2 rounded-xl" />}
          </div>
          <input placeholder="Urutan (kecil = lebih atas)" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: e.target.value })} className={input} />
          <label className="flex gap-3 text-white items-center"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Tampilkan di halaman</label>
        </div>
        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={busy} className="px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2 disabled:opacity-60"><Save size={20} /> {busy ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}</button>
          {editing && <button type="button" onClick={reset} className="px-6 py-4 bg-zinc-800 text-zinc-300 rounded-2xl">Batal</button>}
        </div>
      </form>

      <h3 className="text-xl font-bold text-white mb-4">Daftar Sponsor ({items.length})</h3>
      <div className="grid gap-4">
        {items.map((s) => (
          <div key={s.id} className="bg-zinc-900 p-5 rounded-3xl flex justify-between items-center gap-4 border border-zinc-800">
            <div className="flex items-center gap-4 min-w-0">
              {s.logo_url ? <img src={s.logo_url} alt={s.name} className="h-12 w-16 object-contain bg-white p-1 rounded" /> : <div className="h-12 w-16 rounded bg-zinc-800 flex items-center justify-center text-white font-black">{s.name.charAt(0).toUpperCase()}</div>}
              <div className="min-w-0">
                <h4 className="text-lg font-semibold text-white truncate">{s.name}</h4>
                <p className="text-zinc-500 text-sm">{TIERS.find(([v]) => v === s.tier)?.[1]} · #{s.order_index} {!s.is_active && <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full ml-1">Disembunyikan</span>}</p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => edit(s)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={18} className="text-white" /></button>
              <button onClick={() => remove(s)} className="p-3 bg-red-900/40 rounded-2xl"><Trash2 size={18} className="text-red-400" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-zinc-500 text-center py-12">Belum ada sponsor.</p>}
      </div>
    </>
  );
}
