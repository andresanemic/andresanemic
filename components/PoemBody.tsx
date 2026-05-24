'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  stanzas: string[][]
}

export default function PoemBody({ stanzas }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const lines = el.querySelectorAll<HTMLElement>('[data-line]')

    // Las líneas ya llegan con opacity:0 desde el SSR (style inline en el JSX),
    // así que no hay flash. GSAP solo necesita animar hacia opacity:1.
    gsap.fromTo(
      lines,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: 'power2.out',
        delay: 0.45,
      }
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className="font-poem text-lg md:text-xl text-brand-white"
    >
      {stanzas.map((stanza, si) => (
        <div key={si} className="mb-10">
          {stanza.map((line, li) => (
            <p key={li} data-line="" className="leading-[1.4] mb-[0.6em]" style={{ opacity: 0 }}>
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
