import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Edit2, Trash2, LogOut, Save } from 'lucide-react';

export default function AdminPanel() {
  const { user, signIn, signOut } = useAuth();
  const [plans, setPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [animations, setAnimations] = useState([]);
  const [marquee, setMarquee] = useState({ text: '', speed: 20, is_active: true });
  const [clients, setClients] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [planForm, setPlanForm] = useState({ 
    name: '', price: '', period: '', description: '', 
    features: '', tech_stack: '', popular: false 
  });
  const [testiForm, setTestiForm] = useState({ name: '', role: '', content: '', rating: 5, avatar: '' });
  const [clientForm, setClientForm] = useState({ name: '', logo_url: '', website: '', order_index: 0, is_active: true });
  const [animForm, setAnimForm] = useState({ component: '', animation_type: 'fade', speed: 0.5, delay: 0, intensity: 1, direction: 'up' });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pricing');
  const [message, setMessage] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [clientLogoFile, setClientLogoFile] = useState(null);
  const [clientLogoPreview, setClientLogoPreview] = useState('');

  useEffect(() => { if (user) { fetchAll(); } }, [user]);

  const fetchAll = async () => {
    const { data: p } = await supabase.from('pricing_plans').select('*').order('price');
    const { data: t } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    const { data: a } = await supabase.from('animation_settings').select('*');
    const { data: m } = await supabase.from('marquee_settings').select('*').maybeSingle();
    const { data: c } = await supabase.from('clients').select('*').order('order_index');
    const { data: logo } = await supabase.from('site_settings').select('value').eq('key', 'logo_url').single();
    setPlans(p||[]); setTestimonials(t||[]); setAnimations(a||[]); setClients(c||[]);
    if(m) setMarquee(m);
    if(logo) setLogoUrl(logo.value);
  };

  const handleLogin = async (e) => { e.preventDefault(); setError(''); const err = await signIn(loginEmail, loginPassword); if (err) setError('Email atau password salah'); };

  // Pricing CRUD
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    const featuresArray = planForm.features.split(',').map(f=>f.trim()).filter(Boolean);
    const techStackArray = planForm.tech_stack.split(',').map(t=>t.trim()).filter(Boolean);
    const payload = { 
      name: planForm.name, 
      price: parseInt(planForm.price), 
      period: planForm.period, 
      description: planForm.description, 
      features: featuresArray,
      tech_stack: techStackArray,
      popular: planForm.popular 
    };
    if (editingPlan) { 
      await supabase.from('pricing_plans').update(payload).eq('id', editingPlan.id); 
      setMessage('Paket diupdate'); 
    } else { 
      await supabase.from('pricing_plans').insert([payload]); 
      setMessage('Paket ditambahkan'); 
    }
    setPlanForm({ name:'', price:'', period:'', description:'', features:'', tech_stack:'', popular:false });
    setEditingPlan(null);
    fetchAll();
  };
  const deletePlan = async (id) => { if(confirm('Hapus paket ini?')){ await supabase.from('pricing_plans').delete().eq('id',id); fetchAll(); } };
  const editPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price.toString(),
      period: plan.period || '',
      description: plan.description || '',
      features: plan.features?.join(',') || '',
      tech_stack: plan.tech_stack?.join(',') || '',
      popular: plan.popular || false
    });
  };

  // Testimonials CRUD
  const handleTestiSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: testiForm.name, role: testiForm.role, content: testiForm.content, rating: parseInt(testiForm.rating), avatar: testiForm.avatar || testiForm.name.charAt(0) };
    if (editingTestimonial) { await supabase.from('testimonials').update(payload).eq('id', editingTestimonial.id); setMessage('Testimonial diupdate'); }
    else { await supabase.from('testimonials').insert([payload]); setMessage('Testimonial ditambahkan'); }
    setTestiForm({ name:'', role:'', content:'', rating:5, avatar:'' }); setEditingTestimonial(null);
    fetchAll();
  };
  const deleteTestimonial = async (id) => { if(confirm('Hapus testimonial ini?')){ await supabase.from('testimonials').delete().eq('id',id); fetchAll(); } };
  const editTestimonial = (t) => { setEditingTestimonial(t); setTestiForm({ name:t.name, role:t.role||'', content:t.content, rating:t.rating, avatar:t.avatar||'' }); };

  // Clients CRUD
  const handleClientLogoFile = (e) => {
    const file = e.target.files[0];
    if (file) { setClientLogoFile(file); const preview = URL.createObjectURL(file); setClientLogoPreview(preview); }
  };
  const uploadClientLogo = async () => {
    if (!clientLogoFile) return null;
    return new Promise((resolve) => { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result); reader.readAsDataURL(clientLogoFile); });
  };
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    let logoUrl = clientForm.logo_url;
    if (clientLogoFile) logoUrl = await uploadClientLogo();
    const payload = { name: clientForm.name, logo_url: logoUrl, website: clientForm.website || null, order_index: parseInt(clientForm.order_index), is_active: clientForm.is_active };
    if (editingClient) { await supabase.from('clients').update(payload).eq('id', editingClient.id); setMessage('Klien diupdate'); }
    else { await supabase.from('clients').insert([payload]); setMessage('Klien ditambahkan'); }
    setClientForm({ name:'', logo_url:'', website:'', order_index:0, is_active:true });
    setClientLogoFile(null); setClientLogoPreview(''); setEditingClient(null);
    fetchAll();
  };
  const deleteClient = async (id) => { if(confirm('Hapus klien ini?')){ await supabase.from('clients').delete().eq('id',id); fetchAll(); } };
  const editClient = (c) => { setEditingClient(c); setClientForm({ name:c.name, logo_url:c.logo_url, website:c.website||'', order_index:c.order_index, is_active:c.is_active }); setClientLogoPreview(c.logo_url); setClientLogoFile(null); };

  // Animation settings
  const handleAnimSubmit = async (e) => {
    e.preventDefault();
    const payload = { animation_type: animForm.animation_type, speed: parseFloat(animForm.speed), delay: parseFloat(animForm.delay), intensity: parseFloat(animForm.intensity), direction: animForm.direction };
    const { error } = await supabase.from('animation_settings').upsert({ component: animForm.component, ...payload });
    if (error) setMessage('Gagal update animasi: '+error.message);
    else { setMessage('Animasi berhasil diupdate'); fetchAll(); }
    setAnimForm({ component:'', animation_type:'fade', speed:0.5, delay:0, intensity:1, direction:'up' });
  };
  const editAnim = (anim) => { setAnimForm(anim); };

  // Marquee
  const handleMarqueeUpdate = async () => {
    const { error } = await supabase.from('marquee_settings').upsert({ id: marquee.id, text: marquee.text, speed: parseInt(marquee.speed), is_active: marquee.is_active });
    if (error) setMessage('Gagal update marquee: '+error.message);
    else { setMessage('Marquee diupdate'); fetchAll(); }
  };

  // Logo website
  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setLogoFile(file); const previewUrl = URL.createObjectURL(file); setLogoUrl(previewUrl); }
  };
  const handleLogoUpload = async () => {
    if (!logoFile) { setMessage('Pilih file gambar terlebih dahulu'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const { error } = await supabase.from('site_settings').upsert({ key: 'logo_url', value: base64 });
      if (error) setMessage('Gagal upload: ' + error.message);
      else { setMessage('Logo berhasil diupdate!'); fetchAll(); }
      setUploading(false);
    };
    reader.readAsDataURL(logoFile);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} className="w-full p-4 bg-zinc-800 rounded-2xl mb-4 text-white" required />
            <input type="password" placeholder="Password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className="w-full p-4 bg-zinc-800 rounded-2xl mb-6 text-white" required />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-semibold rounded-2xl">Login</button>
          </form>
          <p className="text-zinc-500 text-xs text-center mt-6">Belum punya akun? Daftar di Supabase Authentication.</p>
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
          <button onClick={signOut} className="flex gap-2 text-red-400"><LogOut size={20}/> Keluar</button>
        </div>
        {message && <div className="bg-green-900/50 text-green-300 p-4 rounded-2xl mb-6">{message}</div>}
        
        <div className="flex gap-4 mb-8 border-b border-gray-700 flex-wrap">
          <button onClick={()=>setActiveTab('pricing')} className={`py-2 px-6 rounded-t-lg ${activeTab==='pricing'?'bg-blue-600 text-white':'text-gray-400'}`}>Paket Harga</button>
          <button onClick={()=>setActiveTab('testimonials')} className={`py-2 px-6 rounded-t-lg ${activeTab==='testimonials'?'bg-blue-600 text-white':'text-gray-400'}`}>Testimonial</button>
          <button onClick={()=>setActiveTab('clients')} className={`py-2 px-6 rounded-t-lg ${activeTab==='clients'?'bg-blue-600 text-white':'text-gray-400'}`}>Klien</button>
          <button onClick={()=>setActiveTab('animations')} className={`py-2 px-6 rounded-t-lg ${activeTab==='animations'?'bg-blue-600 text-white':'text-gray-400'}`}>Animasi</button>
          <button onClick={()=>setActiveTab('marquee')} className={`py-2 px-6 rounded-t-lg ${activeTab==='marquee'?'bg-blue-600 text-white':'text-gray-400'}`}>Marquee</button>
          <button onClick={()=>setActiveTab('settings')} className={`py-2 px-6 rounded-t-lg ${activeTab==='settings'?'bg-blue-600 text-white':'text-gray-400'}`}>Pengaturan</button>
        </div>

        {/* Tab: Paket Harga */}
        {activeTab === 'pricing' && (
          <>
            <form onSubmit={handlePlanSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
              <h2 className="text-2xl mb-6 text-white">{editingPlan?'Edit Paket':'Tambah Paket'}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input placeholder="Nama" value={planForm.name} onChange={e=>setPlanForm({...planForm,name:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <input placeholder="Harga" value={planForm.price} onChange={e=>setPlanForm({...planForm,price:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <input placeholder="Period (sekali bayar/bulan/tahun)" value={planForm.period} onChange={e=>setPlanForm({...planForm,period:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Deskripsi" value={planForm.description} onChange={e=>setPlanForm({...planForm,description:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Fitur (pisahkan koma)" value={planForm.features} onChange={e=>setPlanForm({...planForm,features:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Teknologi (pisahkan koma)" value={planForm.tech_stack} onChange={e=>setPlanForm({...planForm,tech_stack:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <label className="flex gap-3 text-white"><input type="checkbox" checked={planForm.popular} onChange={e=>setPlanForm({...planForm,popular:e.target.checked})}/> Popular</label>
              </div>
              <button type="submit" className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2"><Save size={20}/> {editingPlan?'Simpan':'Tambah'}</button>
            </form>
            <div className="grid gap-6">
              {plans.map(p=> (
                <div key={p.id} className="bg-zinc-900 p-6 rounded-3xl flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{p.name} - Rp {p.price.toLocaleString('id-ID')}</h3>
                    <p className="text-zinc-400 text-sm">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.tech_stack?.map(t=><span key={t} className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={()=>editPlan(p)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={20} className="text-white"/></button>
                    <button onClick={()=>deletePlan(p.id)} className="p-3 bg-red-900/50 rounded-2xl"><Trash2 size={20} className="text-white"/></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Testimonial */}
        {activeTab === 'testimonials' && (
          <>
            <form onSubmit={handleTestiSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
              <h2 className="text-2xl mb-6 text-white">{editingTestimonial?'Edit Testimonial':'Tambah Testimonial'}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input placeholder="Nama" value={testiForm.name} onChange={e=>setTestiForm({...testiForm,name:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <input placeholder="Role" value={testiForm.role} onChange={e=>setTestiForm({...testiForm,role:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <textarea placeholder="Testimonial" rows="3" value={testiForm.content} onChange={e=>setTestiForm({...testiForm,content:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl md:col-span-2 text-white" required />
                <input placeholder="Rating 1-5" type="number" min="1" max="5" value={testiForm.rating} onChange={e=>setTestiForm({...testiForm,rating:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Avatar (huruf)" value={testiForm.avatar} onChange={e=>setTestiForm({...testiForm,avatar:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
              </div>
              <button type="submit" className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2"><Save size={20}/> {editingTestimonial?'Simpan':'Tambah'}</button>
            </form>
            <div className="grid gap-6">
              {testimonials.map(t=> (
                <div key={t.id} className="bg-zinc-900 p-6 rounded-3xl flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{t.name} {t.role&&`- ${t.role}`}</h3>
                    <p className="text-zinc-400 mt-2 italic">"{t.content}"</p>
                    <div>{[...Array(5)].map((_,i)=><span key={i} className={i<t.rating?"text-yellow-400":"text-gray-600"}>★</span>)}</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={()=>editTestimonial(t)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={20} className="text-white"/></button>
                    <button onClick={()=>deleteTestimonial(t.id)} className="p-3 bg-red-900/50 rounded-2xl"><Trash2 size={20} className="text-white"/></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Klien */}
        {activeTab === 'clients' && (
          <>
            <form onSubmit={handleClientSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
              <h2 className="text-2xl mb-6 text-white">{editingClient?'Edit Klien':'Tambah Klien'}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input placeholder="Nama Perusahaan" value={clientForm.name} onChange={e=>setClientForm({...clientForm,name:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <div>
                  <label className="block text-white mb-2">Upload Logo</label>
                  <input type="file" accept="image/*" onChange={handleClientLogoFile} className="text-white" />
                  {clientLogoPreview && <img src={clientLogoPreview} alt="preview" className="h-12 mt-2 object-contain" />}
                </div>
                <input placeholder="Website (opsional)" value={clientForm.website} onChange={e=>setClientForm({...clientForm,website:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Urutan (angka)" type="number" value={clientForm.order_index} onChange={e=>setClientForm({...clientForm,order_index:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <label className="flex gap-3 text-white"><input type="checkbox" checked={clientForm.is_active} onChange={e=>setClientForm({...clientForm,is_active:e.target.checked})}/> Aktif</label>
              </div>
              <button type="submit" className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2"><Save size={20}/> {editingClient?'Simpan':'Tambah'}</button>
            </form>
            <div className="grid gap-6">
              {clients.map(c=> (
                <div key={c.id} className="bg-zinc-900 p-6 rounded-3xl flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={c.logo_url} alt={c.name} className="h-12 w-auto object-contain bg-white p-1 rounded" />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{c.name}</h3>
                      <p className="text-zinc-400 text-sm">{c.website || 'Tidak ada website'}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={()=>editClient(c)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={20} className="text-white"/></button>
                    <button onClick={()=>deleteClient(c.id)} className="p-3 bg-red-900/50 rounded-2xl"><Trash2 size={20} className="text-white"/></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Animasi */}
        {activeTab === 'animations' && (
          <>
            <form onSubmit={handleAnimSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12">
              <h2 className="text-2xl mb-6 text-white">Edit / Tambah Animasi</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <input placeholder="Component (hero, services, process, pricing, testimonials, footer)" value={animForm.component} onChange={e=>setAnimForm({...animForm, component:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
                <select value={animForm.animation_type} onChange={e=>setAnimForm({...animForm, animation_type:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white">
                  <option value="fade">Fade</option><option value="slide">Slide</option><option value="scale">Scale</option><option value="rotate">Rotate</option>
                </select>
                <input placeholder="Speed (detik)" type="number" step="0.1" value={animForm.speed} onChange={e=>setAnimForm({...animForm, speed:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Delay" type="number" step="0.1" value={animForm.delay} onChange={e=>setAnimForm({...animForm, delay:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <input placeholder="Intensity (0.5-2)" type="number" step="0.1" value={animForm.intensity} onChange={e=>setAnimForm({...animForm, intensity:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
                <select value={animForm.direction} onChange={e=>setAnimForm({...animForm, direction:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white">
                  <option value="up">Up</option><option value="down">Down</option><option value="left">Left</option><option value="right">Right</option>
                </select>
              </div>
              <button type="submit" className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2"><Save size={20}/> Simpan Animasi</button>
            </form>
            <div className="grid gap-6">
              {animations.map(a=> (
                <div key={a.component} className="bg-zinc-900 p-6 rounded-3xl flex justify-between items-center">
                  <div><span className="text-white font-semibold">{a.component}</span><span className="text-zinc-400 ml-4">{a.animation_type} | speed:{a.speed} | delay:{a.delay} | intensity:{a.intensity} | dir:{a.direction}</span></div>
                  <button onClick={()=>editAnim(a)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={20} className="text-white"/></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Marquee */}
        {activeTab === 'marquee' && (
          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">Pengaturan Teks Berjalan</h2>
            <div className="space-y-4">
              <label className="block text-white">Teks</label>
              <input type="text" value={marquee.text} onChange={e=>setMarquee({...marquee, text:e.target.value})} className="w-full p-3 bg-zinc-800 rounded-2xl text-white" />
              <label className="block text-white">Kecepatan</label>
              <input type="number" value={marquee.speed} onChange={e=>setMarquee({...marquee, speed:parseInt(e.target.value)})} className="w-full p-3 bg-zinc-800 rounded-2xl text-white" />
              <label className="flex items-center gap-3 text-white"><input type="checkbox" checked={marquee.is_active} onChange={e=>setMarquee({...marquee, is_active:e.target.checked})} /> Aktif</label>
              <button onClick={handleMarqueeUpdate} className="mt-4 px-6 py-2 bg-blue-600 rounded-xl">Simpan Perubahan</button>
            </div>
          </div>
        )}

        {/* Tab: Pengaturan Logo */}
        {activeTab === 'settings' && (
          <div className="bg-zinc-900 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">Logo Website</h2>
            <div className="mb-6"><label className="block text-white mb-2">Logo saat ini:</label>{logoUrl && <img src={logoUrl} alt="Logo" className="h-20 w-auto object-contain bg-white p-2 rounded-lg shadow" />}</div>
            <div className="mb-4"><label className="block text-white mb-2">Pilih file gambar baru (JPG, PNG)</label><input type="file" accept="image/*" onChange={handleLogoFileChange} className="text-white" /></div>
            <button onClick={handleLogoUpload} disabled={uploading} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl disabled:opacity-50">{uploading ? 'Mengupload...' : 'Upload Logo'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
