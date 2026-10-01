// Logo segnaposto: un piccolo simbolo geometrico + nome, finché non arrivano i loghi veri
const MARKS = [
  <g key="tiles">
    <rect x="2" y="2" width="9" height="9" rx="2" />
    <rect x="13" y="2" width="9" height="9" rx="4.5" />
    <rect x="2" y="13" width="9" height="9" rx="4.5" />
    <rect x="13" y="13" width="9" height="9" rx="2" />
  </g>,
  <g key="ring">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" fill="var(--color-mosaiko-sand)" />
  </g>,
  <path key="diamond" d="M12 1.5 22.5 12 12 22.5 1.5 12Z" />,
  <g key="blocks">
    <rect x="2" y="2" width="20" height="9" rx="2" />
    <rect x="2" y="13" width="9" height="9" rx="2" />
    <rect x="13" y="13" width="9" height="9" rx="4.5" />
  </g>,
  <path key="triangle" d="M12 2 22 20H2Z" />,
]

const SIZES = {
  lg: { mark: 'h-8 w-8 sm:h-10 sm:w-10', text: 'text-xl sm:text-2xl' },
  sm: { mark: 'h-6 w-6', text: 'text-sm sm:text-base' },
}

function LogoPlaceholder({ name, index = 0, size = 'sm' }) {
  const s = SIZES[size]

  return (
    <span className="inline-flex items-center gap-2.5 text-mosaiko-navy">
      <svg viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${s.mark}`} aria-hidden="true">
        {MARKS[index % MARKS.length]}
      </svg>
      <span className={`font-heading font-semibold leading-none tracking-tight ${s.text}`}>{name}</span>
    </span>
  )
}

export default LogoPlaceholder
