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

const FIRST_DESKTOP = 9

export default function PoemGrid({ poems }: { poems: Poem[] }) {
  const [shuffled, setShuffled] = useState<Poem[] | null>(null)
  const [page, setPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => { setIsMobile(e.matches); setPage(0) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    setShuffled(shuffle(poems))
  }, [poems])

  // Scroll-reveal: cada card aparece al entrar en el viewport
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !shuffled) return

    // Resetea el wrapper (puede venir con opacity:0 del goTo de paginación)
    gsap.set(grid, { opacity: 1, y: 0 })

    const cards = Array.from(grid.children) as HTMLElement[]
    gsap.set(cards, { opacity: 0, y: 28 })

    let fired = 0
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const i = cards.indexOf(entry.target as HTMLElement)
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 2.0,
            delay: fired < cards.length ? i * 0.28 : 0,
            ease: 'power2.out',
          })
          fired++
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12 }
    )

    cards.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [page, shuffled])

  const goTo = (next: number) => {
    if (busy.current || !gridRef.current) return
    busy.current = true

    gsap.to(gridRef.current, {
      opacity: 0,
      y: -16,
      duration: 0.65,
      ease: 'power1.in',
      onComplete: () => {
        setPage(next)
        busy.current = false
      },
    })
  }

  const firstPageSize = isMobile ? 3 : FIRST_DESKTOP

  // Placeholders mientras el shuffle no ocurrió (server → client)
  if (!shuffled) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: firstPageSize }).map((_, i) => (
            <div key={i} className="h-44 border border-white/10" />
          ))}
        </div>
        <div className="flex justify-end mt-10">
          <div className="w-11 h-11 border border-white/10" />
        </div>
      </div>
    )
  }

  const totalPages = isMobile ? Math.ceil(shuffled.length / 3) : 2
  const current = isMobile
    ? shuffled.slice(page * 3, page * 3 + 3)
    : page === 0 ? shuffled.slice(0, FIRST_DESKTOP) : shuffled.slice(FIRST_DESKTOP)

  const hasPrev = page > 0
  const hasNext = page < totalPages - 1

  const btnClass = 'w-11 h-11 flex items-center justify-center border border-brand-white bg-brand-white text-brand-black hover:bg-transparent hover:text-brand-white transition-all duration-200'

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

      <div className="flex justify-end gap-3 mt-10">
        {hasPrev && (
          <button onClick={() => goTo(page - 1)} aria-label="Página anterior" className={btnClass}>←</button>
        )}
        {hasNext && (
          <button onClick={() => goTo(page + 1)} aria-label="Página siguiente" className={btnClass}>→</button>
        )}
      </div>
    </div>
  )
}
