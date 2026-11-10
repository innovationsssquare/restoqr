"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, X, Sparkles, PlusCircle, Check, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import NotificationSheet from "@/components/ui/Homecomponets/Notification";
import { getSocket } from "@/lib/socket";

const getApiBase = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8081/api/v1`;
  }
  return "http://localhost:8081/api/v1";
};

function CustomizeDialog({ isOpen, onClose, item, onApply }) {
  const [size, setSize] = useState(item?.customizations?.size || "Quarter");
  const [addOns, setAddOns] = useState(item?.customizations?.addOns || []);
  const [note, setNote] = useState(item?.customizations?.note || "");

  const handleApply = () => {
    onApply({ size, addOns, note });
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize your meal</DialogTitle>
          <DialogDescription>Choose your portion size, add-ons, and special instructions.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-semibold text-sm">Select Quantity</h3>
            <RadioGroup value={size} onValueChange={setSize}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Quarter" id="quarter" />
                <Label htmlFor="quarter">Quarter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Half [1 Person]" id="half" />
                <Label htmlFor="half">Half [1 Person]</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Full [2 Person]" id="full" />
                <Label htmlFor="full">Full [2 Person]</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold text-sm">Select Add-Ons</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="raita"
                checked={addOns.includes("Raita")}
                onCheckedChange={(checked) =>
                  setAddOns(
                    checked
                      ? [...addOns, "Raita"]
                      : addOns.filter((i) => i !== "Raita")
                  )
                }
              />
              <Label htmlFor="raita">Raita (+₹45)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="egg"
                checked={addOns.includes("Egg")}
                onCheckedChange={(checked) =>
                  setAddOns(
                    checked
                      ? [...addOns, "Egg"]
                      : addOns.filter((i) => i !== "Egg")
                  )
                }
              />
              <Label htmlFor="egg">Boiled Egg (+₹30)</Label>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note" className="text-sm">Special Kitchen Notes</Label>
            <Textarea
              id="note"
              placeholder="e.g. Mild spicy, no onions, extra crispy"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleApply}
          className="w-full bg-[#F04F5F] text-white"
        >
          Apply Customization
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function Cart() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState("A1");
  const [activeOrder, setActiveOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPairings, setAiPairings] = useState([]);

  const [menuItems, setMenuItems] = useState([
    {
      name: "Veg Biryani",
      description: "Quarter\nMake it extra spicy",
      price: 259,
      quantity: 1,
    },
    {
      name: "Chicken Biryani",
      description: "Half [1 Person]\nBoiled Egg\nMake it extra spicy",
      price: 349,
      quantity: 1,
    },
    {
      name: "Mutton Biryani",
      description: "Full\nExtra meat\nMake it extra spicy",
      price: 449,
      quantity: 0,
    },
    {
      name: "Paneer Tikka",
      description: "Full plate\nWith mint chutney",
      price: 299,
      quantity: 0,
    },
    { name: "Butter Naan", description: "2 pieces", price: 60, quantity: 0 },
  ]);

  // Load session table, active ongoing order (for running tab), and voice cart items
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTable = localStorage.getItem("restoqr_table");
      if (storedTable) setTableNumber(storedTable);

      const ongoing = localStorage.getItem("restoqr_active_order");
      if (ongoing) {
        try {
          const parsed = JSON.parse(ongoing);
          if (parsed && parsed.status !== "Completed") {
            setActiveOrder(parsed);
          }
        } catch (e) {
          console.warn("Error parsing active order:", e);
        }
      }

      const voiceCart = localStorage.getItem("restoqr_cart");
      if (voiceCart) {
        try {
          const parsed = JSON.parse(voiceCart);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMenuItems((prev) => {
              const merged = [...prev];
              parsed.forEach((voiceItem) => {
                const existingIdx = merged.findIndex(
                  (m) => m.name.toLowerCase() === voiceItem.name.toLowerCase()
                );
                if (existingIdx !== -1) {
                  merged[existingIdx].quantity += voiceItem.quantity || 1;
                } else {
                  merged.unshift({
                    name: voiceItem.name,
                    price: voiceItem.price || 150,
                    quantity: voiceItem.quantity || 1,
                    description: voiceItem.notes || "Added via Voice AI Assistant",
                  });
                }
              });
              return merged;
            });
          }
        } catch (e) {
          console.warn("Error parsing voice cart:", e);
        }
      }
    }
  }, []);

  // Fetch AI smart upsell pairings based on current cart
  useEffect(() => {
    const active = menuItems.filter((i) => i.quantity > 0);
    if (active.length > 0) {
      fetch(`${getApiBase()}/ai/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: active }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status && Array.isArray(data.data)) {
            setAiPairings(data.data);
          }
        })
        .catch(() => {});
    }
  }, [menuItems]);

  const [customizeIndex, setCustomizeIndex] = useState(null);

  const updateQuantity = (index, change) => {
    const newItems = [...menuItems];
    newItems[index].quantity = Math.max(0, newItems[index].quantity + change);
    setMenuItems(newItems);
  };

  const handleCustomize = (index) => {
    setCustomizeIndex(index);
  };

  const handleApplyCustomization = (customizations) => {
    if (customizeIndex !== null) {
      const newItems = [...menuItems];
      newItems[customizeIndex].customizations = customizations;
      newItems[customizeIndex].description = `${
        customizations.size
      }\n${customizations.addOns.join(", ")}\n${customizations.note}`;
      setMenuItems(newItems);
    }
  };

  const handleAddPairing = (pairing) => {
    const existingIdx = menuItems.findIndex(
      (m) => m.name.toLowerCase() === pairing.name.toLowerCase()
    );
    if (existingIdx !== -1) {
      updateQuantity(existingIdx, 1);
    } else {
      setMenuItems((prev) => [
        ...prev,
        {
          name: pairing.name,
          price: pairing.price,
          quantity: 1,
          description: pairing.reason || "Recommended Pairing",
        },
      ]);
    }
  };

  const total = menuItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleplaceorder = async () => {
    const activeItems = menuItems.filter((i) => i.quantity > 0);
    const finalItems = activeItems.length > 0 ? activeItems : menuItems.slice(0, 2);
    const finalTotal = total > 0 ? total : 608;

    setIsSubmitting(true);

    // If customer already has an active ongoing table bill, add items to that order (KOT 2)
    if (activeOrder && activeOrder.orderId) {
      try {
        const res = await fetch(
          `${getApiBase()}/order/add-items/${activeOrder.orderId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: finalItems,
              orderNotes: "Additional add-on order (KOT 2)",
            }),
          }
        );
        const data = await res.json();
        if (data.status && data.data) {
          localStorage.setItem("restoqr_active_order", JSON.stringify(data.data));
          localStorage.removeItem("restoqr_cart");
          setIsSubmitting(false);
          router.push("/Order-status");
          return;
        }
      } catch (err) {
        console.warn("Error adding items to active bill:", err.message);
      }
    }

    // Otherwise, create fresh primary order
    let orderPayload = {
      orderId: `ord_${Date.now()}`,
      orderNumber: Math.floor(10000 + Math.random() * 90000).toString(),
      tableNumber: tableNumber || "A1",
      tableId: tableNumber || "A1",
      restaurantId: "default",
      items: finalItems,
      totalPrice: finalTotal,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    try {
      const res = await fetch(`${getApiBase()}/order/placeOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: tableNumber || "A1",
          restaurantId: "default",
          items: finalItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            notes: item.description || "",
          })),
          totalPrice: finalTotal,
        }),
      });
      const data = await res.json();
      if (data.status && data.data) {
        orderPayload.orderId = data.data._id;
        orderPayload.orderNumber = data.data.orderNumber || orderPayload.orderNumber;
      }
    } catch (apiErr) {
      console.warn("Backend API offline, continuing with socket fallback:", apiErr.message);
    }

    try {
      const socket = getSocket();
      socket.emit("order:create", orderPayload);
    } catch (sockErr) {
      console.warn("Socket broadcast error:", sockErr);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("restoqr_active_order", JSON.stringify(orderPayload));
      localStorage.removeItem("restoqr_cart");
    }

    setIsSubmitting(false);
    router.push("/Order-status");
  };

  return (
    <Card className="w-full mx-auto h-auto pb-24 flex flex-col border-none shadow-none bg-neutral-50/50 min-h-screen">
      {/* Sticky Header */}
      <CardHeader className="sticky py-4 flex flex-row justify-between items-center bg-[#F04F5F] top-0 w-full text-white z-20 shadow-md">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <span>Your Order</span>
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
              Table {tableNumber}
            </span>
          </CardTitle>
          <p className="text-xs text-white/80">Review items & special instructions</p>
        </div>
        <div>
          <NotificationSheet />
        </div>
      </CardHeader>

      {/* Ongoing Order Alert Pill if Running Tab */}
      {activeOrder && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-medium">
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            <span>Active Dining Tab: Order #{activeOrder.orderNumber || "Active"}</span>
          </div>
          <span className="bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
            Appending to Bill
          </span>
        </div>
      )}

      <ScrollArea className="flex-grow">
        <CardContent className="p-4 space-y-4">
          {/* Menu Items List */}
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="p-3.5 bg-white border rounded-xl shadow-sm border-gray-200/80 flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500 whitespace-pre-line mt-0.5">
                    {item.description}
                  </p>
                </div>
                <span className="font-bold text-sm text-gray-900">₹{item.price}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <Button
                  variant="link"
                  className="text-red-500 p-0 h-auto text-xs font-medium hover:text-red-600"
                  onClick={() => handleCustomize(index)}
                >
                  + Customize / Notes
                </Button>
                <div className="flex items-center bg-gray-50 border rounded-lg p-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-600 hover:text-red-600"
                    onClick={() => updateQuantity(index, -1)}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-7 text-center font-bold text-xs text-gray-800">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-600 hover:text-green-600"
                    onClick={() => updateQuantity(index, 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* AI Chef Recommended Pairings */}
          {aiPairings.length > 0 && (
            <div className="bg-gradient-to-br from-rose-50 to-orange-50/40 border border-rose-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F04F5F] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#F04F5F]" />
                  <span>Chef AI Pairings</span>
                </div>
                <span className="text-[11px] text-gray-400">Frequently paired together</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiPairings.map((pairing, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-white border border-rose-100 p-2.5 rounded-xl flex items-center justify-between shadow-xs hover:border-rose-300 transition"
                  >
                    <div>
                      <p className="font-semibold text-xs text-gray-900">{pairing.name}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{pairing.reason}</p>
                      <span className="text-xs font-bold text-gray-800">₹{pairing.price}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-300 text-[#F04F5F] hover:bg-rose-500 hover:text-white text-xs h-7 px-2.5 gap-1 rounded-lg"
                      onClick={() => handleAddPairing(pairing)}
                    >
                      <Plus className="w-3 h-3" /> Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>

      {/* Sticky Bottom Checkout Footer */}
      <CardFooter className="flex flex-col gap-3 justify-center items-center p-4 border-t border-gray-200 fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white z-20 shadow-xl">
        <div className="flex justify-between items-center w-full">
          <div>
            <span className="text-xs text-gray-400 uppercase font-medium">To Pay</span>
            <p className="text-xl font-black text-gray-900">₹{total}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-medium">
              {menuItems.filter((i) => i.quantity > 0).length} Dishes Selected
            </span>
          </div>
        </div>

        <Button
          onClick={handleplaceorder}
          disabled={isSubmitting}
          className="w-full bg-[#F04F5F] hover:bg-[#D03F4F] text-white py-6 rounded-2xl font-bold text-base shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Sending to Kitchen...</span>
          ) : activeOrder ? (
            <>
              <span>Add to Active Table Bill (KOT 2)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Confirm & Send to Kitchen</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </CardFooter>

      {customizeIndex !== null && (
        <CustomizeDialog
          isOpen={true}
          onClose={() => setCustomizeIndex(null)}
          item={menuItems[customizeIndex]}
          onApply={handleApplyCustomization}
        />
      )}
    </Card>
  );
}
