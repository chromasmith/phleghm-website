import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PHLEGHM™ | Seattle Underground',
  description: 'Official website for PHLEGHM - Seattle Underground Hip-Hop Artist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}