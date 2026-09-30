"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle: string;
  delay?: number;
  className?: string;
}

/**
 * A small floating card that previews what a result looks like — labelled
 * "ตัวอย่าง" (example) so it reads as a UI preview, never as a live accuracy
 * claim. Values are illustrative, not measured system performance.
 */
export default function FloatingPreviewCard({ title, subtitle, delay = 0, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
      }}
      className={`rounded-card border border-sand-300 bg-surface/95 px-3.5 py-2.5 shadow-[0_10px_30px_-12px_rgba(27,33,30,0.25)] backdrop-blur-sm ${className}`}
    >
      <p className="text-[10px] uppercase tracking-wide text-ink/40">ตัวอย่าง</p>
      <p className="text-sm font-medium text-teal-900">{title}</p>
      <p className="text-xs text-ink/55">{subtitle}</p>
    </motion.div>
  );
}
