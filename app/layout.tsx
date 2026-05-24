import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import GrainOverlay    from '@/components/GrainOverlay'
import Cursor          from '@/components/Cursor'
import SmoothScroll    from '@/components/SmoothScroll'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-poem',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'andresanemic',
  description: 'Andrés Peña, periodista chileno. Escribo cuando estoy triste.',
  metadataBase: new URL('https://andresanemic.vercel.app'),
  openGraph: {
    title: 'andresanemic',
    description: 'Andrés Peña, periodista chileno. Escribo cuando estoy triste.',
    url: 'https://andresanemic.vercel.app',
    siteName: 'andresanemic',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-brand-black text-brand-white antialiased">
        <SmoothScroll />
        <GrainOverlay />
        <Cursor />
        {children}
      </body>
    </html>
  )
}
