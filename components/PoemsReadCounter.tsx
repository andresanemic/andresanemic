'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  allSlugs: string[]
}

export default function PoemsReadCounter({ allSlugs }: Props) {
  const [count, setCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const read: string[] = JSON.parse(sessionStorage.getItem('read_poems') ?? '[]')
    setCount(read.length)
  }, [])

  if (count === 0) return null

  const goToUnread = () => {
    const read: string[] = JSON.parse(sessionStorage.getItem('read_poems') ?? '[]')
    const unread = allSlugs.filter(s => !read.includes(s))
    if (unread.length === 0) return
    const pick = unread[Math.floor(Math.random() * unread.length)]
    router.push(`/${encodeURIComponent(pick)}`)
  }

  return (
    <button
      onClick={goToUnread}
      className="fixed top-6 right-8 z-10 font-ui text-[10px] tracking-widest uppercase text-brand-gray/60 hover:text-brand-gray transition-colors duration-200"
    >
      {count} {count === 1 ? 'leído' : 'leídos'}
    </button>
  )
}
