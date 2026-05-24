'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  // Anima solo al montar — el key={slug} del layout garantiza un montaje fresco
  // en cada poema, por lo que nunca hay conflicto con GSAP sobreescribiendo opacity
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.85, ease: 'power1.out' }
    )
    return () => { tween.kill() }
  }, [])

  return <div ref={ref} style={{ opacity: 0 }}>{children}</div>
}
