import { useEffect, useRef, useState } from 'react'

// Conta da 0 al valore quando entra in viewport (effetto "Count Up" di React Bits)
function CountUp({ to, duration = 2, className = '' }) {
  const ref = useRef(null)
  const [reduceMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [value, setValue] = useState(reduceMotion ? to : 0)

  useEffect(() => {
    const el = ref.current
    if (!el || reduceMotion) return

    let frame
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / (duration * 1000), 1)
          const eased = 1 - Math.pow(2, -10 * t)
          setValue(Math.round(to * (t === 1 ? 1 : eased)))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, duration, reduceMotion])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value.toLocaleString('it-IT')}
    </span>
  )
}

export default CountUp
