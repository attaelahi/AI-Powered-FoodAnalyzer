"use client"

import { TabsContent } from "@/components/ui/tabs"
import type { NutritionData } from "@/types/nutrition"
import { Card, CardContent } from "@/components/ui/card"

interface NutritionDisplayProps {
  nutritionData: NutritionData
}

export default function NutritionDisplay({ nutritionData }: NutritionDisplayProps) {
  const { food_name, calories, serving_size, macros, nutrients } = nutritionData

  // Calculate percentages for macros
  const totalMacroGrams = macros.protein.grams + macros.carbs.grams + macros.fat.grams
  const proteinPercentage = (macros.protein.grams / totalMacroGrams) * 100
  const carbsPercentage = (macros.carbs.grams / totalMacroGrams) * 100
  const fatPercentage = (macros.fat.grams / totalMacroGrams) * 100

  return (
    <>
      <TabsContent value="summary" className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">{food_name}</h2>
          <p className="text-muted-foreground">{serving_size}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-primary">{calories}</div>
              <div className="text-sm text-muted-foreground mt-1">Calories</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-blue-500">{macros.protein.grams}g</div>
              <div className="text-sm text-muted-foreground mt-1">Protein</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-amber-500">{macros.carbs.grams}g</div>
              <div className="text-sm text-muted-foreground mt-1">Carbs</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Macronutrient Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-rose-500">Fat</span>
                  <span>
                    {macros.fat.grams}g ({macros.fat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${fatPercentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-amber-500">Carbs</span>
                  <span>
                    {macros.carbs.grams}g ({macros.carbs.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${carbsPercentage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-blue-500">Protein</span>
                  <span>
                    {macros.protein.grams}g ({macros.protein.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${proteinPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="macros" className="space-y-6">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500/10 p-3">
                <div className="h-6 w-6 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <h3 className="font-medium text-xl">Protein: {macros.protein.grams}g</h3>
                <p className="text-muted-foreground">
                  {macros.protein.calories} calories ({macros.protein.percentage}% of total)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-amber-500/10 p-3">
                <div className="h-6 w-6 rounded-full bg-amber-500"></div>
              </div>
              <div>
                <h3 className="font-medium text-xl">Carbohydrates: {macros.carbs.grams}g</h3>
                <p className="text-muted-foreground">
                  {macros.carbs.calories} calories ({macros.carbs.percentage}% of total)
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-background p-3">
                <div className="text-sm font-medium">Fiber</div>
                <div className="text-2xl font-bold">{macros.carbs.fiber}g</div>
              </div>
              <div className="rounded-lg bg-background p-3">
                <div className="text-sm font-medium">Sugar</div>
                <div className="text-2xl font-bold">{macros.carbs.sugar}g</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rose-500/5 border-rose-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-rose-500/10 p-3">
                <div className="h-6 w-6 rounded-full bg-rose-500"></div>
              </div>
              <div>
                <h3 className="font-medium text-xl">Fat: {macros.fat.grams}g</h3>
                <p className="text-muted-foreground">
                  {macros.fat.calories} calories ({macros.fat.percentage}% of total)
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-background p-3">
                <div className="text-sm font-medium">Saturated</div>
                <div className="text-2xl font-bold">{macros.fat.saturated}g</div>
              </div>
              <div className="rounded-lg bg-background p-3">
                <div className="text-sm font-medium">Unsaturated</div>
                <div className="text-2xl font-bold">{macros.fat.unsaturated}g</div>
              </div>
              <div className="rounded-lg bg-background p-3">
                <div className="text-sm font-medium">Trans</div>
                <div className="text-2xl font-bold">{macros.fat.trans}g</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-xl mb-4">Vitamins & Minerals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nutrients.map((nutrient, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-background">
                  <span className="font-medium">{nutrient.name}</span>
                  <div className="flex items-center gap-2">
                    <span>
                      {nutrient.amount} {nutrient.unit}
                    </span>
                    <div className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                      {nutrient.daily_value}% DV
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-xl mb-4">Dietary Information</h3>
            <div className="flex flex-wrap gap-2">
              {nutritionData.dietary_info.map((info, index) => (
                <div key={index} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {info}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  )
}

