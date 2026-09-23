import { DISCLAIMER_TH } from "@/lib/recommendation/engine";

export default function Disclaimer() {
  return (
    <div className="rounded-card border border-attention-400/30 bg-attention-50 px-4 py-3 text-sm text-attention-600">
      <span aria-hidden className="mr-1.5">⚠</span>
      {DISCLAIMER_TH}
    </div>
  );
}
