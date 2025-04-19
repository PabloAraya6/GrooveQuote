"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import GradientText from "@/components/ui/gradient-text"
import DecryptedText from "@/components/ui/decrypted-text"

export function LandingPage() {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  
  const isDarkTheme = theme === "dark" || resolvedTheme === "dark"
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold font-display tracking-tight">GrooveQuote</h1>
        <ModeToggle />
      </header>
      <main className="container flex-1">
        <section className="flex flex-col items-center justify-center space-y-12 py-12 md:py-24">
          <div className="space-y-6 w-full">
            <div className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-center flex flex-col">
              <DecryptedText
                text="Ilumina el momento"
                sequential={true}
                speed={80}
                maxIterations={12}
                animateOn="view"
                revealDirection="start"
                className="text-primary dark:text-primary"
                encryptedClassName="text-primary/40 dark:text-primary/30"
              />
            </div>
            <div className="text-center">
              Soluciones profesionales de sonido e iluminación para eventos inolvidables.
            </div>
          </div>
          <div className="w-full flex justify-center mt-8">
              {isDarkTheme ? (
                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                  animationSpeed={3}
                  showBorder={true}
                  className="py-3 px-8 text-lg font-extrabold font-heading tracking-wide transform transition-transform hover:scale-105 hover:shadow-lg shadow-md"
                >
                  <Link href="/quote" onClick={() => router.push("/quote")}>
                    Crea tu experiencia  
                  </Link>
                </GradientText>
              ) : (
                <Button size='lg' variant='default' onClick={() => router.push("/quote")}>
                  Crea tu experiencia 
                </Button>
              )}
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground font-display">
            &copy; {new Date().getFullYear()} GrooveQuote. Elevando cada momento con sonido y luz.
          </p>
        </div>
      </footer>
    </div>
  )
}
