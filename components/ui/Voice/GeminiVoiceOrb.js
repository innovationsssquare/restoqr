"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  Check,
  UtensilsCrossed,
  BellRing,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Known catalog for instant voice-to-order intent
const FOOD_CATALOG = [
  { id: "1", name: "Hyderabadi Chicken Biryani", category: "Biryani", price: 349, isVeg: false, keywords: ["chicken biryani", "chicken", "biryani", "hyderabadi"] },
  { id: "2", name: "Veg Dum Biryani", category: "Biryani", price: 259, isVeg: true, keywords: ["veg biryani", "biryani", "veg dum", "vegetable biryani"] },
  { id: "3", name: "Paneer Butter Masala", category: "Mains", price: 280, isVeg: true, keywords: ["paneer butter", "paneer masala", "paneer butter masala", "paneer"] },
  { id: "4", name: "Butter Naan", category: "Breads", price: 50, isVeg: true, keywords: ["butter naan", "naan", "roti"] },
  { id: "5", name: "Garlic Naan", category: "Breads", price: 65, isVeg: true, keywords: ["garlic naan", "garlic", "naan"] },
  { id: "6", name: "Paneer Tikka Charcoal", category: "Starters", price: 299, isVeg: true, keywords: ["paneer tikka", "paneer starter", "tikka"] },
  { id: "7", name: "Tandoori Chicken (Half)", category: "Starters", price: 330, isVeg: false, keywords: ["tandoori chicken", "tandoori"] },
  { id: "8", name: "Dal Makhani Grand", category: "Mains", price: 240, isVeg: true, keywords: ["dal makhani", "dal"] },
  { id: "9", name: "Fresh Lime Soda", category: "Drinks", price: 60, isVeg: true, keywords: ["lime soda", "soda", "cold drink"] },
  { id: "10", name: "Sweet Punjabi Lassi", category: "Drinks", price: 75, isVeg: true, keywords: ["sweet lassi", "lassi"] },
  { id: "11", name: "Gulab Jamun (2 Pcs)", category: "Desserts", price: 80, isVeg: true, keywords: ["gulab jamun", "jamun", "sweet", "dessert"] },
];

const NUM_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  "1": 1, "2": 2, "3": 3, "4": 4, "5": 5,
  double: 2, single: 1, half: 1, full: 2, plate: 1,
};

