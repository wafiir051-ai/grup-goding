const WaveDivider = ({ bgColor = "#ffffff" }) => {
  return (
    <div className="relative w-full overflow-hidden h-24 md:h-32">
      <svg
        className="absolute bottom-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,90.7C1120,85,1280,43,1360,21.3L1440,0L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          fill={bgColor}
          fillOpacity="1"
        />
      </svg>
    </div>
  );
};
export default WaveDivider;
