// Styled placeholder for the custom dark-mode map. Replace with Mapbox GL once an
// access token and the confirmed office/workshop coordinates are provided.
export default function LocationMap() {
  return (
    <figure className="glass overflow-hidden">
      <div className="relative aspect-[4/3] bg-ink-900">
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" role="img" aria-label="Map placeholder showing Kuwait office location">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.05)" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />
          <path d="M0 210 C 80 200, 120 230, 200 215 S 320 190, 400 205 V300 H0Z" fill="#0f2a44" />
          <g stroke="rgba(148,163,184,0.25)" strokeWidth="3" fill="none">
            <path d="M30 40 L 220 150 L 380 120" />
            <path d="M60 180 L 220 150 L 260 20" />
            <path d="M140 0 L 170 190" />
          </g>
          <g transform="translate(220 150)">
            <circle r="22" fill="#ff6a00" opacity=".2">
              <animate attributeName="r" values="10;28;10" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values=".4;0;.4" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r="7" fill="#ff6a00" stroke="#fff" strokeWidth="2" />
          </g>
        </svg>
      </div>
      <figcaption className="px-5 py-3 text-xs text-slate-500">Interactive map pending location confirmation.</figcaption>
    </figure>
  );
}
