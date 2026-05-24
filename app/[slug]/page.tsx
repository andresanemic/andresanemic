import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPoems, getPoemBySlug } from '@/lib/poems'
import PoemBody from '@/components/PoemBody'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPoems().map(poem => ({ slug: poem.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const poem = getPoemBySlug(decodeURIComponent(slug))
  if (!poem) return { title: 'andresanemic' }
  return {
    title: `${poem.title} — andresanemic`,
    description: poem.preview.join(' '),
  }
}

export default async function PoemPage({ params }: Props) {
  const { slug } = await params
  const poem = getPoemBySlug(decodeURIComponent(slug))
  if (!poem) notFound()

  return (
    <main className="min-h-screen bg-brand-black text-brand-white">
      <article className="max-w-2xl mx-auto px-8 pt-36 pb-32">
        <h1 className="font-poem text-3xl md:text-4xl text-brand-white mb-16 font-normal italic">
          {poem.title}
        </h1>
        <PoemBody stanzas={poem.stanzas} />
      </article>
    </main>
  )
}
