import type { Metadata } from 'next'
import { Montserrat, Geist_Mono, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const _montserrat = Montserrat({ 
  subsets: ["latin", "vietnamese"],
  weight: ['400', '500', '600', '700', '800', '900']
});
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _dancingScript = Dancing_Script({ 
  subsets: ["latin", "vietnamese"],
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'CAMICO - Thức ăn xanh chăn nuôi bền vững',
  description: 'CAMICO là thương hiệu dẫn đầu trong lĩnh vực thức ăn chăn nuôi sinh học tại Việt Nam',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`font-sans antialiased ${_montserrat.className}`} suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
