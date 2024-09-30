import { ArrowLeft, Star, PhoneCall } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from '@/components/ui/scroll-area'

export default function OrderStatus() {
  return (
    <div className="flex flex-col py-20 h-full bg-white">
      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b fixed w-full z-10 bg-white top-0">
        <Button variant="ghost" className="text-red-500">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Order More
        </Button>
        <Button variant="ghost" className="text-gray-600">
          Rate us!
          <Star className="w-5 h-5 ml-2" fill="currentColor" />
        </Button>
      </header>

      {/* Main content */}
      <ScrollArea className="flex-grow overflow-auto">
        {/* Chef Illustration */}
        <div className="relative h-64 bg-red-100 rounded-b-full overflow-hidden">
          <svg className="absolute bottom-0 left-1/2 transform -translate-x-1/2" width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="170" r="60" fill="#FFFFFF" />
            <circle cx="100" cy="120" r="40" fill="#FFFFFF" />
            <circle cx="85" cy="110" r="5" fill="#000000" />
            <circle cx="115" cy="110" r="5" fill="#000000" />
            <path d="M90 130 Q100 140 110 130" stroke="#000000" strokeWidth="3" fill="none" />
            <path d="M70 90 Q100 80 130 90" stroke="#000000" strokeWidth="3" fill="none" />
            <rect x="70" y="140" width="60" height="80" fill="#FF4136" />
            <rect x="85" y="140" width="30" height="40" fill="#FFFFFF" />
            <circle cx="90" cy="150" r="3" fill="#000000" />
            <circle cx="100" cy="150" r="3" fill="#000000" />
            <circle cx="110" cy="150" r="3" fill="#000000" />
          </svg>
        </div>

        {/* Order Status */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-500 font-semibold">Served</span>
            <span className="ml-2 text-gray-600">Hope you loved the Food!</span>
          </div>

          {/* Order Details */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-gray-600 mb-2">#order73829 | Table A1</p>
            <div className="flex justify-between text-sm">
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
              <img src="/placeholder.svg?height=40&width=40" alt="Receptionist" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <p className="font-semibold">Need any assistance?</p>
                <p className="text-red-500 text-sm">Contact our receptionist</p>
              </div>
            </div>
            <Button size="icon" className="bg-green-500 hover:bg-green-600">
              <PhoneCall className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="p-4 fixed bottom-0 w-full bg-white z-10">
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-lg">
          Get Bill
        </Button>
      </footer>
    </div>
  )
}