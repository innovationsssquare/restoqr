"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import TabSlider from "./Tabslider";
import Vegicon from "@/public/Asset/Vegicon.png";
import Nonvegicon from "@/public/Asset/Nonvegicon.png";
import Addicon from "@/public/Asset/Addicon.png";
import MasalaTea from "@/public/Asset/MasalaTea.png";
import Fries from "@/public/Asset/Fries.png";
import BiryaniImage from "@/public/Asset/Biryani2.png";
import PizzaImage from "@/public/Asset/Pizza.png";
import BurgerImage from "@/public/Asset/Burger.png";
import NoodlesImage from "@/public/Asset/Noodles.png";

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
import { Button } from "@nextui-org/react";
import { BookmarkIcon, ShareIcon, Sparkles, Flame, Leaf, Drumstick, Plus, Minus, Check, X, Filter } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const DEFAULT_DISHES = [
  {
    id: "1",
    name: "Hyderabadi Chicken Biryani",
    category: "Biryani",
    image: BiryaniImage,
    isVeg: false,
    spice: "spicy",
    price: 349,
    description: "Tender chicken marinated in yogurt and fiery royal spices, dum cooked to perfection with aged basmati rice.",
    ingredients: ["Basmati Rice", "Chicken", "Saffron", "Fried Onions", "Biryani Spices"],
  },
  {
    id: "2",
    name: "Veg Dum Biryani",
    category: "Biryani",
    image: BiryaniImage,
    isVeg: true,
    spice: "medium",
    price: 259,
    description: "Fragrant basmati rice layered with garden vegetables, saffron & aromatic whole spices.",
    ingredients: ["Basmati Rice", "Carrots", "Beans", "Paneer", "Mint", "Ghee"],
  },
  {
    id: "3",
    name: "Paneer Tikka Charcoal",
    category: "Starters",
    image: Fries,
    isVeg: true,
    spice: "medium",
    price: 299,
    description: "Cottage cheese cubes marinated in tandoori masala, charred in clay oven with bell peppers.",
    ingredients: ["Fresh Paneer", "Hung Curd", "Kashmiri Chilli", "Mustard Oil", "Capsicum"],
  },
  {
    id: "4",
    name: "Tandoori Chicken (Half)",
    category: "Starters",
    image: PizzaImage,
    isVeg: false,
    spice: "spicy",
    price: 330,
    description: "Classic spicy clay-oven roasted chicken served with mint chutney and onion rings.",
    ingredients: ["Spring Chicken", "Deggi Mirch", "Yogurt", "Garam Masala", "Lime"],
  },
  {
    id: "5",
    name: "Paneer Butter Masala",
    category: "Mains",
    image: BurgerImage,
    isVeg: true,
    spice: "mild",
    price: 280,
    description: "Silky tomato butter gravy loaded with velvety fresh paneer cubes and crushed kasuri methi.",
    ingredients: ["Paneer", "Tomatoes", "Cashews", "Butter", "Fresh Cream", "Fenugreek"],
  },
  {
    id: "6",
    name: "Butter Naan",
    category: "Breads",
    image: NoodlesImage,
    isVeg: true,
    spice: "mild",
    price: 50,
    description: "Soft and pillowy leavened flatbread brushed with golden farm butter.",
    ingredients: ["Refined Flour", "Butter", "Nigella Seeds", "Milk"],
  },
  {
    id: "7",
    name: "Garlic Naan",
    category: "Breads",
    image: NoodlesImage,
    isVeg: true,
    spice: "mild",
    price: 65,
    description: "Crisp tandoori naan encrusted with roasted garlic cloves and fresh cilantro.",
    ingredients: ["Refined Flour", "Roasted Garlic", "Coriander", "Butter"],
  },
  {
    id: "8",
    name: "French Fries Special",
    category: "Starters",
    image: Fries,
    isVeg: true,
    spice: "mild",
    price: 120,
    description: "Crispy, golden-brown potato strips deep-fried to perfection with peri-peri seasoning.",
    ingredients: ["Potatoes", "Vegetable oil", "Peri-peri spice", "Salt"],
  },
  {
    id: "9",
    name: "Masala Chai",
    category: "Drinks",
    image: MasalaTea,
    isVeg: true,
    spice: "mild",
    price: 50,
    description: "A spiced tea beverage made by brewing black tea with ginger, cardamom, and fresh milk.",
    ingredients: ["Assam Black Tea", "Milk", "Ginger", "Cardamom", "Sugar"],
  },
];

