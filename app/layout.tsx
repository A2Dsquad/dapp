import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Header } from '@/components/header'
import { WalletProvider } from '@/components/wallet-provider'
import { Kanit } from 'next/font/google'
import { BackgroundBeams } from '@/components/aceternity/background-beams'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'

export const metadata: Metadata = {
  title: 'Sentra Layer',
  description: 'Sentra Layer',
}

const kanit = Kanit({
  subsets: ['latin'],
  variable: '--font-kanit',
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased bg-background dark`}>
        <QueryProvider>
          <WalletProvider>
            <div className="relative min-h-screen">
              <BackgroundBeams />
              <Header />
              <div className="isolate">{children}</div>
            </div>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
