'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const CHARS          = 'abcdefghijklmnopqrstuvwxyz'
const NAME           = 'andresanemic'
const SESSION_KEY    = 'andresanemic_visited'
const FRAMES_PER_LETTER = 4
const INTERVAL_MS       = 38

export default function Hero() {
  const rotatingGroupRef = useRef<SVGGElement>(null)
  const discWrapperRef   = useRef<HTMLDivElement>(null)
  const nameRef          = useRef<HTMLHeadingElement>(null)
  const glitchFn         = useRef<() => void>(() => {})

  // ── Scramble: solo en la primera visita de la sesión ─────────────────────
  useEffect(() => {
    const el = nameRef.current
    if (!el) return

    if (sessionStorage.getItem(SESSION_KEY)) return  // ya visitó → nada

    sessionStorage.setItem(SESSION_KEY, '1')

    let frame = 0
    const total = NAME.length * FRAMES_PER_LETTER

    const id = setInterval(() => {
      el.textContent = NAME
        .split('')
        .map((char, i) =>
          i < Math.floor(frame / FRAMES_PER_LETTER)
            ? char
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        )
        .join('')

      frame++
      if (frame > total) {
        clearInterval(id)
        el.textContent = NAME
      }
    }, INTERVAL_MS)

    return () => clearInterval(id)
  }, [])

  // ── Rotación del disco ────────────────────────────────────────────────────
  useEffect(() => {
    const el = rotatingGroupRef.current
    if (!el) return
    const tween = gsap.to(el, {
      rotation: 360, svgOrigin: '0 0',
      duration: 26, repeat: -1, ease: 'none',
    })
    return () => { tween.kill() }
  }, [])

  // ── Glitch periódico + on click ──────────────────────────────────────────
  useEffect(() => {
    const el = nameRef.current
    if (!el) return

    let id: ReturnType<typeof setTimeout>

    const glitch = () => {
      gsap.timeline()
        .to(el, { duration: 0.06, skewX:  8, x:  4, ease: 'none' })
        .to(el, { duration: 0.04, skewX: -5, x: -3, ease: 'none' })
        .to(el, { duration: 0.06, skewX:  3, x:  2, ease: 'none' })
        .to(el, { duration: 0.04, skewX:  0, x:  0, ease: 'none' })
    }

    glitchFn.current = glitch

    const schedule = () => {
      id = setTimeout(() => { glitch(); schedule() }, 12000 + Math.random() * 3000)
    }

    schedule()
    return () => clearTimeout(id)
  }, [])

  // ── Parallax del disco según posición del mouse ───────────────────────────
  useEffect(() => {
    const el = discWrapperRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(el, {
        rotateY:  nx * 28,
        rotateX: -ny * 28,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Patrón SVG del Rotorelief ─────────────────────────────────────────────
  const ELLIPSE_COUNT = 12
  const MAX_R = 88

  const ellipses = Array.from({ length: ELLIPSE_COUNT }, (_, i) => {
    const r = (MAX_R / ELLIPSE_COUNT) * (i + 1)
    return (
      <ellipse
        key={`e-${i}`}
        cx={0} cy={0}
        rx={r} ry={r * 0.52}
        fill="none" stroke="white"
        strokeWidth={0.5 + (i / ELLIPSE_COUNT) * 0.6}
        opacity={0.35 + (i / ELLIPSE_COUNT) * 0.65}
      />
    )
  })

  const circles = Array.from({ length: 7 }, (_, i) => {
    const r = (MAX_R / 7) * (i + 1)
    return (
      <circle
        key={`c-${i}`}
        cx={0} cy={0} r={r}
        fill="none" stroke="white"
        strokeWidth={0.3} opacity={0.12}
      />
    )
  })

  return (
    <section
      className="h-screen flex flex-col items-center justify-center bg-brand-black select-none overflow-hidden"
      aria-label="Hero"
    >
      <div className="flex flex-col items-center gap-12">

        {/* ── Disco con perspectiva 3-D ──────────────────────────────────── */}
        <div style={{ perspective: '600px' }}>
          <div
            ref={discWrapperRef}
            className="w-[38vmin] h-[38vmin]"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            <svg viewBox="-100 -100 200 200" width="100%" height="100%" aria-hidden="true">
              <defs>
                <clipPath id="disc-clip">
                  <circle cx={0} cy={0} r={95} />
                </clipPath>
              </defs>
              <circle cx={0} cy={0} r={95} fill="#000000" />
              <g ref={rotatingGroupRef} clipPath="url(#disc-clip)">
                {circles}
                {ellipses}
                <circle cx={0} cy={0} r={1.5} fill="white" opacity={0.6} />
              </g>
              <circle cx={0} cy={0} r={95} fill="none" stroke="white" strokeWidth={0.8} />
            </svg>
          </div>
        </div>

        {/* ── Identidad ───────────────────────────────────────────────────── */}
        <div className="text-center space-y-4">
          <h1
            ref={nameRef}
            onClick={() => glitchFn.current()}
            className="font-ui text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.15em] sm:tracking-[0.35em] text-brand-white uppercase px-4 sm:px-0 cursor-pointer"
          >
            andresanemic
          </h1>
          <p className="font-ui text-xs sm:text-sm text-brand-gray tracking-widest mx-auto">
            Andrés Peña, periodista chileno.<br />
            Escribo cuando estoy triste.
          </p>
        </div>

      </div>
    </section>
  )
}
