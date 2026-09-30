"use client";

import { motion } from "framer-motion";

const LABEL = "AI SKIN ANALYSIS • ประเมินผิวเบื้องต้น • ";

/**
 * Circular rotating text badge (like a "clean beauty" seal on a product
 * page) — here it honestly says what the system does rather than making a
 * quality claim, and keeps spinning slowly so it reads as a UI flourish,
 * not a certification stamp.
 */
export default function RotatingBadge() {
  const id = "rotating-badge-path";

  return (
    <motion.div
      className="relative h-20 w-20 sm:h-24 sm:w-24"
      animate={{ rotate: 360 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <path id={id} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="#123B30" />
        <text fill="#EEF5F2" fontSize="8.2" letterSpacing="1.5">
          <textPath href={`#${id}`}>{LABEL.repeat(2)}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg" aria-hidden>
          ✦
        </span>
      </div>
    </motion.div>
  );
}
