import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">FoodAnalyzer</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/#analyzer" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Analyzer
            </Link>
            <Link href="/#api-settings" className="transition-colors hover:text-foreground/80 text-foreground/60">
              API Settings
            </Link>
            <Link href="/#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Button size="sm">Sign In</Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

