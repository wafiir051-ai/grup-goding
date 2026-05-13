export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  return (
    <div style={{ backgroundColor: fromColor, lineHeight: 0, display: 'block' }}>
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '120px' }}
      >
        <path
          d="M0,60 Q120,10 240,50 T480,40 Q600,80 720,50 T960,60 Q1080,20 1200,55 T1440,50 L1440,120 L0,120 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
