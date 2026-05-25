'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import type { Poem } from '@/lib/poems'

export default function PoemCard({ poem }: { poem: Poem }) {
  const href    = `/${encodeURIComponent(poem.slug)}`
  const router  = useRouter()
  const wrapRef = useRef<HTMLDivElement>(null)
  const artRef  = useRef<HTMLElement>(null)
  const [isRead, setIsRead] = useState(false)

  // ── Leer estado "visitado" desde sessionStorage ───────────────────────────
  useEffect(() => {
    const read: string[] = JSON.parse(sessionStorage.getItem('read_poems') ?? '[]')
    setIsRead(read.includes(poem.slug))
  }, [poem.slug])

  // ── Respiración: scale muy sutil, desfasada por card ─────────────────────
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const tween = gsap.to(el, {
      y: -2,
      scale: 1.012,
      duration: 1.8 + Math.random() * 1.2,
      delay: Math.random() * 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
    return () => { tween.kill() }
  }, [])

  // ── Hover 3-D ─────────────────────────────────────────────────────────────
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = artRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const nx = ((e.clientX - left) / width  - 0.5) * 2
    const ny = ((e.clientY - top)  / height - 0.5) * 2
    gsap.to(el, { rotateY: nx * 6, rotateX: -ny * 6, duration: 0.4, ease: 'power2.out' })
  }

  const onMouseLeave = () => {
    gsap.to(artRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' })
  }

  // ── Click: escala y navega ────────────────────────────────────────────────
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('page-exit'))
    gsap.to(artRef.current, {
      scale: 1.07,
      duration: 0.75,
      ease: 'expo.out',
      onComplete: () => router.push(href),
    })
  }

  return (
    <Link href={href} className="group block" onClick={handleClick}>
      {/* wrapper: breathing — aislado del 3-D para no conflictuar transforms */}
      <div ref={wrapRef}>
        <article
          ref={artRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className={`relative h-44 border p-7 overflow-hidden group-hover:bg-brand-white transition-colors duration-150 ${
            isRead ? 'border-white/30' : 'border-white/10'
          }`}
          style={{ perspective: '800px', transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {/* Punto de "leído" */}
          {isRead && (
            <span className="absolute top-3 right-3 font-ui text-[9px] leading-none text-white/50 group-hover:text-black/30 transition-colors duration-150">
              ✓
            </span>
          )}

          <h2 className="font-poem text-base font-normal tracking-wide mb-5 truncate text-brand-white group-hover:text-brand-black transition-colors duration-150">
            {poem.title}
          </h2>

          <div className="space-y-1">
            {poem.preview.map((line, i) => (
              <p
                key={i}
                className="font-poem text-sm leading-relaxed truncate text-brand-gray-light group-hover:text-brand-black/60 transition-colors duration-150"
              >
                {line}
              </p>
            ))}
            {poem.preview.length > 0 && (
              <p className="font-poem text-sm mt-1 text-brand-gray/30 group-hover:text-brand-black/30 transition-colors duration-150">
                …
              </p>
            )}
          </div>
        </article>
      </div>
    </Link>
  )
}
