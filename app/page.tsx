import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera, Utensils, Sparkles, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import FoodAnalyzer from "@/components/food-analyzer"
import FeatureCard from "@/components/feature-card"
import ExampleCard from "@/components/example-card"
import ApiSettings from "@/components/api-settings"
import { SiteHeader } from "@/components/site-header"

// Sample food images
const HERO_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
const SALMON_IMAGE = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80"
const SALAD_IMAGE = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80"
const CAKE_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80"

export const metadata: Metadata = {
  title: "Food Analyzer - AI-Powered Nutrition Analysis",
  description: "Upload food images and get detailed nutritional information powered by AI",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  AI-Powered Food Analysis
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Upload an image of your food and get detailed nutritional information instantly. Powered by advanced
                  AI and the FatSecret API.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="gap-1">
                  <Link href="#analyzer">
                    Try It Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#api-settings">
                    API Settings <Settings className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-xl">
                <Image
                  src={HERO_IMAGE || "/placeholder.svg"}
                  alt="Food analysis illustration"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </section>

      {/* Analyzer Section - MOVED TO FIRST */}
      <section className="container px-4 py-12 md:px-6 md:py-24" id="analyzer">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Analyze Your Food</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Upload an image of your food to get detailed nutritional information
          </p>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <FoodAnalyzer />
        </div>
      </section>

      {/* API Settings Section - MOVED TO SECOND */}
      <section className="bg-muted py-12 md:py-24" id="api-settings">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">API Settings</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Configure your own API keys for enhanced functionality
            </p>
          </div>
          <div className="mx-auto max-w-3xl py-12">
            <ApiSettings />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-12 md:px-6 md:py-24" id="features">
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Powerful Features for Nutrition Analysis
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform combines cutting-edge AI with comprehensive nutritional data to provide you with accurate and
              detailed information about your food.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <FeatureCard
              icon={<Camera className="h-10 w-10 text-primary" />}
              title="Image Recognition"
              description="Advanced AI identifies food from your photos with high accuracy"
            />
            <FeatureCard
              icon={<Utensils className="h-10 w-10 text-primary" />}
              title="Nutritional Analysis"
              description="Get detailed breakdown of calories, macros, vitamins and minerals"
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Dietary Insights"
              description="Understand the nutritional profile of your meals at a glance"
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-primary" />}
              title="Custom API Integration"
              description="Use your own API keys for personalized analysis"
            />
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">See It in Action</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our AI can analyze a wide variety of foods and provide accurate nutritional information
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <ExampleCard
              imageSrc={SALMON_IMAGE}
              foodName="Grilled Salmon"
              calories="367"
              protein="40g"
              carbs="0g"
              fat="22g"
            />
            <ExampleCard
              imageSrc={SALAD_IMAGE}
              foodName="Vegetable Salad"
              calories="481"
              protein="9g"
              carbs="25g"
              fat="39g"
            />
            <ExampleCard
              imageSrc={CAKE_IMAGE}
              foodName="Chocolate Cake"
              calories="352"
              protein="5g"
              carbs="50g"
              fat="16g"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 Food Analyzer. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

