'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

interface Props {
  allSlugs: string[]
  currentSlug: string
}

const FADE_OUT_DURATION = 0.5
const FADE_IN_DURATION  = 1.2
const FADE_EASE         = 'power1.inOut'

export default function RandomPoemArrow({ allSlugs, currentSlug }: Props) {
  const router  = useRouter()
  const btnRef  = useRef<HTMLButtonElement>(null)
  const busy    = useRef(false)

  // Fade in cada vez que el slug cambia (montaje inicial y navegación entre poemas)
  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    busy.current = false
    gsap.to(btn, { opacity: 1, duration: FADE_IN_DURATION, ease: FADE_EASE })
  }, [currentSlug])

  const goToRandom = () => {
    if (busy.current) return
    const others = allSlugs.filter(s => s !== currentSlug)
    if (others.length === 0) return

    busy.current = true
    const pick = others[Math.floor(Math.random() * others.length)]

    // Fade out a la misma velocidad que el fade in
    gsap.to(btnRef.current, {
      opacity: 0,
      duration: FADE_OUT_DURATION,
      ease: FADE_EASE,
      onComplete: () => router.push(`/${encodeURIComponent(pick)}`),
    })
  }

  return (
    <button
      ref={btnRef}
      onClick={goToRandom}
      aria-label="Ir a un poema aleatorio"
      title="Poema aleatorio"
      // opacity:0 inicial → GSAP lo anima a 1; sin flash en el primer render
      style={{ opacity: 0 }}
      className="fixed bottom-8 right-8 w-11 h-11 flex items-center justify-center border border-white/20 bg-brand-black/70 backdrop-blur-sm text-brand-gray hover:text-brand-white hover:border-white/50 transition-colors duration-200"
    >
      <span className="text-lg leading-none">→</span>
    </button>
  )
}
