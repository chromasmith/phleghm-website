import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PHLEGM | Seattle Underground',
  description: 'Official website for PHLEGM - Seattle Underground Hip-Hop Artist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="phlegm.music"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}