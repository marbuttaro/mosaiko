const VARIANTS = {
  primary: 'bg-mosaiko-beige text-mosaiko-navy hover:bg-mosaiko-beige-light',
  // Regola: su sfondo scuro 'primary' (oro), su sfondo chiaro 'navy'
  navy: 'bg-mosaiko-navy text-white hover:bg-mosaiko-navy-3',
  outline: 'border border-white/30 text-white hover:bg-white/10',
  outlineNavy: 'border border-mosaiko-navy/25 text-mosaiko-navy hover:bg-mosaiko-navy/5',
}

function Button({ as: Component = 'a', variant = 'primary', className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200'

  return (
    <Component className={`${base} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </Component>
  )
}

export default Button
