import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Mencatat kunjungan dan sesi aktif ke Supabase. Angkanya tidak lagi ditampilkan di
// halaman (angka kecil justru membuat situs terlihat sepi), tetapi tetap tercatat.
export default function VisitorStats() {
  const getSessionId = () => {
    let id = sessionStorage.getItem('visitor_session_id');
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('visitor_session_id', id);
    }
    return id;
  };

  const updateTotalVisits = async () => {
    const { data } = await supabase.from('site_stats').select('total_visits').eq('id', 1).single();
    const currentTotal = data?.total_visits || 0;
    await supabase.from('site_stats').update({ total_visits: currentTotal + 1 }).eq('id', 1);
  };

  const updateActiveSession = async () => {
    const sessionId = getSessionId();
    await supabase.from('active_sessions').upsert({
      session_id: sessionId,
      last_active: new Date().toISOString(),
      user_agent: navigator.userAgent,
      page_url: window.location.pathname
    });
  };

  useEffect(() => {
    updateTotalVisits();
    updateActiveSession();

    const interval = setInterval(updateActiveSession, 30000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
