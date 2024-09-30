"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import TabSlider from "./Tabslider";
import Vegicon from "@/public/Asset/Vegicon.png";
import Nonvegicon from "@/public/Asset/Nonvegicon.png";
import Addicon from "@/public/Asset/Addicon.png";
import MasalaTea from "@/public/Asset/MasalaTea.png";
import Fries from "@/public/Asset/Fries.png";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Button } from "@nextui-org/react";

export default function Quickpick() {
  const [selectedDish, setSelectedDish] = useState(null);

  const quickPicks = [
    {
      name: "Masala Tea",
      image: MasalaTea,
      veg: true,
      description:
        "A spiced tea beverage made by brewing black tea with a mixture of aromatic Indian spices and herbs.",
      price: 2.5,
      ingredients: [
        "Black tea",
        "Milk",
        "Sugar",
        "Cardamom",
        "Cinnamon",
        "Ginger",
      ],
    },
    {
      name: "French Fries",
      image: MasalaTea,
      veg: true,
      description:
        "Crispy, golden-brown potato strips deep-fried to perfection.",
      price: 3.99,
      ingredients: ["Potatoes", "Vegetable oil", "Salt"],
    },
    {
      name: "Mutton Hotdog",
      image: Fries,
      veg: false,
      description:
        "Juicy mutton sausage served in a soft bun with various toppings.",
      price: 5.99,
      ingredients: ["Mutton sausage", "Bun", "Mustard", "Ketchup", "Onions"],
    },
    {
      name: "Chicken Sandwich",
      image: Fries,
      veg: false,
      description:
        "Grilled chicken breast with fresh vegetables and mayo in toasted bread.",
      price: 6.99,
      ingredients: [
        "Chicken breast",
        "Bread",
        "Lettuce",
        "Tomato",
        "Mayonnaise",
      ],
    },
    {
      name: "Chicken Pizza",
      image:MasalaTea,
      veg: false,
      description:
        "Delicious pizza topped with grilled chicken, vegetables, and cheese.",
      price: 12.99,
      ingredients: [
        "Pizza dough",
        "Tomato sauce",
        "Mozzarella cheese",
        "Grilled chicken",
        "Bell peppers",
        "Onions",
      ],
    },
    {
      name: "Oreo Milkshake",
      image:Fries,
      veg: true,
      description:
        "Creamy milkshake blended with Oreo cookies and topped with whipped cream.",
      price: 4.99,
      ingredients: [
        "Milk",
        "Vanilla ice cream",
        "Oreo cookies",
        "Whipped cream",
      ],
    },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Quick Picks</h2>
          <Button variant="link" className="text-pink-500">
            See All
          </Button>
        </div>
       <TabSlider/>
        <div className="grid grid-cols-2 sm:grid-cols-3 py-4 gap-4">
          {quickPicks.map((item, index) => (
            <Drawer key={index}>
              <DrawerTrigger asChild>
                <div
                  className="relative cursor-pointer rounded-sm"
                  onClick={() => setSelectedDish(item)}
                >
                  <div className="relative aspect-square mb-2 rounded-sm bg-slate-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                    <div
                      className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center`}
                    >
                     <Image src={item.veg?Vegicon:Nonvegicon} alt="veicon"/>
                    </div>
                    <Button
                    isIconOnly
                      className="absolute bottom-2 right-2 rounded-none bg-transparent w-12 h-12"
                    >
                     <Image src={Addicon} alt="addicon" className="w-12 h-12"/>
                    </Button>
                  </div>
                  <p className="font-medium text-sm">{item.name}</p>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>{selectedDish?.name}</DrawerTitle>
                    <DrawerDescription>
                      {selectedDish?.description}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <Image
                      src={selectedDish?.image || "/placeholder.svg"}
                      alt={selectedDish?.name || "Dish"}
                      width={200}
                      height={200}
                      className="rounded-lg mx-auto mb-4"
                    />
                    <p className="text-lg font-bold mb-2">
                      Price: ${selectedDish?.price.toFixed(2)}
                    </p>
                    <h3 className="font-semibold mb-1">Ingredients:</h3>
                    <ul className="list-disc list-inside mb-4">
                      {selectedDish?.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    <p
                      className={`font-semibold ${
                        selectedDish?.veg ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {selectedDish?.veg ? "Vegetarian" : "Non-Vegetarian"}
                    </p>
                  </div>
                  <DrawerFooter>
                    <Button>Add to Cart</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
