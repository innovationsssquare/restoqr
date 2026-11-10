"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  ArrowRight,
  Filter,
  X,
  UtensilsCrossed,
  Flame,
  Leaf,
  Drumstick,
  RotateCcw,
  BellRing,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

// Comprehensive restaurant menu items for real-time live filtering
const RESTAURANT_MENU = [
  {
    id: "1",
    name: "Veg Dum Biryani",
    category: "Biryani",
    price: 259,
    isVeg: true,
    spice: "medium",
    description: "Fragrant basmati rice layered with garden vegetables, saffron & roasted spices",
    keywords: ["veg biryani", "biryani", "veg dum", "vegetable biryani", "chawal"],
  },
  {
    id: "2",
    name: "Hyderabadi Chicken Biryani",
    category: "Biryani",
    price: 349,
    isVeg: false,
    spice: "spicy",
    description: "Tender chicken marinated in yogurt and fiery spices, dum cooked to perfection",
    keywords: ["chicken biryani", "chicken", "biryani", "hyderabadi", "dum biryani"],
  },
  {
    id: "3",
    name: "Mutton Dum Biryani",
    category: "Biryani",
    price: 449,
    isVeg: false,
    spice: "spicy",
    description: "Slow-cooked tender goat meat with long grain basmati rice and royal kewra aroma",
    keywords: ["mutton biryani", "mutton", "lamb biryani", "gosht biryani", "biryani"],
  },
  {
    id: "4",
    name: "Paneer Tikka Charcoal Skewer",
    category: "Starters",
    price: 299,
    isVeg: true,
    spice: "medium",
    description: "Cottage cheese cubes marinated in tandoori masala, charred in clay oven",
    keywords: ["paneer tikka", "paneer starter", "tikka", "paneer", "starter"],
  },
  {
    id: "5",
    name: "Tandoori Chicken (Half)",
    category: "Starters",
    price: 330,
    isVeg: false,
    spice: "spicy",
    description: "Spicy clay-oven roasted chicken served with mint chutney and onion rings",
    keywords: ["tandoori chicken", "tandoori", "chicken starter", "starter"],
  },
  {
    id: "6",
    name: "Paneer Butter Masala",
    category: "Mains",
    price: 280,
    isVeg: true,
    spice: "mild",
    description: "Silky tomato butter gravy loaded with velvety fresh paneer cubes",
    keywords: ["paneer butter masala", "paneer butter", "paneer masala", "paneer gravy", "curry"],
  },
  {
    id: "7",
    name: "Dal Makhani Grand",
    category: "Mains",
    price: 240,
    isVeg: true,
    spice: "mild",
    description: "Black lentils slow-simmered for 16 hours with cream and artisanal butter",
    keywords: ["dal makhani", "dal", "makhani", "black dal", "curry"],
  },
  {
    id: "8",
    name: "Chicken Tikka Masala",
    category: "Mains",
    price: 360,
    isVeg: false,
    spice: "spicy",
    description: "Smoky tandoori chicken chunks simmered in a robust, spiced onion-tomato gravy",
    keywords: ["chicken tikka masala", "chicken curry", "chicken gravy", "curry", "mains"],
  },
  {
    id: "9",
    name: "Butter Naan",
    category: "Breads",
    price: 50,
    isVeg: true,
    spice: "mild",
    description: "Soft and pillowy leavened flatbread brushed with golden farm butter",
    keywords: ["butter naan", "naan", "roti", "bread"],
  },
  {
    id: "10",
    name: "Garlic Naan",
    category: "Breads",
    price: 65,
    isVeg: true,
    spice: "mild",
    description: "Crisp tandoori naan encrusted with roasted garlic cloves and fresh cilantro",
    keywords: ["garlic naan", "garlic", "naan", "bread"],
  },
  {
    id: "11",
    name: "Tandoori Roti",
    category: "Breads",
    price: 30,
    isVeg: true,
    spice: "mild",
    description: "Whole wheat crisp flatbread baked in traditional tandoor",
    keywords: ["tandoori roti", "roti", "chapati", "wheat roti"],
  },
  {
    id: "12",
    name: "Fresh Lime Soda",
    category: "Drinks",
    price: 60,
    isVeg: true,
    spice: "mild",
    description: "Refreshing fizzy cooler served sweet, salted, or mixed",
    keywords: ["lime soda", "soda", "cold drink", "lemonade", "drink"],
  },
  {
    id: "13",
    name: "Sweet Punjabi Lassi",
    category: "Drinks",
    price: 75,
    isVeg: true,
    spice: "mild",
    description: "Thick hand-churned fresh yogurt flavored with green cardamom and saffron",
    keywords: ["sweet lassi", "lassi", "punjabi lassi", "curd drink", "drink"],
  },
  {
    id: "14",
    name: "Gulab Jamun (2 Pcs)",
    category: "Desserts",
    price: 80,
    isVeg: true,
    spice: "mild",
    description: "Soft, golden-fried milk dumplings soaked in fragrant rose and cardamom syrup",
    keywords: ["gulab jamun", "jamun", "sweet", "dessert", "meetha"],
  },
];

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
  half: 1, full: 2, plate: 1, plates: 1, single: 1, double: 2,
};

