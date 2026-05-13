export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  return (
    <div style={{ backgroundColor: fromColor, lineHeight: 0, display: 'block' }}>
      <svg
        viewBox="0 0 1440 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '200px' }}
      >
        <path
          d="M0,100 C50,20 80,180 150,80 C200,0 250,160 320,60 C370,10 400,190 480,70 C530,5 580,170 650,90 C700,30 730,180 800,80 C850,10 900,185 970,75 C1020,15 1050,190 1120,85 C1170,25 1220,175 1290,95 C1340,40 1380,160 1440,100 L1440,200 L0,200 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
