"use client";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import NotificationSheet from "@/components/ui/Homecomponets/Notification";

function CustomizeDialog({ isOpen, onClose, item, onApply }) {
  const [size, setSize] = useState(item.customizations?.size || "Quarter");
  const [addOns, setAddOns] = useState(item.customizations?.addOns || []);
  const [note, setNote] = useState(item.customizations?.note || "");

  const handleApply = () => {
    onApply({ size, addOns, note });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Customize your meal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Select Quantity</h3>
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
            <h3 className="font-semibold">Select Add-Ons</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="raita"
                checked={addOns.includes("Raita")}
                onCheckedChange={(checked) =>
                  setAddOns(
                    checked
                      ? [...addOns, "Raita"]
                      : addOns.filter((item) => item !== "Raita")
                  )
                }
              />
              <Label htmlFor="raita">Raita</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="egg"
                checked={addOns.includes("Egg")}
                onCheckedChange={(checked) =>
                  setAddOns(
                    checked
                      ? [...addOns, "Egg"]
                      : addOns.filter((item) => item !== "Egg")
                  )
                }
              />
              <Label htmlFor="egg">Egg</Label>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Add a custom note</Label>
            <Textarea
              id="note"
              placeholder="Make it extra spicy"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleApply}
          className="w-full bg-[#F04F5F] text-white"
        >
          Apply
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function Cart() {
  const router = useRouter();
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

  const total = menuItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleplaceorder = () => {
    router.push("/Order-status");
  };

  return (
    <Card className="w-full  mx-auto h-auto pb-20 flex flex-col">
      <CardHeader className="sticky py-3  flex flex-row justify-between items-center bg-[#F04F5F] top-0 w-full text-white z-10">
        <CardTitle className="text-2xl">Your Order</CardTitle>
        <CardTitle>
          {" "}
          <NotificationSheet />
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent className="p-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="mb-6 pb-6 border rounded-md  p-2 border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
                <span className="font-semibold">₹{item.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant="link"
                  className="text-red-500 p-0 h-auto"
                  onClick={() => handleCustomize(index)}
                >
                  Customize
                </Button>
                <div className="flex items-center ">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(index, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-3 w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(index, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full mt-4 bg-white text-red-500 hover:text-red-500 border-red-500"
          >
            + Add additional requests
          </Button>
        </CardContent>
      </ScrollArea>
      {/* <CardContent className="border-t border-gray-200">
        <div className="font-semibold mb-2">Bill Details</div>
        <ScrollArea className="h-24">
          {menuItems.map((item, index) => (
            item.quantity > 0 && (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>₹{item.price} x {item.quantity}</span>
              </div>
            )
          ))}
        </ScrollArea>
      </CardContent> */}
      <CardFooter className="flex flex-col gap-2 justify-center items-center pt-4 border-t border-gray-200 sticky bottom-16 w-full bg-white">
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">₹{total}</span>
        </div>

        <Button
          onClick={handleplaceorder}
          className="w-full bg-[#F04F5F] rounded-full hover:bg-red-600 text-white"
        >
          Place Order
        </Button>
      </CardFooter>
      {/* <CardContent className="">
      </CardContent> */}
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
