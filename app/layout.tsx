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
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-GL0V5O7E6RPgtfCnIQVKe.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}