export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#1a1a2e' }) {
  return (
    <div style={{ backgroundColor: fromColor, lineHeight: 0, display: 'block' }}>
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '120px' }}
      >
        <path
          d="M0,40 C180,120 360,0 540,60 C720,120 900,0 1080,60 C1260,120 1380,20 1440,50 L1440,120 L0,120 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
