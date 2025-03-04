export interface MacroNutrient {
  grams: number
  calories: number
  percentage: number
}

export interface CarbMacro extends MacroNutrient {
  fiber: number
  sugar: number
}

export interface FatMacro extends MacroNutrient {
  saturated: number
  unsaturated: number
  trans: number
}

export interface Nutrient {
  name: string
  amount: number
  unit: string
  daily_value: number
}

export interface NutritionData {
  food_name: string
  serving_size: string
  calories: number
  macros: {
    protein: MacroNutrient
    carbs: CarbMacro
    fat: FatMacro
  }
  nutrients: Nutrient[]
  dietary_info: string[]
}

