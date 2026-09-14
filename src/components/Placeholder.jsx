const TONES = {
  navy: {
    wrapper: 'bg-gradient-to-br from-mosaiko-navy-2 to-mosaiko-navy',
    shape: 'text-white',
    label: 'text-white/50',
  },
  cream: {
    wrapper: 'bg-gradient-to-br from-white to-mosaiko-navy/5',
    shape: 'text-mosaiko-navy',
    label: 'text-mosaiko-navy/40',
  },
}

function Placeholder({ className = '', tone = 'navy', label }) {
  const t = TONES[tone]

  return (
    <div className={`relative overflow-hidden ${t.wrapper} ${className}`}>
      <svg
        className={`absolute -right-8 -top-10 h-48 w-48 opacity-20 ${t.shape}`}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg
        className={`absolute -bottom-14 -left-10 h-56 w-56 opacity-15 ${t.shape}`}
        viewBox="0 0 100 100"
        fill="none"
      >
        <rect x="12" y="8" width="52" height="84" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {label && (
        <span
          className={`absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-wider ${t.label}`}
        >
          {label}
        </span>
      )}
    </div>
  )
}

export default Placeholder
