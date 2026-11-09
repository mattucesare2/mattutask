import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MattuTask - Gestione Attività',
  description: 'Gestisci le tue attività come in Outlook, con calendario e sincronizzazione multi-device',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
