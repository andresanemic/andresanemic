'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  stanzas: string[][]
  title: string
}

export default function PoemBody({ stanzas, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power2.out' }
    )

    const lines = el.querySelectorAll<HTMLElement>('[data-line]')
    gsap.fromTo(
      lines,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.11,
        ease: 'power2.out',
        delay: 0.6,
      }
    )
  }, [])

  return (
    <div ref={containerRef} className="font-poem text-lg md:text-xl text-brand-white">
      <h1
        ref={titleRef}
        style={{ opacity: 0 }}
        className="text-3xl md:text-4xl text-brand-white mb-16 font-normal italic"
      >
        {title}
      </h1>
      {stanzas.map((stanza, si) => (
        <div key={si} className="mb-10">
          {stanza.map((line, li) => (
            <p
              key={li}
              data-line=""
              data-first={li === 0 ? 'true' : undefined}
              className="leading-[1.4] mb-[0.6em] whitespace-pre-wrap"
              style={{ opacity: 0 }}
            >
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
