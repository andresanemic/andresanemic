'use client'

import { useEffect } from 'react'

export default function PoemTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const read: string[] = JSON.parse(sessionStorage.getItem('read_poems') ?? '[]')
    if (!read.includes(slug)) {
      read.push(slug)
      sessionStorage.setItem('read_poems', JSON.stringify(read))
      window.dispatchEvent(new CustomEvent('poems-read-updated'))
    }
  }, [slug])

  return null
}
