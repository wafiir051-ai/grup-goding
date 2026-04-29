import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminSettings() {
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'logo_url').single();
    if (data) setLogoUrl(data.value);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const { error } = await supabase.from('site_settings').upsert({ key: 'logo_url', value: base64 });
      if (error) setMessage('Gagal upload: ' + error.message);
      else { setMessage('Logo berhasil diupdate!'); setLogoUrl(base64); }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-zinc-900 p-8 rounded-3xl">
      <h2 className="text-2xl font-bold text-white mb-6">Pengaturan Website</h2>
      <div className="mb-6"><label className="block text-white mb-2">Logo saat ini:</label>{logoUrl && <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain bg-white p-1 rounded" />}</div>
      <div><label className="block text-white mb-2">Ganti Logo (file gambar)</label><input type="file" accept="image/*" onChange={handleLogoUpload} className="text-white" />{uploading && <p className="text-yellow-400 mt-2">Mengupload...</p>}{message && <p className="text-green-400 mt-2">{message}</p>}</div>
    </div>
  );
}
