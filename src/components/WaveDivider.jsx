export default function WaveDivider({ fromColor = '#0a0a0a', toColor = '#ffffff' }) {
  return (
    <div
      className="w-full overflow-hidden leading-none"
      style={{ backgroundColor: fromColor, marginBottom: '-3px' }}
    >
      <svg
        viewBox="0 0 1440 160"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-32 md:h-48 lg:h-56"
        style={{ display: 'block' }}
      >
        <path
          d="M0,60 C200,160 400,0 600,80 C800,160 1000,10 1200,80 C1320,120 1390,40 1440,70 L1440,160 L0,160 Z"
          fill={toColor}
        />
      </svg>
    </div>
  );
}
