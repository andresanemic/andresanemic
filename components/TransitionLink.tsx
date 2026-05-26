'use client'

import { useRouter } from 'next/navigation'

const EXIT_MS = 650

interface Props {
  href: string
  className?: string
  children: React.ReactNode
}

export default function TransitionLink({ href, className, children }: Props) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.dispatchEvent(new Event('page-exit'))
    setTimeout(() => router.push(href), EXIT_MS)
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
