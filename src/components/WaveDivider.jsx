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
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '60px',
          transform: flip ? 'scaleY(-1)' : 'none'
        }}
      >
        <path
          d="M0,40 C360,20 720,20 1080,40 C1200,45 1320,45 1440,40 L1440,60 L0,60 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
