export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  return (
    <div style={{ 
      backgroundColor: fromColor, 
      lineHeight: 0, 
      display: 'block',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '80px',
          transform: flip ? 'scaleY(-1)' : 'none'
        }}
      >
        <path
          d="M0,60 C120,100 240,20 360,60 C480,100 600,20 720,60 C840,100 960,20 1080,60 C1200,100 1320,20 1440,60 L1440,120 L0,120 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
