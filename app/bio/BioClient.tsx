'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

const GLITCH_CHARS = '!×∆≠∑√∂∫Ω#@%&÷±~*§¶'
const GAP = 3.5

interface PhraseConfig {
  type: 'normal' | 'glitch' | 'link'
  text?: string
  lines?: string[]
  size: string
  blur: boolean
}

const PHRASES: PhraseConfig[] = [
  {
    type: 'normal',
    text: 'nací en la capital de un país encerrado por la naturaleza.',
    size: 'text-lg md:text-4xl',
    blur: true,
  },
  {
    type: 'normal',
    text: 'andrés peña mellado',
    size: 'text-3xl md:text-7xl',
    blur: false,
  },
  {
    type: 'normal',
    text: 'originario de santiago, chile',
    size: 'text-base md:text-2xl',
    blur: false,
  },
  {
    type: 'glitch',
    lines: ['estudié periodismo y comunicación'],
    size: 'text-lg md:text-3xl',
    blur: false,
  },
  {
    type: 'glitch',
    lines: ['porque necesitaba entender'],
    size: 'text-base md:text-2xl',
    blur: false,
  },
  {
    type: 'glitch',
    lines: ['por qué las personas dicen cosas'],
    size: 'text-lg md:text-3xl',
    blur: false,
  },
  {
    type: 'glitch',
    lines: ['y luego hacen otras.'],
    size: 'text-base md:text-2xl',
    blur: false,
  },
  {
    type: 'normal',
    text: 'escribo poesía hace tiempo.',
    size: 'text-sm md:text-xl',
    blur: true,
  },
  {
    type: 'normal',
    text: 'si quieres leer mis poemas, navega hacia atrás.',
    size: 'text-sm md:text-xl',
    blur: false,
  },
  {
    type: 'link',
    text: '¡o haz clic aquí!',
    size: 'text-base md:text-2xl',
    blur: false,
  },
]

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Rect = { top: number; left: number; w: number; h: number }
type Pos  = { top: number; left: number }

function noOverlap(a: Rect, b: Rect): boolean {
  return (
    a.left + a.w + GAP <= b.left ||
    b.left + b.w + GAP <= a.left ||
    a.top  + a.h + GAP <= b.top  ||
    b.top  + b.h + GAP <= a.top
  )
}

function findPos(wPct: number, hPct: number, placed: Rect[]): Pos {
  const pad    = 2
  const topMax = 93 - hPct
  const lefMax = 97 - wPct

  for (let i = 0; i < 500; i++) {
    const top  = pad + Math.random() * (topMax - pad)
    const left = pad + Math.random() * (lefMax - pad)
    const c: Rect = { top, left, w: wPct, h: hPct }
    if (placed.every(p => noOverlap(c, p))) return { top, left }
  }

  const lastBottom = placed.reduce((m, p) => Math.max(m, p.top + p.h + GAP), pad)
  return { top: Math.min(lastBottom, topMax), left: pad + Math.random() * 30 }
}

// ── Sub-components ──────────────────────────────────────────────────────────

function GlitchLines({ lines, active }: { lines: string[]; active: boolean }) {
  const [states, setStates] = useState<(string | null)[][]>(() =>
    lines.map(l => l.split(' ').map(() => null))
  )

  useEffect(() => {
    if (!active) return
    let dead = false
    let idx = 0

    lines.forEach((line, li) => {
      line.split(' ').forEach((word, wi) => {
        const delay = idx * 160
        idx++
        setTimeout(() => {
          if (dead) return
          let frame = 0
          const tick = () => {
            if (dead) return
            if (frame < 5) {
              const scrambled = word
                .split('')
                .map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
                .join('')
              setStates(prev => {
                const next = prev.map(r => [...r])
                next[li][wi] = scrambled
                return next
              })
              frame++
              setTimeout(tick, 65)
            } else {
              setStates(prev => {
                const next = prev.map(r => [...r])
                next[li][wi] = word
                return next
              })
            }
          }
          tick()
        }, delay)
      })
    })

    return () => { dead = true }
  }, [active, lines])

  return (
    <div>
      {lines.map((line, li) => (
        <p key={li} className="mb-0.5 leading-snug">
          {line.split(' ').map((word, wi) => {
            const s = states[li]?.[wi]
            return (
              <span key={wi}>
                {s === null ? (
                  <span className="opacity-0 select-none" aria-hidden>{word}</span>
                ) : s === word ? (
                  <span data-bio-letter>{word}</span>
                ) : (
                  <span className="opacity-40">{s}</span>
                )}
                {wi < line.split(' ').length - 1 ? ' ' : ''}
              </span>
            )
          })}
        </p>
      ))}
    </div>
  )
}

function LetterSpans({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span key={i} data-bio-letter style={{ display: 'inline' }}>{ch}</span>
      ))}
    </>
  )
}

// ── Phrase ──────────────────────────────────────────────────────────────────

