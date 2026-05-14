export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  return (
    <div style={{ backgroundColor: fromColor, lineHeight: 0, display: 'block' }}>
      <svg
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '100px' }}
      >
        <path
          d="M0,50 C240,80 480,80 720,50 C960,20 1200,20 1440,50 L1440,100 L0,100 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
