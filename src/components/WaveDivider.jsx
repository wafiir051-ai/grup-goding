export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  return (
    <div style={{ 
      backgroundColor: fromColor, 
      lineHeight: 0, 
      display: 'block',
      position: 'relative',
      margin: 0,
      padding: 0
    }}>
      <svg
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '200px',
          transform: flip ? 'scaleY(-1)' : 'none',
          verticalAlign: 'middle'
        }}
      >
        <path
          d="M0,160 C240,280 480,40 720,160 C960,280 1200,40 1440,160 L1440,320 L0,320 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