function Phrase({
  cfg, pos, visible, onActivate,
}: {
  cfg: PhraseConfig
  pos: Pos
  visible: boolean
  onActivate?: () => void
}) {
  const ref  = useRef<HTMLDivElement>(null)
  const done = useRef(false)

  useLayoutEffect(() => {
    if (ref.current) ref.current.style.opacity = '0'
  }, [])

  useEffect(() => {
    if (!visible || !ref.current || done.current) return
    done.current = true
    const el = ref.current

    if (cfg.type === 'glitch') {
      gsap.set(el, { opacity: 1 })
      return
    }

    if (cfg.blur) {
      gsap.fromTo(el,
        { opacity: 0, filter: 'blur(14px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 2.5, ease: 'power2.out' }
      )
    } else {
      gsap.fromTo(el,
        { opacity: 0 },
        { opacity: 1, duration: 1.8, ease: 'power2.out' }
      )
    }
  }, [visible, cfg])

  const inner =
    cfg.type === 'glitch' ? (
      <GlitchLines lines={cfg.lines!} active={visible} />
    ) : cfg.type === 'link' ? (
      <button
        onClick={onActivate}
        className="pointer-events-auto cursor-pointer underline underline-offset-[5px] decoration-[#9a9a9a]/50 font-poem italic"
      >
        <LetterSpans text={cfg.text!} />
      </button>
    ) : (
      <LetterSpans text={cfg.text!} />
    )

  return (
    <div
      ref={ref}
      className={`absolute font-poem italic text-[#9a9a9a] leading-snug pointer-events-none ${cfg.size}`}
      style={{ top: `${pos.top}%`, left: `${pos.left}%`, maxWidth: 'min(75vw, 50ch)' }}
    >
      {inner}
    </div>
  )
}

// ── Page client ─────────────────────────────────────────────────────────────

export default function BioClient({ allSlugs }: { allSlugs: string[] }) {
  const router = useRouter()
  const [positions, setPositions] = useState<Pos[] | null>(null)
  const [visible,   setVisible]   = useState<boolean[]>(PHRASES.map(() => false))
  const measureRefs = useRef<(HTMLDivElement | null)[]>(new Array(PHRASES.length).fill(null))

  const goToRandom = useCallback(() => {
    const read: string[] = JSON.parse(sessionStorage.getItem('read_poems') ?? '[]')
    const unread = allSlugs.filter(s => !read.includes(s))
    const pool = unread.length > 0 ? unread : allSlugs
    if (pool.length === 0) { router.push('/'); return }
    router.push(`/${encodeURIComponent(pool[Math.floor(Math.random() * pool.length)])}`)
  }, [allSlugs, router])

  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'

    document.fonts.ready.then(() => {
      const vw = window.innerWidth
      const vh = window.innerHeight

      const dims = measureRefs.current.map(el => {
        if (!el) return { w: 20, h: 5 }
        const r = el.getBoundingClientRect()
        return { w: (r.width / vw) * 100, h: (r.height / vh) * 100 }
      })

      const order  = shuffled(PHRASES.map((_, i) => i))
      const placed: Rect[] = []
      const posMap: Pos[]  = new Array(PHRASES.length)

      order.forEach(i => {
        const pos = findPos(dims[i].w, dims[i].h, placed)
        placed.push({ ...pos, w: dims[i].w, h: dims[i].h })
        posMap[i] = pos
      })

      setPositions(posMap)
    })

    return () => { html.style.overflow = prev }
  }, [])

  useEffect(() => {
    if (!positions) return
    const timers = PHRASES.map((_, i) =>
      setTimeout(() =>
        setVisible(prev => { const n = [...prev]; n[i] = true; return n }),
        i * 700 + 300
      )
    )
    return () => timers.forEach(clearTimeout)
  }, [positions])

  useEffect(() => {
    let raf = 0
    let lastT = 0

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastT < 50) return
      lastT = now
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('[data-bio-letter]').forEach(el => {
          const r = el.getBoundingClientRect()
          if (!r.width) return
          const dist = Math.hypot(
            e.clientX - (r.left + r.width  / 2),
            e.clientY - (r.top  + r.height / 2)
          )
          if (dist < 90 && Math.random() > 0.88) {
            if (Math.random() > 0.45) {
              gsap.to(el, {
                x: (Math.random() - 0.5) * 2.5,
                y: (Math.random() - 0.5) * 2,
                duration: 0.1,
                overwrite: true,
                ease: 'power1.out',
                onComplete: () => gsap.to(el, { x: 0, y: 0, duration: 0.35 }),
              })
            } else {
              gsap.to(el, {
                keyframes: [
                  { x: 1, duration: 0.045 },
                  { x: -1, duration: 0.045 },
                  { x: 0, duration: 0.06 },
                ],
                overwrite: true,
              })
            }
          }
        })
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!positions) {
    return (
      <div className="fixed inset-0 bg-brand-black overflow-hidden" aria-hidden="true">
        {PHRASES.map((cfg, i) => (
          <div
            key={i}
            ref={el => { measureRefs.current[i] = el }}
            className={`absolute font-poem italic leading-snug ${cfg.size}`}
            style={{ left: '-200vw', top: 0, maxWidth: 'min(75vw, 50ch)', opacity: 0 }}
          >
            {cfg.type === 'glitch'
              ? cfg.lines!.map((l, li) => <p key={li} className="mb-0.5 leading-snug">{l}</p>)
              : cfg.text
            }
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-brand-black overflow-hidden">
      {PHRASES.map((cfg, i) => (
        <Phrase
          key={i}
          cfg={cfg}
          pos={positions[i]}
          visible={visible[i]}
          onActivate={cfg.type === 'link' ? goToRandom : undefined}
        />
      ))}
    </div>
  )
}
