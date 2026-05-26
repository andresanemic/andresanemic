import type { Metadata } from 'next'
import { Inter, Playfair_Display, Josefin_Sans, Libre_Baskerville } from 'next/font/google'
import './globals.css'
import GrainOverlay    from '@/components/GrainOverlay'
import Cursor          from '@/components/Cursor'
import SmoothScroll    from '@/components/SmoothScroll'
import { Analytics }   from '@vercel/analytics/next'

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

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
})

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: '100',
  variable: '--font-hero',
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
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${josefin.variable} ${libreBaskerville.variable}`}>
      <body className="bg-brand-black text-brand-white antialiased">
        <SmoothScroll />
        <GrainOverlay />
        <Cursor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
