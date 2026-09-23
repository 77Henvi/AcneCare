"use client";

import { motion } from "framer-motion";

/**
 * Overlay shown on top of the captured photo while the (mock or real)
 * predictor is running. The moving line + corner brackets communicate
 * "actively being analyzed" rather than a generic spinner, and doubles as
 * a loading indicator so slow real-model inference doesn't feel stalled.
 */
export default function ScanLineOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-card">
      <motion.div
        className="absolute left-0 right-0 h-1/4"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(60,130,114,0.35), transparent)",
        }}
        initial={{ top: "-25%" }}
        animate={{ top: ["-25%", "100%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      {[
        "top-3 left-3 border-t-2 border-l-2",
        "top-3 right-3 border-t-2 border-r-2",
        "bottom-3 left-3 border-b-2 border-l-2",
        "bottom-3 right-3 border-b-2 border-r-2",
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute h-6 w-6 rounded-[3px] border-teal-400 ${cls}`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}
