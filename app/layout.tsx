import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Sahi AI — India\'s Personalized AI Tool Finder',
  description: 'Find the best AI tools for your budget, device, and goals. Trusted by students, freelancers, and business owners across India.',
  keywords: ['AI tools India', 'best AI apps India', 'free AI tools Hindi', 'AI for students India', 'Sahi AI'],
  authors: [{ name: 'Sahi AI' }],
  creator: 'Sahi AI',
  publisher: 'Sahi AI',
  metadataBase: new URL('https://sahiai.in'),
  openGraph: {
    title: 'Sahi AI — India\'s Personalized AI Tool Finder',
    description: 'Find the best AI tools for your budget, device, and goals. Made for India 🇮🇳',
    url: 'https://sahiai.in',
    siteName: 'Sahi AI',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sahi AI — India\'s Personalized AI Tool Finder',
    description: 'Find the best AI tools for your budget, device, and goals. Made for India 🇮🇳',
    creator: '@sahiai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0618',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to Supabase */}
        <link rel="preconnect" href="https://hjclpblshwtaabnixuct.supabase.co" />
        {/* Preconnect to Anthropic */}
        <link rel="preconnect" href="https://api.anthropic.com" />
      </head>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          background: '#0a0618',
          minHeight: '100vh',
          fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          overflowX: 'hidden',
        }}
      >
        {/* Skip to content for accessibility */}
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          Skip to main content
        </a>

        {/* Main content */}
        <div id="main-content">
          {children}
        </div>

        {/* Global loading indicator */}
        <div id="global-loader" style={{ display: 'none' }} />
        
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  )
}