type FurrowsProps = {
  tone?: "dark" | "light";
};


const Furrows = ({ tone = "dark" }: FurrowsProps) => {
  const stroke = tone === "dark" ? "#fefcf8" : "#c8a265";

  return (
    <svg
      viewBox="0 0 1200 60"
      className="w-full h-auto"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M0 ${12 + i * 10} Q 300 ${2 + i * 10}, 600 ${12 + i * 10} T 1200 ${12 + i * 10}`}
          fill="none"
          stroke={stroke}
          strokeOpacity={tone === "dark" ? 0.15 : 0.5}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
};

export default Furrows;
