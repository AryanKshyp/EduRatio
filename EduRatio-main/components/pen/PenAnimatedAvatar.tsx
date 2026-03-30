"use client";

/**
 * Inline SVG Pen — blink: whole eye (sclera + pupil) scales vertically from round → flat slit → round.
 * Transform origin at eye center so it reads as blinking, not lids sliding in.
 */
export function PenAnimatedAvatar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <filter id="pen-avatar-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2F4156" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#pen-avatar-shadow)">
        <ellipse cx="55" cy="128" rx="28" ry="5" fill="#2F4156" opacity="0.12" />

        <g>
          <ellipse cx="38" cy="118" rx="12" ry="7" fill="#f5a623" stroke="#d4880a" strokeWidth="1" />
          <ellipse cx="32" cy="121" rx="5" ry="3.5" fill="#f5a623" />
          <ellipse cx="38" cy="123" rx="5" ry="3.5" fill="#f5a623" />
          <ellipse cx="44" cy="121" rx="5" ry="3.5" fill="#f5a623" />
        </g>
        <g>
          <ellipse cx="72" cy="118" rx="12" ry="7" fill="#f5a623" stroke="#d4880a" strokeWidth="1" />
          <ellipse cx="66" cy="121" rx="5" ry="3.5" fill="#f5a623" />
          <ellipse cx="72" cy="123" rx="5" ry="3.5" fill="#f5a623" />
          <ellipse cx="78" cy="121" rx="5" ry="3.5" fill="#f5a623" />
        </g>

        <ellipse cx="55" cy="92" rx="30" ry="36" fill="#2a3540" stroke="#1e2630" strokeWidth="1.2" />
        <ellipse cx="55" cy="96" rx="19" ry="26" fill="#f7f4f0" />

        <g>
          <ellipse cx="22" cy="88" rx="10" ry="20" fill="#2a3540" stroke="#1e2630" strokeWidth="1" transform="rotate(-10 22 88)" />
        </g>
        <g>
          <ellipse cx="88" cy="88" rx="10" ry="20" fill="#2a3540" stroke="#1e2630" strokeWidth="1" transform="rotate(10 88 88)" />
        </g>

        <circle cx="55" cy="48" r="33" fill="#2a3540" stroke="#1e2630" strokeWidth="1.2" />

        <ellipse cx="55" cy="54" rx="22" ry="20" fill="#faf8f5" />

        <ellipse cx="36" cy="58" rx="6" ry="4" fill="#ffb4c0" opacity="0.55" />
        <ellipse cx="74" cy="58" rx="6" ry="4" fill="#ffb4c0" opacity="0.55" />

        <path d="M 40 42 Q 44 39 48 41" stroke="#1e2630" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 62 41 Q 66 39 70 42" stroke="#1e2630" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        <g className="pen-avatar-eye pen-avatar-eye-l">
          <ellipse cx="43" cy="48" rx="9" ry="10" fill="white" stroke="#1e2630" strokeWidth="1" />
          <circle cx="44.5" cy="49" r="5" fill="#141820" />
          <circle cx="46.5" cy="47" r="2" fill="white" />
        </g>

        <g className="pen-avatar-eye pen-avatar-eye-r">
          <ellipse cx="67" cy="48" rx="9" ry="10" fill="white" stroke="#1e2630" strokeWidth="1" />
          <circle cx="68.5" cy="49" r="5" fill="#141820" />
          <circle cx="70.5" cy="47" r="2" fill="white" />
        </g>

        <path
          d="M 49 62 Q 55 72 61 62 Q 57 58 53 58 Z"
          fill="#f5a623"
          stroke="#d4880a"
          strokeWidth="0.8"
        />
        <path d="M 49 62 Q 55 66 61 62" stroke="#d4880a" strokeWidth="0.8" fill="none" />
      </g>
    </svg>
  );
}
