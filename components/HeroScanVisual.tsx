"use client";

import { motion } from "framer-motion";

/**
 * The one deliberate motion moment on the landing page (per frontend-design
 * guidance: spend boldness in one place). A stylised face outline with a
 * scan line that sweeps top-to-bottom once on load, then settles into a
 * slow idle loop — visually explains "AI reads your face" without a stock
 * photo or a literal camera icon.
 */
export default function HeroScanVisual() {
  return (
    <div className="relative aspect-square w-full max-w-[280px] mx-auto lg:mx-0">
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <defs>
          <clipPath id="face-clip">
            <path d="M100 24c-34 0-56 26-56 62 0 40 26 78 56 78s56-38 56-78c0-36-22-62-56-62z" />
          </clipPath>
          <linearGradient id="scan-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3C8272" stopOpacity="0" />
            <stop offset="50%" stopColor="#3C8272" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3C8272" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* face outline */}
        <path
          d="M100 24c-34 0-56 26-56 62 0 40 26 78 56 78s56-38 56-78c0-36-22-62-56-62z"
          fill="#FFFFFF"
          stroke="#DCD3C0"
          strokeWidth="2"
        />

        {/* landmark dots — eyes, nose tip, mouth corners */}
        {[
          [78, 92],
          [122, 92],
          [100, 116],
          [86, 142],
          [114, 142],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="2.6"
            fill="#25604F"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
          />
        ))}

        {/* sweeping scan line, clipped to the face shape */}
        <g clipPath="url(#face-clip)">
          <motion.rect
            x="30"
            y="0"
            width="140"
            height="26"
            fill="url(#scan-grad)"
            initial={{ y: 10 }}
            animate={{ y: [10, 160, 10] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          />
        </g>

        {/* corner brackets, like a framing/detection UI */}
        {[
          { x: 28, y: 20, rotate: 0 },
          { x: 172, y: 20, rotate: 90 },
          { x: 172, y: 178, rotate: 180 },
          { x: 28, y: 178, rotate: 270 },
        ].map((c, i) => (
          <motion.path
            key={i}
            d="M0 10 L0 0 L10 0"
            stroke="#3C8272"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            transform={`translate(${c.x} ${c.y}) rotate(${c.rotate})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
          />
        ))}
      </svg>
    </div>
  );
}
