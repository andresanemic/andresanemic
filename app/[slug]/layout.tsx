import Link from 'next/link'
import { getAllPoems } from '@/lib/poems'
import RandomPoemArrow   from '@/components/RandomPoemArrow'
import PageTransition    from '@/components/PageTransition'
import PoemTracker       from '@/components/PoemTracker'
import PoemsReadCounter  from '@/components/PoemsReadCounter'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function SlugLayout({ children, params }: Props) {
  const { slug } = await params
  const allSlugs    = getAllPoems().map(p => p.slug)
  const currentSlug = decodeURIComponent(slug)

  return (
    <>
      {/* Nav y flecha viven FUERA de PageTransition → persisten sin transición */}
      <nav className="fixed top-0 left-0 right-0 z-10 px-8 py-6 bg-brand-black/80 backdrop-blur-sm">
        <Link
          href="/"
          className="font-ui text-xs tracking-[0.3em] uppercase text-brand-gray hover:text-brand-white transition-colors duration-200"
        >
          andresanemic
        </Link>
      </nav>

      <PoemsReadCounter allSlugs={allSlugs} />
      <PoemTracker slug={currentSlug} />
      <RandomPoemArrow allSlugs={allSlugs} currentSlug={currentSlug} />

      {/* key={slug} → React desmonta/remonta PageTransition en cada poema,
          así siempre arranca en opacity:0 sin conflicto con GSAP */}
      <PageTransition key={currentSlug}>
        {children}
      </PageTransition>
    </>
  )
}
