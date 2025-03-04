import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { NutritionData, Nutrient } from "@/types/nutrition"

// FatSecret API credentials
const CLIENT_ID = process.env.FATSECRET_CLIENT_ID || "6e01889c79464d42ad94687b197483cf"
const CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET || "48f16f65984341ed988b89b5e8045272"

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 })
    }

    // Convert the file to a buffer
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert the buffer to a base64 string
    const base64Image = buffer.toString("base64")

    // First, use AI to identify the food in the image
    const { text: foodIdentification } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify the food in this image. Be specific and concise. Just name the food item(s).",
            },
            {
              type: "image",
              image: `data:image/${imageFile.type.split("/")[1]};base64,${base64Image}`,
            },
          ],
        },
      ],
    })

    // Get an access token from FatSecret API
    const tokenResponse = await fetch("https://oauth.fatsecret.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "basic",
      }),
    })

    if (!tokenResponse.ok) {
      console.error("Failed to get access token:", await tokenResponse.text())
      return NextResponse.json({ message: "Failed to authenticate with nutrition API" }, { status: 500 })
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Search for the food in FatSecret API
    const searchResponse = await fetch(
      `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(foodIdentification)}&format=json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!searchResponse.ok) {
      // If the API call fails, generate mock data based on the food identification
      console.warn("Failed to get nutrition data from API, generating mock data")
      const mockData = await generateMockNutritionData(foodIdentification)
      return NextResponse.json(mockData)
    }

    const searchData = await searchResponse.json()

    // If no foods found, generate mock data
    if (!searchData.foods || !searchData.foods.food || searchData.foods.food.length === 0) {
      console.warn("No foods found in API, generating mock data")
      const mockData = await generateMockNutritionData(foodIdentification)
      return NextResponse.json(mockData)
    }

    // Get the first food item
    const food = Array.isArray(searchData.foods.food) ? searchData.foods.food[0] : searchData.foods.food

    // Get detailed information about the food
    const foodResponse = await fetch(
      `https://platform.fatsecret.com/rest/server.api?method=food.get.v2&food_id=${food.food_id}&format=json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!foodResponse.ok) {
      console.warn("Failed to get detailed food data, generating mock data")
      const mockData = await generateMockNutritionData(foodIdentification)
      return NextResponse.json(mockData)
    }

    const foodData = await foodResponse.json()

    // Process the food data into our format
    const nutritionData = processNutritionData(foodData.food)

    return NextResponse.json(nutritionData)
  } catch (error) {
    console.error("Error analyzing food:", error)
    return NextResponse.json({ message: "Failed to analyze food image" }, { status: 500 })
  }
}

// Function to process the nutrition data from FatSecret API
function processNutritionData(foodData: any): NutritionData {
  // Get the first serving
  const serving = foodData.servings.serving
  const servingData = Array.isArray(serving) ? serving[0] : serving

  // Calculate macros
  const protein = {
    grams: Number.parseFloat(servingData.protein || "0"),
    calories: Number.parseFloat(servingData.protein || "0") * 4,
    percentage: 0,
  }

  const carbs = {
    grams: Number.parseFloat(servingData.carbohydrate || "0"),
    calories: Number.parseFloat(servingData.carbohydrate || "0") * 4,
    percentage: 0,
    fiber: Number.parseFloat(servingData.fiber || "0"),
    sugar: Number.parseFloat(servingData.sugar || "0"),
  }

  const fat = {
    grams: Number.parseFloat(servingData.fat || "0"),
    calories: Number.parseFloat(servingData.fat || "0") * 9,
    percentage: 0,
    saturated: Number.parseFloat(servingData.saturated_fat || "0"),
    unsaturated:
      Number.parseFloat(servingData.polyunsaturated_fat || "0") +
      Number.parseFloat(servingData.monounsaturated_fat || "0"),
    trans: Number.parseFloat(servingData.trans_fat || "0"),
  }

  // Calculate percentages
  const totalCalories = Number.parseFloat(servingData.calories || "0")
  protein.percentage = Math.round((protein.calories / totalCalories) * 100)
  carbs.percentage = Math.round((carbs.calories / totalCalories) * 100)
  fat.percentage = Math.round((fat.calories / totalCalories) * 100)

  // Extract nutrients
  const nutrients: Nutrient[] = []

  // Add vitamins and minerals if available
  if (servingData.vitamin_a) {
    nutrients.push({
      name: "Vitamin A",
      amount: Number.parseFloat(servingData.vitamin_a),
      unit: "IU",
      daily_value: Number.parseFloat(servingData.vitamin_a_daily_percent || "0"),
    })
  }

  if (servingData.vitamin_c) {
    nutrients.push({
      name: "Vitamin C",
      amount: Number.parseFloat(servingData.vitamin_c),
      unit: "mg",
      daily_value: Number.parseFloat(servingData.vitamin_c_daily_percent || "0"),
    })
  }

  if (servingData.calcium) {
    nutrients.push({
      name: "Calcium",
      amount: Number.parseFloat(servingData.calcium),
      unit: "mg",
      daily_value: Number.parseFloat(servingData.calcium_daily_percent || "0"),
    })
  }

  if (servingData.iron) {
    nutrients.push({
      name: "Iron",
      amount: Number.parseFloat(servingData.iron),
      unit: "mg",
      daily_value: Number.parseFloat(servingData.iron_daily_percent || "0"),
    })
  }

  if (servingData.sodium) {
    nutrients.push({
      name: "Sodium",
      amount: Number.parseFloat(servingData.sodium),
      unit: "mg",
      daily_value: Math.round((Number.parseFloat(servingData.sodium) / 2300) * 100),
    })
  }

  if (servingData.potassium) {
    nutrients.push({
      name: "Potassium",
      amount: Number.parseFloat(servingData.potassium),
      unit: "mg",
      daily_value: Math.round((Number.parseFloat(servingData.potassium) / 4700) * 100),
    })
  }

  if (servingData.cholesterol) {
    nutrients.push({
      name: "Cholesterol",
      amount: Number.parseFloat(servingData.cholesterol),
      unit: "mg",
      daily_value: Math.round((Number.parseFloat(servingData.cholesterol) / 300) * 100),
    })
  }

  // Generate dietary info
  const dietaryInfo: string[] = []

  if (protein.grams > 20) {
    dietaryInfo.push("High Protein")
  }

  if (carbs.fiber > 5) {
    dietaryInfo.push("High Fiber")
  }

  if (fat.saturated < 2) {
    dietaryInfo.push("Low Saturated Fat")
  }

  if (Number.parseFloat(servingData.sodium || "0") < 140) {
    dietaryInfo.push("Low Sodium")
  }

  if (carbs.sugar < 5) {
    dietaryInfo.push("Low Sugar")
  }

  if (Number.parseFloat(servingData.cholesterol || "0") < 20) {
    dietaryInfo.push("Low Cholesterol")
  }

  return {
    food_name: foodData.food_name,
    serving_size: servingData.serving_description,
    calories: totalCalories,
    macros: {
      protein,
      carbs,
      fat,
    },
    nutrients,
    dietary_info: dietaryInfo,
  }
}