export default function GeminiVoiceOrb({
  externalOpen,
  onExternalClose,
  showSearchTrigger = false,
  showFloatingButton = false,
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [orbState, setOrbState] = useState("idle"); // "idle" | "listening" | "thinking" | "speaking"
  const [transcript, setTranscript] = useState("");
  const [geminiSpeech, setGeminiSpeech] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [tableNumber, setTableNumber] = useState("A1");
  const [stagedItems, setStagedItems] = useState([]);
  const [toastAlert, setToastAlert] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("restoqr_table");
      if (stored) setTableNumber(stored);
    }
  }, []);

  useEffect(() => {
    if (externalOpen !== undefined) {
      setIsOpen(externalOpen);
      if (externalOpen) {
        startListening();
        speakVoice(`Table ${tableNumber} Voice Assistant ready. What would you like to order?`);
      }
    }
  }, [externalOpen, tableNumber]);

  useEffect(() => {
    const handleGlobalVoiceOpen = () => {
      setIsOpen(true);
      startListening();
      speakVoice(`Table ${tableNumber} Voice Assistant ready. What would you like to order?`);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("open-gemini-voice", handleGlobalVoiceOpen);
      return () => window.removeEventListener("open-gemini-voice", handleGlobalVoiceOpen);
    }
  }, [tableNumber]);

  // Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = "en-IN";

        reco.onresult = (event) => {
          let liveText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            liveText += event.results[i][0].transcript;
          }
          if (liveText) {
            setTranscript(liveText);
            setOrbState("listening");
            parseVoiceEntities(liveText);
          }
        };

        reco.onerror = () => {
          setOrbState("idle");
        };

        reco.onend = () => {
          if (isOpen && orbState === "listening") {
            setOrbState("idle");
          }
        };

        recognitionRef.current = reco;
      }
    }
  }, [isOpen]);

  const speakVoice = (text) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setOrbState("speaking");
      utterance.onend = () => setOrbState("idle");
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const startListening = () => {
    setTranscript("");
    setOrbState("listening");
    try {
      recognitionRef.current?.start();
    } catch (e) {
      // Fallback
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setOrbState("idle");
  };

  const handleOpenOrb = () => {
    setIsOpen(true);
    setStagedItems([]);
    setTranscript("");
    setGeminiSpeech("I'm listening. Ask for any dish, pure veg options, or say what to order!");
    setTimeout(() => startListening(), 400);
  };

  const handleCloseOrb = () => {
    stopListening();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsOpen(false);
    if (onExternalClose) onExternalClose();
  };

  // Voice NLP Parser
  const parseVoiceEntities = (raw) => {
    if (!raw || !raw.trim()) return;
    const lower = raw.toLowerCase();

    // 1. Dietary filter detection
    let diet = "all";
    if (lower.includes("pure veg") || lower.includes("only veg") || lower.includes("vegetarian") || (lower.includes("veg") && !lower.includes("non"))) {
      diet = "veg";
    } else if (lower.includes("non veg") || lower.includes("non-veg") || lower.includes("chicken") || lower.includes("mutton")) {
      diet = "non-veg";
    }

    // 2. Spice filter detection
    let spice = "all";
    if (lower.includes("spicy") || lower.includes("teekha") || lower.includes("hot") || lower.includes("extra spicy")) {
      spice = "spicy";
    } else if (lower.includes("mild") || lower.includes("sweet") || lower.includes("less spicy")) {
      spice = "mild";
    }

    // 3. Category detection
    let category = "all";
    if (lower.includes("biryani") || lower.includes("rice")) category = "Biryani";
    else if (lower.includes("starter") || lower.includes("tikka") || lower.includes("tandoori")) category = "Starters";
    else if (lower.includes("curry") || lower.includes("mains") || lower.includes("dal") || lower.includes("paneer butter")) category = "Mains";
    else if (lower.includes("bread") || lower.includes("naan") || lower.includes("roti")) category = "Breads";
    else if (lower.includes("drink") || lower.includes("soda") || lower.includes("lassi") || lower.includes("chai")) category = "Drinks";
    else if (lower.includes("dessert") || lower.includes("sweet") || lower.includes("jamun")) category = "Desserts";

    // Broadcast filter change to the Swiggy/Zomato menu in background!
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("restoqr_filter_change", {
          detail: { diet, spice, category, search: raw },
        })
      );
    }

    // 4. Dish & quantity extraction for instant ordering
    const matchedItems = [];
    FOOD_CATALOG.forEach((dish) => {
      let matched = false;
      dish.keywords.forEach((kw) => {
        if (lower.includes(kw)) matched = true;
      });

      if (matched) {
        let qty = 1;
        const dishIndex = lower.indexOf(dish.name.toLowerCase());
        const slice = lower.slice(Math.max(0, dishIndex - 12), dishIndex);
        for (const [w, val] of Object.entries(NUM_WORDS)) {
          if (slice.includes(w)) {
            qty = val;
            break;
          }
        }
        matchedItems.push({
          id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: qty,
          isVeg: dish.isVeg,
        });
      }
    });

    // 5. Special actions
    if (lower.includes("water") || lower.includes("waiter")) {
      handleCallWaiter();
      return;
    }

    if (lower.includes("bill") || lower.includes("check bill") || lower.includes("payment")) {
      speakVoice("Opening active table bill");
      router.push("/Order-status");
      handleCloseOrb();
      return;
    }

    if ((lower.includes("confirm") || lower.includes("yes") || lower.includes("haan") || lower.includes("order karo")) && stagedItems.length > 0) {
      handleConfirmAdd();
      return;
    }

    if (matchedItems.length > 0) {
      setStagedItems(matchedItems);
      const summary = matchedItems.map((i) => `${i.quantity}x ${i.name}`).join(", ");
      setGeminiSpeech(`Staged ${summary}. Tap below or say "Confirm" to add to Table ${tableNumber}!`);
      speakVoice(`Staged ${summary}. Speak Confirm or tap below.`);
    } else if (diet !== "all" || category !== "all") {
      setGeminiSpeech(`Filtered menu on screen for ${diet !== "all" ? diet : ""} ${category !== "all" ? category : ""}.`);
    }
  };

  const handleCallWaiter = async () => {
    try {
      await fetch("http://localhost:8081/api/v1/service/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber,
          requestType: "Water",
          notes: "Voice request via Gemini Orb",
        }),
      });
      setGeminiSpeech(`Waiter alerted to bring drinking water to Table ${tableNumber}.`);
      speakVoice(`Waiter alerted to bring drinking water to Table ${tableNumber}.`);
    } catch (e) {
      setGeminiSpeech(`Waiter alerted for Table ${tableNumber}.`);
    }
  };

  const handleConfirmAdd = () => {
    if (stagedItems.length === 0) return;
    try {
      const cart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      stagedItems.forEach((item) => {
        cart.push({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: "Added via Gemini Voice Orb",
        });
      });
      localStorage.setItem("restoqr_cart", JSON.stringify(cart));
      setToastAlert(`✓ Added to Table ${tableNumber} Bill!`);
      speakVoice(`Added to Table ${tableNumber} bill!`);
      setTimeout(() => {
        setToastAlert("");
        handleCloseOrb();
      }, 1500);
    } catch (e) {}
  };

  const simulateSpeech = (text) => {
    setTranscript(text);
    setOrbState("listening");
    parseVoiceEntities(text);
  };

  const stagedTotal = stagedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <>
      {/* Sleek Minimal Trigger Button: Glowing Orb Ring (Optional) */}
      {showSearchTrigger && (
        <button
          onClick={handleOpenOrb}
          className="relative group p-2.5 rounded-xl bg-[#F04F5F] hover:bg-[#D6293C] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center shrink-0"
          title="Open Gemini Voice AI"
        >
          <div className="relative flex items-center gap-1.5 z-10">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span className="text-xs font-bold tracking-wide hidden sm:inline">Voice AI</span>
          </div>
        </button>
      )}

      {/* Floating Action Button (Optional) */}
      {showFloatingButton && (
        <div className="fixed bottom-20 right-4 z-40">
          <button
            onClick={handleOpenOrb}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-neutral-900 border border-neutral-700/80 shadow-2xl hover:scale-110 active:scale-95 transition-all group overflow-hidden"
            title="Speak to Gemini AI"
          >
            {/* Internal rotating fluid chromatic orb preview */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-600 to-rose-500 opacity-90 blur-xs group-hover:scale-110 transition animate-spin-slow" />
            <div className="relative z-10 w-9 h-9 rounded-full bg-neutral-950/80 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
          </button>
        </div>
      )}

      {/* Fullscreen Immersive Gemini / ChatGPT Voice Orb Experience */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-neutral-950/90 backdrop-blur-2xl text-white animate-fade-in p-6 select-none">
          {/* Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">
                Gemini Live Voice • Table {tableNumber}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCloseOrb}
                className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Stage: The Hypnotic Gemini / ChatGPT Glowing Fluid Animated Orb */}
          <div className="flex flex-col items-center justify-center my-auto">
            {/* Morphing Glowing Circle Orb */}
            <div
              onClick={orbState === "listening" ? stopListening : startListening}
              className="relative cursor-pointer flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64 my-6 group"
            >
              {/* Outer Chromatic Ripples */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-violet-600 to-rose-500 opacity-60 blur-2xl transition-all duration-700 ${
                  orbState === "listening"
                    ? "scale-125 animate-pulse opacity-90"
                    : orbState === "speaking"
                    ? "scale-115 opacity-80"
                    : "scale-100 opacity-40"
                }`}
              />

              {/* Concentric Rotating Gradient Ring */}
              <div
                className={`absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-pink-500 opacity-90 blur-md transition-all duration-500 ${
                  orbState === "listening" ? "animate-spin-slow scale-105" : "animate-spin-slower"
                }`}
              />

              {/* Core Fluid Orb Surface */}
              <div
                className={`relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-rose-500 shadow-2xl flex items-center justify-center transition-all duration-300 ${
                  orbState === "listening"
                    ? "scale-105 shadow-cyan-500/50"
                    : "scale-100 shadow-purple-500/30"
                }`}
                style={{
                  boxShadow:
                    orbState === "listening"
                      ? "0 0 60px rgba(6, 182, 212, 0.6), 0 0 100px rgba(168, 85, 247, 0.4)"
                      : "0 0 40px rgba(147, 51, 234, 0.4)",
                }}
              >
                {/* Internal Fluid Core */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-neutral-950/70 backdrop-blur-md flex flex-col items-center justify-center text-center p-3">
                  <Sparkles
                    className={`w-8 h-8 text-cyan-300 transition-all ${
                      orbState === "listening"
                        ? "animate-spin scale-125 text-amber-300"
                        : "opacity-80"
                    }`}
                  />
                  <span className="text-[11px] font-bold text-neutral-300 tracking-wider uppercase mt-2">
                    {orbState === "listening"
                      ? "Listening..."
                      : orbState === "speaking"
                      ? "Speaking..."
                      : "Tap to Speak"}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Streaming Speech Transcript */}
            <div className="w-full max-w-md text-center px-4">
              {transcript ? (
                <p className="text-base sm:text-lg font-medium text-white tracking-wide animate-fade-in">
                  &ldquo;{transcript}&rdquo;
                </p>
              ) : (
                <p className="text-sm text-neutral-400 italic">
                  Say &quot;Add 2 Butter Naan and Chicken Biryani&quot; or &quot;Show pure veg starters&quot;
                </p>
              )}

              {/* Gemini Voice Reply Bubble */}
              {geminiSpeech && (
                <div className="mt-3 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium text-cyan-200 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{geminiSpeech}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Card: Staged Order Action (Direct Add to Table Bill) */}
          <div className="w-full max-w-md mx-auto space-y-3">
            {stagedItems.length > 0 && (
              <div className="p-4 rounded-3xl bg-neutral-900/90 border border-neutral-700/80 shadow-2xl backdrop-blur-xl animate-slide-up">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Staged for Table {tableNumber}
                  </span>
                  <span className="text-sm font-black text-white font-mono">₹{stagedTotal}</span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {stagedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-neutral-200">
                      <span className="font-semibold">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-mono text-neutral-400">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmAdd}
                    className="flex-1 py-3 px-4 rounded-2xl bg-[#F04F5F] hover:bg-[#D6293C] text-white font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Add to Table Bill (₹{stagedTotal})</span>
                  </button>
                  <button
                    onClick={() => setStagedItems([])}
                    className="p-3 rounded-2xl bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Voice Simulation Prompts */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-center">
              {[
                "2 Butter Naan & Chicken Biryani",
                "Pure Veg Starters",
                "Spicy Hyderabadi Biryani",
                "Call Waiter for Water",
              ].map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => simulateSpeech(phrase)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition"
                >
                  &ldquo;{phrase}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Toast */}
          {toastAlert && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#F04F5F] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-2xl animate-bounce">
              {toastAlert}
            </div>
          )}
        </div>
      )}
    </>
  );
}

