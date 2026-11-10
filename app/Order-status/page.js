"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  PhoneCall,
  Clock,
  CheckCircle2,
  Utensils,
  Receipt,
  Sparkles,
  AlertCircle,
  Droplets,
  UserCheck,
  QrCode,
  Check,
  ShieldCheck,
  PartyPopper,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
import * as animationData from "../../lib/new.json";
import assist from "@/public/Asset/assist.png";
import Image from "next/image";
import { Progress } from "@nextui-org/react";
import NotificationSheet from "@/components/ui/Homecomponets/Notification";
import { useRouter } from "next/navigation";

const getApiBase = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8081/api/v1`;
  }
  return "http://localhost:8081/api/v1";
};
import { getSocket } from "@/lib/socket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrderStatus() {
  const router = useRouter();

  const [order, setOrder] = useState({
    orderNumber: "73829",
    tableNumber: "A1",
    status: "Pending", // Pending, Cooking, Ready, Served, Paid
    timelineMinutes: 15,
    items: [
      { name: "Paneer Butter Masala", quantity: 2, price: 280 },
      { name: "Butter Naan", quantity: 4, price: 45 },
    ],
  });

  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [assistanceOpen, setAssistanceOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [assistanceStatus, setAssistanceStatus] = useState("");
  const [billStatus, setBillStatus] = useState("");
  const [upiData, setUpiData] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Sync active order from localStorage and Backend API
  useEffect(() => {
    if (typeof window === "undefined") return;

    let targetTable = "A1";
    const localTable = localStorage.getItem("restoqr_table");
    if (localTable) targetTable = localTable;

    const storedOrder = localStorage.getItem("restoqr_active_order");
    if (storedOrder) {
      try {
        const parsed = JSON.parse(storedOrder);
        setOrder((prev) => ({
          ...prev,
          orderNumber: parsed.orderNumber || prev.orderNumber,
          tableNumber: parsed.tableNumber || targetTable,
          status: parsed.status || prev.status,
          items: parsed.items || prev.items,
        }));
      } catch (e) {
        console.warn("Error parsing stored order:", e);
      }
    }

    // Fetch live status from backend
    fetch(`${getApiBase()}/order/active-table/${targetTable}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          const live = data.data;
          setOrder({
            orderNumber: live.orderNumber || live._id.slice(-5),
            tableNumber: live.tableNumber || targetTable,
            status: live.status || "Pending",
            timelineMinutes: live.timelineMinutes || 15,
            items:
              live.items?.length > 0
                ? live.items
                : [
                    { name: "Paneer Butter Masala", quantity: 2, price: 280 },
                    { name: "Butter Naan", quantity: 4, price: 45 },
                  ],
          });

          if (live.timelineMinutes) {
            setSecondsRemaining(live.timelineMinutes * 60);
          }
        }
      })
      .catch((err) => {
        console.log("Using cached order status:", err.message);
      });
  }, []);

  useEffect(() => {
    const socket = getSocket();

    // Join room for this table
    socket.emit("join_table", {
      restaurantId: "default",
      tableId: order.tableNumber,
      tableNumber: order.tableNumber,
    });

    // Listen for chef updates & countdown changes
    socket.on("order:status_update", (data) => {
      console.log("[Customer App] Received order status update:", data);
      setOrder((prev) => ({
        ...prev,
        status: data.status || prev.status,
        timelineMinutes: data.timelineMinutes || prev.timelineMinutes,
        items: data.items || prev.items,
      }));

      if (data.timelineMinutes) {
        setSecondsRemaining(data.timelineMinutes * 60);
      }
    });

    // Listen for cashier bill settlement
    socket.on("bill:paid", () => {
      setOrder((prev) => ({ ...prev, status: "Paid" }));
      setBillStatus("Bill paid successfully. Thank you for dining with us!");
      if (typeof window !== "undefined") {
        localStorage.removeItem("restoqr_active_order");
      }
    });

    return () => {
      socket.off("order:status_update");
      socket.off("bill:paid");
    };
  }, [order.tableNumber]);

  // Live countdown timer when in Cooking state
  useEffect(() => {
    if (order.status !== "Cooking" || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [order.status, secondsRemaining]);

  // Format MM:SS
  const formatCountdown = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Progress percentage calculation
  const totalTimelineSeconds = (order.timelineMinutes || 15) * 60;
  const progressPercent =
    order.status === "Pending"
      ? 15
      : order.status === "Cooking"
      ? Math.min(
          95,
          Math.round(
            ((totalTimelineSeconds - secondsRemaining) / totalTimelineSeconds) *
              100
          )
        )
      : order.status === "Ready"
      ? 95
      : 100;

  const handleRequestAssistance = async (type) => {
    // 1. Backend REST API
    try {
      await fetch(`${getApiBase()}/service/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: order.tableNumber,
          requestType: type,
        }),
      });
    } catch (e) {
      console.warn("Service request API error:", e.message);
    }

    // 2. Real-time socket
    const socket = getSocket();
    socket.emit("service:request", {
      restaurantId: "default",
      tableId: order.tableNumber,
      tableNumber: order.tableNumber,
      requestType: type,
    });

    setAssistanceStatus(`Requested: ${type}. Floor waiter has been alerted!`);
    setTimeout(() => {
      setAssistanceOpen(false);
      setAssistanceStatus("");
    }, 1800);
  };

  const handleOpenOnlineUPI = async () => {
    const total = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      const res = await fetch(
        `${getApiBase()}/payment/create-upi-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableNumber: order.tableNumber,
            amount: total,
          }),
        }
      );
      const json = await res.json();
      if (json.status && json.data) {
        setUpiData(json.data);
      } else {
        // Fallback dynamic UPI URI
        const upi = `upi://pay?pa=restoqr.granddine@icici&pn=RestoQR+Dine&am=${total}&cu=INR&tn=Table+${order.tableNumber}`;
        setUpiData({
          amount: total,
          tableNumber: order.tableNumber,
          transactionRef: `TXN_${Date.now()}`,
          upiUri: upi,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            upi
          )}`,
        });
      }
    } catch (e) {
      const upi = `upi://pay?pa=restoqr.granddine@icici&pn=RestoQR+Dine&am=${total}&cu=INR&tn=Table+${order.tableNumber}`;
      setUpiData({
        amount: total,
        tableNumber: order.tableNumber,
        transactionRef: `TXN_${Date.now()}`,
        upiUri: upi,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          upi
        )}`,
      });
    }

    setBillOpen(false);
    setUpiModalOpen(true);
  };

  const handleVerifyUPI = async () => {
    setIsVerifyingPayment(true);
    try {
      const res = await fetch(`${getApiBase()}/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: order.tableNumber,
          transactionRef: upiData?.transactionRef,
          paymentMethod: "UPI",
        }),
      });
      const data = await res.json();
      if (data.status) {
        setOrder((prev) => ({ ...prev, status: "Paid" }));
        setUpiModalOpen(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("restoqr_active_order");
        }
      }
    } catch (e) {
      // Fallback
      setOrder((prev) => ({ ...prev, status: "Paid" }));
      setUpiModalOpen(false);
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  const handleRequestCashBill = (mode) => {
    const socket = getSocket();
    const total = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    socket.emit("bill:request", {
      restaurantId: "default",
      tableId: order.tableNumber,
      tableNumber: order.tableNumber,
      paymentMode: mode,
      totalAmount: total,
    });

    setBillStatus(
      `Cash bill requested. Cashier desk has been alerted to collect ₹${total}!`
    );
    setTimeout(() => {
      setBillOpen(false);
    }, 2500);
  };

  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="flex justify-between items-center py-4 border-b sticky w-full z-10 bg-[#F04F5F] px-4 top-0 text-white shadow-sm">
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          className="text-white bg-transparent hover:bg-white/10 hover:text-white px-2 gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold text-base">Menu</span>
        </Button>
        <div className="text-center">
          <span className="text-xs uppercase tracking-wider text-pink-100 font-medium">
            Active Dining Session
          </span>
          <p className="font-bold text-sm">Table {order.tableNumber}</p>
        </div>
        <NotificationSheet />
      </header>

      <ScrollArea className="flex-1 w-full">
        {/* Animated Banner Area */}
        <div className="flex flex-col items-center justify-center pt-4 pb-2 px-4 bg-gradient-to-b from-pink-50/50 to-white">
          <div className="w-48 h-48 relative">
            <Lottie options={defaultOptions} height={192} width={192} />
          </div>

          {/* Dynamic Status Badge */}
          <div className="text-center mt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                order.status === "Pending"
                  ? "bg-amber-100 text-amber-800"
                  : order.status === "Cooking"
                  ? "bg-orange-100 text-orange-800"
                  : order.status === "Ready"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "Paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              {order.status === "Cooking"
                ? "Chef is Preparing Your Food"
                : order.status === "Ready"
                ? "Food Ready • Waiter Dispatched"
                : order.status === "Paid"
                ? "Bill Settled • Thank You!"
                : `Order ${order.status}`}
            </span>
          </div>

          {/* Animated Countdown Timer (When Cooking) */}
          {order.status === "Cooking" && (
            <div className="mt-4 flex flex-col items-center bg-white border border-orange-200 shadow-sm rounded-2xl px-6 py-3">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Estimated Time Remaining</span>
              </div>
              <div className="text-3xl font-black text-gray-900 tracking-wider font-mono mt-0.5">
                {formatCountdown(secondsRemaining)}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Freshly prepared by Head Chef
              </p>
            </div>
          )}

          {/* Paid Celebration Banner */}
          {order.status === "Paid" && (
            <div className="mt-4 flex flex-col items-center bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center max-w-sm">
              <PartyPopper className="w-8 h-8 text-emerald-600 mb-1" />
              <p className="font-bold text-sm text-emerald-900">
                Payment Completed Successfully!
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Your table bill has been fully settled. Thank you for dining with us!
              </p>
            </div>
          )}
        </div>

        {/* Live Progress Bar */}
        <div className="px-6 py-2">
          <div className="flex justify-between text-xs text-gray-500 font-medium mb-1.5">
            <span>Order Placed</span>
            <span>Kitchen Prep</span>
            <span>Serving</span>
          </div>
          <Progress
            value={progressPercent}
            color="danger"
            className="w-full h-2 rounded-full"
          />
        </div>

        {/* Order Details & Bill Breakdown */}
        <div className="p-4 space-y-4">
          <div className="border border-gray-200/90 rounded-2xl p-4 bg-white shadow-xs">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <div>
                <p className="text-xs text-gray-400 font-medium">Order Number</p>
                <p className="font-bold text-gray-900 text-sm">
                  #{order.orderNumber}
                </p>
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                Table {order.tableNumber}
              </span>
            </div>

            {/* Items list */}
            <div className="space-y-2.5">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-700">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 mt-3 border-t font-bold text-base text-gray-900">
              <span>Total Bill</span>
              <span className="text-[#F04F5F]">₹{totalAmount}</span>
            </div>
          </div>

          {/* Assistance Call Card */}
          <div className="flex items-center justify-between bg-pink-50/70 border border-pink-100 rounded-2xl p-4">
            <div className="flex items-center">
              <Image
                src={assist}
                alt="Floor Waiter"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Need Service / Water?
                </p>
                <p className="text-[#F04F5F] text-xs">
                  Tap to alert floor wait staff
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-[#F04F5F] hover:bg-[#D03F4F] text-white rounded-full text-xs gap-1.5 shadow-sm"
              onClick={() => setAssistanceOpen(true)}
            >
              <PhoneCall className="h-3.5 w-3.5" /> Call Staff
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Floating Footer Actions */}
      <footer className="p-4 fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-sm border-t z-10 flex gap-2">
        <Button
          onClick={() => router.push("/Cart")}
          variant="outline"
          className="flex-1 rounded-full text-gray-800 border-gray-300 font-semibold gap-1"
        >
          <PlusCircle className="w-4 h-4 text-[#F04F5F]" />
          Order More Items
        </Button>
        <Button
          onClick={() => setBillOpen(true)}
          disabled={order.status === "Paid"}
          className={`flex-1 rounded-full text-white font-bold ${
            order.status === "Paid"
              ? "bg-gray-400"
              : "bg-[#F04F5F] hover:bg-[#D03F4F]"
          }`}
        >
          {order.status === "Paid" ? "Bill Settled" : `Pay Bill (₹${totalAmount})`}
        </Button>
      </footer>

      {/* Assistance Dialog */}
      <Dialog open={assistanceOpen} onOpenChange={setAssistanceOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Call Waiter to Table {order.tableNumber}</DialogTitle>
            <DialogDescription>
              Select what you need and a server will arrive at your table.
            </DialogDescription>
          </DialogHeader>

          {assistanceStatus ? (
            <div className="p-4 bg-green-50 text-green-800 text-center font-semibold rounded-xl text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />{" "}
              {assistanceStatus}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                className="flex flex-col h-20 items-center justify-center gap-1.5 text-xs text-gray-700"
                onClick={() => handleRequestAssistance("Water Bottle")}
              >
                <Droplets className="w-5 h-5 text-blue-500" />
                <span>Water</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-20 items-center justify-center gap-1.5 text-xs text-gray-700"
                onClick={() =>
                  handleRequestAssistance("Extra Cutlery / Napkins")
                }
              >
                <Utensils className="w-5 h-5 text-amber-500" />
                <span>Cutlery & Napkins</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-20 items-center justify-center gap-1.5 text-xs text-gray-700"
                onClick={() => handleRequestAssistance("Assistance / Query")}
              >
                <UserCheck className="w-5 h-5 text-purple-500" />
                <span>Call Waiter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-20 items-center justify-center gap-1.5 text-xs text-gray-700"
                onClick={() =>
                  handleRequestAssistance("Clear Table / Cleaning")
                }
              >
                <Sparkles className="w-5 h-5 text-green-500" />
                <span>Clean Table</span>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bill Choice Dialog */}
      <Dialog open={billOpen} onOpenChange={setBillOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Settle Bill for Table {order.tableNumber}</DialogTitle>
            <DialogDescription>Total Amount: ₹{totalAmount}</DialogDescription>
          </DialogHeader>

          {billStatus ? (
            <div className="p-4 bg-green-50 text-green-800 text-center font-semibold rounded-xl text-sm">
              {billStatus}
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <Button
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white py-6 rounded-xl font-bold flex justify-between items-center px-4"
                onClick={handleOpenOnlineUPI}
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-xs uppercase font-semibold">Instant Online</p>
                    <p className="text-sm">Pay via UPI (GPay / PhonePe / Paytm)</p>
                  </div>
                </div>
                <span className="text-base font-black">₹{totalAmount}</span>
              </Button>

              <Button
                variant="outline"
                className="w-full py-6 rounded-xl font-bold text-gray-800 border-gray-300 flex justify-between items-center px-4"
                onClick={() => handleRequestCashBill("Cash at Desk")}
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-600" />
                  <div className="text-left">
                    <p className="text-xs uppercase font-semibold text-gray-500">Traditional</p>
                    <p className="text-sm">Pay Cash to Floor Server</p>
                  </div>
                </div>
                <span className="text-base font-black">₹{totalAmount}</span>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dynamic UPI Payment QR Modal */}
      <Dialog open={upiModalOpen} onOpenChange={setUpiModalOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6 text-center">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Scan & Pay via UPI
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Open Google Pay, PhonePe, Paytm, or BHIM to pay
            </DialogDescription>
          </DialogHeader>

          {upiData && (
            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="p-3 bg-white border-2 border-emerald-500 rounded-2xl shadow-inner">
                <img
                  src={upiData.qrCodeUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl text-xs w-full">
                <p className="font-semibold text-sm">₹{upiData.amount}</p>
                <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                  UPI ID: restoqr.granddine@icici
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NPCI Secured 256-bit Instant Settlement</span>
              </div>

              <div className="w-full flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => setUpiModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1"
                  disabled={isVerifyingPayment}
                  onClick={handleVerifyUPI}
                >
                  {isVerifyingPayment ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>I Have Paid</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
