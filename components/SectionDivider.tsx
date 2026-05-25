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

    const init = () => {
      W = container.offsetWidth
      const d = `M 0 ${mid} L ${W} ${mid}`
      path.setAttribute('d', d)
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: drawn.current ? 0 : len })
    }
    init()

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

    window.addEventListener('resize', init)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <div ref={containerRef} style={{ height: 60 }}>
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
