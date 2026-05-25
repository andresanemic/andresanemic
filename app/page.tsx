import Hero              from '@/components/Hero'
import PoemGrid          from '@/components/PoemGrid'
import PageTransition    from '@/components/PageTransition'
import SectionDivider    from '@/components/SectionDivider'
import PoemsReadCounter  from '@/components/PoemsReadCounter'
import { getAllPoems }   from '@/lib/poems'

export default function Home() {
  const poems = getAllPoems()

  return (
    <PageTransition>
      <main className="bg-brand-black min-h-screen">
        <PoemsReadCounter allSlugs={poems.map(p => p.slug)} />
        <Hero />
        <section id="poemas" className="pt-10 pb-24 px-6 md:px-12 max-w-5xl mx-auto" aria-label="Poemas">
          <PoemGrid poems={poems} />
        </section>
        <div className="px-6 md:px-12 max-w-5xl mx-auto">
          <SectionDivider />
        </div>
        <footer className="pb-12 text-center px-6 md:px-12 max-w-5xl mx-auto">
          <p className="font-ui text-[10px] text-brand-gray/30">
            Hecho con Claude Code. 2026
          </p>
        </footer>
      </main>
    </PageTransition>
  )
}
