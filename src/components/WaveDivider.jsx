export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  return (
    <div style={{ backgroundColor: fromColor, lineHeight: 0, display: 'block' }}>
      <svg
        viewBox="0 0 1440 160"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '160px' }}
      >
        <path
          d="M0,80 Q60,20 120,60 Q180,100 240,50 Q300,0 360,70 Q420,140 480,60 Q540,30 600,80 Q660,130 720,70 Q780,10 840,90 Q900,150 960,80 Q1020,40 1080,100 Q1140,140 1200,70 Q1260,30 1320,90 Q1380,130 1440,80 L1440,160 L0,160 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
