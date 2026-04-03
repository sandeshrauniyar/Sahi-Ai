import type { Metadata, Viewport } from 'next'
import './globals.css'
import SahiChatbot from '@/components/SahiChatbot'
import ConsentBanner from '@/components/ConsentBanner'

export const metadata: Metadata = {
  title: 'Sahi AI — India\'s Personalized AI Tool Finder',
  description: 'Find the best AI tools for your budget, device, and goals. Free. Hindi supported. Made for India 🇮🇳',
  keywords: ['AI tools India', 'best AI apps India', 'free AI tools Hindi', 'Sahi AI', 'AI tools for students India'],
  authors: [{ name: 'Sahi AI' }],
  openGraph: {
    title: 'Sahi AI — India\'s Personalized AI Tool Finder',
    description: 'Tell us your problem. We\'ll find the best AI tools for YOU. Free. Hindi supported. Made for India.',
    url: 'https://sahiai.in',
    siteName: 'Sahi AI',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sahi AI — India\'s Personalized AI Tool Finder',
    description: 'Free AI tool recommendations for Indians. Works in Hindi too 🇮🇳',
  },
  metadataBase: new URL('https://sahiai.in'),
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0618',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, background: '#0a0618', minHeight: '100vh' }}>
        {children}
        <ConsentBanner />
        <SahiChatbot />
      </body>
    </html>
  )
}