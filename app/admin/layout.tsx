import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - CAMICO',
  description: 'Admin panel để quản lý nội dung website CAMICO',
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
