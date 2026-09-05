export function SketchArt({
  className = "",
  variant = "signup",
}: {
  className?: string;
  variant?: "signup" | "signin";
}) {
  if (variant === "signin") {
    return (
      <svg
        viewBox="0 0 640 480"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* welcoming speech bubble */}
        <path
          d="M120 220c0-56 46-100 104-100h96c58 0 104 44 104 100c0 56-46 100-104 100h-40l-40 36v-36h-16c-58 0-104-44-104-100Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[stroke-dasharray:1100] [stroke-dashoffset:1100]"
          style={{ animation: "draw-line 1.7s ease-out 0.1s forwards" }}
        />

        {/* checkmark, "you're all set" */}
        <path
          d="M215 215l30 30l70-70"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[stroke-dasharray:180] [stroke-dashoffset:180]"
          style={{ animation: "draw-line 0.6s ease-out 1.9s forwards" }}
        />

        {/* signature-like wavy flourish underneath */}
        <path
          d="M150 360c40-20 80 20 120 0s80-20 120 0"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="[stroke-dasharray:340] [stroke-dashoffset:340]"
          style={{ animation: "draw-line 1s ease-out 2.6s forwards" }}
        />

        {/* small entry arrow */}
        <path
          d="M420 320h50m0 0l-16-16m16 16l-16 16"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[stroke-dasharray:120] [stroke-dashoffset:120]"
          style={{ animation: "draw-line 0.6s ease-out 3.4s forwards" }}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 640 480"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* loose hand-drawn circle */}
      <path
        d="M180 300c-42-48-34-124 22-158c60-38 138-26 176 20c36 44 30 118-16 156c-54 44-140 36-182-18Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="[stroke-dasharray:1000] [stroke-dashoffset:1000]"
        style={{ animation: "draw-line 1.6s ease-out 0.1s forwards" }}
      />

      {/* connecting squiggle */}
      <path
        d="M240 250c46 6 70-34 116-34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="[stroke-dasharray:300] [stroke-dashoffset:300]"
        style={{ animation: "draw-line 0.8s ease-out 0.9s forwards" }}
      />

      {/* tilted sticky-note rectangle with folded corner */}
      <g style={{ transform: "rotate(-6deg)", transformOrigin: "440px 260px" }}>
        <path
          d="M370 190h150v130h-150Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[stroke-dasharray:700] [stroke-dashoffset:700]"
          style={{ animation: "draw-line 1.2s ease-out 1.1s forwards" }}
        />
        <path
          d="M480 190v36h40"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="[stroke-dasharray:120] [stroke-dashoffset:120]"
          style={{ animation: "draw-line 0.5s ease-out 2.1s forwards" }}
        />
      </g>

      {/* small spark/sparkle */}
      <path
        d="M110 120l10 26l26 10l-26 10l-10 26l-10-26l-26-10l26-10Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="[stroke-dasharray:220] [stroke-dashoffset:220]"
        style={{ animation: "draw-line 0.9s ease-out 2.4s forwards" }}
      />
    </svg>
  );
}