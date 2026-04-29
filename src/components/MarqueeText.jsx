import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function MarqueeText() {
  const [marquee, setMarquee] = useState({ text: '', speed: 20, is_active: true });

  useEffect(() => {
    const fetchMarquee = async () => {
      const { data } = await supabase
        .from('marquee_settings')
        .select('text, speed, is_active')
        .eq('is_active', true)
        .maybeSingle();
      if (data) setMarquee(data);
    };
    fetchMarquee();
  }, []);

  if (!marquee.is_active || !marquee.text) return null;

  return (
    <div className="w-full overflow-hidden">
      <div className="whitespace-nowrap text-center text-cyan-400 font-medium text-sm sm:text-base md:text-lg">
        <span
          className="inline-block mx-4"
          style={{
            animation: `marquee-scroll ${marquee.speed}s linear infinite`,
          }}
        >
          {marquee.text}
        </span>
        <span
          className="inline-block mx-4"
          style={{
            animation: `marquee-scroll ${marquee.speed}s linear infinite`,
          }}
        >
          {marquee.text}
        </span>
      </div>
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
