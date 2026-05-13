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
          d="M0,120 C40,30 70,200 120,100 S180,20 240,90 C280,160 310,40 360,110 S420,200 480,80 C520,10 560,190 620,100 S680,30 740,120 C780,200 820,50 870,110 S930,210 990,90 C1030,20 1070,180 1130,110 S1190,40 1250,100 C1290,170 1330,60 1380,120 S1440,120 1440,120 L1440,240 L0,240 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
