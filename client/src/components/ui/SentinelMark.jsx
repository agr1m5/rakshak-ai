// The Rakshak mark: a shield silhouette with a slow radar sweep inside it.
// This is the one deliberately "alive" element in the interface — it stands
// for the product's core idea (an assistant that is always watching), so it
// appears in exactly two places (sidebar header, auth hero) and nowhere else.
export default function SentinelMark({ size = 40, animated = true }) {
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {animated && (
        <span className="absolute inset-0 rounded-full border border-sentinel-400/40 animate-pulse-ring" />
      )}
      <svg viewBox="0 0 32 32" width={size} height={size} className="relative">
        <path
          d="M16 2 L28 7 V15 C28 23 22 28 16 30 C10 28 4 23 4 15 V7 Z"
          fill="#0E1626"
          stroke="#38E1C6"
          strokeWidth="1"
        />
        <clipPath id="shield-clip">
          <path d="M16 2 L28 7 V15 C28 23 22 28 16 30 C10 28 4 23 4 15 V7 Z" />
        </clipPath>
        <g clipPath="url(#shield-clip)">
          {animated && (
            <g className="origin-[16px_15px] animate-sweep" style={{ transformOrigin: "16px 15px" }}>
              <path d="M16 15 L16 2 A13 13 0 0 1 27 10 Z" fill="#38E1C6" opacity="0.18" />
            </g>
          )}
          <circle cx="16" cy="15" r="7" fill="none" stroke="#38E1C6" strokeWidth="0.6" opacity="0.4" />
          <circle cx="16" cy="15" r="3.5" fill="none" stroke="#38E1C6" strokeWidth="0.6" opacity="0.6" />
          <circle cx="16" cy="15" r="1.4" fill="#38E1C6" />
        </g>
      </svg>
    </div>
  );
}
