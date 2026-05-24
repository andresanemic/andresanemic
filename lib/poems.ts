import fs from 'fs'
import path from 'path'

export interface Poem {
  slug: string
  filename: string
  title: string
  preview: string[]    // primeras 2 líneas no vacías
  stanzas: string[][]  // líneas agrupadas por estrofa
}

const POEMS_DIR = path.join(process.cwd(), 'Poemas')

/** "pájaros.txt" → "pájaros" | "lejos de la lengua.txt" → "lejos-de-la-lengua" */
export function filenameToSlug(filename: string): string {
  return filename.replace(/\.txt$/, '').replace(/\s+/g, '-')
}

function parsePoem(filename: string): Poem {
  const raw = fs.readFileSync(path.join(POEMS_DIR, filename), 'utf-8')
  const allLines = raw.split(/\r?\n/)

  const title = allLines[0].trim()

  // Agrupar el cuerpo del poema en estrofas (bloques separados por líneas vacías)
  const stanzas: string[][] = []
  let current: string[] = []

  for (const line of allLines.slice(1)) {
    if (line.trim() === '') {
      if (current.length > 0) {
        stanzas.push(current)
        current = []
      }
    } else {
      current.push(line)
    }
  }
  if (current.length > 0) stanzas.push(current)

  const preview = stanzas.flatMap(s => s).slice(0, 2)

  return {
    slug: filenameToSlug(filename),
    filename,
    title,
    preview,
    stanzas,
  }
}

export function getAllPoems(): Poem[] {
  const files = fs.readdirSync(POEMS_DIR).filter(f => f.endsWith('.txt'))
  return files.map(parsePoem)
}

export function getPoemBySlug(slug: string): Poem | null {
  const poems = getAllPoems()
  return poems.find(p => p.slug === slug) ?? null
}
