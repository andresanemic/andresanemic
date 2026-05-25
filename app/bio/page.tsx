import { getAllPoems } from '@/lib/poems'
import BioClient from './BioClient'

export default function BioPage() {
  const allSlugs = getAllPoems().map(p => p.slug)
  return <BioClient allSlugs={allSlugs} />
}
