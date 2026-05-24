'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.body.style.cursor = 'none'

    const dot  = dotRef.current!
    const ring = ringRef.current!

    gsap.set([dot, ring], { opacity: 0 })

    const onMove = (e: MouseEvent) => {
      gsap.to(dot,  { x: e.clientX - 2.5, y: e.clientY - 2.5, duration: 0.55, ease: 'power3.out', opacity: 1 })
      gsap.to(ring, { x: e.clientX - 15,  y: e.clientY - 15,  duration: 0.08, ease: 'power2.out', opacity: 1 })
    }

    const onOver = (e: MouseEvent) => {
      const link = (e.target as Element).closest('a, button')
      if (link && !link.contains(e.relatedTarget as Node)) {
        gsap.to(ring, { scale: 1.3, duration: 0.2, ease: 'power2.out' })
      }
    }

    const onOut = (e: MouseEvent) => {
      const link = (e.target as Element).closest('a, button')
      if (link && !link.contains(e.relatedTarget as Node)) {
        gsap.to(ring, { scale: 1, duration: 0.2, ease: 'power2.out' })
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} aria-hidden="true" style={{
        position: 'fixed', top: 0, left: 0,
        width: 5, height: 5, borderRadius: '50%',
        background: 'white', mixBlendMode: 'difference',
        pointerEvents: 'none', zIndex: 9999,
      }} />
      <div ref={ringRef} aria-hidden="true" style={{
        position: 'fixed', top: 0, left: 0,
        width: 30, height: 30, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.5)',
        pointerEvents: 'none', zIndex: 9999,
      }} />
    </>
  )
}
