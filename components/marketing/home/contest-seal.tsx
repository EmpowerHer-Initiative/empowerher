export const ContestSeal = () => (
  <div className="relative size-32">
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className="h-full w-full animate-[spin_26s_linear_infinite]"
    >
      <defs>
        <path
          id="hv-seal-path"
          d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
        />
      </defs>
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        stroke="#E0AE3C"
        strokeWidth="1.4"
      />
      <circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="#E0AE3C"
        strokeWidth="1"
        strokeDasharray="1.5 4.5"
        opacity="0.8"
      />
      <text
        fill="#E0AE3C"
        style={{ fontSize: "9.2px", fontWeight: 700, letterSpacing: "3px" }}
      >
        <textPath href="#hv-seal-path" startOffset="0">
          HERVOICE &middot; CELEBRATING WINNERS &middot;{" "}
        </textPath>
      </text>
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <p className="font-serif text-[26px] leading-none font-bold">2026</p>
      <p className="mt-0.5 text-[8.5px] font-bold tracking-[0.2em] text-[#E0AE3C] uppercase">
        Winners
      </p>
    </div>
  </div>
);
