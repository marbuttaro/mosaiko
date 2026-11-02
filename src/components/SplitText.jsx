'use client'

import { Fragment, useRef } from 'react'
import { useInView } from '../lib/useInView'

// Titolo che sale parola per parola da una maschera
function SplitText({ as: Tag = 'h2', text, delay = 0, stagger = 55, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const words = text.split(' ')

  return (
    <Tag ref={ref} className={`split ${inView ? 'is-visible' : ''} ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="split-mask" aria-hidden="true">
            <span className="split-word" style={{ '--split-delay': `${delay + i * stagger}ms` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}

export default SplitText
