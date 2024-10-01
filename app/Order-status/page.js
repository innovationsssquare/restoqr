"use client"
import { ArrowLeft, Star, PhoneCall } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from '@/components/ui/scroll-area'
import Lottie from 'react-lottie';
import * as animationData from '../../lib/new.json'
import assist from "@/public/Asset/assist.png"
import Image from 'next/image';
import { Progress } from "@nextui-org/react";
import NotificationSheet from '@/components/ui/Homecomponets/Notification';
import { useRouter } from 'next/navigation';

export default function OrderStatus() {
const router=useRouter()
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


  return (
    <div className="flex flex-col  h-full bg-white">
      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b sticky w-full z-10 bg-[#F04F5F] px-2 top-0">
        <Button onClick={()=>router.push("/")} variant="ghost" className="text-white bg-transparent hover:bg-transparent hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <p className='text-lg'>Order More</p>
        </Button>
       <NotificationSheet/>
      </header>

      {/* Main content */}
      <ScrollArea className="w-full flex flex-col justify-center items-center mx-auto">
        {/* Chef Illustration */}
        <div className="relative w-full pt-6 flex justify-center items-center overflow-hidden">
        <Lottie options={defaultOptions}
              height={250}
              width={250}
              speed={0.1}
              />
              
        </div>

        {/* Order Status */}
        <div className="p-6">
          <div className="flex flex-col gap-4 items-center mb-4">
            <div>
            <span className="text-green-500 font-semibold bg-green-200 px-4 p-1 rounded-md">Served</span>
            <span className="ml-2 text-gray-600">Hope you loved the Food!</span>

            </div>
            <Progress
      size="sm"
      color='success'
      value={100}
      // isIndeterminate
      aria-label="Loading..."
      className="w-full"
    />
          </div>

          {/* Order Details */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-black font-semibold mb-2">#order73829 | Table A1</p>
            <div className="flex justify-between text-sm w-full">
              <span>Veg Biryani</span>
              <span>259 x 1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Chicken Biryani</span>
              <span>349 x 1</span>
            </div>
          </div>

          {/* Assistance */}
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
            <div className="flex items-center">
              <Image src={assist} alt="Receptionist" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <p className="font-semibold">Need any assistance?</p>
                <p className="text-red-500 text-sm">Contact our receptionist</p>
              </div>
            </div>
            <Button size="icon" className="bg-green-500 hover:bg-green-600">
              <PhoneCall className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="p-4 sticky bottom-0 w-full bg-white z-10">
        <Button className="w-full rounded-full bg-red-500 hover:bg-red-600 text-white py-4 text-lg">
          Get Bill
        </Button>
      </footer>
    </div>
  )
}