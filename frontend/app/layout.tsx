import type { Metadata } from 'next'
import { Bubblegum_Sans, Fredoka, Nunito } from 'next/font/google'
import '@/styles/globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FlagsProvider } from '@/context/FlagsContext'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'

const bubblegumSans = Bubblegum_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const fredoka = Fredoka({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const nunito = Nunito({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Come Color With Me',
    template: '%s | Come Color With Me',
  },
  description:
    'Free coloring pages and premium art prints by Amalia, age 8. Download, color, and enjoy original hand-drawn artwork.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'Come Color With Me™',
    locale: 'en_US',
    title: 'Come Color With Me — Free Coloring Pages by Amalia',
    description:
      'Free coloring pages and premium art prints by Amalia, age 8. Download, color, and enjoy original hand-drawn artwork.',
    images: [
      {
        url: '/assets/brand/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Come Color With Me — Free coloring pages and premium art prints by Amalia, age 8',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Come Color With Me — Free Coloring Pages by Amalia',
    description:
      'Free coloring pages and premium art prints by Amalia, age 8.',
    images: ['/assets/brand/og-image.png'],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: { url: '/assets/brand/logo-icon.svg' },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bubblegumSans.variable} ${fredoka.variable} ${nunito.variable}`}
    >
      <body className="bg-[#FFF6F9] text-[#3D1F5C] antialiased">
        <AuthProvider>
          <FlagsProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main id="main-content" className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </CartProvider>
          </FlagsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
