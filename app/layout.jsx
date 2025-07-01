export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Bevelient Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
