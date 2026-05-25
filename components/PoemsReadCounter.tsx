'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  allSlugs: string[]
  inline?: boolean
}

export default function PoemsReadCounter({ allSlugs, inline }: Props) {
  const [count, setCount] = useState(0)
  const router = useRouter()

  const sync = () => {
    const read: string[] = JSON.parse(sessionStorage.getItem('read_poems') ?? '[]')
    setCount(read.length)
  }

  useEffect(() => {
    sync()
    window.addEventListener('poems-read-updated', sync)
    return () => window.removeEventListener('poems-read-updated', sync)
  }, [])

  const goToUnread = () => {
    const read: string[] = JSON.parse(sessionStorage.getItem('read_poems') ?? '[]')
    const unread = allSlugs.filter(s => !read.includes(s))
    if (unread.length === 0) return
    const pick = unread[Math.floor(Math.random() * unread.length)]
    router.push(`/${encodeURIComponent(pick)}`)
  }

  return (
    <div className={inline ? 'flex items-center gap-6' : 'fixed top-6 right-8 z-10 flex items-center gap-6'}>
      {count > 0 && (
        <button
          onClick={goToUnread}
          className="font-ui text-xs tracking-widest uppercase text-brand-gray hover:text-brand-white transition-colors duration-200"
        >
          {count} {count === 1 ? 'leído' : 'leídos'}
        </button>
      )}
      <Link
        href="/bio"
        className="font-ui text-xs tracking-widest uppercase text-brand-gray hover:text-brand-white transition-colors duration-200"
      >
        bio
      </Link>
    </div>
  )
}
