import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DURATION, EASE_OUT } from '../lib/scrollMotion';

// Satu query animation_settings per komponen, dibagi semua pemakainya
// (misalnya keempat kartu layanan memakai componentName yang sama).
const settingsCache = new Map();
function loadSettings(componentName) {
  if (!settingsCache.has(componentName)) {
    settingsCache.set(
      componentName,
      supabase
        .from('animation_settings')
        .select('animation_type, speed, delay, intensity, direction')
        .eq('component', componentName)
        .maybeSingle()
        .then(({ data }) => data, () => null),
    );
  }
  return settingsCache.get(componentName);
}

export default function RevealOnScroll({ children, componentName, once = true, className = '', customDelay = null }) {
  // undefined = masih dimuat, null = tidak ada pengaturan (tampil biasa seperti dulu).
  const [settings, setSettings] = useState(undefined);
  const reduced = useReducedMotion();
  // Ambang kecil: baris terakhir footer (copyright) tetap bisa muncul di ujung halaman.
  const [ref, inView] = useInView({ triggerOnce: once, threshold: 0, rootMargin: '0px 0px -20px 0px' });
  useEffect(() => {
    if (!componentName) return undefined;
    let alive = true;
    loadSettings(componentName).then((data) => {
      if (alive) setSettings(data || null);
    });
    return () => {
      alive = false;
    };
  }, [componentName]);
  if (!componentName) return <div className={className}>{children}</div>;

  const s = settings || {};
  const k = s.intensity || 1;
  // Posisi diam yang tampil di situs saat ini. Varian versi sebelumnya tidak
  // mengembalikan geser/skala ke nol, jadi elemen berhenti di sini; dipertahankan
  // supaya tampilan homepage tidak berubah.
  const rest = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };
  if (s.direction === 'up') rest.y = 60 * k;
  if (s.direction === 'down') rest.y = -60 * k;
  if (s.direction === 'left') rest.x = 60 * k;
  if (s.direction === 'right') rest.x = -60 * k;
  if (s.animation_type === 'scale') rest.scale = 0.7;
  if (s.animation_type === 'rotate') rest.rotate = -10;

  // Masuk: fade dan geser pendek menuju posisi diam, tanpa blur supaya ringan di HP.
  const hidden = { ...rest, opacity: 0, transition: { duration: 0 } };
  if (!reduced) {
    if (s.direction === 'up') hidden.y = rest.y + 24;
    if (s.direction === 'down') hidden.y = rest.y - 24;
    if (s.direction === 'left') hidden.x = rest.x + 24;
    if (s.direction === 'right') hidden.x = rest.x - 24;
    if (s.animation_type === 'scale') hidden.scale = rest.scale * 0.96;
  }
  const delay = customDelay !== null ? customDelay : s.delay || 0;
  const variants = {
    plain: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, transition: { duration: 0 } },
    hidden,
    // Durasi seragam di semua section (kolom speed tidak lagi membuat tempo berbeda-beda).
    visible: { ...rest, transition: { duration: reduced ? 0.3 : DURATION, delay, ease: EASE_OUT } },
  };
  const state = !settings ? 'plain' : inView ? 'visible' : 'hidden';
  return <motion.div ref={ref} initial="plain" animate={state} variants={variants} className={className} style={{width:'100%', maxWidth:'100%', boxSizing:'border-box'}}>{children}</motion.div>;
}
