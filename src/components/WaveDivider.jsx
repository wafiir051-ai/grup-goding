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
        viewBox="0 0 1440 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '120px',
          transform: flip ? 'scaleY(-1)' : 'none'
        }}
      >
        <path
          d="M0,100 C180,160 360,40 540,100 C720,160 900,40 1080,100 C1260,160 1380,40 1440,100 L1440,200 L0,200 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
