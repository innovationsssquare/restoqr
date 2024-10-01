"use client"
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Biryani from "../../../public/Asset/Biryani2.png"
import Pizza from "../../../public/Asset/Pizza.png"
import Burger from "../../../public/Asset/Burger.png"
import Noodles from "../../../public/Asset/Noodles.png"
import Image from "next/image"
import { Divider,Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"

const categories = [
  { name: "Biryani", image: Biryani },
  { name: "Pizza", image: Pizza },
  { name: "Burger", image: Burger },
  { name: "Noodles", image: Noodles },
  { name: "Fries", image: Biryani },
]

export default function FoodCategories() {
  const router=useRouter()
  return (
    <div className="w-full flex flex-col justify-center items-center mx-auto px-2  py-2">
     
      <div className="flex justify-between items-center w-full px-2 mb-2">
        <h2 className="text-xl font-bold">Categories</h2>
        <Button onClick={()=>router.push("/Seeallcategory")} variant="link" className="text-[#F04F5F] text-sm font-medium">
          See All
        </Button>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {categories.map((category, index) => (
            <CarouselItem key={index} className="basis-1/4">
              <div className="p-1">
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src={category.image}
                    alt={category.name}
                    className=" rounded-full mb-1 h-16 w-16 object-fill"
                  />
                  <h3 className="text-sm font-medium text-center text-gray-700">{category.name}</h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Divider className="mt-2"/>
    </div>
  )
}