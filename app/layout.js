export const metadata = {
  title: 'Circlo',
  description: 'Connessioni oltre l’apparenza',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f0f4f8' }}>
        {children}
      </body>
    </html>
  )
}
