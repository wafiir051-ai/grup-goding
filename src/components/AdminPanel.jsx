import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Edit2, Trash2, LogOut, Save, Plus, X } from 'lucide-react';

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
    name: '', price: '', period: '', description: '', features: '', tech_stack: '', popular: false 
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

  // Pricing CRUD dengan tech_stack
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

  // Testimonial CRUD
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

  // Clients CRUD (upload file)
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
    return ( ... ) // sama seperti sebelumnya, tidak diubah
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8"><div className="max-w-6xl mx-auto"><div className="flex justify-between items-center mb-10"><h1 className="text-4xl font-bold text-white">Admin Panel</h1><button onClick={signOut} className="flex gap-2 text-red-400"><LogOut size={20}/> Keluar</button></div>{message && <div className="bg-green-900/50 text-green-300 p-4 rounded-2xl mb-6">{message}</div>}
      <div className="flex gap-4 mb-8 border-b border-gray-700 flex-wrap">
        <button onClick={()=>setActiveTab('pricing')} className={`py-2 px-6 rounded-t-lg ${activeTab==='pricing'?'bg-blue-600 text-white':'text-gray-400'}`}>Paket Harga</button>
        <button onClick={()=>setActiveTab('testimonials')} className={`py-2 px-6 rounded-t-lg ${activeTab==='testimonials'?'bg-blue-600 text-white':'text-gray-400'}`}>Testimonial</button>
        <button onClick={()=>setActiveTab('clients')} className={`py-2 px-6 rounded-t-lg ${activeTab==='clients'?'bg-blue-600 text-white':'text-gray-400'}`}>Klien</button>
        <button onClick={()=>setActiveTab('animations')} className={`py-2 px-6 rounded-t-lg ${activeTab==='animations'?'bg-blue-600 text-white':'text-gray-400'}`}>Animasi</button>
        <button onClick={()=>setActiveTab('marquee')} className={`py-2 px-6 rounded-t-lg ${activeTab==='marquee'?'bg-blue-600 text-white':'text-gray-400'}`}>Marquee</button>
        <button onClick={()=>setActiveTab('settings')} className={`py-2 px-6 rounded-t-lg ${activeTab==='settings'?'bg-blue-600 text-white':'text-gray-400'}`}>Pengaturan</button>
      </div>

      {activeTab === 'pricing' && (
        <><form onSubmit={handlePlanSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-12"><h2 className="text-2xl mb-6 text-white">{editingPlan?'Edit Paket':'Tambah Paket'}</h2><div className="grid md:grid-cols-2 gap-6">
          <input placeholder="Nama" value={planForm.name} onChange={e=>setPlanForm({...planForm,name:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
          <input placeholder="Harga" value={planForm.price} onChange={e=>setPlanForm({...planForm,price:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" required />
          <input placeholder="Period (misal: sekal bayar / per tahun)" value={planForm.period} onChange={e=>setPlanForm({...planForm,period:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
          <input placeholder="Deskripsi" value={planForm.description} onChange={e=>setPlanForm({...planForm,description:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
          <input placeholder="Fitur (pisahkan koma)" value={planForm.features} onChange={e=>setPlanForm({...planForm,features:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
          <input placeholder="Teknologi (pisahkan koma)" value={planForm.tech_stack} onChange={e=>setPlanForm({...planForm,tech_stack:e.target.value})} className="p-4 bg-zinc-800 rounded-2xl text-white" />
          <label className="flex gap-3 text-white"><input type="checkbox" checked={planForm.popular} onChange={e=>setPlanForm({...planForm,popular:e.target.checked})}/> Popular</label>
        </div><button type="submit" className="mt-6 px-10 py-4 bg-blue-600 text-white rounded-2xl flex gap-2"><Save size={20}/> {editingPlan?'Simpan':'Tambah'}</button></form>
        <div className="grid gap-6">{plans.map(p=> <div key={p.id} className="bg-zinc-900 p-6 rounded-3xl flex justify-between items-center"><div><h3 className="text-2xl font-semibold text-white">{p.name} - Rp {p.price.toLocaleString('id-ID')}</h3><p className="text-zinc-400">{p.description}</p><div className="flex gap-1 mt-2">{p.tech_stack?.map(t=><span key={t} className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">{t}</span>)}</div></div><div className="flex gap-3"><button onClick={()=>editPlan(p)} className="p-3 bg-zinc-800 rounded-2xl"><Edit2 size={20} className="text-white"/></button><button onClick={()=>deletePlan(p.id)} className="p-3 bg-red-900/50 rounded-2xl"><Trash2 size={20} className="text-white"/></button></div></div>)}</div></>
      )}

      {/* Bagian lain (testimonials, clients, animations, marquee, settings) sama seperti sebelumnya, tidak diubah */}

    </div></div>
  );
}
