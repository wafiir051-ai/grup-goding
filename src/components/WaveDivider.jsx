export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff', flip = false }) {
  return (
    <div style={{ backgroundColor: fromColor, lineHeight: 0, display: 'block' }}>
      <svg
        viewBox="0 0 1440 240"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '240px' }}
      >
        <path
          d="M0,120 C30,60 60,40 90,80 C120,120 150,200 180,160 C210,120 240,30 270,70 C300,110 330,180 360,140 C390,100 420,20 450,90 C480,160 510,210 540,150 C570,90 600,40 630,100 C660,160 690,200 720,140 C750,80 780,30 810,110 C840,190 870,210 900,130 C930,50 960,20 990,90 C1020,160 1050,190 1080,120 C1110,50 1140,30 1170,100 C1200,170 1230,200 1260,140 C1290,80 1320,50 1350,100 C1380,150 1410,180 1440,120 L1440,240 L0,240 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
