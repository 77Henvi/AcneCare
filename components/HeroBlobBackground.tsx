/**
 * Soft organic blob shapes behind the hero visual — purely decorative
 * (aria-hidden), built from the existing teal/sand palette only. No new
 * colors introduced.
 */
export default function HeroBlobBackground() {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-125 opacity-70"
    >
      <defs>
        <linearGradient id="blob-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D7E8E1" />
          <stop offset="100%" stopColor="#EEF5F2" />
        </linearGradient>
      </defs>
      <path
        fill="url(#blob-a)"
        d="M139.5 33.2c46.7-18.6 103.6-7.6 137.9 28.7 34.3 36.3 46.1 92.8 27.6 140.2-18.5 47.4-66.2 85.7-118.1 88.9-51.9 3.2-108-28.7-129.8-75.8C35.3 167.1 42 105.5 74 66.1c14.8-18.3 37-24.3 65.5-32.9Z"
      />
      <path
        fill="#DCD3C0"
        opacity="0.5"
        d="M245 250c28.8 16.6 52 46.4 48.9 76.6-3.1 30.2-32.5 60.8-64.8 65.4-32.3 4.6-67.6-16.8-83.6-46.6-16-29.8-12.7-68 9.6-91 22.3-23 61.1-20 89.9-4.4Z"
      />
    </svg>
  );
}
