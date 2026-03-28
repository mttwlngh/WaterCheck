"use client";

interface StanleyCupProps {
  percentage: number;
  isGoalReached: boolean;
  mobile?: boolean;
}

export function StanleyCup({ percentage, isGoalReached, mobile = false }: StanleyCupProps) {
  const clampedPct = Math.min(Math.max(percentage, 0), 100);

  // Cup inner fill area: top y=80, bottom y=440, total height=360
  // We fill from the bottom up
  const cupInnerTop = 80;
  const cupInnerBottom = 440;
  const cupInnerHeight = cupInnerBottom - cupInnerTop;
  const fillHeight = (clampedPct / 100) * cupInnerHeight;
  const fillY = cupInnerBottom - fillHeight;

  // Water color
  const waterColor = isGoalReached ? "#22c55e" : "#38bdf8";
  const waterColorDark = isGoalReached ? "#16a34a" : "#0ea5e9";

  return (
    <div className="relative flex flex-col items-center select-none">
      <svg
        viewBox="0 0 220 500"
        className={mobile ? "w-28 drop-shadow-xl" : "w-48 md:w-56 lg:w-64 drop-shadow-2xl"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clip path for inner cup body */}
          <clipPath id="cupBodyClip">
            {/* Cup shape: slight trapezoid with rounded bottom */}
            <path d="
              M 52,70
              L 30,440
              Q 30,460 50,460
              L 170,460
              Q 190,460 190,440
              L 168,70
              Z
            " />
          </clipPath>

          {/* Gradient for cup glass effect */}
          <linearGradient id="cupGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.25" />
            <stop offset="35%" stopColor="#f0f9ff" stopOpacity="0.08" />
            <stop offset="65%" stopColor="#f0f9ff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.22" />
          </linearGradient>

          {/* Water gradient */}
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={waterColorDark} stopOpacity="0.95" />
            <stop offset="50%" stopColor={waterColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={waterColorDark} stopOpacity="0.95" />
          </linearGradient>

          {/* Shine gradient for cup */}
          <linearGradient id="cupShineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Handle gradient */}
          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="1" />
            <stop offset="50%" stopColor="#f1f5f9" stopOpacity="1" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* ── Handle ── */}
        <path
          d="M 190,140 Q 230,140 230,190 Q 230,240 190,240"
          fill="none"
          stroke="url(#handleGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 190,140 Q 228,140 228,190 Q 228,240 190,240"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* ── Cup Body Shadow ── */}
        <path
          d="M 54,72 L 32,442 Q 32,464 52,464 L 168,464 Q 188,464 188,442 L 166,72 Z"
          fill="#94a3b8"
          opacity="0.18"
          transform="translate(4,6)"
        />

        {/* ── Cup Body Background ── */}
        <path
          d="M 52,70 L 30,440 Q 30,460 50,460 L 170,460 Q 190,460 190,440 L 168,70 Z"
          fill="#f0f9ff"
          fillOpacity="0.6"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* ── Water Fill (clipped to cup shape) ── */}
        <g clipPath="url(#cupBodyClip)">
          {/* Water body */}
          <rect
            x="28"
            y={fillY}
            width="164"
            height={fillHeight + 10}
            fill="url(#waterGrad)"
            style={{
              transition: "y 0.8s cubic-bezier(0.4, 0, 0.2, 1), height 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Wave on top of water */}
          {clampedPct > 0 && clampedPct < 100 && (
            <g style={{ transform: `translateY(${fillY - 10}px)` }}>
              <path
                className="animate-wave"
                d="M 28,10 Q 55,0 82,10 Q 109,20 136,10 Q 163,0 192,10 L 192,22 L 28,22 Z"
                fill={waterColor}
                opacity="0.7"
                style={{
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              <path
                className="animate-wave-slow"
                d="M 28,14 Q 60,4 92,14 Q 124,24 156,14 Q 174,8 192,14 L 192,22 L 28,22 Z"
                fill={waterColor}
                opacity="0.5"
                style={{
                  transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </g>
          )}

          {/* Shimmer on water */}
          {clampedPct > 0 && (
            <rect
              x="40"
              y={Math.max(fillY, cupInnerTop)}
              width="20"
              height={Math.min(fillHeight, cupInnerHeight)}
              rx="10"
              fill="white"
              opacity="0.18"
              style={{
                transition: "y 0.8s cubic-bezier(0.4, 0, 0.2, 1), height 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          )}
        </g>

        {/* ── Cup Glass Overlay ── */}
        <path
          d="M 52,70 L 30,440 Q 30,460 50,460 L 170,460 Q 190,460 190,440 L 168,70 Z"
          fill="url(#cupGlassGrad)"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* ── Left Shine ── */}
        <path
          d="M 60,90 L 45,380"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M 72,90 L 59,320"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* ── Lid / Top ── */}
        <rect x="42" y="56" width="136" height="20" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="48" y="60" width="124" height="12" rx="3" fill="#f1f5f9" />

        {/* ── Straw Hole on Lid ── */}
        <ellipse cx="110" cy="56" rx="10" ry="5" fill="#cbd5e1" />
        <ellipse cx="110" cy="56" rx="7" ry="3.5" fill="#94a3b8" />

        {/* ── Straw ── */}
        <rect x="106" y="0" width="8" height="62" rx="4" fill="#94a3b8" />
        <rect x="107" y="0" width="3" height="62" rx="2" fill="#e2e8f0" opacity="0.6" />

        {/* ── Bottom Ring ── */}
        <ellipse cx="110" cy="460" rx="60" ry="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

        {/* ── Logo Area on Cup ── */}
        {clampedPct < 70 && (
          <g opacity="0.3">
            <circle cx="110" cy="260" r="18" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <text
              x="110"
              y="265"
              textAnchor="middle"
              fontSize="9"
              fill="#64748b"
              fontFamily="sans-serif"
              fontWeight="600"
              letterSpacing="1"
            >
              H₂O
            </text>
          </g>
        )}

        {/* ── Success overlay ── */}
        {isGoalReached && (
          <g>
            <circle cx="110" cy="260" r="26" fill="#22c55e" opacity="0.2" />
            <text x="110" y="255" textAnchor="middle" fontSize="22" fill="#16a34a">
              ✓
            </text>
          </g>
        )}
      </svg>

      {/* Percentage badge */}
      <div
        className={`mt-3 px-3 py-1 rounded-full font-semibold tracking-wide transition-all duration-500 ${
          mobile ? "text-xs" : "text-sm px-4 py-1.5"
        } ${
          isGoalReached
            ? "bg-green-100 text-green-700"
            : "bg-sky-100 text-sky-700"
        }`}
      >
        {clampedPct}%
      </div>
    </div>
  );
}
