"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  Sparkles,
  BellRing,
  UtensilsCrossed,
  Check,
  ChevronDown,
  X,
  Clock,
  ArrowRight,
  Users,
  CheckCircle2,
  SlidersHorizontal,
  Mic,
  MapPin,
  Home as HomeIcon,
  Flame,
  RotateCcw,
  ChefHat,
  Tag,
} from "lucide-react";
import GeminiVoiceOrb from "../Voice/GeminiVoiceOrb";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

// Local image fallbacks
import BiryaniImg from "@/public/Asset/Biryani2.png";
import FriesImg from "@/public/Asset/Fries.png";
import TeaImg from "@/public/Asset/MasalaTea.png";
import PizzaImg from "@/public/Asset/Pizza.png";
import BurgerImg from "@/public/Asset/Burger.png";

const getApiBase = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8081/api/v1`;
  }
  return "http://localhost:8081/api/v1";
};
const API_BASE = getApiBase();

// High-resolution culinary default catalog with Half/Full portions and spice levels
const DEFAULT_CATALOG = [
  {
    id: "1",
    name: "Hyderabadi Chicken Dum Biryani",
    category: "Biryani",
    price: 349,
    hasHalfFull: true,
    halfPrice: 199,
    fullPrice: 349,
    spiceLevel: "Medium",
    rating: 4.8,
    prepTime: "15-20 mins",
    isVeg: false,
    offerBadge: "30% OFF up to ₹75",
    isTodaySpecial: true,
    isNewDish: false,
    description: "Tender chicken dum-cooked with aged basmati, saffron, caramelised onions & royal spices.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
    fallback: BiryaniImg,
  },
  {
    id: "2",
    name: "Krishna Pure Veg Handi Biryani",
    category: "Biryani",
    price: 259,
    hasHalfFull: true,
    halfPrice: 159,
    fullPrice: 259,
    spiceLevel: "Mild",
    rating: 4.6,
    prepTime: "15 mins",
    isVeg: true,
    offerBadge: "Items starting at ₹99",
    isTodaySpecial: false,
    isNewDish: true,
    description: "Garden fresh carrots, beans, florets & soft paneer cubes dum-cooked with fragrant basmati.",
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=500&auto=format&fit=crop&q=80",
    fallback: BiryaniImg,
  },
  {
    id: "3",
    name: "The Pizzeria Smoked Woodfire",
    category: "Starters",
    price: 299,
    hasHalfFull: false,
    halfPrice: 0,
    fullPrice: 299,
    spiceLevel: "Mild",
    rating: 4.5,
    prepTime: "15 mins",
    isVeg: true,
    offerBadge: "Buy 1 Get 1 FREE",
    isTodaySpecial: false,
    isNewDish: false,
    description: "Hand-stretched sourdough pizza topped with San Marzano tomatoes, fresh mozzarella & basil.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
    fallback: PizzaImg,
  },
  {
    id: "4",
    name: "Biryani 1 Kilo Special Feast",
    category: "Biryani",
    price: 499,
    hasHalfFull: true,
    halfPrice: 299,
    fullPrice: 499,
    spiceLevel: "Spicy",
    rating: 4.7,
    prepTime: "20 mins",
    isVeg: false,
    offerBadge: "Chef Special",
    isTodaySpecial: true,
    isNewDish: false,
    description: "Royal jumbo handi portion of fragrant dum biryani packed with succulent meat cuts.",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80",
    fallback: BiryaniImg,
  },
  {
    id: "5",
    name: "Paneer Tikka Charcoal Skewer",
    category: "Starters",
    price: 299,
    hasHalfFull: true,
    halfPrice: 179,
    fullPrice: 299,
    spiceLevel: "Medium",
    rating: 4.7,
    prepTime: "12 mins",
    isVeg: true,
    offerBadge: "60% OFF up to ₹120",
    isTodaySpecial: true,
    isNewDish: false,
    description: "Thick cubes of fresh malai paneer marinated in Kashmiri chili hung curd, roasted in clay tandoor.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80",
    fallback: FriesImg,
  },
  {
    id: "6",
    name: "Tandoori Chicken (Charcoal Roast)",
    category: "Starters",
    price: 330,
    hasHalfFull: true,
    halfPrice: 190,
    fullPrice: 330,
    spiceLevel: "Spicy",
    rating: 4.9,
    prepTime: "15 mins",
    isVeg: false,
    offerBadge: "Chef Special",
    isTodaySpecial: false,
    isNewDish: true,
    description: "Classic Amritsari whole spring chicken roasted on glowing charcoal, basted with butter.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80",
    fallback: PizzaImg,
  },
  {
    id: "7",
    name: "Paneer Butter Masala (Signature)",
    category: "Curries",
    price: 280,
    hasHalfFull: true,
    halfPrice: 160,
    fullPrice: 280,
    spiceLevel: "Mild",
    rating: 4.8,
    prepTime: "12 mins",
    isVeg: true,
    offerBadge: "30% OFF up to ₹75",
    isTodaySpecial: true,
    isNewDish: false,
    description: "Cottage cheese simmered in velvety ripe tomato-cashew gravy with a rich swirl of churned butter.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80",
    fallback: BurgerImg,
  },
  {
    id: "8",
    name: "Classic Paneer Kathi Roll",
    category: "Rolls",
    price: 180,
    hasHalfFull: true,
    halfPrice: 110,
    fullPrice: 180,
    spiceLevel: "Medium",
    rating: 4.5,
    prepTime: "10 mins",
    isVeg: true,
    offerBadge: "Items starting at ₹99",
    isTodaySpecial: false,
    isNewDish: true,
    description: "Crispy flaky paratha wrapped with spiced cottage cheese cubes, pickled onions & mint relish.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
    fallback: FriesImg,
  },
  {
    id: "9",
    name: "Smoked Chicken Kathi Roll",
    category: "Rolls",
    price: 210,
    hasHalfFull: true,
    halfPrice: 130,
    fullPrice: 210,
    spiceLevel: "Medium",
    rating: 4.7,
    prepTime: "10 mins",
    isVeg: false,
    offerBadge: "30% OFF up to ₹75",
    isTodaySpecial: false,
    isNewDish: false,
    description: "Tandoori chicken tikka chunks rolled inside a golden egg paratha with fresh mint chutney.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
    fallback: BurgerImg,
  },
  {
    id: "10",
    name: "Butter Naan (2 Pcs)",
    category: "Breads",
    price: 60,
    hasHalfFull: false,
    halfPrice: 0,
    fullPrice: 60,
    spiceLevel: "Mild",
    rating: 4.8,
    prepTime: "5 mins",
    isVeg: true,
    offerBadge: "Fresh from Tandoor",
    isTodaySpecial: false,
    isNewDish: false,
    description: "Soft, pillowy leavened flatbread baked fresh on clay tandoor walls, brushed with farm butter.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
    fallback: FriesImg,
  },
  {
    id: "11",
    name: "Sweet Punjabi Lassi Handi",
    category: "Drinks",
    price: 75,
    hasHalfFull: false,
    halfPrice: 0,
    fullPrice: 75,
    spiceLevel: "Mild",
    rating: 4.6,
    prepTime: "5 mins",
    isVeg: true,
    offerBadge: "Chilled",
    isTodaySpecial: false,
    isNewDish: false,
    description: "Hand-churned thick curd beverage sweetened with rose water, cardamom & almond slivers.",
    image: "https://images.unsplash.com/photo-1571006682855-3dc3206256c7?w=500&auto=format&fit=crop&q=80",
    fallback: TeaImg,
  },
  {
    id: "12",
    name: "Hot Gulab Jamun with Rabri (2 Pcs)",
    category: "Desserts",
    price: 90,
    hasHalfFull: false,
    halfPrice: 0,
    fullPrice: 90,
    spiceLevel: "Mild",
    rating: 4.9,
    prepTime: "5 mins",
    isVeg: true,
    offerBadge: "Sweet Special",
    isTodaySpecial: true,
    isNewDish: false,
    description: "Golden fried khoya dumplings served piping hot in cardamom rose syrup with chilled rabri.",
    image: "https://images.unsplash.com/photo-1605197143431-155df9b772c5?w=500&auto=format&fit=crop&q=80",
    fallback: BiryaniImg,
  },
];

const DEFAULT_CATEGORY_TABS = [
  { name: "All", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80" },
  { name: "Rolls", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop&q=80" },
  { name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80" },
  { name: "Starters", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&auto=format&fit=crop&q=80" },
  { name: "Curries", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&auto=format&fit=crop&q=80" },
  { name: "Breads", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop&q=80" },
  { name: "Drinks", image: "https://images.unsplash.com/photo-1571006682855-3dc3206256c7?w=200&auto=format&fit=crop&q=80" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1605197143431-155df9b772c5?w=200&auto=format&fit=crop&q=80" },
];

// Rich culinary photography background slides for the dynamic banner
const CULINARY_BANNER_SLIDES = [
  {
    badge: "⭐ TODAY'S SPECIAL",
    title: "Hyderabadi Dum Handi Biryani",
    subtitle: "Slow-dum cooked in pure desi ghee with royal saffron & aged basmati",
    price: 349,
    bgImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=85",
    dishIndex: 0,
  },
  {
    badge: "🔥 CHEF'S CHARCOAL SENSATION",
    title: "Paneer Tikka Charcoal Skewer",
    subtitle: "Clay tandoor roasted malai cottage cheese with bell peppers & Kashmiri glaze",
    price: 299,
    bgImage: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&auto=format&fit=crop&q=85",
    dishIndex: 4,
  },
  {
    badge: "✨ ARTISAN WOODFIRE PIZZA",
    title: "The Pizzeria Smoked Woodfire",
    subtitle: "Hand-stretched sourdough with San Marzano sauce & fresh buffalo mozzarella",
    price: 299,
    bgImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=85",
    dishIndex: 2,
  },
];

// Quick chef instruction suggestions
const QUICK_INSTRUCTION_TAGS = [
  "🌶️ Less Spicy",
  "🔥 Extra Spicy",
  "🍃 Less Oil / Ghee",
  "🧅 No Onion / Garlic",
  "✨ Extra Crispy",
  "🍋 Extra Lemon & Mint",
  "🧀 Extra Cheese",
];

export default function ZomatoSwiggyMenu({ initialTable = "" } = {}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tableNumber, setTableNumber] = useState(initialTable ? initialTable.toUpperCase() : "A1");
  const [section, setSection] = useState("Indoor AC");
  const [guestCount, setGuestCount] = useState(2);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Dynamic dishes & categories managed from Dashboard
  const [dishesList, setDishesList] = useState(DEFAULT_CATALOG);
  const [categoryTabs, setCategoryTabs] = useState(DEFAULT_CATEGORY_TABS);

  // Dynamic Offer from Admin
  const [activeOffer, setActiveOffer] = useState({
    isActive: false,
    title: "",
    subtitle: "",
    discountTag: "",
    couponCode: "",
  });

  // Carousel & Banner State
  const [bannerApi, setBannerApi] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter Drawer & Quick Filters
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [dietFilter, setDietFilter] = useState("all"); // "all" | "veg" | "non-veg"
  const [priceRange, setPriceRange] = useState("all"); // "all" | "under150" | "under250" | "under400" | "above400"
  const [spiceFilter, setSpiceFilter] = useState("all"); // "all" | "mild" | "medium" | "spicy"
  const [prepFilter, setPrepFilter] = useState("all"); // "all" | "fast"
  const [curationFilter, setCurationFilter] = useState("all"); // "all" | "special" | "new" | "offer"
  const [sortBy, setSortBy] = useState("recommended"); // "recommended" | "rating" | "price-asc" | "price-desc"

  const [isVegOnly, setIsVegOnly] = useState(false);
  const [under250Only, setUnder250Only] = useState(false);
  const [fastPrepOnly, setFastPrepOnly] = useState(false);

  // Dish Details & Portion Drawer State
  const [selectedDishForDetails, setSelectedDishForDetails] = useState(null);
  const [selectedPortion, setSelectedPortion] = useState("Full"); // "Half" | "Full"
  const [specialInstruction, setSpecialInstruction] = useState("");
  const [detailQuantity, setDetailQuantity] = useState(1);

  // Cart Quantities & Toast
  const [cartQuantities, setCartQuantities] = useState({});
  const [toastText, setToastText] = useState("");

  // Fetch backend data & verify table session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTable = urlParams.get("table");
      const stored = localStorage.getItem("restoqr_table") || "A1";
      const targetTable = (initialTable || urlTable || stored).toUpperCase();

      setTableNumber(targetTable);
      localStorage.setItem("restoqr_table", targetTable);

      const storedGuests = localStorage.getItem(`restoqr_guests_${targetTable}`);
      if (storedGuests) {
        setGuestCount(Number(storedGuests));
        verifyTableWithBackend(targetTable, Number(storedGuests));
      } else {
        setShowGuestModal(true);
      }

      // Check for active ongoing order
      const ongoing = localStorage.getItem("restoqr_active_order");
      if (ongoing) {
        try {
          const parsed = JSON.parse(ongoing);
          if (parsed && parsed.status !== "Completed") {
            setActiveOrder(parsed);
          }
        } catch (e) {}
      }

      // Load initial cart
      refreshCartFromStorage();
    }

    // Fetch dynamic dishes from backend with half/full & spice mapping
    fetch(`${API_BASE}/menu/getAll`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data?.length > 0) {
          const mapped = data.data.map((item, idx) => ({
            id: item._id || `m_${idx}`,
            name: item.menuName,
            category: item.category?.name || "Mains",
            price: item.price,
            hasHalfFull: Boolean(item.hasHalfFull),
            halfPrice: item.halfPrice || Math.round(item.price * 0.6),
            fullPrice: item.fullPrice || item.price,
            spiceLevel: item.spiceLevel || "Medium",
            rating: item.rating || 4.6,
            prepTime: item.prepTime || "15 mins",
            isVeg: item.foodTags === "Veg",
            offerBadge: item.offerBadge || "",
            isTodaySpecial: Boolean(item.isTodaySpecial),
            isNewDish: Boolean(item.isNewDish),
            description: item.description || "Freshly cooked to table order.",
            image: item.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
          }));
          setDishesList(mapped);
        }
      })
      .catch(() => {});

    // Fetch dynamic categories from backend
    fetch(`${API_BASE}/category/getAll`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data?.length > 0) {
          const tabs = [{ name: "All", image: DEFAULT_CATEGORY_TABS[0].image }];
          data.data.forEach((c) => {
            const foundDef = DEFAULT_CATEGORY_TABS.find((dt) => dt.name.toLowerCase() === c.name.toLowerCase());
            tabs.push({
              name: c.name,
              image: c.image || foundDef?.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80",
            });
          });
          setCategoryTabs(tabs);
        }
      })
      .catch(() => {});

    // Fetch active restaurant promotional offer
    fetch(`${API_BASE}/restaurant/active-offer`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          setActiveOffer(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const refreshCartFromStorage = () => {
    if (typeof window === "undefined") return;
    const currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
    const qMap = {};
    currentCart.forEach((item) => {
      // Look up dish by originalId or name
      const found = dishesList.find(
        (d) =>
          d.id === item.originalId ||
          d.name.toLowerCase() === item.name.toLowerCase() ||
          item.name.toLowerCase().startsWith(d.name.toLowerCase())
      );
      if (found) {
        qMap[found.id] = (qMap[found.id] || 0) + (item.quantity || 1);
      }
    });
    setCartQuantities(qMap);
  };

  // Auto-advance banner slides via shadcn carousel API
  useEffect(() => {
    if (!bannerApi) return;
    const onSelect = () => {
      setCurrentSlide(bannerApi.selectedScrollSnap());
    };
    bannerApi.on("select", onSelect);
    const interval = setInterval(() => {
      bannerApi.scrollNext();
    }, 4500);
    return () => {
      clearInterval(interval);
      bannerApi.off("select", onSelect);
    };
  }, [bannerApi]);

  // Backend Table Verification
  const verifyTableWithBackend = async (tbl, guests) => {
    try {
      const res = await fetch(`${API_BASE}/table/scan-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber: tbl, guests: guests || 2 }),
      });
      const data = await res.json();
      if (data.status && data.data) {
        setSection(data.data.section || "Indoor AC");
      }
    } catch (e) {}
  };

  const handleConfirmGuests = (count) => {
    setGuestCount(count);
    setShowGuestModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(`restoqr_guests_${tableNumber}`, count.toString());
    }
    verifyTableWithBackend(tableNumber, count);
    setToastText(`✓ Table ${tableNumber} checked in for ${count} Guests!`);
    setTimeout(() => setToastText(""), 2500);
  };

  // Open Dish Details & Portion Drawer
  const handleOpenDishDetails = (dish) => {
    setSelectedDishForDetails(dish);
    setSelectedPortion(dish.hasHalfFull ? "Full" : "Regular");
    setSpecialInstruction("");
    setDetailQuantity(1);
  };

  // Add Item to Cart from Dish Details Drawer
  const handleConfirmAddFromDetails = () => {
    if (!selectedDishForDetails) return;
    const dish = selectedDishForDetails;
    const isHalf = dish.hasHalfFull && selectedPortion === "Half";
    const portionPrice = dish.hasHalfFull ? (isHalf ? dish.halfPrice : dish.fullPrice) : dish.price;
    const portionLabel = dish.hasHalfFull ? (isHalf ? "Half" : "Full") : "";
    const cartItemName = portionLabel ? `${dish.name} (${portionLabel})` : dish.name;

    if (typeof window !== "undefined") {
      const currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      const existingIdx = currentCart.findIndex(
        (it) => it.name === cartItemName && (it.notes || "") === (specialInstruction.trim() || "Table Dine-in")
      );

      if (existingIdx > -1) {
        currentCart[existingIdx].quantity += detailQuantity;
      } else {
        currentCart.push({
          name: cartItemName,
          price: portionPrice,
          quantity: detailQuantity,
          notes: specialInstruction.trim() || "Table Dine-in",
          originalId: dish.id,
          portion: portionLabel,
        });
      }
      localStorage.setItem("restoqr_cart", JSON.stringify(currentCart));
    }

    setCartQuantities((prev) => ({
      ...prev,
      [dish.id]: (prev[dish.id] || 0) + detailQuantity,
    }));

    setToastText(`✓ Added ${detailQuantity}x ${cartItemName}`);
    setTimeout(() => setToastText(""), 2000);
    setSelectedDishForDetails(null);
  };

  // Direct Quick Add / Remove for dishes without portion requirement
  const handleQuickAdd = (dish, delta) => {
    // If dish requires half/full choice, prompt via drawer
    if (dish.hasHalfFull && delta > 0) {
      handleOpenDishDetails(dish);
      return;
    }

    const current = cartQuantities[dish.id] || 0;
    const next = Math.max(0, current + delta);
    const updated = { ...cartQuantities, [dish.id]: next };
    if (next === 0) delete updated[dish.id];
    setCartQuantities(updated);

    if (typeof window !== "undefined") {
      let currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      const foundIdx = currentCart.findIndex(
        (it) => it.originalId === dish.id || it.name.toLowerCase() === dish.name.toLowerCase()
      );

      if (delta > 0) {
        if (foundIdx > -1) {
          currentCart[foundIdx].quantity += delta;
        } else {
          currentCart.push({
            name: dish.name,
            price: dish.price,
            quantity: 1,
            notes: "Table Dine-in",
            originalId: dish.id,
          });
        }
      } else if (delta < 0 && foundIdx > -1) {
        if (currentCart[foundIdx].quantity > 1) {
          currentCart[foundIdx].quantity -= 1;
        } else {
          currentCart.splice(foundIdx, 1);
        }
      }
      localStorage.setItem("restoqr_cart", JSON.stringify(currentCart));
    }

    if (delta > 0) {
      setToastText(`✓ Added ${dish.name}`);
      setTimeout(() => setToastText(""), 1200);
    }
  };

  const handleTriggerVoiceAI = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-gemini-voice"));
    }
  };

  const handleCallWaiter = async () => {
    try {
      await fetch(`${API_BASE}/service/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber,
          requestType: "General",
          notes: `Guest called waiter for Table ${tableNumber} (${guestCount} guests)`,
        }),
      });
      setWaiterCalled(true);
      setToastText(`✓ Waiter alerted for Table ${tableNumber}`);
      setTimeout(() => {
        setWaiterCalled(false);
        setToastText("");
      }, 3000);
    } catch (e) {
      setWaiterCalled(true);
      setTimeout(() => setWaiterCalled(false), 3000);
    }
  };

  // Filter Dishes Dynamically
  const filteredDishes = useMemo(() => {
    let result = dishesList.filter((dish) => {
      // Category filter
      if (selectedCategory !== "All" && dish.category !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if ((dietFilter === "veg" || isVegOnly) && !dish.isVeg) return false;
      if (dietFilter === "non-veg" && dish.isVeg) return false;

      // Price filter (based on lowest portion or standard price)
      const effectivePrice = dish.hasHalfFull && dish.halfPrice ? dish.halfPrice : dish.price;
      if ((under250Only || priceRange === "under250") && effectivePrice > 250) return false;
      if (priceRange === "under150" && effectivePrice > 150) return false;
      if (priceRange === "under400" && effectivePrice > 400) return false;
      if (priceRange === "above400" && effectivePrice <= 400) return false;

      // Spice level filter
      if (spiceFilter !== "all" && dish.spiceLevel?.toLowerCase() !== spiceFilter.toLowerCase()) {
        return false;
      }

      // Prep speed
      const isFast =
        dish.prepTime?.includes("5") ||
        dish.prepTime?.includes("10") ||
        dish.prepTime?.includes("12");
      if ((fastPrepOnly || prepFilter === "fast") && !isFast) {
        return false;
      }

      // Curation tags
      if (curationFilter === "special" && !dish.isTodaySpecial) return false;
      if (curationFilter === "new" && !dish.isNewDish) return false;
      if (curationFilter === "offer" && !dish.offerBadge) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !dish.name.toLowerCase().includes(q) &&
          !dish.description?.toLowerCase().includes(q) &&
          !dish.category?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    // Sort order
    if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    dishesList,
    selectedCategory,
    dietFilter,
    isVegOnly,
    priceRange,
    under250Only,
    spiceFilter,
    prepFilter,
    fastPrepOnly,
    curationFilter,
    searchQuery,
    sortBy,
  ]);

  // Active filter count indicator
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (dietFilter !== "all" || isVegOnly) count++;
    if (priceRange !== "all" || under250Only) count++;
    if (spiceFilter !== "all") count++;
    if (prepFilter !== "all" || fastPrepOnly) count++;
    if (curationFilter !== "all") count++;
    if (sortBy !== "recommended") count++;
    return count;
  }, [dietFilter, isVegOnly, priceRange, under250Only, spiceFilter, prepFilter, fastPrepOnly, curationFilter, sortBy]);

  const handleResetAllFilters = () => {
    setDietFilter("all");
    setIsVegOnly(false);
    setPriceRange("all");
    setUnder250Only(false);
    setSpiceFilter("all");
    setPrepFilter("all");
    setFastPrepOnly(false);
    setCurationFilter("all");
    setSortBy("recommended");
    setSearchQuery("");
  };

  // Cart Totals
  const totalCartCount = useMemo(() => {
    if (typeof window === "undefined") return 0;
    try {
      const currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      return currentCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } catch (e) {
      return 0;
    }
  }, [cartQuantities, toastText]);

  const totalCartPrice = useMemo(() => {
    if (typeof window === "undefined") return 0;
    try {
      const currentCart = JSON.parse(localStorage.getItem("restoqr_cart") || "[]");
      return currentCart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    } catch (e) {
      return 0;
    }
  }, [cartQuantities, toastText]);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#1C1C1C] font-sans pb-36">
      {/* Responsive Floating Toast Alert (Light Mode) */}
      {toastText && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] bg-white/95 backdrop-blur-md border border-gray-200 text-gray-900 text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F04F5F] shrink-0" />
          <span className="truncate">{toastText}</span>
        </div>
      )}

      {/* 1. UPPER HEADER (STRICTLY #F04F5F THEME - NO TA1 & NO DINE-IN TAG) */}
      <header className="bg-[#F04F5F] text-white px-4 pt-3 pb-3.5 relative overflow-hidden shadow-xs">
        {/* Subtle background ambient pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Location / Table Indicator Row */}
        <div className="relative z-10 flex justify-between items-center mb-3">
          {/* Table / Location Selector */}
          <div
            onClick={() => setShowGuestModal(true)}
            className="cursor-pointer group flex items-start gap-1.5"
          >
            <MapPin className="w-4 h-4 text-white fill-white shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1">
                  Table {tableNumber}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-white/90 group-hover:translate-y-0.5 transition" />
              </div>
              <p className="text-[11px] text-white/90 font-medium">
                {section} Section • {guestCount} Guests Seated
              </p>
            </div>
          </div>

          {/* Right Header Actions: Clean VEG Switch & Waiter Bell (No TA1 or DINE-IN tag) */}
          <div className="flex items-center gap-2.5">
            {/* Iconic VEG Switch Pill */}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/30">
              <span className="text-[10px] font-black uppercase text-white tracking-wider">
                VEG
              </span>
              <button
                onClick={() => {
                  const nextVeg = !isVegOnly;
                  setIsVegOnly(nextVeg);
                  setDietFilter(nextVeg ? "veg" : "all");
                }}
                className={`w-7 h-4 rounded-full transition-all relative flex items-center p-0.5 ${
                  isVegOnly ? "bg-emerald-500" : "bg-white/40"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white shadow-xs transform transition-all ${
                    isVegOnly ? "translate-x-3" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Quick Waiter Call Bell */}
            <button
              onClick={handleCallWaiter}
              className={`p-2 rounded-full border transition flex items-center justify-center ${
                waiterCalled
                  ? "bg-white text-[#F04F5F] border-white shadow-md"
                  : "bg-white/20 border-white/30 text-white hover:bg-white/30"
              }`}
              title="Call Waiter"
            >
              <BellRing className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Zomato Clean Pure White Search Bar with Mic */}
        <div className="relative z-10 mt-1">
          <div className="relative bg-white rounded-2xl shadow-lg flex items-center px-3.5 py-2.5 sm:py-3">
            <Search className="w-4 h-4 text-[#F04F5F] shrink-0 mr-2.5" />
            <input
              type="text"
              placeholder='Search "salad under ₹400", biryani, naan...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#1C1C1C] placeholder-gray-400 text-xs sm:text-sm font-medium focus:outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-700 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleTriggerVoiceAI}
                className="text-[#F04F5F] hover:scale-110 active:scale-95 transition ml-1 p-0.5"
                title="Tap to speak with Gemini AI"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. DYNAMIC HOMEPAGE BANNER (SHADCN CAROUSEL WITH 0 PADDING) */}
      <div className="w-full bg-white p-0 relative">
        <Carousel
          setApi={setBannerApi}
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="m-0">
            {/* Slide 1: Active Admin Promotional Offer Card (If Active in Backend) */}
            {activeOffer?.isActive && (
              <CarouselItem className="p-0 basis-full">
                <div className="relative w-full overflow-hidden shadow-xs min-h-[165px] sm:min-h-[195px] flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=85"
                    alt="Restaurant Feast Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />

                  <div className="relative z-10 p-4 sm:p-6 flex justify-between items-center w-full">
                    <div className="flex-1 pr-3">
                      <div className="inline-flex items-center gap-1 bg-white/20 border border-white/30 text-amber-300 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1.5 backdrop-blur-md">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        <span>Dine-In Exclusive Treat</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                        {activeOffer.title || "MINIMUM ₹200 OFF"}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-200 font-medium mt-1 drop-shadow-xs">
                        {activeOffer.subtitle || "On dine-in table orders • Instant Kitchen KOT"}
                      </p>
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className="mt-3 bg-[#F04F5F] hover:bg-[#D6293C] text-white text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md active:scale-95 transition"
                      >
                        <span>Order now</span>
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>

                    {activeOffer.discountTag && (
                      <div className="shrink-0 w-22 sm:w-28 bg-[#F04F5F]/95 backdrop-blur-md border border-white/30 rounded-2xl p-3 text-center text-white shadow-xl transform rotate-1">
                        <span className="block text-[8px] font-black uppercase tracking-wider text-rose-100">
                          OFFER
                        </span>
                        <span className="block text-lg sm:text-2xl font-black text-white leading-none">
                          {activeOffer.discountTag}
                        </span>
                        {activeOffer.couponCode && (
                          <span className="block text-[8px] font-black uppercase text-white/95 mt-1 bg-black/30 rounded px-1.5 py-0.5">
                            {activeOffer.couponCode}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            )}

            {/* Culinary Special Slides */}
            {CULINARY_BANNER_SLIDES.map((slide, sIdx) => {
              const targetDish = dishesList[slide.dishIndex] || DEFAULT_CATALOG[0];

              return (
                <CarouselItem key={sIdx} className="p-0 basis-full">
                  <div className="relative w-full overflow-hidden shadow-xs min-h-[165px] sm:min-h-[195px] flex items-center">
                    <img
                      src={slide.bgImage}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />

                    <div className="relative z-10 p-4 sm:p-6 flex justify-between items-center w-full">
                      <div className="flex-1 pr-3">
                        <div className="inline-flex items-center gap-1 bg-white/20 border border-white/30 text-amber-300 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1.5 backdrop-blur-md">
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          <span>{slide.badge}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                          {slide.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-200 font-medium mt-1 line-clamp-1 drop-shadow-xs">
                          {slide.subtitle}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleOpenDishDetails(targetDish)}
                            className="bg-[#F04F5F] hover:bg-[#D6293C] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md active:scale-95 transition flex items-center gap-1.5"
                          >
                            <span>Quick Add (₹{slide.price}) +</span>
                          </button>
                        </div>
                      </div>

                      {/* Price Pill on Right */}
                      <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-xl mr-4">
                        <span className="text-[9px] font-bold text-gray-300 uppercase">Chef Pick</span>
                        <span className="text-xl font-black text-white font-mono">
                          ₹{slide.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {CULINARY_BANNER_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => bannerApi?.scrollTo(dotIdx)}
              className={`transition-all rounded-full ${
                currentSlide === dotIdx
                  ? "w-5 h-1.5 bg-white shadow-xs"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4. Circular Category Navigation Bar Powered by Shadcn Embla Carousel */}
      <div className="bg-white px-4 pt-3 pb-2 border-b border-gray-100">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 py-1">
            {/* Show Promotional Offer Card ONLY if active in backend */}
            {activeOffer?.isActive && (
              <CarouselItem className="pl-3 basis-auto">
                <button
                  onClick={() => {
                    setCurationFilter("offer");
                    setSelectedCategory("All");
                  }}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-[#F04F5F]/40 hover:border-[#F04F5F] flex flex-col items-center justify-center text-center p-1 shadow-xs transition-all group-hover:scale-105">
                    <span className="text-[8px] font-black text-[#F04F5F] uppercase tracking-wider">
                      OFFER
                    </span>
                    <span className="text-xs font-black text-[#F04F5F] leading-tight">
                      {activeOffer.discountTag || "PROMO"}
                    </span>
                    <span className="text-[8px] font-bold bg-[#F04F5F] text-white px-1.5 py-0.5 rounded-full mt-0.5 uppercase tracking-tight">
                      {activeOffer.couponCode || "Explore"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#F04F5F] mt-1.5">
                    Offers
                  </span>
                </button>
              </CarouselItem>
            )}

            {/* Category Circles */}
            {categoryTabs.map((cat) => {
              const isSelected = selectedCategory === cat.name;

              return (
                <CarouselItem key={cat.name} className="pl-3 basis-auto">
                  <button
                    onClick={() => setSelectedCategory(cat.name)}
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    <div
                      className={`w-16 h-16 rounded-full overflow-hidden p-0.5 transition-all ${
                        isSelected
                          ? "ring-2 ring-[#F04F5F] scale-105 shadow-sm"
                          : "ring-1 ring-gray-200 group-hover:scale-102"
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span
                      className={`text-xs font-bold mt-1.5 transition text-center whitespace-nowrap ${
                        isSelected ? "text-[#F04F5F]" : "text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </span>

                    {/* Active Indicator Underline Pill */}
                    {isSelected && (
                      <span className="w-7 h-1 bg-[#F04F5F] rounded-full mt-1 animate-fade-in" />
                    )}
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* 5. Filter Pills Bar (Tap 'Filters' to open Bottom Drawer) */}
      <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-200/80 bg-white">
        {/* Main Filters Button triggering Drawer */}
        <button
          onClick={() => setIsFilterDrawerOpen(true)}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition shadow-2xs flex items-center gap-1.5 ${
            activeFiltersCount > 0
              ? "bg-[#F04F5F] text-white border-[#F04F5F] font-bold"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>

        {/* Quick Under ₹250 Filter Pill */}
        <button
          onClick={() => {
            const next = !under250Only;
            setUnder250Only(next);
            setPriceRange(next ? "under250" : "all");
          }}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition shadow-2xs ${
            under250Only
              ? "bg-[#F04F5F] text-white border-[#F04F5F] font-bold"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Under ₹250
        </button>

        {/* Quick Fast Prep Filter Pill */}
        <button
          onClick={() => {
            const next = !fastPrepOnly;
            setFastPrepOnly(next);
            setPrepFilter(next ? "fast" : "all");
          }}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition shadow-2xs ${
            fastPrepOnly
              ? "bg-[#F04F5F] text-white border-[#F04F5F] font-bold"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Fast Prep (⏱️ 10m)
        </button>

        {/* Quick Pure Veg Filter Pill */}
        <button
          onClick={() => {
            const next = !isVegOnly;
            setIsVegOnly(next);
            setDietFilter(next ? "veg" : "all");
          }}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition shadow-2xs ${
            isVegOnly
              ? "bg-emerald-600 text-white border-emerald-600 font-bold"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Pure Veg
        </button>

        {/* Quick Today's Special Pill */}
        <button
          onClick={() => {
            setCurationFilter(curationFilter === "special" ? "all" : "special");
          }}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition shadow-2xs ${
            curationFilter === "special"
              ? "bg-amber-500 text-white border-amber-500 font-bold"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          ⭐ Specials
        </button>
      </div>

      {/* Active Table Running Bill Alert Banner */}
      {activeOrder && (
        <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex justify-between items-center shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-amber-950">
                Order #{activeOrder.orderNumber || "73829"} • {activeOrder.status || "Cooking"}
              </p>
              <p className="text-[11px] text-amber-700 font-medium">
                Add more items to this bill anytime!
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/Order-status")}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
          >
            View Bill
          </button>
        </div>
      )}

      {/* 6. RECOMMENDED FOR YOU (PIXEL-PERFECT CARD HEIGHT CONSISTENCY & RESPONSIVE GRID) */}
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
            RECOMMENDED FOR YOU ({filteredDishes.length})
          </h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetAllFilters}
              className="text-xs font-bold text-[#F04F5F] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#F04F5F] flex items-center justify-center mb-3">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-gray-900">No dishes match these filters</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Try adjusting your price range, dietary preference or spice filters to view delicious options.
            </p>
            <button
              onClick={handleResetAllFilters}
              className="mt-4 bg-[#F04F5F] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Responsive Grid with strict uniform card height */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredDishes.map((dish) => {
              const quantity = cartQuantities[dish.id] || 0;

              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition flex flex-col justify-between h-full group"
                >
                  {/* Uniform Fixed-Height Image Container */}
                  <div
                    onClick={() => handleOpenDishDetails(dish)}
                    className="relative h-36 sm:h-40 w-full bg-gray-100 overflow-hidden shrink-0 cursor-pointer"
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80";
                      }}
                    />

                    {/* Top-Left Promotional & Curation Badges */}
                    <div className="absolute top-0 left-0 flex flex-col gap-1 z-10">
                      {dish.offerBadge && (
                        <div className="bg-[#1C1C1C]/85 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-br-lg tracking-tight">
                          {dish.offerBadge}
                        </div>
                      )}
                      {dish.isTodaySpecial && (
                        <div className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-br-md tracking-tight flex items-center gap-0.5 shadow-xs">
                          <Sparkles className="w-2 h-2" /> Special
                        </div>
                      )}
                    </div>

                    {/* Veg / Non-Veg Indicator Badge */}
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs z-10">
                      {dish.isVeg ? (
                        <span className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center p-0.5 rounded-xs block">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full block" />
                        </span>
                      ) : (
                        <span className="w-3.5 h-3.5 border-2 border-rose-700 flex items-center justify-center p-0.5 rounded-xs block">
                          <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-700 block" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content with strict pixel-perfect uniform heights */}
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      {/* Rating & Prep Time Row */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                          <span>★</span>
                          <span>{dish.rating || 4.5}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-gray-400" />
                          <span>{dish.prepTime || "15 mins"}</span>
                        </span>
                        {dish.spiceLevel && (
                          <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1 rounded ml-auto">
                            {dish.spiceLevel}
                          </span>
                        )}
                      </div>

                      {/* Fixed Height Title (h-10 line-clamp-2 prevents jagged spacing) */}
                      <h4
                        onClick={() => handleOpenDishDetails(dish)}
                        className="text-xs sm:text-sm font-bold text-[#1C1C1C] h-10 line-clamp-2 leading-tight cursor-pointer hover:text-[#F04F5F] transition"
                        title={dish.name}
                      >
                        {dish.name}
                      </h4>

                      {/* Fixed Height Description (h-8 line-clamp-2) */}
                      <p
                        onClick={() => handleOpenDishDetails(dish)}
                        className="text-[11px] text-gray-500 h-8 line-clamp-2 mt-1 leading-snug cursor-pointer"
                      >
                        {dish.description || "Freshly cooked to table order with chef's seasoning."}
                      </p>

                      {/* Half & Full Indicator Badge */}
                      {dish.hasHalfFull && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#F04F5F] bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded-md">
                            Half & Full options
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price & Zomato "ADD" Button (#F04F5F) */}
                    <div className="mt-auto pt-2.5 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        {dish.hasHalfFull ? (
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-black text-[#1C1C1C] font-mono leading-none">
                              ₹{dish.halfPrice} - ₹{dish.fullPrice}
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                              Half / Full
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm font-black text-[#1C1C1C] font-mono">
                            ₹{dish.price}
                          </span>
                        )}
                      </div>

                      {/* Action Button: Opens Details/Portion Drawer if half/full, else quick counter */}
                      {dish.hasHalfFull ? (
                        <button
                          onClick={() => handleOpenDishDetails(dish)}
                          className="bg-white hover:bg-rose-50 text-[#F04F5F] font-black text-[11px] px-3 py-1 rounded-lg border border-[#F04F5F]/60 shadow-2xs hover:shadow-xs transition uppercase flex items-center gap-0.5"
                        >
                          <span>{quantity > 0 ? `${quantity} ADDED` : "ADD"}</span>
                          <Plus className="w-3 h-3 text-[#F04F5F] stroke-[3]" />
                        </button>
                      ) : quantity === 0 ? (
                        <button
                          onClick={() => handleQuickAdd(dish, 1)}
                          className="bg-white hover:bg-rose-50 text-[#F04F5F] font-black text-[11px] px-3.5 py-1 rounded-lg border border-[#F04F5F]/60 shadow-2xs hover:shadow-xs transition uppercase flex items-center gap-0.5"
                        >
                          <span>ADD</span>
                          <Plus className="w-3 h-3 text-[#F04F5F] stroke-[3]" />
                        </button>
                      ) : (
                        <div className="bg-[#F04F5F] text-white font-black text-[11px] rounded-lg shadow-xs flex items-center overflow-hidden">
                          <button
                            onClick={() => handleQuickAdd(dish, -1)}
                            className="px-2 py-0.5 hover:bg-[#D6293C] text-white"
                          >
                            <Minus className="w-2.5 h-2.5 stroke-[3]" />
                          </button>
                          <span className="px-1.5 font-black text-white text-xs">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuickAdd(dish, 1)}
                            className="px-2 py-0.5 hover:bg-[#D6293C] text-white"
                          >
                            <Plus className="w-2.5 h-2.5 stroke-[3]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Sticky Bottom Cart Bar (Safely positioned ABOVE the bottom nav to prevent overlap) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-md animate-slide-up">
          <button
            onClick={() => router.push("/Cart")}
            className="w-full bg-[#F04F5F] hover:bg-[#D6293C] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between transition-all active:scale-[0.98] border border-white/20"
          >
            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-wider uppercase">
                {totalCartCount} {totalCartCount === 1 ? "ITEM" : "ITEMS"} • ₹{totalCartPrice}
              </span>
              <span className="text-[10px] text-white/90 font-medium">
                Table {tableNumber} • Tap to review & place order
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
              <span>View Cart & Order</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* 8. SINGLE ANIMATED HERO TAB BOTTOM NAVIGATION (Responsive & Elegant) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] max-w-[94vw] sm:max-w-md">
        {/* Left: Glowing Circular AI Voice Orb Launcher */}
        <button
          onClick={handleTriggerVoiceAI}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-rose-500 to-amber-400 p-0.5 shadow-xs shrink-0 hover:scale-105 active:scale-95 transition"
          title="Open Voice AI"
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#F04F5F] animate-pulse" />
          </div>
        </button>

        {/* Hero Tabs with Smooth Spring Sliding Cursor Pill */}
        <div className="flex items-center gap-1 relative">
          {[
            { id: "home", label: "Home", icon: HomeIcon, path: "/" },
            { id: "waiter", label: "Waiter", icon: BellRing, path: "/Waiter" },
            { id: "dining", label: "Dining", icon: UtensilsCrossed, path: "/Order-status" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.path && tab.id !== "home") router.push(tab.path);
                  if (tab.id === "home") router.push("/");
                }}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors duration-200 flex items-center gap-1.5 z-10 ${
                  isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="heroTabCursor"
                    className="absolute inset-0 bg-[#F04F5F] rounded-full shadow-md -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Embedded Gemini Voice Orb Modal */}
      <GeminiVoiceOrb showSearchTrigger={false} showFloatingButton={false} />

      {/* ========================================================================= */}
      {/* 9. SHADCN BOTTOM DRAWER: FOOD & MENU FILTERS                             */}
      {/* ========================================================================= */}
      <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <DrawerContent className="max-w-lg mx-auto bg-white rounded-t-[28px] max-h-[85vh] flex flex-col p-0 overflow-hidden border-t border-gray-200">
          <DrawerHeader className="p-4 border-b border-gray-100 flex items-center justify-between text-left">
            <div>
              <DrawerTitle className="text-base font-black text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F04F5F]" />
                <span>Food & Menu Filters</span>
              </DrawerTitle>
              <DrawerDescription className="text-xs text-gray-500 mt-0.5">
                Refine by diet, portion, spice level, prep time and sort
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          {/* Scrollable Filter Categories */}
          <div className="overflow-y-auto p-4 space-y-5 flex-1">
            {/* 1. Dietary Preference */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                Dietary Preference
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Dishes" },
                  { id: "veg", label: "🌱 Pure Veg Only" },
                  { id: "non-veg", label: "🍗 Non-Veg" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setDietFilter(opt.id);
                      setIsVegOnly(opt.id === "veg");
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                      dietFilter === opt.id
                        ? "bg-[#F04F5F] text-white border-[#F04F5F] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Sort Options */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "recommended", label: "Recommended" },
                  { id: "rating", label: "★ Top Rated (4.5+)" },
                  { id: "price-asc", label: "Price: Low to High" },
                  { id: "price-desc", label: "Price: High to Low" },
                ].map((sortOpt) => (
                  <button
                    key={sortOpt.id}
                    onClick={() => setSortBy(sortOpt.id)}
                    className={`text-xs font-bold p-2.5 rounded-xl border text-left transition ${
                      sortBy === sortOpt.id
                        ? "bg-rose-50 text-[#F04F5F] border-[#F04F5F]"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {sortOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Price Range */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                Price Range
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under150", label: "Under ₹150" },
                  { id: "under250", label: "Under ₹250" },
                  { id: "under400", label: "Under ₹400" },
                  { id: "above400", label: "₹400+" },
                ].map((pOpt) => (
                  <button
                    key={pOpt.id}
                    onClick={() => {
                      setPriceRange(pOpt.id);
                      setUnder250Only(pOpt.id === "under250");
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                      priceRange === pOpt.id
                        ? "bg-[#F04F5F] text-white border-[#F04F5F] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {pOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Spice Level */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                Spice Level
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Levels" },
                  { id: "mild", label: "Mild 🟢" },
                  { id: "medium", label: "Medium 🟡" },
                  { id: "spicy", label: "Spicy / Hot 🌶️" },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => setSpiceFilter(sp.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                      spiceFilter === sp.id
                        ? "bg-[#F04F5F] text-white border-[#F04F5F] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Cooking Speed / Prep Time */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                Cooking Speed
              </label>
              <div className="flex gap-2">
                {[
                  { id: "all", label: "Any Prep Time" },
                  { id: "fast", label: "Fast Prep (< 10m) ⏱️" },
                ].map((prep) => (
                  <button
                    key={prep.id}
                    onClick={() => {
                      setPrepFilter(prep.id);
                      setFastPrepOnly(prep.id === "fast");
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                      prepFilter === prep.id
                        ? "bg-[#F04F5F] text-white border-[#F04F5F] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {prep.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Special Curations */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                Curations & Badges
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Items" },
                  { id: "special", label: "⭐ Today's Specials" },
                  { id: "new", label: "✨ New Dishes" },
                  { id: "offer", label: "🏷️ Active Offers" },
                ].map((cur) => (
                  <button
                    key={cur.id}
                    onClick={() => setCurationFilter(cur.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                      curationFilter === cur.id
                        ? "bg-[#F04F5F] text-white border-[#F04F5F] shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {cur.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <DrawerFooter className="p-4 border-t border-gray-100 flex flex-row items-center justify-between gap-3 bg-gray-50">
            <button
              onClick={handleResetAllFilters}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
            >
              Reset All
            </button>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="flex-1 bg-[#F04F5F] hover:bg-[#D6293C] text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition"
            >
              Apply ({filteredDishes.length} Dishes)
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ========================================================================= */}
      {/* 10. SHADCN BOTTOM DRAWER: DISH DETAILS, HALF/FULL PORTION & INSTRUCTIONS   */}
      {/* ========================================================================= */}
      <Drawer
        open={Boolean(selectedDishForDetails)}
        onOpenChange={(open) => {
          if (!open) setSelectedDishForDetails(null);
        }}
      >
        <DrawerContent className="max-w-lg mx-auto bg-white rounded-t-[28px] max-h-[92vh] flex flex-col p-0 overflow-hidden border-t border-gray-200">
          {selectedDishForDetails && (
            <>
              {/* Dish Header Image */}
              <div className="relative h-48 sm:h-56 w-full bg-gray-100 shrink-0 overflow-hidden">
                <img
                  src={selectedDishForDetails.image}
                  alt={selectedDishForDetails.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Close Button */}
                <DrawerClose asChild>
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/80 transition">
                    <X className="w-4 h-4" />
                  </button>
                </DrawerClose>

                {/* Badges on Image */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    {selectedDishForDetails.isVeg ? (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        ● PURE VEG
                      </span>
                    ) : (
                      <span className="bg-rose-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        ▲ NON-VEG
                      </span>
                    )}
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      ★ {selectedDishForDetails.rating || 4.5}
                    </span>
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedDishForDetails.prepTime || "15 mins"}
                    </span>
                  </div>

                  {selectedDishForDetails.spiceLevel && (
                    <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {selectedDishForDetails.spiceLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Scrollable Dish Information & Customisation */}
              <div className="overflow-y-auto p-4 space-y-4 flex-1">
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-snug">
                    {selectedDishForDetails.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {selectedDishForDetails.description ||
                      "Authentic culinary creation, made fresh to table order with premium hand-picked ingredients."}
                  </p>
                </div>

                {/* Portion Confirmation Section (If Dish Supports Half/Full) */}
                {selectedDishForDetails.hasHalfFull && (
                  <div className="bg-rose-50/50 rounded-2xl p-3.5 border border-rose-100">
                    <label className="text-xs font-black uppercase tracking-wider text-[#F04F5F] block mb-2 flex items-center gap-1">
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Select Portion Size</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Half Portion Option */}
                      <button
                        type="button"
                        onClick={() => setSelectedPortion("Half")}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          selectedPortion === "Half"
                            ? "bg-white border-[#F04F5F] shadow-sm ring-2 ring-[#F04F5F]/20"
                            : "bg-white/80 border-gray-200 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-gray-900">Half Portion</span>
                          {selectedPortion === "Half" && (
                            <CheckCircle2 className="w-4 h-4 text-[#F04F5F]" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 mt-0.5">Serves 1 guest</span>
                        <span className="text-sm font-black text-[#F04F5F] font-mono mt-2">
                          ₹{selectedDishForDetails.halfPrice}
                        </span>
                      </button>

                      {/* Full Portion Option */}
                      <button
                        type="button"
                        onClick={() => setSelectedPortion("Full")}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          selectedPortion === "Full"
                            ? "bg-white border-[#F04F5F] shadow-sm ring-2 ring-[#F04F5F]/20"
                            : "bg-white/80 border-gray-200 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-gray-900">Full Portion</span>
                          {selectedPortion === "Full" && (
                            <CheckCircle2 className="w-4 h-4 text-[#F04F5F]" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 mt-0.5">Serves 2 guests</span>
                        <span className="text-sm font-black text-[#F04F5F] font-mono mt-2">
                          ₹{selectedDishForDetails.fullPrice}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Chef Cooking Instructions & Notes */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-600 block mb-1.5 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-[#F04F5F]" />
                    <span>Special Cooking Instructions for Chef</span>
                  </label>

                  {/* Quick Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {QUICK_INSTRUCTION_TAGS.map((chip) => {
                      const isIncluded = specialInstruction.includes(chip);

                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (isIncluded) {
                              setSpecialInstruction((prev) =>
                                prev
                                  .replace(chip, "")
                                  .replace(/,\s*,/g, ",")
                                  .trim()
                              );
                            } else {
                              setSpecialInstruction((prev) =>
                                prev ? `${prev}, ${chip}` : chip
                              );
                            }
                          }}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${
                            isIncluded
                              ? "bg-[#F04F5F] text-white border-[#F04F5F]"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    rows={2}
                    value={specialInstruction}
                    onChange={(e) => setSpecialInstruction(e.target.value)}
                    placeholder="e.g. Less oil, extra green chutney, no onion or garlic, serve hot..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F04F5F] transition placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Drawer Footer with Quantity Selector & Add Button */}
              <DrawerFooter className="p-4 border-t border-gray-100 flex flex-row items-center justify-between gap-3 bg-white">
                {/* Quantity Counter */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setDetailQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-2xs flex items-center justify-center text-gray-700 font-bold active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <span className="w-6 text-center font-black text-sm text-gray-900 font-mono">
                    {detailQuantity}
                  </span>
                  <button
                    onClick={() => setDetailQuantity((prev) => prev + 1)}
                    className="w-8 h-8 rounded-lg bg-white shadow-2xs flex items-center justify-center text-gray-700 font-bold active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>

                {/* Add to Order Button */}
                <button
                  onClick={handleConfirmAddFromDetails}
                  className="flex-1 bg-[#F04F5F] hover:bg-[#D6293C] text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>
                    Add to Cart • ₹
                    {selectedDishForDetails.hasHalfFull
                      ? (selectedPortion === "Half"
                          ? selectedDishForDetails.halfPrice
                          : selectedDishForDetails.fullPrice) * detailQuantity
                      : selectedDishForDetails.price * detailQuantity}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* ========================================================================= */}
      {/* 11. Guest Check-in Modal upon Table QR Scan                              */}
      {/* ========================================================================= */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#F04F5F] flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-[#1C1C1C]">
              Welcome to Table {tableNumber}!
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              RestoQR Grand Dine • {section} Section
            </p>

            <div className="w-full my-4 p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
              <p className="text-xs font-bold text-gray-700 mb-2">
                How many guests are dining today?
              </p>

              {/* Guest Counter */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center active:scale-95 shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-black text-[#F04F5F] font-mono w-10 text-center">
                  {guestCount}
                </span>
                <button
                  onClick={() => setGuestCount((prev) => Math.min(12, prev + 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center active:scale-95 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex justify-center gap-1.5 mt-3">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setGuestCount(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      guestCount === num
                        ? "bg-[#F04F5F] text-white shadow-xs"
                        : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleConfirmGuests(guestCount)}
              className="w-full py-3 rounded-xl bg-[#F04F5F] hover:bg-[#D6293C] text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Start Dining</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
