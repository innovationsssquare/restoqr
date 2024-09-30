"use client";

import { useState } from "react";
import { Search, Bell, Mic, Battery, Signal, Wifi } from "lucide-react";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock suggestions - replace with actual data or API call in a real app
  const suggestions = ["Pizza", "Burger", "Sushi", "Pasta", "Salad"].filter(
    (item) => item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full rounded-b-lg  mx-auto bg-[#F04F5F] text-white font-sans">
      {/* Main Header Content */}
      <div className="px-5 pt-4 pb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hello there!</h1>
            <p className="text-sm">What would you like to eat?</p>
          </div>
          <div className="relative">
            <Bell className="h-7 w-7" />
            <span className="absolute -top-2 -right-1 bg-white text-[#F04F5F] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              2
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#F04F5F]" />
          </div>
          <input
            type="text"
            placeholder="Search for Dishes"
            className="w-full py-3 pl-10 pr-10 rounded-md bg-white text-gray-500 placeholder-gray-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <Mic className="h-5 w-5 text-[#F04F5F]" />
          </div>
        </div>

        {/* Suggestions Window */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 left-0 right-0  bg-white rounded-lg shadow-lg w-11/12 mx-auto overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => {
                  setSearchTerm(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
