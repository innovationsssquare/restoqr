"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Mic, UtensilsCrossed, Edit2, Check, Sparkles } from "lucide-react";
import VoiceSearch from "./Voicesearch";
import NotificationSheet from "./Notification";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tableNumber, setTableNumber] = useState("A1");
  const [editingTable, setEditingTable] = useState(false);
  const [tempTable, setTempTable] = useState("A1");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("restoqr_table");
      if (stored) {
        setTableNumber(stored);
        setTempTable(stored);
      }
    }
  }, []);

  const handleSaveTable = () => {
    if (tempTable.trim()) {
      const clean = tempTable.trim().toUpperCase();
      setTableNumber(clean);
      if (typeof window !== "undefined") {
        localStorage.setItem("restoqr_table", clean);
      }
      setEditingTable(false);
    }
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setShowSuggestions(val.length > 0);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("restoqr_filter_change", {
          detail: {
            search: val,
            category: "all",
          },
        })
      );
    }
  };

  const suggestions = [
    "Hyderabadi Chicken Biryani",
    "Veg Dum Biryani",
    "Paneer Tikka",
    "Butter Naan",
    "Tandoori Chicken",
    "Fresh Lime Soda",
  ].filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full rounded-b-3xl mx-auto bg-gradient-to-br from-[#F04F5F] via-[#E03546] to-[#C92A39] text-white font-sans shadow-lg">
      <div className="px-5 pt-4 pb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">RestoQR Grand Dine</h1>
              {editingTable ? (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30 text-xs">
                  <input
                    type="text"
                    value={tempTable}
                    onChange={(e) => setTempTable(e.target.value)}
                    className="w-12 bg-transparent text-white font-bold outline-none text-center"
                    autoFocus
                  />
                  <button onClick={handleSaveTable} className="text-white hover:text-green-200" title="Save">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingTable(true)}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/30 text-xs font-semibold text-white tracking-wide transition shadow-xs"
                  title="Click to switch table"
                >
                  <UtensilsCrossed className="w-3 h-3 text-amber-200" />
                  <span>Table {tableNumber}</span>
                  <Edit2 className="w-2.5 h-2.5 opacity-70 ml-0.5" />
                </button>
              )}
            </div>
            <p className="text-xs text-white/90">Scan, Speak with Voice AI & Order at your table</p>
          </div>
          <div className="relative">
            <NotificationSheet />
          </div>
        </div>

        {/* Search Bar with ConfirmTkt Voice AI */}
        <div className="relative mt-4">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#F04F5F]" />
          </div>
          <input
            type="text"
            placeholder="Search dishes or tap mic for ConfirmTkt Voice AI..."
            className="w-full py-3 pl-10 pr-12 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none shadow-sm text-xs sm:text-sm font-medium"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            <VoiceSearch />
          </div>
        </div>

        {/* Suggestions Window */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-30 mt-1 left-5 right-5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-800 hover:bg-rose-50 hover:text-[#F04F5F] transition flex items-center justify-between"
                onClick={() => {
                  handleSearchChange(suggestion);
                  setShowSuggestions(false);
                }}
              >
                <span>{suggestion}</span>
                <span className="text-[10px] text-gray-400">Tap to filter</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
