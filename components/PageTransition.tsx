'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tween = gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 1.1, delay: 0.1, ease: 'power2.out' }
    )

    const onExit = () => {
      tween.kill()
      gsap.to(el, { opacity: 0, duration: 0.6, ease: 'power2.in' })
    }

    window.addEventListener('page-exit', onExit)
    return () => {
      tween.kill()
      window.removeEventListener('page-exit', onExit)
    }
  }, [])

  return <div ref={ref} style={{ opacity: 0 }}>{children}</div>
}
