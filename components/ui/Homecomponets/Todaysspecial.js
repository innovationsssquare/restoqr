"use client"

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from "@nextui-org/react"
import Banner from "../../../public/Asset/Banner.png"
import Image from 'next/image'

const specials = [
  {
    title: "Tasty Indian Dosa",
    description: "Crispy, savory, and filled with spiced potatoes. A South Indian delight!",
    image: Banner,
    color: "bg-amber-800"
  },
  {
    title: "Spicy Noodle",
    description: "Fiery, flavorful noodles that pack a punch. Today's best!",
    image: Banner,
    color: "bg-purple-800"
  },
  {
    title: "Juicy Burger",
    description: "Classic American burger with all the fixings. Pure indulgence!",
    image: Banner,
    color: "bg-red-800"
  }
]

export default function TodaysSpecial() {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' })

  return (
    <div className="w-full px-1 mx-auto  ">
      <div className="flex justify-between items-center px-2 mb-2">
        <h2 className="text-xl font-bold">{`Today's Special`}</h2>
        <Button variant="link" className="text-[#F04F5F]">
          See All
        </Button>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {specials.map((special, index) => (
            <div key={index} className="flex-[0_0_90%] min-w-0 pl-4 first:pl-0 sm:flex-[0_0_45%]">
              <div className={`${special.color} rounded-lg overflow-hidden shadow-lg`}>
                <div className="relative h-40">
                  <Image
                    src={special.image}
                    alt={special.title}
                    className="absolute inset-0 w-full h-full object-fill"
                  />
                </div>
                {/* <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{special.title}</h3>
                  <p className="text-white text-sm mb-4">{special.description}</p>
                  <Button className="bg-white text-purple-800 hover:bg-gray-100">
                    Order Now
                  </Button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}