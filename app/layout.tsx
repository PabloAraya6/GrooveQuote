import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// DM Sans: Fuente sans-serif geométrica minimalista con buena legibilidad.
// Ideal para interfaces de usuario y texto de cuerpo.
const dmSans = DM_Sans({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  title: "Presupuestos de Sonido e Iluminación",
  description: "Genera presupuestos de sonido e iluminación para tu evento",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'