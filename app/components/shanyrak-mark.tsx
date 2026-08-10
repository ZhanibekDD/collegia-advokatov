export function ShanyrakMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="4" />
      <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="2.5" opacity=".95" />
      <path d="M32 5v15M32 44v15M5 32h15M44 32h15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="m12.9 12.9 10.6 10.6M40.5 40.5l10.6 10.6M51.1 12.9 40.5 23.5M23.5 40.5 12.9 51.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 21c2.8 5.6 13.2 5.6 16 0M24 43c2.8-5.6 13.2-5.6 16 0M21 24c5.6 2.8 5.6 13.2 0 16M43 24c-5.6 2.8-5.6 13.2 0 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="m26 26 12 12M38 26 26 38" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="32" r="2.6" fill="currentColor" />
    </svg>
  );
}
