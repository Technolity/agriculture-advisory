import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import OfflineBanner from '@/components/OfflineBanner'

export const metadata: Metadata = {
  title: 'KisanAI — Agricultural Advisory',
  description: 'AI-powered crop disease detection and agricultural advisory for farmers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Providers>
          <Navbar />
          <OfflineBanner />
          {/* Desktop: offset left by sidebar width */}
          <main className="md:ml-[240px] pb-[60px] md:pb-0 min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
