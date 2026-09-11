const VARIANTS = {
  primary: 'bg-mosaiko-gold text-mosaiko-navy hover:bg-mosaiko-gold-light',
  outline: 'border border-white/30 text-white hover:bg-white/10',
  outlineNavy: 'border border-mosaiko-navy/25 text-mosaiko-navy hover:bg-mosaiko-navy/5',
}

function Button({ as: Component = 'a', variant = 'primary', className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200'

  return (
    <Component className={`${base} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </Component>
  )
}

export default Button
