import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PencilIcon } from "lucide-react"
import Image from "next/image"
import Vegicon from "@/public/Asset/Vegicon.png";
import Nonvegicon from "@/public/Asset/Nonvegicon.png";
import Addicon from "@/public/Asset/Addicon.png";
import MasalaTea from "@/public/Asset/MasalaTea.png";
import Fries from "@/public/Asset/Fries.png"; 



const foodItems = [
  {
    id: '1',
    name: 'Veg Biryani',
    description: 'Saffron-infused basmati rice, fresh veggies, warming spices. Authentic Indian flavors in every bite!',
    price: 259,
    image: Fries,
    isVeg: true,
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    description: 'Tender chicken, fragrant basmati rice & hint of spices. A classic Indian favorite, cooked to perfection!',
    price: 349,
    image: MasalaTea,
    isVeg: false,
  },
]

export default function FoodItemList() {
  return (
    <div className="space-y-4 p-2 w-full mx-auto pb-20">
      {foodItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-start p-4">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-1">
                <Image src={item.veg?Vegicon:Nonvegicon} alt="veicon" className='h-6 w-6'/>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="font-bold">₹{item.price}</p>
                <Button variant="link" className="text-red-500 p-0 h-auto font-normal" asChild>
      
                </Button>
              </div>
              <div className="flex flex-col justify-center items-center space-y-2">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="rounded-md object-cover h-24 w-28"
                />
                <Button className="bg-green-500 hover:bg-green-600 w-full rounded-full text-white">
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}