import Link from 'next/link'
import { getAllPoems } from '@/lib/poems'
import RandomPoemArrow   from '@/components/RandomPoemArrow'
import PageTransition    from '@/components/PageTransition'
import PoemTracker       from '@/components/PoemTracker'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function SlugLayout({ children, params }: Props) {
  const { slug } = await params
  const allPoems    = getAllPoems()
  const allSlugs    = allPoems.map(p => p.slug)
  const currentSlug = decodeURIComponent(slug)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-5 bg-brand-black/80 backdrop-blur-sm">
        <Link
          href="/"
          className="font-ui text-xs tracking-[0.3em] uppercase text-brand-gray hover:text-brand-white transition-colors duration-200"
        >
          andresanemic
        </Link>
        <Link
          href="/bio"
          className="font-ui text-xs tracking-widest uppercase text-brand-gray hover:text-brand-white transition-colors duration-200"
        >
          bio
        </Link>
      </nav>

      <PoemTracker slug={currentSlug} />
      <RandomPoemArrow allSlugs={allSlugs} currentSlug={currentSlug} />

      <PageTransition key={currentSlug}>
        {children}
      </PageTransition>
    </>
  )
}
