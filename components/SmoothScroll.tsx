'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 })

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return null
}
