import type React from "react"
import type { Metadata } from "next"
import { Manrope, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Manrope: Fuente sans-serif moderna con gran legibilidad y estilo contemporáneo.
// Es versátil, elegante y funciona excelentemente para todo tipo de contenido.
// Equilibra profesionalismo con personalidad, ideal para descripciones de servicios.
const manrope = Manrope({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  fallback: ['system-ui', 'sans-serif'],
})

// Space Grotesk: Fuente geométrica con personalidad única y excelente legibilidad.
// Combina elementos contemporáneos con un toque distintivo que la hace memorable.
// Su estilo es moderno pero no demasiado futurista, aportando carácter sin ser extravagante.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  fallback: ['Arial', 'sans-serif'],
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
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'