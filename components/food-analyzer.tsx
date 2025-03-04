"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Utensils, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import NutritionDisplay from "@/components/nutrition-display"
import type { NutritionData } from "@/types/nutrition"

// Sample food images
const SAMPLE_IMAGES = {
  salmon: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
}

export default function FoodAnalyzer() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setNutritionData(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    if (!file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setNutritionData(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const clearImage = () => {
    setImage(null)
    setFile(null)
    setNutritionData(null)
    setError(null)
  }

  const analyzeImage = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setProgress(0)
    setError(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 500)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/analyze-food", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to analyze image")
      }

      const data = await response.json()
      setNutritionData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Function to use a sample image
  const useSampleImage = (imageUrl: string) => {
    setImage(imageUrl)
    setNutritionData(null)
    setError(null)
    // We don't have a file object for external URLs, but that's ok for demo purposes
    setFile(null)
  }

  const sampleImageClickHandlers = {
    salmon: () => useSampleImage(SAMPLE_IMAGES.salmon),
    salad: () => useSampleImage(SAMPLE_IMAGES.salad),
    cake: () => useSampleImage(SAMPLE_IMAGES.cake),
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          {!image ? (
            <div
              className="rounded-lg p-12 text-center cursor-pointer hover:bg-primary/5 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-medium text-xl">Upload a food image</h3>
                <p className="text-muted-foreground max-w-md">
                  Drag and drop an image file here, or click to browse. We support JPG, PNG and other common formats.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6 w-full max-w-md">
                  <div
                    className="aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                    onClick={sampleImageClickHandlers.salmon}
                  >
                    <Image
                      src={SAMPLE_IMAGES.salmon || "/placeholder.svg"}
                      alt="Salmon dish"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Use this</span>
                    </div>
                  </div>
                  <div
                    className="aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                    onClick={sampleImageClickHandlers.salad}
                  >
                    <Image
                      src={SAMPLE_IMAGES.salad || "/placeholder.svg"}
                      alt="Vegetable salad"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Use this</span>
                    </div>
                  </div>
                  <div
                    className="aspect-square relative rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                    onClick={sampleImageClickHandlers.cake}
                  >
                    <Image
                      src={SAMPLE_IMAGES.cake || "/placeholder.svg"}
                      alt="Chocolate cake"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Use this</span>
                    </div>
                  </div>
                </div>
                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <div className="aspect-video relative rounded-lg overflow-hidden border border-border">
                  <Image src={image || "/placeholder.svg"} alt="Food image" fill className="object-cover" />
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isAnalyzing ? (
                <div className="space-y-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-center text-muted-foreground">
                    {progress < 30
                      ? "Analyzing your food image..."
                      : progress < 60
                        ? "Identifying ingredients..."
                        : progress < 90
                          ? "Calculating nutritional values..."
                          : "Almost done..."}
                  </p>
                </div>
              ) : (
                <div className="flex justify-center">
                  {!nutritionData && !error && (
                    <Button onClick={analyzeImage} className="gap-2 px-8 py-6 text-lg h-auto">
                      <Utensils className="h-5 w-5" />
                      Analyze Food
                    </Button>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
                  <p className="font-medium mb-2">Analysis Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {nutritionData && (
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="macros">Macronutrients</TabsTrigger>
                <TabsTrigger value="details">Detailed Info</TabsTrigger>
              </TabsList>
              <NutritionDisplay nutritionData={nutritionData} />
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

