// Logo monocromatico: la larghezza cresce con la radice del rapporto d'aspetto,
// così loghi quadrati e loghi molto larghi occupano più o meno la stessa area
function PartnerLogo({ name, logo, ratio, scale = 7, className = '' }) {
  const width = scale * Math.sqrt(ratio)

  return (
    <img
      src={logo}
      alt={name}
      width={Math.round(width * 16)}
      height={Math.round((width * 16) / ratio)}
      loading="lazy"
      className={`h-auto max-w-full opacity-55 transition-opacity duration-300 hover:opacity-100 ${className}`}
      style={{ width: `${width}rem` }}
    />
  )
}

export default PartnerLogo
