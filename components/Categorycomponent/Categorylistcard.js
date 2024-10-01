"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
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
import { BookmarkIcon, ShareIcon, InfoIcon } from "lucide-react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const foodItems = [
  {
    id: "1",
    name: "Veg Biryani",
    description:
      "Saffron-infused basmati rice, fresh veggies, warming spices. Authentic Indian flavors in every bite!",
    price: 259,
    image: Fries,
    isVeg: true,
  },
  {
    id: "2",
    name: "Chicken Biryani",
    description:
      "Tender chicken, fragrant basmati rice & hint of spices. A classic Indian favorite, cooked to perfection!",
    price: 349,
    image: MasalaTea,
    isVeg: false,
  },
  {
    id: "2",
    name: "Chicken Biryani",
    description:
      "Tender chicken, fragrant basmati rice & hint of spices. A classic Indian favorite, cooked to perfection!",
    price: 349,
    image: MasalaTea,
    isVeg: false,
  },
];

export default function FoodItemList() {
  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState("half");
  const [cookingRequest, setCookingRequest] = useState("");

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleCookingRequestChange = (event) => {
    setCookingRequest(event.target.value);
  };

  const addSpiceLevel = (level) => {
    setCookingRequest((prev) => (prev ? `${prev}, ${level}` : level));
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="space-y-4 p-2 w-full mx-auto pb-20">
      {foodItems.map((item) => (
        <Drawer key={item.id}>
          <DrawerTrigger asChild>
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start p-4">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <Image
                        src={item.veg ? Vegicon : Nonvegicon}
                        alt="veicon"
                        className="h-6 w-6"
                      />
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <p className="font-bold">₹{item.price}</p>
                    <Button
                      variant="link"
                      className="text-red-500 p-0 h-auto font-normal"
                      asChild
                    ></Button>
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
          </DrawerTrigger>
          <DrawerContent>
            <div className="w-full mx-auto bg-white rounded-t-xl overflow-hidden">
              <div className="relative">
                <Image
                  src={item.image}
                  alt="Tandoori Chicken"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Spicy
                  </span>
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Bestseller
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <div className="flex space-x-2">
                    <BookmarkIcon className="w-6 h-6 text-gray-400" />
                    <ShareIcon className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {"★★★★☆".split("").map((star, index) => (
                      <span key={index}>{star}</span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">64 ratings</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Marinated in yogurt & a fiery red masala, grilled in a clay
                  tandoor oven
                </p>
                <ScrollArea className="h-52 w-full ">
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Quantity</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Required • Select any 1 option
                    </p>
                    <RadioGroup
                      value={quantity}
                      onValueChange={handleQuantityChange}
                    >
                      <div className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
                        <div className="flex items-center">
                          <RadioGroupItem value="half" id="half" />
                          <Label htmlFor="half" className="ml-2">
                            Half
                          </Label>
                        </div>
                        <span className="font-bold">₹130</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <div className="flex items-center">
                          <RadioGroupItem value="full" id="full" />
                          <Label htmlFor="full" className="ml-2">
                            Full
                          </Label>
                        </div>
                        <span className="font-bold">₹170</span>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold">
                        Add a cooking request (optional)
                      </h3>
                      <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
                    </div>
                    <Textarea
                      placeholder="e.g. Don't make it too spicy"
                      value={cookingRequest}
                      onChange={handleCookingRequestChange}
                      className="w-full p-2 border rounded"
                    />
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSpiceLevel("Extra Spicy")}
                      >
                        Extra Spicy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSpiceLevel("Less Spicy")}
                      >
                        Less Spicy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSpiceLevel("Double Spicy")}
                      >
                        Double Spicy
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border-[#F04F5F] border rounded-lg bg-pink-100">
                    <Button
                      variant="light"
                      isIconOnly
                      onClick={decreaseQuantity}
                      className="h-8 w-8 rounded-none"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2">{quantity}</span>
                    <Button
                      variant="light"
                      isIconOnly
                      onClick={increaseQuantity}
                      className="h-8 w-8 rounded-none"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="bg-[#F04F5F] hover:bg-[#F04F5F/80] text-white px-8">
                    Add item ₹{330 * quantity}
                  </Button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