export default function VoiceSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiSpeechText, setAiSpeechText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [tableNumber, setTableNumber] = useState("A1");

  // ConfirmTkt Parameter Extraction State
  const [dietFilter, setDietFilter] = useState("all"); // "all" | "veg" | "non-veg"
  const [spiceFilter, setSpiceFilter] = useState("all"); // "all" | "mild" | "medium" | "spicy"
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all" | "Biryani" | "Starters" | "Mains" | "Breads" | "Drinks" | "Desserts"
  const [maxPriceFilter, setMaxPriceFilter] = useState(null); // number or null
  const [stagedItems, setStagedItems] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const recognitionRef = useRef(null);

  // Read current table
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("restoqr_table");
      if (stored) setTableNumber(stored);
    }
  }, []);

  // Web Speech API Initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = "en-IN"; // English (India) with Hinglish tolerance

        reco.onresult = (event) => {
          let liveTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            liveTranscript += event.results[i][0].transcript;
          }
          if (liveTranscript) {
            setTranscript(liveTranscript);
            parseVoiceEntities(liveTranscript);
          }
        };

        reco.onerror = (e) => {
          console.warn("Speech recognition error:", e.error);
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = reco;
      }
    }
  }, []);

  // Text-to-Speech synthesis
  const speakVoiceFeedback = (text) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  };

  // Toggle Live Microphone
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Cannot start reco:", err.message);
        // Fallback simulate voice prompt
        simulateVoiceQuery("Show me spicy biryani under 400");
      }
    }
  };

  // ConfirmTkt Real-Time Parameter Parsing Engine
  const parseVoiceEntities = (rawText) => {
    if (!rawText || !rawText.trim()) return;
    const lower = rawText.toLowerCase();

    // 1. Dietary Parameter Extraction
    let detectedDiet = dietFilter;
    if (
      lower.includes("pure veg") ||
      lower.includes("only veg") ||
      lower.includes("shakahari") ||
      lower.includes("vegetarian") ||
      (lower.includes("veg") && !lower.includes("non"))
    ) {
      detectedDiet = "veg";
    } else if (
      lower.includes("non veg") ||
      lower.includes("non-veg") ||
      lower.includes("chicken") ||
      lower.includes("mutton") ||
      lower.includes("meat")
    ) {
      detectedDiet = "non-veg";
    }

    // 2. Spice Parameter Extraction
    let detectedSpice = spiceFilter;
    if (
      lower.includes("extra spicy") ||
      lower.includes("very spicy") ||
      lower.includes("teekha") ||
      lower.includes("spicy") ||
      lower.includes("hot")
    ) {
      detectedSpice = "spicy";
    } else if (
      lower.includes("medium spicy") ||
      lower.includes("normal") ||
      lower.includes("medium")
    ) {
      detectedSpice = "medium";
    } else if (
      lower.includes("mild") ||
      lower.includes("less spicy") ||
      lower.includes("kam teekha") ||
      lower.includes("simple")
    ) {
      detectedSpice = "mild";
    }

    // 3. Category Parameter Extraction
    let detectedCategory = categoryFilter;
    if (lower.includes("biryani") || lower.includes("rice") || lower.includes("chawal")) {
      detectedCategory = "Biryani";
    } else if (
      lower.includes("starter") ||
      lower.includes("starters") ||
      lower.includes("tikka") ||
      lower.includes("tandoori") ||
      lower.includes("appetizer")
    ) {
      detectedCategory = "Starters";
    } else if (
      lower.includes("main") ||
      lower.includes("curry") ||
      lower.includes("gravy") ||
      lower.includes("dal")
    ) {
      detectedCategory = "Mains";
    } else if (
      lower.includes("bread") ||
      lower.includes("naan") ||
      lower.includes("roti") ||
      lower.includes("kulcha")
    ) {
      detectedCategory = "Breads";
    } else if (
      lower.includes("drink") ||
      lower.includes("soda") ||
      lower.includes("lassi") ||
      lower.includes("beverage")
    ) {
      detectedCategory = "Drinks";
    } else if (
      lower.includes("dessert") ||
      lower.includes("sweet") ||
      lower.includes("meetha") ||
      lower.includes("jamun")
    ) {
      detectedCategory = "Desserts";
    }

    // 4. Budget / Price Ceiling Extraction
    let detectedMaxPrice = maxPriceFilter;
    const underMatch = lower.match(/(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*(\d{2,4})/);
    if (underMatch) {
      detectedMaxPrice = parseInt(underMatch[1], 10);
    }

    // 5. Dish & Quantity Extraction (Direct Cart Order Intent)
    const detectedItems = [];
    const words = lower.split(/\s+/);

    RESTAURANT_MENU.forEach((dish) => {
      let matched = false;
      dish.keywords.forEach((kw) => {
        if (lower.includes(kw)) matched = true;
      });

      if (matched) {
        // Find preceding quantity word or digit
        let qty = 1;
        const dishIndex = lower.indexOf(dish.name.toLowerCase());
        const precedingSlice = lower.slice(Math.max(0, dishIndex - 15), dishIndex);

        for (const [w, val] of Object.entries(NUMBER_WORDS)) {
          if (precedingSlice.includes(w)) {
            qty = val;
            break;
          }
        }

        detectedItems.push({
          id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: qty,
          isVeg: dish.isVeg,
        });
      }
    });

    // 6. Action Intents (Call Waiter / Show Bill / Reset)
    if (lower.includes("call waiter") || lower.includes("water") || lower.includes("waiter")) {
      handleCallWaiter();
      return;
    }

    if (lower.includes("show bill") || lower.includes("check bill") || lower.includes("payment")) {
      speakVoiceFeedback("Opening your active table bill and UPI payment");
      router.push("/Order-status");
      setIsOpen(false);
      return;
    }

    if (lower.includes("clear") || lower.includes("reset") || lower.includes("sab hatao")) {
      resetAllFilters();
      speakVoiceFeedback("Cleared all filters");
      return;
    }

    // Check confirmation intent
    if (
      (lower.includes("confirm") || lower.includes("yes") || lower.includes("order karo") || lower.includes("haan")) &&
      stagedItems.length > 0
    ) {
      handleConfirmStagedOrder();
      return;
    }

    // Apply extracted parameters
    setDietFilter(detectedDiet);
    setSpiceFilter(detectedSpice);
    setCategoryFilter(detectedCategory);
    setMaxPriceFilter(detectedMaxPrice);

    if (detectedItems.length > 0) {
      setStagedItems(detectedItems);
      const summary = detectedItems.map((i) => `${i.quantity}x ${i.name}`).join(" and ");
      setAiSpeechText(`Staged ${summary}. Say "Confirm" or tap below to add to Table ${tableNumber}.`);
      speakVoiceFeedback(`Staged ${summary}. Speak Confirm to add to Table ${tableNumber}`);
    } else {
      setAiSpeechText(`Filtering menu for: ${detectedDiet !== "all" ? detectedDiet : ""} ${detectedSpice !== "all" ? detectedSpice : ""} ${detectedCategory !== "all" ? detectedCategory : ""}`);
    }

    // Dispatch custom event to auto-filter the customer home screen in background!
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("restoqr_filter_change", {
          detail: {
            diet: detectedDiet,
            spice: detectedSpice,
            category: detectedCategory,
            maxPrice: detectedMaxPrice,
            search: rawText,
          },
        })
      );
    }
  };

  // Reset Filters
  const resetAllFilters = () => {
    setDietFilter("all");
    setSpiceFilter("all");
    setCategoryFilter("all");
    setMaxPriceFilter(null);
    setStagedItems([]);
    setTranscript("");
    setAiSpeechText("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("restoqr_filter_change", {
          detail: { diet: "all", spice: "all", category: "all", maxPrice: null, search: "" },
        })
      );
    }
  };

  // Instant Waiter Call via Voice
  const handleCallWaiter = async () => {
    try {
      await fetch("http://localhost:8081/api/v1/service/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: tableNumber,
          requestType: "Water",
          notes: "Customer voice request for drinking water",
        }),
      });
      speakVoiceFeedback(`Waiter has been alerted to bring water to Table ${tableNumber}`);
      setToastMessage(`✓ Waiter alerted for Table ${tableNumber}`);
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      speakVoiceFeedback(`Alerted server for Table ${tableNumber}`);
    }
  };

  // Add Staged Order directly to Table Bill (Cart)
  const handleConfirmStagedOrder = () => {
    if (stagedItems.length === 0) return;
    try {
      const currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      stagedItems.forEach((item) => {
        currentCart.push({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: "Ordered via ConfirmTkt Voice AI",
        });
      });
      localStorage.setItem("restoqr_cart", JSON.stringify(currentCart));
      speakVoiceFeedback(`Added to Table ${tableNumber} bill! Ready to serve.`);
      setToastMessage(`✓ Added ${stagedItems.length} items to Table ${tableNumber}!`);
      setStagedItems([]);
      setTimeout(() => {
        setToastMessage("");
        setIsOpen(false);
      }, 1500);
    } catch (e) {
      console.warn("Storage error:", e);
    }
  };

  // Quick Add 1 dish from filtered results
  const handleAddSingleDish = (dish) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      currentCart.push({
        name: dish.name,
        price: dish.price,
        quantity: 1,
        notes: "Quick added from Voice AI catalog",
      });
      localStorage.setItem("restoqr_cart", JSON.stringify(currentCart));
      speakVoiceFeedback(`Added 1 ${dish.name} to order.`);
      setToastMessage(`✓ Added ${dish.name} to Table ${tableNumber}`);
      setTimeout(() => setToastMessage(""), 2000);
    } catch (e) {
      console.warn("Cart error:", e);
    }
  };

  // Simulate a Voice Query (for browser testing / 1-click execution)
  const simulateVoiceQuery = (phrase) => {
    setTranscript(phrase);
    parseVoiceEntities(phrase);
  };

  // Live Auto-Filtered Menu List
  const filteredCatalog = useMemo(() => {
    return RESTAURANT_MENU.filter((item) => {
      // Diet match
      if (dietFilter === "veg" && !item.isVeg) return false;
      if (dietFilter === "non-veg" && item.isVeg) return false;

      // Spice match
      if (spiceFilter !== "all" && item.spice !== spiceFilter) return false;

      // Category match
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;

      // Price ceiling
      if (maxPriceFilter !== null && item.price > maxPriceFilter) return false;

      return true;
    });
  }, [dietFilter, spiceFilter, categoryFilter, maxPriceFilter]);

  // Total amount for staged items
  const stagedTotal = stagedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <>
      {/* Trigger 1: Microphone Icon in Search Bar */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => toggleListening(), 300);
            }}
            className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md hover:shadow-lg transition flex items-center justify-center relative group"
            title="Search with Voice AI (ConfirmTkt Mode)"
          >
            <Mic className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </button>
        </DrawerTrigger>

        {/* ConfirmTkt-Style Voice AI Bottom HUD */}
        <DrawerContent className="max-h-[90vh] bg-neutral-950 text-white border-t border-neutral-800 rounded-t-3xl overflow-hidden flex flex-col">
          {/* Header Bar */}
          <div className="px-5 pt-4 pb-3 border-b border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <DrawerTitle className="text-base font-bold text-white flex items-center gap-2">
                  <span>Voice AI Assistant</span>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-rose-300 border border-neutral-700">
                    Table {tableNumber}
                  </span>
                </DrawerTitle>
                <DrawerDescription className="text-xs text-neutral-400">
                  ConfirmTkt-style real-time parameter filtering & instant order staging
                </DrawerDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-full border transition ${
                  isMuted
                    ? "bg-neutral-800 border-neutral-700 text-neutral-400"
                    : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                }`}
                title={isMuted ? "Unmute Voice Feedback" : "Mute Voice Feedback"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={resetAllFilters}
                className="p-2 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white"
                title="Reset All Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Visualizer & Live Speech Bar */}
          <div className="px-5 py-4 bg-gradient-to-b from-neutral-900 to-neutral-950 flex flex-col items-center">
            {/* Acoustic Waveform Visualizer */}
            <div className="flex items-center justify-center gap-1.5 h-12 w-full my-1">
              {[40, 75, 100, 60, 90, 45, 80, 100, 70, 50, 85, 60].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: isListening ? `${h}%` : "16%",
                    animationDelay: `${i * 70}ms`,
                  }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isListening
                      ? "bg-gradient-to-t from-rose-600 via-rose-400 to-amber-300 shadow-sm shadow-rose-500/50"
                      : "bg-neutral-700"
                  }`}
                />
              ))}
            </div>

            {/* Microphone Toggle Button */}
            <div className="flex items-center gap-3 my-2">
              <button
                onClick={toggleListening}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all shadow-xl ${
                  isListening
                    ? "bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/40 animate-pulse"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                }`}
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
            </div>

            {/* Live Streaming Speech Transcript */}
            <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 text-center min-h-[46px] flex items-center justify-center">
              <p className="text-sm font-medium text-neutral-200">
                {transcript ? (
                  <span>
                    <span className="text-rose-400 font-semibold">&ldquo;</span>
                    {transcript}
                    <span className="text-rose-400 font-semibold">&rdquo;</span>
                  </span>
                ) : isListening ? (
                  <span className="text-neutral-400 italic animate-pulse">
                    Listening to your voice... Speak naturally (e.g. &quot;2 Butter Naan and spicy Biryani&quot;)
                  </span>
                ) : (
                  <span className="text-neutral-500">Tap microphone or select a quick voice query below</span>
                )}
              </p>
            </div>

            {/* AI Speech Voice Reply Toast */}
            {aiSpeechText && (
              <div className="mt-2 text-xs font-semibold text-rose-300 flex items-center gap-1.5 bg-rose-950/40 border border-rose-800/40 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{aiSpeechText}</span>
              </div>
            )}
          </div>

          {/* ConfirmTkt-Style Interactive Parameter Chips */}
          <div className="px-5 py-2.5 bg-neutral-900/60 border-y border-neutral-800 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-rose-400" /> Filters:
            </span>

            {/* Dietary Chip */}
            <button
              onClick={() => {
                const next = dietFilter === "veg" ? "non-veg" : dietFilter === "non-veg" ? "all" : "veg";
                setDietFilter(next);
              }}
              className={`text-xs font-medium px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                dietFilter === "veg"
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/80 shadow-xs shadow-emerald-500/20"
                  : dietFilter === "non-veg"
                  ? "bg-rose-950/80 text-rose-300 border-rose-500/80 shadow-xs shadow-rose-500/20"
                  : "bg-neutral-800/70 text-neutral-400 border-neutral-700 hover:text-white"
              }`}
            >
              {dietFilter === "veg" ? (
                <>
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  <span>Pure Veg</span>
                </>
              ) : dietFilter === "non-veg" ? (
                <>
                  <Drumstick className="w-3 h-3 text-rose-400" />
                  <span>Non-Veg</span>
                </>
              ) : (
                <span>All Diets</span>
              )}
            </button>

            {/* Spice Chip */}
            <button
              onClick={() => {
                const order = ["all", "mild", "medium", "spicy"];
                const next = order[(order.indexOf(spiceFilter) + 1) % order.length];
                setSpiceFilter(next);
              }}
              className={`text-xs font-medium px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                spiceFilter === "spicy"
                  ? "bg-red-950/80 text-red-300 border-red-500 shadow-xs shadow-red-500/20"
                  : spiceFilter === "medium"
                  ? "bg-amber-950/80 text-amber-300 border-amber-500 shadow-xs shadow-amber-500/20"
                  : spiceFilter === "mild"
                  ? "bg-blue-950/80 text-blue-300 border-blue-500"
                  : "bg-neutral-800/70 text-neutral-400 border-neutral-700 hover:text-white"
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>
                {spiceFilter === "all"
                  ? "Any Spice"
                  : spiceFilter === "spicy"
                  ? "🌶️ Extra Spicy"
                  : spiceFilter === "medium"
                  ? "🌶️ Medium Spice"
                  : "😊 Mild / Sweet"}
              </span>
            </button>

            {/* Category Chip */}
            {["Biryani", "Starters", "Mains", "Breads", "Drinks", "Desserts"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                className={`text-xs font-medium px-2.5 py-1 rounded-full border transition ${
                  categoryFilter === cat
                    ? "bg-rose-500 text-white border-rose-400 font-semibold shadow-xs shadow-rose-500/30"
                    : "bg-neutral-800/70 text-neutral-400 border-neutral-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Price Ceiling Chip */}
            {maxPriceFilter && (
              <button
                onClick={() => setMaxPriceFilter(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"
              >
                <span>&lt; ₹{maxPriceFilter}</span>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            )}
          </div>

          {/* Staged Order Action Banner (ConfirmTkt Direct Booking Equivalent) */}
          {stagedItems.length > 0 && (
            <div className="mx-5 my-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/80 to-amber-950/60 border border-rose-500/40 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Staged Voice Order (Table {tableNumber})
                </span>
                <span className="text-xs font-bold text-white font-mono">Total: ₹{stagedTotal}</span>
              </div>

              <div className="space-y-1.5 mb-3">
                {stagedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-neutral-200">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-mono text-neutral-400">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleConfirmStagedOrder}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs h-9 rounded-xl shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Add to Table Bill (₹{stagedTotal})</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStagedItems([])}
                  className="h-9 px-3 border-neutral-700 text-neutral-400 hover:text-white rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Quick Voice Simulation Chips */}
          <div className="px-5 pt-2 pb-1 overflow-x-auto flex items-center gap-2 no-scrollbar">
            <span className="text-[10px] text-neutral-500 font-semibold shrink-0">Try Voice:</span>
            {[
              "2 Butter Naan & Chicken Biryani",
              "Spicy Hyderabadi Biryani under 400",
              "Pure Veg Starters under 300",
              "Call Waiter for Water",
            ].map((query, i) => (
              <button
                key={i}
                onClick={() => simulateVoiceQuery(query)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition"
              >
                &ldquo;{query}&rdquo;
              </button>
            ))}
          </div>

          {/* Live Auto-Filtered Menu Results */}
          <div className="px-5 py-3 overflow-y-auto flex-1 max-h-[360px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-neutral-400">
                Live Matching Dishes ({filteredCatalog.length})
              </span>
              <span className="text-[11px] text-neutral-500">Auto-filtered while speaking</span>
            </div>

            {filteredCatalog.length === 0 ? (
              <div className="py-8 text-center text-neutral-500 text-xs">
                No dishes match this combination. Try clicking &quot;Reset All Filters&quot; or speaking another preference.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredCatalog.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800/90 flex justify-between items-center hover:border-neutral-700 transition"
                  >
                    <div className="pr-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            dish.isVeg ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        <p className="text-xs font-bold text-white line-clamp-1">{dish.name}</p>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">{dish.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-bold text-rose-400 font-mono">₹{dish.price}</span>
                        <span className="text-[10px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
                          {dish.spice === "spicy" ? "🌶️ Spicy" : dish.spice === "medium" ? "🌶️ Medium" : "Mild"}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddSingleDish(dish)}
                      className="bg-neutral-800 hover:bg-rose-600 text-white text-xs h-8 px-3 rounded-xl border border-neutral-700 shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="p-2 text-center text-xs font-semibold bg-emerald-600 text-white animate-fade-in">
              {toastMessage}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
