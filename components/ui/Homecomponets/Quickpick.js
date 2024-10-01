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
import { BookmarkIcon, ShareIcon, InfoIcon } from "lucide-react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Quickpick() {
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
      image: MasalaTea,
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
      image: Fries,
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
    <Card className="w-full pb-8 mx-auto">
      <CardContent className="p-3 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Quick Picks</h2>
          <Button variant="link" className="text-pink-500">
            See All
          </Button>
        </div>
        <TabSlider />
        <div className="grid grid-cols-2 sm:grid-cols-3 py-4 gap-4 w-full">
          {quickPicks.map((item, index) => (
            <Drawer key={index}>
              <DrawerTrigger asChild>
                <div
                  className="relative cursor-pointer rounded-sm ring-1 ring-gray-300 shadow-sm"
                  onClick={() => setSelectedDish(item)}
                >
                  <div className="relative aspect-square mb-2 rounded-t-sm bg-slate-200 ">
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
                      <Image
                        src={item.veg ? Vegicon : Nonvegicon}
                        alt="veicon"
                      />
                    </div>
                    <Button
                      isIconOnly
                      className="absolute bottom-2 right-2 rounded-none bg-transparent w-12 h-12"
                    >
                      <Image
                        src={Addicon}
                        alt="addicon"
                        className="w-12 h-12"
                      />
                    </Button>
                  </div>
                  <p className="font-medium text-sm p-2">{item.name}</p>
                </div>
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
                      <span className="ml-2 text-sm text-gray-600">
                        64 ratings
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Marinated in yogurt & a fiery red masala, grilled in a
                      clay tandoor oven
                    </p>
                    <ScrollArea className="h-40 w-full ">
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
      </CardContent>
    </Card>
  );
}