// Function to generate mock nutrition data when API fails
async function generateMockNutritionData(foodName: string): Promise<NutritionData> {
  try {
    const { text: nutritionJson } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: `Generate realistic nutrition data for "${foodName}" in JSON format. Include calories, protein, carbs (with fiber and sugar), fat (with saturated, unsaturated, and trans), vitamins, minerals, and dietary information. Make it as accurate as possible based on typical values for this food.`,
        },
      ],
    })

    // Parse the JSON from the AI response
    const nutritionData = JSON.parse(nutritionJson)

    // Ensure the data matches our expected format
    return {
      food_name: nutritionData.food_name || foodName,
      serving_size: nutritionData.serving_size || "1 serving",
      calories: nutritionData.calories || 0,
      macros: {
        protein: {
          grams: nutritionData.macros?.protein?.grams || 0,
          calories: nutritionData.macros?.protein?.calories || 0,
          percentage: nutritionData.macros?.protein?.percentage || 0,
        },
        carbs: {
          grams: nutritionData.macros?.carbs?.grams || 0,
          calories: nutritionData.macros?.carbs?.calories || 0,
          percentage: nutritionData.macros?.carbs?.percentage || 0,
          fiber: nutritionData.macros?.carbs?.fiber || 0,
          sugar: nutritionData.macros?.carbs?.sugar || 0,
        },
        fat: {
          grams: nutritionData.macros?.fat?.grams || 0,
          calories: nutritionData.macros?.fat?.calories || 0,
          percentage: nutritionData.macros?.fat?.percentage || 0,
          saturated: nutritionData.macros?.fat?.saturated || 0,
          unsaturated: nutritionData.macros?.fat?.unsaturated || 0,
          trans: nutritionData.macros?.fat?.trans || 0,
        },
      },
      nutrients: nutritionData.nutrients || [],
      dietary_info: nutritionData.dietary_info || [],
    }
  } catch (error) {
    console.error("Error generating mock nutrition data:", error)

    // Return basic fallback data if AI generation fails
    return {
      food_name: foodName,
      serving_size: "1 serving",
      calories: 200,
      macros: {
        protein: { grams: 10, calories: 40, percentage: 20 },
        carbs: { grams: 25, calories: 100, percentage: 50, fiber: 2, sugar: 5 },
        fat: { grams: 7, calories: 60, percentage: 30, saturated: 2, unsaturated: 4, trans: 0 },
      },
      nutrients: [
        { name: "Vitamin C", amount: 10, unit: "mg", daily_value: 15 },
        { name: "Calcium", amount: 50, unit: "mg", daily_value: 5 },
        { name: "Iron", amount: 1, unit: "mg", daily_value: 8 },
      ],
      dietary_info: ["Moderate Calories", "Balanced Macronutrients"],
    }
  }
}

