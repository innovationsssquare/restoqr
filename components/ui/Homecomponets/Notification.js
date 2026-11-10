"use client";

import React, { useState, useEffect } from "react";
import { Bell, MoreVertical, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getSocket } from "@/lib/socket";

export default function NotificationSheet() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n_welcome",
      title: "Welcome to RestoQR!",
      message: "Scan table QR or use Voice AI to place your order anytime.",
      time: "Just now",
      isRead: false,
    },
  ]);

  useEffect(() => {
    try {
      const socket = getSocket();

      socket.on("order:status_update", (data) => {
        const title =
          data.status === "Cooking"
            ? "🍳 Kitchen Started Cooking"
            : data.status === "Ready"
            ? "🔔 Food Ready for Pickup"
            : data.status === "Served"
            ? "✨ Order Served"
            : `Order ${data.status}`;

        const msg = data.message || `Table order status changed to ${data.status}.`;

        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}`,
            title,
            message: msg,
            time: "Just now",
            isRead: false,
          },
          ...prev,
        ]);
      });

      socket.on("service:resolved", (data) => {
        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}`,
            title: "✓ Assistance Handled",
            message: `Table ${data.tableNumber} request was fulfilled by server.`,
            time: "Just now",
            isRead: false,
          },
          ...prev,
        ]);
      });

      socket.on("bill:paid", (data) => {
        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}`,
            title: "💳 Payment Successful",
            message: `Bill of ₹${data.amount || data.totalPrice || ""} paid. Thank you!`,
            time: "Just now",
            isRead: false,
          },
          ...prev,
        ]);
      });

      return () => {
        socket.off("order:status_update");
        socket.off("service:resolved");
        socket.off("bill:paid");
      };
    } catch (e) {}
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:text-white hover:bg-white/10"
        >
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute 1 top-1 right-1 h-4 w-4 bg-amber-300 text-neutral-900 font-bold rounded-full flex items-center justify-center text-[10px] shadow-sm">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-6">
        <SheetHeader className="flex flex-row items-center justify-between pb-3 border-b">
          <SheetTitle className="text-lg font-bold text-gray-900">Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="text-xs text-[#F04F5F] hover:bg-pink-50 h-7 px-2"
            >
              Mark all read
            </Button>
          )}
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-3">
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`p-3.5 rounded-xl border transition ${
                  notification.isRead
                    ? "bg-white border-gray-100"
                    : "bg-pink-50/50 border-pink-100 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full mt-0.5 ${
                      notification.isRead ? "bg-gray-100 text-gray-500" : "bg-[#F04F5F] text-white"
                    }`}
                  >
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-xs text-gray-900">{notification.title}</h2>
                    <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
