export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0 text-[#F3EFE6]" fill="none">
        <rect x="2" y="2" width="36" height="36" rx="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M14 26l2-7 11-11a2.5 2.5 0 013.5 3.5L19.5 22.5 12 26z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path d="M22.5 11.5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-xl lg:text-2xl" style={{ fontFamily: "'Fraunces', serif" }}>
        <span className="italic text-[#F3EFE6]">Handy</span>
        <span className="text-[#3B5BFF]">Draw</span>
      </span>
    </div>
  );
}