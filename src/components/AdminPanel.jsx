import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Edit2, Trash2, LogOut, Save } from 'lucide-react';

export default function AdminPanel() {
  const { user, signIn, signOut } = useAuth();
  const [plans, setPlans] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [portfolioForm, setPortfolioForm] = useState({ title: '', description: '', full_desc: '', tags: '', link: '', gradient: 'from-blue-600 via-indigo-600 to-purple-600', image_letter: 'P', year: '2025', category: 'Web App', order_index: 0, is_active: true });
  const [testimonials, setTestimonials] = useState([]);
  const [clients, setClients] = useState([]);
  const [marquee, setMarquee] = useState({ text: '', speed: 20, is_active: true });
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [planForm, setPlanForm] = useState({ name: '', price: '', period: '', description: '', features: '', tech_stack: '', popular: false });
  const [testiForm, setTestiForm] = useState({ name: '', role: '', content: '', rating: 5, avatar: '' });
  const [clientForm, setClientForm] = useState({ name: '', logo_url: '', website: '', order_index: 0, is_active: true });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pricing');
  const [message, setMessage] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [clientLogoFile, setClientLogoFile] = useState(null);
  const [clientLogoPreview, setClientLogoPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  const fetchAll = async () => {
    const { data: p } = await supabase.from('pricing_plans').select('*').order('price');
    const { data: t } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    const { data: c } = await supabase.from('clients').select('*').order('order_index');
    const { data: m } = await supabase.from('marquee_settings').select('*').maybeSingle();
    const { data: port } = await supabase.from('portfolios').select('*').order('order_index');
    const { data: logo } = await supabase.from('site_settings').select('value').eq('key', 'logo_url').single();
    setPortfolios(port || []);
    setPlans(p || []); setTestimonials(t || []); setClients(c || []);
    if (m) setMarquee(m);
    if (logo) setLogoUrl(logo.value);
  };

  const handleLogin = async (e) => { e.preventDefault(); setError(''); const err = await signIn(loginEmail, loginPassword); if (err) setError('Email atau password salah'); };

  // Pricing CRUD
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    const featuresArr = planForm.features.split(',').map(s => s.trim()).filter(Boolean);
    const techArr = planForm.tech_stack.split(',').map(s => s.trim()).filter(Boolean);
    const payload = { name: planForm.name, price: parseInt(planForm.price), period: planForm.period, description: planForm.description, features: featuresArr, tech_stack: techArr, popular: planForm.popular };
    if (editingPlan) { await supabase.from('pricing_plans').update(payload).eq('id', editingPlan.id); setMessage('Paket diupdate'); }
    else { await supabase.from('pricing_plans').insert([payload]); setMessage('Paket ditambahkan'); }
    setPlanForm({ name: '', price: '', period: '', description: '', features: '', tech_stack: '', popular: false }); setEditingPlan(null);
    fetchAll();
  };
  const deletePlan = async (id) => { if (confirm('Hapus paket ini?')) { await supabase.from('pricing_plans').delete().eq('id', id); fetchAll(); } };
  const editPlan = (plan) => { setEditingPlan(plan); setPlanForm({ name: plan.name, price: plan.price.toString(), period: plan.period || '', description: plan.description || '', features: plan.features?.join(',') || '', tech_stack: plan.tech_stack?.join(',') || '', popular: plan.popular || false }); };

  // Testimonial CRUD
  const handleTestiSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: testiForm.name, role: testiForm.role, content: testiForm.content, rating: parseInt(testiForm.rating), avatar: testiForm.avatar || testiForm.name.charAt(0) };
    if (editingTestimonial) { await supabase.from('testimonials').update(payload).eq('id', editingTestimonial.id); setMessage('Testimonial diupdate'); }
    else { await supabase.from('testimonials').insert([payload]); setMessage('Testimonial ditambahkan'); }
    setTestiForm({ name: '', role: '', content: '', rating: 5, avatar: '' }); setEditingTestimonial(null); fetchAll();
  };
  const deleteTestimonial = async (id) => { if (confirm('Hapus testimonial?')) { await supabase.from('testimonials').delete().eq('id', id); fetchAll(); } };
  const editTestimonial = (t) => { setEditingTestimonial(t); setTestiForm({ name: t.name, role: t.role || '', content: t.content, rating: t.rating, avatar: t.avatar || '' }); };

  // Clients CRUD
  const handleClientLogoFile = (e) => {
    const file = e.target.files[0];
    if (file) { setClientLogoFile(file); setClientLogoPreview(URL.createObjectURL(file)); }
  };
  const uploadClientLogoBase64 = () => new Promise((resolve) => { if (!clientLogoFile) resolve(null); else { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result); reader.readAsDataURL(clientLogoFile); } });
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    let logoUrl = clientForm.logo_url;
    if (clientLogoFile) logoUrl = await uploadClientLogoBase64();
    const payload = { name: clientForm.name, logo_url: logoUrl, website: clientForm.website || null, order_index: parseInt(clientForm.order_index), is_active: clientForm.is_active };
    if (editingClient) { await supabase.from('clients').update(payload).eq('id', editingClient.id); setMessage('Klien diupdate'); }
    else { await supabase.from('clients').insert([payload]); setMessage('Klien ditambahkan'); }
    setClientForm({ name: '', logo_url: '', website: '', order_index: 0, is_active: true }); setClientLogoFile(null); setClientLogoPreview(''); setEditingClient(null); fetchAll();
  };
  const deleteClient = async (id) => { if (confirm('Hapus klien?')) { await supabase.from('clients').delete().eq('id', id); fetchAll(); } };
  const editClient = (c) => { setEditingClient(c); setClientForm({ name: c.name, logo_url: c.logo_url, website: c.website || '', order_index: c.order_index, is_active: c.is_active }); setClientLogoPreview(c.logo_url); setClientLogoFile(null); };

  // Marquee
  const handleMarqueeUpdate = async () => {
    const { error } = await supabase.from('marquee_settings').upsert({ id: marquee.id, text: marquee.text, speed: parseInt(marquee.speed), is_active: marquee.is_active });
    if (error) setMessage('Gagal update marquee: ' + error.message); else { setMessage('Marquee diupdate'); fetchAll(); }
  };

  // Logo website
  const handleLogoFileChange = (e) => { const file = e.target.files[0]; if (file) { setLogoFile(file); setLogoUrl(URL.createObjectURL(file)); } };
  const handleLogoUpload = async () => {
    if (!logoFile) { setMessage('Pilih file dulu'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const { error } = await supabase.from('site_settings').upsert({ key: 'logo_url', value: base64 });
      if (error) setMessage('Gagal upload: ' + error.message); else { setMessage('Logo berhasil diupdate!'); fetchAll(); }
      setUploading(false);
    };
    reader.readAsDataURL(logoFile);
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    const tagsArr = portfolioForm.tags.split(',').map(s => s.trim()).filter(Boolean);
    const payload = { title: portfolioForm.title, description: portfolioForm.description, full_desc: portfolioForm.full_desc, tags: tagsArr, link: portfolioForm.link, gradient: portfolioForm.gradient, image_letter: portfolioForm.image_letter, year: portfolioForm.year, category: portfolioForm.category, order_index: parseInt(portfolioForm.order_index), is_active: portfolioForm.is_active };
    if (editingPortfolio) { await supabase.from('portfolios').update(payload).eq('id', editingPortfolio.id); setMessage('Portfolio diupdate!'); }
    else { await supabase.from('portfolios').insert([payload]); setMessage('Portfolio ditambahkan!'); }
    setPortfolioForm({ title: '', description: '', full_desc: '', tags: '', link: '', gradient: 'from-blue-600 via-indigo-600 to-purple-600', image_letter: 'P', year: '2025', category: 'Web App', order_index: 0, is_active: true });
    setEditingPortfolio(null); fetchAll();
  };
  const deletePortfolio = async (id) => { if (confirm('Hapus portfolio ini?')) { await supabase.from('portfolios').delete().eq('id', id); fetchAll(); } };
  const editPortfolio = (p) => {
    setEditingPortfolio(p);
    setPortfolioForm({ title: p.title, description: p.description || '', full_desc: p.full_desc || '', tags: p.tags?.join(',') || '', link: p.link || '', gradient: p.gradient || 'from-blue-600 via-indigo-600 to-purple-600', image_letter: p.image_letter || 'P', year: p.year || '2025', category: p.category || 'Web App', order_index: p.order_index || 0, is_active: p.is_active });
    window.scrollTo(0, 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full p-4 bg-zinc-800 rounded-2xl mb-4 text-white" required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full p-4 bg-zinc-800 rounded-2xl mb-6 text-white" required />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-semibold rounded-2xl">Login</button>
          </form>
          <a href="/" className="block text-center text-cyan-400 mt-4 hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          <button onClick={signOut} className="flex gap-2 text-red-400"><LogOut size={20} /> Keluar</button>
        </div>
        {message && <div className="bg-green-900/50 text-green-300 p-4 rounded-2xl mb-6">{message}</div>}
        <div className="flex gap-4 mb-8 border-b border-gray-700 flex-wrap">
          <button onClick={() => setActiveTab('pricing')} className={`py-2 px-6 rounded-t-lg ${activeTab === 'pricing' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Paket Harga</button>
          <button onClick={() => setActiveTab('testimonials')} className={`py-2 px-6 rounded-t-lg ${activeTab === 'testimonials' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Testimonial</button>
          <button onClick={() => setActiveTab('clients')} className={`py-2 px-6 rounded-t-lg ${activeTab === 'clients' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Klien</button>
          <button onClick={() => setActiveTab('marquee')} className={`py-2 px-6 rounded-t-lg ${activeTab === 'marquee' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Marquee</button>
          <button onClick={() => setActiveTab('portfolio')} className={`py-2 px-6 rounded-t-lg ${activeTab === 'portfolio' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Portfolio</button>
          <button onClick={() => setActiveTab('settings')} className={`py-2 px-6 rounded-t-lg ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Pengaturan</button>
        </div>

        {activeTab === 'pricing' && (
          <>
            <form onSubmit={handlePlanSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
              <h2 className="text-2xl mb-6 text-white">{editingPlan ? 'Edit Paket' : 'Tambah Paket'}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input placeholder="Nama" value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <input placeholder="Harga" value={planForm.price} onChange={e => setPlanForm({ ...planForm, price: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <input placeholder="Period" value={planForm.period} onChange={e => setPlanForm({ ...planForm, period: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Deskripsi" value={planForm.description} onChange={e => setPlanForm({ ...planForm, description: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Fitur (pisahkan koma)" value={planForm.features} onChange={e => setPlanForm({ ...planForm, features: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Teknologi (pisahkan koma)" value={planForm.tech_stack} onChange={e => setPlanForm({ ...planForm, tech_stack: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <label className="flex gap-3 text-white"><input type="checkbox" checked={planForm.popular} onChange={e => setPlanForm({ ...planForm, popular: e.target.checked })} /> Popular</label>
              </div>
              <button type="submit" className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2"><Save size={20} /> {editingPlan ? 'Simpan' : 'Tambah'}</button>
            </form>
            <div className="grid gap-6">
              {plans.map(p => (
                <div key={p.id} className="bg-zinc-900 p-6 rounded-3xl flex justify-between items-center">
                  <div><h3 className="text-2xl font-semibold text-white">{p.name} - Rp {p.price.toLocaleString('id-ID')}</h3><p className="text-zinc-400">{p.description}</p><div className="flex gap-1 mt-1">{p.tech_stack?.map(t => <span key={t} className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">{t}</span>)}</div></div>
                  <div className="flex gap-3"><button onClick={() => editPlan(p)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={20} className="text-white" /></button><button onClick={() => deletePlan(p.id)} className="p-3 bg-red-900/50 rounded-2xl"><Trash2 size={20} className="text-white" /></button></div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'testimonials' && (
          <>
            <form onSubmit={handleTestiSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
              <h2 className="text-2xl mb-6 text-white">{editingTestimonial ? 'Edit Testimonial' : 'Tambah Testimonial'}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input placeholder="Nama" value={testiForm.name} onChange={e => setTestiForm({ ...testiForm, name: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <input placeholder="Role" value={testiForm.role} onChange={e => setTestiForm({ ...testiForm, role: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <textarea placeholder="Isi testimonial" rows="3" value={testiForm.content} onChange={e => setTestiForm({ ...testiForm, content: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl md:col-span-2 text-white" required />
                <input placeholder="Rating 1-5" type="number" min="1" max="5" value={testiForm.rating} onChange={e => setTestiForm({ ...testiForm, rating: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Avatar (huruf)" value={testiForm.avatar} onChange={e => setTestiForm({ ...testiForm, avatar: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
              </div>
              <button type="submit" className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2"><Save size={20} /> {editingTestimonial ? 'Simpan' : 'Tambah'}</button>
            </form>
            <div className="grid gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-zinc-900 p-6 rounded-3xl flex justify-between items-start">
                  <div><h3 className="text-xl font-semibold text-white">{t.name} {t.role && `- ${t.role}`}</h3><p className="text-zinc-400 mt-2 italic">"{t.content}"</p><div>{[...Array(5)].map((_, i) => <span key={i} className={i < t.rating ? "text-yellow-400" : "text-gray-600"}>★</span>)}</div></div>
                  <div className="flex gap-3"><button onClick={() => editTestimonial(t)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={20} className="text-white" /></button><button onClick={() => deleteTestimonial(t.id)} className="p-3 bg-red-900/50 rounded-2xl"><Trash2 size={20} className="text-white" /></button></div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'clients' && (
          <>
            <form onSubmit={handleClientSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
              <h2 className="text-2xl mb-6 text-white">{editingClient ? 'Edit Klien' : 'Tambah Klien'}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input placeholder="Nama Perusahaan" value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <div><label className="block text-white mb-2">Upload Logo</label><input type="file" accept="image/*" onChange={handleClientLogoFile} className="text-white" />{clientLogoPreview && <img src={clientLogoPreview} alt="preview" className="h-12 mt-2 object-contain" />}</div>
                <input placeholder="Website (opsional)" value={clientForm.website} onChange={e => setClientForm({ ...clientForm, website: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Urutan" type="number" value={clientForm.order_index} onChange={e => setClientForm({ ...clientForm, order_index: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <label className="flex gap-3 text-white"><input type="checkbox" checked={clientForm.is_active} onChange={e => setClientForm({ ...clientForm, is_active: e.target.checked })} /> Aktif</label>
              </div>
              <button type="submit" className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2"><Save size={20} /> {editingClient ? 'Simpan' : 'Tambah'}</button>
            </form>
            <div className="grid gap-6">
              {clients.map(c => (
                <div key={c.id} className="bg-zinc-900 p-6 rounded-3xl flex justify-between items-center">
                  <div className="flex items-center gap-4"><img src={c.logo_url} alt={c.name} className="h-12 w-auto object-contain bg-white p-1 rounded" /><div><h3 className="text-xl font-semibold text-white">{c.name}</h3><p className="text-zinc-400 text-sm">{c.website || 'Tidak ada website'}</p></div></div>
                  <div className="flex gap-3"><button onClick={() => editClient(c)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={20} className="text-white" /></button><button onClick={() => deleteClient(c.id)} className="p-3 bg-red-900/50 rounded-2xl"><Trash2 size={20} className="text-white" /></button></div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'marquee' && (
          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">Teks Berjalan</h2>
            <input type="text" value={marquee.text} onChange={e => setMarquee({ ...marquee, text: e.target.value })} className="w-full p-3 bg-zinc-800 rounded-2xl text-white mb-4" />
            <input type="number" value={marquee.speed} onChange={e => setMarquee({ ...marquee, speed: parseInt(e.target.value) })} className="w-full p-3 bg-zinc-800 rounded-2xl text-white mb-4" />
            <label className="flex gap-3 text-white mb-4"><input type="checkbox" checked={marquee.is_active} onChange={e => setMarquee({ ...marquee, is_active: e.target.checked })} /> Aktif</label>
            <button onClick={handleMarqueeUpdate} className="px-6 py-2 bg-blue-600 rounded-xl">Simpan</button>
          </div>
        )}


        {activeTab === 'portfolio' && (
          <>
            <form onSubmit={handlePortfolioSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
              <h2 className="text-2xl mb-2 text-white font-bold">{editingPortfolio ? 'Edit Portfolio' : 'Tambah Portfolio Baru'}</h2>
              <p className="text-zinc-500 text-sm mb-6">Data akan langsung tampil di halaman /portfolio</p>
              <div className="grid md:grid-cols-2 gap-6">
                <input placeholder="Judul Proyek *" value={portfolioForm.title} onChange={e => setPortfolioForm({ ...portfolioForm, title: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white border border-zinc-700 focus:border-blue-500 outline-none" required />
                <input placeholder="Link Website (https://...)" value={portfolioForm.link} onChange={e => setPortfolioForm({ ...portfolioForm, link: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white border border-zinc-700 focus:border-blue-500 outline-none" />
                <textarea placeholder="Deskripsi singkat *" rows="2" value={portfolioForm.description} onChange={e => setPortfolioForm({ ...portfolioForm, description: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white md:col-span-2 border border-zinc-700 focus:border-blue-500 outline-none" required />
                <textarea placeholder="Deskripsi lengkap (opsional)" rows="3" value={portfolioForm.full_desc} onChange={e => setPortfolioForm({ ...portfolioForm, full_desc: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white md:col-span-2 border border-zinc-700 focus:border-blue-500 outline-none" />
                <input placeholder="Tags (pisahkan koma, cth: React,Supabase,UI)" value={portfolioForm.tags} onChange={e => setPortfolioForm({ ...portfolioForm, tags: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white md:col-span-2 border border-zinc-700 focus:border-blue-500 outline-none" />
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">Warna Kartu</label>
                  <select value={portfolioForm.gradient} onChange={e => setPortfolioForm({ ...portfolioForm, gradient: e.target.value })} className="w-full p-4 bg-zinc-800 rounded-2xl text-white border border-zinc-700 focus:border-blue-500 outline-none">
                    <option value="from-blue-600 via-indigo-600 to-purple-600">🔵 Biru - Ungu</option>
                    <option value="from-rose-500 via-pink-500 to-orange-500">🔴 Merah - Orange</option>
                    <option value="from-green-500 via-emerald-500 to-teal-500">🟢 Hijau - Teal</option>
                    <option value="from-yellow-500 via-orange-500 to-red-500">🟡 Kuning - Merah</option>
                    <option value="from-cyan-500 via-blue-500 to-indigo-500">🩵 Cyan - Indigo</option>
                    <option value="from-purple-600 via-pink-500 to-rose-500">💜 Ungu - Pink</option>
                  </select>
                </div>
                <input placeholder="Huruf pada kartu (1 huruf, cth: G)" maxLength="2" value={portfolioForm.image_letter} onChange={e => setPortfolioForm({ ...portfolioForm, image_letter: e.target.value.toUpperCase() })} className="p-4 bg-zinc-800 rounded-2xl text-white border border-zinc-700 focus:border-blue-500 outline-none" />
                <input placeholder="Tahun (cth: 2025)" value={portfolioForm.year} onChange={e => setPortfolioForm({ ...portfolioForm, year: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white border border-zinc-700 focus:border-blue-500 outline-none" />
                <input placeholder="Kategori (cth: Web App / Company Profile)" value={portfolioForm.category} onChange={e => setPortfolioForm({ ...portfolioForm, category: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white border border-zinc-700 focus:border-blue-500 outline-none" />
                <input placeholder="Urutan tampil (angka, 1 = paling atas)" type="number" value={portfolioForm.order_index} onChange={e => setPortfolioForm({ ...portfolioForm, order_index: e.target.value })} className="p-4 bg-zinc-800 rounded-2xl text-white border border-zinc-700 focus:border-blue-500 outline-none" />
                <label className="flex gap-3 text-white items-center cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={portfolioForm.is_active} onChange={e => setPortfolioForm({ ...portfolioForm, is_active: e.target.checked })} /> Tampilkan di halaman portfolio</label>
              </div>
              <div className="mt-6 flex items-center gap-4 p-4 bg-zinc-800 rounded-2xl w-fit">
                <div className={"w-16 h-16 rounded-2xl bg-gradient-to-br " + portfolioForm.gradient + " flex items-center justify-center text-white text-2xl font-black shadow-lg"}>{portfolioForm.image_letter || 'P'}</div>
                <div><p className="text-white font-semibold">{portfolioForm.title || 'Judul Proyek'}</p><p className="text-zinc-400 text-sm">{portfolioForm.category} · {portfolioForm.year}</p></div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl flex gap-2 font-semibold hover:opacity-90 transition"><Save size={20} /> {editingPortfolio ? 'Simpan Perubahan' : 'Tambah Portfolio'}</button>
                {editingPortfolio && <button type="button" onClick={() => { setEditingPortfolio(null); setPortfolioForm({ title: '', description: '', full_desc: '', tags: '', link: '', gradient: 'from-blue-600 via-indigo-600 to-purple-600', image_letter: 'P', year: '2025', category: 'Web App', order_index: 0, is_active: true }); }} className="px-6 py-4 bg-zinc-700 text-white rounded-2xl hover:bg-zinc-600 transition">Batal Edit</button>}
              </div>
            </form>
            <h3 className="text-xl font-bold text-white mb-4">Daftar Portfolio ({portfolios.length})</h3>
            <div className="grid gap-4">
              {portfolios.map(p => (
                <div key={p.id} className={"bg-zinc-900 p-6 rounded-3xl flex justify-between items-center gap-4 border " + (p.is_active ? "border-zinc-800" : "border-zinc-800 opacity-50")}>
                  <div className="flex items-center gap-4">
                    <div className={"w-14 h-14 rounded-2xl bg-gradient-to-br " + p.gradient + " flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-lg"}>{p.image_letter}</div>
                    <div>
                      <div className="flex items-center gap-2"><h3 className="text-lg font-semibold text-white">{p.title}</h3>{!p.is_active && <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">Disembunyikan</span>}</div>
                      <p className="text-zinc-500 text-sm">{p.category} · {p.year} · Urutan #{p.order_index}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">{p.tags?.map(t => <span key={t} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{t}</span>)}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <button onClick={() => editPortfolio(p)} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition" title="Edit"><Edit2 size={18} className="text-white" /></button>
                    <button onClick={() => deletePortfolio(p.id)} className="p-3 bg-red-900/40 hover:bg-red-900/70 rounded-2xl transition" title="Hapus"><Trash2 size={18} className="text-red-400" /></button>
                  </div>
                </div>
              ))}
              {portfolios.length === 0 && <div className="text-center py-16 text-zinc-500"><p className="text-lg">Belum ada portfolio</p><p className="text-sm mt-1">Tambahkan proyek pertama kamu di form atas</p></div>}
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">Logo Website</h2>
            {logoUrl && <img src={logoUrl} alt="Logo" className="h-20 mb-4" />}
            <input type="file" accept="image/*" onChange={handleLogoFileChange} className="text-white mb-4" />
            <button onClick={handleLogoUpload} disabled={uploading} className="px-6 py-2 bg-cyan-600 rounded-xl">{uploading ? 'Uploading...' : 'Upload Logo'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
