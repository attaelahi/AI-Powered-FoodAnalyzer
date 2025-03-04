import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ExampleCardProps {
  imageSrc: string
  foodName: string
  calories: string
  protein: string
  carbs: string
  fat: string
}

export default function ExampleCard({ imageSrc, foodName, calories, protein, carbs, fat }: ExampleCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square w-full">
        <Image src={imageSrc || "/placeholder.svg"} alt={foodName} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">{foodName}</h3>
        <div className="mt-2 grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <p className="font-bold">{calories}</p>
            <p className="text-xs text-muted-foreground">Calories</p>
          </div>
          <div>
            <p className="font-bold">{protein}</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div>
            <p className="font-bold">{carbs}</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
          <div>
            <p className="font-bold">{fat}</p>
            <p className="text-xs text-muted-foreground">Fat</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

