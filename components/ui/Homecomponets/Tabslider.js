"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@nextui-org/react"

const tabs = [
  { id: "whats-new", label: "What's New?" },
  { id: "pure-veg", label: "Pure Veg" },
  { id: "under-300", label: "Under 300/-" },
  { id: "bestsellers", label: "Bestsellers" },
  { id: "offers", label: "Offers" },
]

export default function TabCarousel() {
  const [activeTab, setActiveTab] = React.useState(tabs[0].id)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const index = tabs.findIndex((tab) => tab.id === tabId)
    if (emblaApi) emblaApi.scrollTo(index)
  }

  return (
    <div className="relative w-full mx-auto ">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {tabs.map((tab) => (
            <Button
            size="sm"
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-[0_0_auto] px-4 py-1 mx-1 rounded-full text-sm font-medium transition-colors focus:outline-none",
                activeTab === tab.id
                  ? "bg-[#F04F5F] text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      {/* <Button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
        size="icon"
        variant="ghost"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span className="sr-only">Scroll left</span>
      </Button>
      <Button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
        size="icon"
        variant="ghost"
      >
        <ChevronRightIcon className="h-4 w-4" />
        <span className="sr-only">Scroll right</span>
      </Button> */}
    </div>
  )
}