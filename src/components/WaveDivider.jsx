export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  const id = `ice-cream-${Math.random().toString(36).slice(2)}`;
  
  // Kalau toColor putih (#ffffff), pakai gradient es krim
  // Kalau toColor hitam (#0a0a0a), tetap hitam
  const useGradient = toColor === '#ffffff';
  
  return (
    <div style={{ backgroundColor: fromColor, lineHeight: 0, display: 'block' }}>
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '120px' }}
      >
        {useGradient && (
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#f9a8d4" />
              <stop offset="25%"  stopColor="#fde68a" />
              <stop offset="50%"  stopColor="#a5f3fc" />
              <stop offset="75%"  stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#f9a8d4" />
            </linearGradient>
          </defs>
        )}
        <path
          d="M0,40 C180,120 360,0 540,60 C720,120 900,0 1080,60 C1260,120 1380,20 1440,50 L1440,120 L0,120 Z"
          fill={useGradient ? `url(#${id})` : toColor}
        />
      </svg>
    </div>
  );
}
