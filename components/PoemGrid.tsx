'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import PoemCard from './PoemCard'
import type { Poem } from '@/lib/poems'

function shuffle(arr: Poem[]): Poem[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const PAGES = [9, 7] as const // 9 primeras, 7 restantes

export default function PoemGrid({ poems }: { poems: Poem[] }) {
  const [shuffled, setShuffled] = useState<Poem[] | null>(null)
  const [page, setPage] = useState(0)
  const gridRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  useEffect(() => {
    setShuffled(shuffle(poems))
  }, [poems])

  // Anima la entrada cada vez que cambia el contenido
  useEffect(() => {
    if (!gridRef.current || !shuffled) return
    gsap.fromTo(
      gridRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    )
  }, [page, shuffled])

  const goTo = (next: number) => {
    if (busy.current || !gridRef.current) return
    busy.current = true

    gsap.to(gridRef.current, {
      opacity: 0,
      y: -16,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setPage(next)
        busy.current = false
      },
    })
  }

  // Placeholders mientras el shuffle no ocurrió (server → client)
  if (!shuffled) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: PAGES[0] }).map((_, i) => (
            <div key={i} className="h-44 border border-white/10" />
          ))}
        </div>
        <div className="flex justify-end mt-10">
          <div className="w-11 h-11 border border-white/10" />
        </div>
      </div>
    )
  }

  const slices = [shuffled.slice(0, PAGES[0]), shuffled.slice(PAGES[0])]
  const current = slices[page]

  return (
    <div>
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {current.map(poem => (
          <PoemCard key={poem.slug} poem={poem} />
        ))}
      </div>

      {/* Flechas: solo la relevante para la página actual */}
      <div className="flex justify-end mt-10">
        {page === 0 ? (
          <button
            onClick={() => goTo(1)}
            aria-label="Ver más poemas"
            className="w-11 h-11 flex items-center justify-center border border-white/20 text-brand-gray hover:text-brand-white hover:border-white/50 transition-all duration-200"
          >
            →
          </button>
        ) : (
          <button
            onClick={() => goTo(0)}
            aria-label="Volver a los primeros poemas"
            className="w-11 h-11 flex items-center justify-center border border-white/20 text-brand-gray hover:text-brand-white hover:border-white/50 transition-all duration-200"
          >
            ←
          </button>
        )}
      </div>
    </div>
  )
}