export default function Quickpick() {
  const [dishes, setDishes] = useState(DEFAULT_DISHES);
  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cookingRequest, setCookingRequest] = useState("");
  const [addedMessage, setAddedMessage] = useState("");

  // Live filter state synchronized with ConfirmTkt Voice AI
  const [activeFilters, setActiveFilters] = useState({
    diet: "all",
    spice: "all",
    category: "all",
    maxPrice: null,
    search: "",
  });

  // Listen to ConfirmTkt Voice AI events in real time
  useEffect(() => {
    const handleVoiceFilter = (e) => {
      if (e.detail) {
        setActiveFilters((prev) => ({
          ...prev,
          ...e.detail,
        }));
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("restoqr_filter_change", handleVoiceFilter);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("restoqr_filter_change", handleVoiceFilter);
      }
    };
  }, []);

  // Fetch real backend dishes if available
  useEffect(() => {
    fetch("http://localhost:8081/api/v1/dish/getAll")
      .then((res) => res.json())
      .then((data) => {
        if (data.status && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.map((d, idx) => ({
            id: d._id || idx.toString(),
            name: d.menuName || d.name,
            category: d.categoryName || "Mains",
            image: DEFAULT_DISHES[idx % DEFAULT_DISHES.length].image,
            isVeg: d.isVeg !== undefined ? d.isVeg : idx % 2 === 0,
            spice: idx % 3 === 0 ? "spicy" : idx % 3 === 1 ? "medium" : "mild",
            price: d.price || 250,
            description: d.description || "Fresh chef prepared specialty",
            ingredients: ["Fresh Spices", "Chef Seasoning", "Authentic Ingredients"],
          }));
          setDishes(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddToCart = (dish) => {
    if (typeof window === "undefined") return;
    try {
      const currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      currentCart.push({
        name: dish.name,
        price: dish.price,
        quantity: quantity,
        notes: cookingRequest || "Quick Pick Order",
      });
      localStorage.setItem("restoqr_cart", JSON.stringify(currentCart));
      setAddedMessage(`✓ Added ${quantity}x ${dish.name} to Cart!`);
      setTimeout(() => {
        setAddedMessage("");
      }, 1800);
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  const handleQuickAdd = (e, dish) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      currentCart.push({
        name: dish.name,
        price: dish.price,
        quantity: 1,
        notes: "Quick Pick 1-Tap Add",
      });
      localStorage.setItem("restoqr_cart", JSON.stringify(currentCart));
      setAddedMessage(`✓ Added 1x ${dish.name}!`);
      setTimeout(() => setAddedMessage(""), 1500);
    }
  };

  const clearFilter = (key) => {
    const updated = { ...activeFilters, [key]: key === "maxPrice" ? null : "all" };
    setActiveFilters(updated);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("restoqr_filter_change", { detail: updated }));
    }
  };

  const clearAllFilters = () => {
    const reset = { diet: "all", spice: "all", category: "all", maxPrice: null, search: "" };
    setActiveFilters(reset);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("restoqr_filter_change", { detail: reset }));
    }
  };

  // Filter dishes based on active Voice / Manual Filters
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Diet filter
      if (activeFilters.diet === "veg" && !dish.isVeg) return false;
      if (activeFilters.diet === "non-veg" && dish.isVeg) return false;

      // Spice filter
      if (activeFilters.spice !== "all" && dish.spice !== activeFilters.spice) return false;

      // Category filter
      if (activeFilters.category !== "all" && dish.category !== activeFilters.category) return false;

      // Price ceiling
      if (activeFilters.maxPrice !== null && dish.price > activeFilters.maxPrice) return false;

      return true;
    });
  }, [dishes, activeFilters]);

  const hasActiveFilters =
    activeFilters.diet !== "all" ||
    activeFilters.spice !== "all" ||
    activeFilters.category !== "all" ||
    activeFilters.maxPrice !== null;

  return (
    <div className="w-full pb-8 mx-auto px-3 sm:px-4">
      {/* Toast Alert */}
      {addedMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-full shadow-lg animate-bounce">
          {addedMessage}
        </div>
      )}

      {/* Header & Filter Indicator */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <span>Curated Menu</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              {filteredDishes.length} items
            </span>
          </h2>
          <p className="text-xs text-neutral-500">Live updated with ConfirmTkt Voice AI search</p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-rose-200"
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Active Voice Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60">
          <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> Voice Filters:
          </span>

          {activeFilters.diet !== "all" && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <Leaf className="w-2.5 h-2.5 text-emerald-600" />
              <span>{activeFilters.diet === "veg" ? "Pure Veg" : "Non-Veg"}</span>
              <X className="w-2.5 h-2.5 cursor-pointer ml-0.5" onClick={() => clearFilter("diet")} />
            </span>
          )}

          {activeFilters.spice !== "all" && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-red-800 border border-red-300 flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-red-600" />
              <span>{activeFilters.spice}</span>
              <X className="w-2.5 h-2.5 cursor-pointer ml-0.5" onClick={() => clearFilter("spice")} />
            </span>
          )}

          {activeFilters.category !== "all" && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-purple-800 border border-purple-300 flex items-center gap-1">
              <span>{activeFilters.category}</span>
              <X className="w-2.5 h-2.5 cursor-pointer ml-0.5" onClick={() => clearFilter("category")} />
            </span>
          )}

          {activeFilters.maxPrice && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-blue-800 border border-blue-300 flex items-center gap-1">
              <span>&lt; ₹{activeFilters.maxPrice}</span>
              <X className="w-2.5 h-2.5 cursor-pointer ml-0.5" onClick={() => clearFilter("maxPrice")} />
            </span>
          )}
        </div>
      )}

      {/* Dishes Grid */}
      {filteredDishes.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700">No dishes match these voice filters</p>
          <p className="text-xs text-neutral-400 mt-1">Try tapping &quot;Clear filters&quot; or speaking another dish preference.</p>
          <Button
            onClick={clearAllFilters}
            className="mt-3 bg-[#F04F5F] text-white text-xs font-semibold px-4 py-1.5 rounded-xl h-8"
          >
            View Full Menu
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredDishes.map((item) => (
            <Drawer key={item.id}>
              <DrawerTrigger asChild>
                <div
                  className="group relative cursor-pointer rounded-2xl bg-white border border-neutral-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  onClick={() => {
                    setSelectedDish(item);
                    setQuantity(1);
                    setCookingRequest("");
                  }}
                >
                  <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Veg / Non-Veg Indicator */}
                    <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs">
                      <Image
                        src={item.isVeg ? Vegicon : Nonvegicon}
                        alt={item.isVeg ? "Veg" : "Non-Veg"}
                        width={14}
                        height={14}
                      />
                    </div>

                    {/* Spice Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs ${
                          item.spice === "spicy"
                            ? "bg-red-600 text-white"
                            : item.spice === "medium"
                            ? "bg-amber-500 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {item.spice === "spicy" ? "🌶️ Spicy" : item.spice === "medium" ? "🌶️ Med" : "Mild"}
                      </span>
                    </div>

                    {/* 1-Tap Quick Add Button */}
                    <button
                      onClick={(e) => handleQuickAdd(e, item)}
                      className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-rose-500 hover:text-white text-neutral-800 shadow-md flex items-center justify-center transition border border-neutral-200"
                      title="Quick Add to Table"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dish Details */}
                  <div className="p-2.5 flex flex-col justify-between flex-1">
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-neutral-100">
                      <span className="text-xs sm:text-sm font-bold text-[#F04F5F] font-mono">₹{item.price}</span>
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </DrawerTrigger>

              {/* Customization Drawer */}
              <DrawerContent>
                <div className="w-full max-w-lg mx-auto bg-white rounded-t-3xl overflow-hidden p-4">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-3">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold text-neutral-800 flex items-center gap-1 shadow-xs">
                        <Image src={item.isVeg ? Vegicon : Nonvegicon} alt="diet" width={14} height={14} />
                        {item.isVeg ? "Pure Veg" : "Non-Veg"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <DrawerTitle className="text-lg font-bold text-neutral-900">{item.name}</DrawerTitle>
                      <DrawerDescription className="text-xs text-neutral-500 mt-0.5">
                        {item.description}
                      </DrawerDescription>
                    </div>
                    <span className="text-lg font-bold text-[#F04F5F] font-mono">₹{item.price}</span>
                  </div>

                  {/* Cooking Instructions */}
                  <div className="space-y-3 my-3">
                    <Label className="text-xs font-semibold text-neutral-700">Special Cooking Instructions for Chef:</Label>
                    <Textarea
                      placeholder="e.g. Less oil, extra green chilies, crisper naan, no onion..."
                      value={cookingRequest}
                      onChange={(e) => setCookingRequest(e.target.value)}
                      className="text-xs rounded-xl border-neutral-200"
                      rows={2}
                    />

                    {/* Quick Spice Level Chips */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-neutral-500">Quick Notes:</span>
                      {["Mild", "Medium Spicy", "Extra Spicy", "Less Oil"].map((note, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setCookingRequest((prev) => (prev ? `${prev}, ${note}` : note))
                          }
                          className="text-[10px] font-semibold px-2 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                        >
                          +{note}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity & Add to Cart Action */}
                  <div className="flex items-center justify-between gap-4 pt-3 border-t">
                    <div className="flex items-center border border-neutral-200 rounded-xl px-2 py-1 bg-neutral-50">
                      <button
                        onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                        className="p-1 hover:text-rose-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="p-1 hover:text-rose-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <DrawerClose asChild>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-[#F04F5F] hover:bg-[#D03F4F] text-white font-bold text-sm h-11 rounded-xl shadow-md flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Add to Table Bill • ₹{item.price * quantity}</span>
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      )}
    </div>
  );
}
