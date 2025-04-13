import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">GrooveQuote</h1>
        <ModeToggle />
      </header>
      <main className="container flex-1">
        <section className="flex flex-col items-center justify-center space-y-8 py-12 text-center md:py-24">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Presupuestos de Sonido e Iluminación
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Obtén un presupuesto personalizado para tu evento en minutos. Sonido, iluminación y más.
            </p>
          </div>
          <Link href="/quote">
            <Button size="lg" className="h-12 px-8">
              Cotiza ahora
            </Button>
          </Link>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GrooveQuote. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
