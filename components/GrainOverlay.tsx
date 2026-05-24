'use client'

import { useEffect, useRef } from 'react'

const W = 250
const H = 200

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = W
    canvas.height = H

    let raf: number
    let frame = 0

    const draw = () => {
      frame++
      if (frame % 3 === 0) {
        const imageData = ctx.createImageData(W, H)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const v = (Math.random() * 255) | 0
          data[i] = data[i + 1] = data[i + 2] = v
          data[i + 3] = 255
        }
        ctx.putImageData(imageData, 0, 0)
      }
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9000,
        opacity: 0.06,
        mixBlendMode: 'screen',
      }}
    />
  )
}
