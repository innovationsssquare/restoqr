"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BellRing,
  Droplets,
  Utensils,
  Receipt,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Send,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Flame,
  Coffee,
} from "lucide-react";

const getApiBase = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8081/api/v1`;
  }
  return "http://localhost:8081/api/v1";
};
const API_BASE = getApiBase();

const QUICK_SERVICE_OPTIONS = [
  {
    id: "water_chilled",
    icon: Droplets,
    title: "Chilled Drinking Water",
    desc: "Bottled / iced drinking water for table",
    tag: "Urgent",
  },
  {
    id: "cutlery",
    icon: Utensils,
    title: "Extra Cutlery & Plates",
    desc: "Extra spoons, forks, serving bowls & napkins",
    tag: "Service",
  },
  {
    id: "condiments",
    icon: Flame,
    title: "Chutney & Condiments",
    desc: "Mint chutney, pickled onions, salt & pepper",
    tag: "Kitchen",
  },
  {
    id: "clean_table",
    icon: Sparkles,
    title: "Clear & Wipe Table",
    desc: "Clean empty plates, spills or fresh napkins",
    tag: "Housekeeping",
  },
  {
    id: "running_bill",
    icon: Receipt,
    title: "Request Running Bill",
    desc: "Review table bill, pay via UPI QR or Card machine",
    tag: "Billing",
  },
  {
    id: "call_captain",
    icon: BellRing,
    title: "Call Floor Captain",
    desc: "Speak with head chef or restaurant manager",
    tag: "Assistance",
  },
];

export default function WaiterPage() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState("A1");
  const [section, setSection] = useState("Indoor AC");
  const [guestCount, setGuestCount] = useState(2);
  const [customNote, setCustomNote] = useState("");
  const [activeRequests, setActiveRequests] = useState([]);
  const [toastText, setToastText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTable = localStorage.getItem("restoqr_table") || "A1";
      setTableNumber(storedTable);
      const storedGuests = localStorage.getItem(`restoqr_guests_${storedTable}`) || "2";
      setGuestCount(Number(storedGuests));

      const storedReqs = localStorage.getItem(`restoqr_waiter_calls_${storedTable}`);
      if (storedReqs) {
        try {
          setActiveRequests(JSON.parse(storedReqs));
        } catch (e) {}
      }
    }
  }, []);

  const showToast = (msg) => {
    setToastText(msg);
    setTimeout(() => setToastText(""), 3500);
  };

  const handleSendRequest = async (requestTitle, requestDetails = "") => {
    setIsSending(true);
    const newReq = {
      id: Date.now().toString(),
      title: requestTitle,
      details: requestDetails || requestTitle,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Dispatched to Waiter Expo",
    };

    try {
      await fetch(`${API_BASE}/service/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber,
          requestType: requestTitle,
          notes: `${requestTitle}: ${requestDetails} (Table ${tableNumber}, ${guestCount} Guests)`,
        }),
      });

      const updated = [newReq, ...activeRequests.slice(0, 5)];
      setActiveRequests(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem(`restoqr_waiter_calls_${tableNumber}`, JSON.stringify(updated));
      }
      showToast(`✓ Waiter alerted: "${requestTitle}"`);
      setCustomNote("");
    } catch (e) {
      const updated = [newReq, ...activeRequests.slice(0, 5)];
      setActiveRequests(updated);
      showToast(`✓ Request recorded for Table ${tableNumber}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-[#1C1C1C] pb-24 font-sans">
      {/* Toast Alert */}
      {toastText && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] bg-white/95 backdrop-blur-md border border-gray-200 text-gray-900 text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F04F5F] shrink-0" />
          <span className="truncate">{toastText}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#F04F5F] text-white px-4 pt-4 pb-6 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10 mb-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3 py-1.5 rounded-full transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100">Dine-In Session</span>
            <h1 className="text-sm sm:text-base font-black">Table {tableNumber}</h1>
          </div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
            <BellRing className="w-3 h-3 text-amber-200" />
            <span>Waiter Service Desk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">How can our staff serve you?</h2>
          <p className="text-xs text-white/90 font-medium mt-0.5">
            Instant 1-tap table call directly sent to Waiter handheld POS & Floor Expo
          </p>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-xl mx-auto px-4 -mt-3 relative z-10 space-y-4">
        {/* Table Host Status Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#F04F5F] border border-rose-200 flex items-center justify-center font-black text-sm">
              T{tableNumber}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1C1C1C]">Table {tableNumber} • {section}</h3>
              <p className="text-xs text-gray-500 font-medium">{guestCount} Guests Seated • Captain on Floor</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Host Active</span>
          </div>
        </div>

        {/* 1-Tap Quick Service Grid */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5 px-1">
            Instant 1-Tap Table Calls
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_SERVICE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSendRequest(opt.title, opt.desc)}
                  disabled={isSending}
                  className="bg-white hover:bg-rose-50/50 p-3.5 rounded-2xl border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#F04F5F]/40 transition text-left flex flex-col justify-between group active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 group-hover:bg-[#F04F5F] text-[#F04F5F] group-hover:text-white transition flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{opt.tag}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1C1C] group-hover:text-[#F04F5F] transition leading-tight">
                      {opt.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Waiter Note Request */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/90">
          <div className="flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-4 h-4 text-[#F04F5F]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Custom Waiter Request</h3>
          </div>
          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder='Type specific request, e.g. "Need baby high-chair", "Table corner is shaky", "Please send manager"...'
            rows={2}
            className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#F04F5F] placeholder-gray-400 bg-gray-50/50 resize-none font-medium"
          />
          <div className="mt-2.5 flex justify-end">
            <button
              onClick={() => customNote.trim() && handleSendRequest("Custom Table Call", customNote.trim())}
              disabled={!customNote.trim() || isSending}
              className="bg-[#F04F5F] hover:bg-[#D6293C] disabled:bg-gray-300 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Request to Waiter</span>
            </button>
          </div>
        </div>

        {/* Active Calls History / Live Status */}
        {activeRequests.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/90">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" /> Recent Table Calls
              </h3>
              <button
                onClick={() => {
                  setActiveRequests([]);
                  if (typeof window !== "undefined") {
                    localStorage.removeItem(`restoqr_waiter_calls_${tableNumber}`);
                  }
                }}
                className="text-[10px] text-gray-400 hover:text-gray-600 font-semibold"
              >
                Clear History
              </button>
            </div>

            <div className="space-y-2">
              {activeRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <span className="font-bold text-[#1C1C1C] block">{req.title}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{req.details}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-700 block bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Dispatched
                    </span>
                    <span className="text-[9px] text-gray-400">{req.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Return to Menu Button */}
        <div className="pt-2">
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200/90 text-gray-800 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
            <span>Return to Food Menu</span>
          </button>
        </div>
      </main>
    </div>
  );
}

