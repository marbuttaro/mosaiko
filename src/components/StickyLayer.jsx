'use client'

import { useEffect, useRef, useState } from 'react'

// Livello che resta fermo quando il suo fondo tocca il fondo dello schermo,
// così il pannello successivo può scorrergli sopra (effetto "foglio che sale").
// L'ancora è fuori dall'elemento sticky, così i link #id puntano alla posizione reale.
// `hold` (in vh) aggiunge una pausa: il livello resta fermo e visibile per quel tratto
// di scroll prima che il pannello successivo inizi a salire.
function StickyLayer({ id, hold = 0, children }) {
  const ref = useRef(null)
  const [top, setTop] = useState(0)

  useEffect(() => {
    const el = ref.current
    const update = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight))
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      {id && <div id={id} aria-hidden="true" />}
      <div ref={ref} className="sticky" style={{ top }}>
        {children}
      </div>
      {hold > 0 && <div aria-hidden="true" style={{ height: `${hold}vh` }} />}
    </>
  )
}

export default StickyLayer
