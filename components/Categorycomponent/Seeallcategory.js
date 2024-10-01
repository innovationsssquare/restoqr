"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Search, SlidersHorizontal, Pencil, ChevronRight } from 'lucide-react'
import Image from "next/image"
import Vegicon from "@/public/Asset/Vegicon.png";
import Nonvegicon from "@/public/Asset/Nonvegicon.png";
import Addicon from "@/public/Asset/Addicon.png";
import MasalaTea from "@/public/Asset/MasalaTea.png";
import Fries from "@/public/Asset/Fries.png"; 
import useEmblaCarousel from 'embla-carousel-react'
import NotificationSheet from '../ui/Homecomponets/Notification'
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


const categories = ['All', 'Biryani', 'Pizza', 'Burger', 'Noodles', 'Pasta', 'Dessert', 'Drinks', 'Salads', 'Appetizers']

const foodItems = [
  { id: '1', name: 'Veg Biryani', category: 'Biryani', price: 259, image: Fries, description: 'Saffron-infused basmati rice, fresh veggies, warming spices. Authentic Indian flavors in every bite!', isVeg: true },
  { id: '2', name: 'Chicken Biryani', category: 'Biryani', price: 299, image: Fries, description: 'Aromatic basmati rice cooked with tender chicken and spices', isVeg: false },
  { id: '3', name: 'Margherita Pizza', category: 'Pizza', price: 200, image: Fries, description: 'Classic pizza with tomato sauce, mozzarella, and basil', isVeg: true },
  { id: '4', name: 'Cheeseburger', category: 'Burger', price: 150, image: MasalaTea, description: 'Juicy beef patty with cheese, lettuce, and tomato', isVeg: false },
  { id: '5', name: 'Pad Thai', category: 'Noodles', price: 180, image: MasalaTea, description: 'Stir-fried rice noodles with shrimp, tofu, peanuts, and bean sprouts', isVeg: false },
  { id: '6', name: 'Chocolate Lava Cake', category: 'Dessert', price: 120, image: MasalaTea, description: 'Warm chocolate cake with a gooey center, served with vanilla ice cream', isVeg: true },
]

export default function RestaurantMenu() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' })
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

  const filteredItems = foodItems.filter(item => 
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-[#F04F5F] p-4 flex items-center justify-between sticky top-0 z-10">
        {/* <Button variant="ghost" size="icon" className="text-white hover:bg-[#E03F4F]">
          <ChevronLeft className="h-6 w-6" />
        </Button> */}
        <h1 className="text-xl font-semibold text-white">Restaurant Menu</h1>
          <NotificationSheet/>
      </header>

      <div className="p-4  w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            className="w-full py-3 pl-10 pr-10 rounded-md bg-white text-gray-500 placeholder-gray-400 focus:outline-none"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="relative px-4">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {categories.map((category) => (
              <div key={category} className="embla__slide flex-[0_0_auto] min-w-0 pr-4">
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full w-full ${
                    selectedCategory === category
                      ? 'bg-[#F04F5F] text-white hover:bg-[#E03F4F]'
                      : 'border-[#F04F5F] text-[#F04F5F] hover:bg-[#F04F5F] hover:text-white'
                  }`}
                >
                  {category}
                </Button>
              </div>
            ))}
          </div>
        </div>
        {/* <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button> */}
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
        {filteredItems.map((item) => (
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
    </div>
  )
}