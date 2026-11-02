'use client'

import { useRef } from 'react'
import { useInView } from '../lib/useInView'

// Dissolvenza dal basso all'ingresso in viewport
function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...props }) {
  const ref = useRef(null)
  const inView = useInView(ref)

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Reveal
