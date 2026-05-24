'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function SectionDivider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef      = useRef<SVGPathElement>(null)
  const drawn        = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const path      = pathRef.current
    if (!container || !path) return

    const H   = 60
    const mid = H / 2
    let W     = container.offsetWidth

    const basePath = () => `M 0 ${mid} Q ${W / 2} ${mid} ${W} ${mid}`

    const init = () => {
      W = container.offsetWidth
      path.setAttribute('d', basePath())
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: drawn.current ? 0 : len })
    }
    init()

    // Dibuja la línea al entrar en viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !drawn.current) {
          drawn.current = true
          gsap.to(path, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' })
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(container)

    // Efecto magnético
    const onMove = (e: MouseEvent) => {
      if (!drawn.current) return
      const rect = container.getBoundingClientRect()
      const x    = e.clientX - rect.left
      const y    = e.clientY - rect.top
      const distY   = Math.abs(y - mid)
      const maxDist = 80

      if (distY < maxDist && x >= 0 && x <= W) {
        const pull     = (1 - distY / maxDist) * 20
        const controlY = y < mid ? mid - pull : mid + pull
        gsap.to(path, {
          attr: { d: `M 0 ${mid} Q ${x} ${controlY} ${W} ${mid}` },
          duration: 0.3, ease: 'power2.out',
        })
      } else {
        gsap.to(path, {
          attr: { d: basePath() },
          duration: 0.7, ease: 'elastic.out(1, 0.35)',
        })
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', init)
    return () => {
      observer.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <div ref={containerRef} className="px-6 md:px-12 max-w-5xl mx-auto" style={{ height: 60 }}>
      <svg width="100%" height="60" style={{ overflow: 'visible' }}>
        <path
          ref={pathRef}
          d=""
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  )
}
