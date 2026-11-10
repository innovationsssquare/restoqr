"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Users, ArrowRightLeft, CheckCircle2, RefreshCw, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationSheet from "@/components/ui/Homecomponets/Notification";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";

export default function TableSwitchScreen() {
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState("A1");
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switchMessage, setSwitchMessage] = useState("");

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/api/v1/table/getAll");
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        setTables(
          json.data.map((t) => ({
            id: t._id,
            number: t.tableNumber,
            capacity: t.capacity || 4,
            isOccupied: t.status !== "Vacant",
            status: t.status || "Vacant",
          }))
        );
      } else {
        loadFallbackTables();
      }
    } catch (e) {
      loadFallbackTables();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackTables = () => {
    setTables([
      { id: "1", number: "A1", capacity: 2, isOccupied: false, status: "Vacant" },
      { id: "2", number: "A2", capacity: 4, isOccupied: true, status: "Occupied" },
      { id: "3", number: "B1", capacity: 6, isOccupied: false, status: "Vacant" },
      { id: "4", number: "B2", capacity: 2, isOccupied: true, status: "Occupied" },
      { id: "5", number: "C1", capacity: 8, isOccupied: false, status: "Vacant" },
      { id: "6", number: "C2", capacity: 4, isOccupied: false, status: "Vacant" },
    ]);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("restoqr_table");
      if (stored) setCurrentTable(stored);
    }
    fetchTables();
  }, []);

  const handleTableSwitch = (targetTable) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("restoqr_table", targetTable.number);
    }
    setCurrentTable(targetTable.number);

    try {
      const socket = getSocket();
      socket.emit("join_table", {
        restaurantId: "default",
        tableId: targetTable.number,
        tableNumber: targetTable.number,
      });
    } catch (e) {}

    setSwitchMessage(`Successfully switched session to Table ${targetTable.number}!`);
    setTimeout(() => {
      setSwitchMessage("");
      router.push("/");
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <header className="text-white p-4 flex justify-between bg-[#F04F5F] items-center border-b sticky top-0 w-full z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Switch Dining Table</h1>
            <p className="text-xs text-white/80">Current: Table {currentTable}</p>
          </div>
        </div>
        <NotificationSheet />
      </header>

      {switchMessage && (
        <div className="p-3 bg-emerald-100 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5 border-b border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {switchMessage}
        </div>
      )}

      <main className="flex-grow p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Available Restaurant Tables ({tables.filter((t) => !t.isOccupied).length})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTables}
            className="text-xs text-gray-600 gap-1 h-7"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-3">
            {tables.map((table) => {
              const isCurrent = table.number === currentTable;
              return (
                <div
                  key={table.id}
                  className={`bg-white rounded-2xl p-4 border transition flex flex-col justify-between shadow-xs ${
                    isCurrent
                      ? "border-[#F04F5F] ring-2 ring-[#F04F5F]/20 bg-rose-50/20"
                      : table.isOccupied
                      ? "opacity-60 bg-gray-100 border-gray-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-base font-bold text-gray-900">
                        Table {table.number}
                      </span>
                      {isCurrent && (
                        <p className="text-[10px] font-bold text-[#F04F5F]">● Your Table</p>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{table.capacity}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t">
                    {isCurrent ? (
                      <span className="text-xs font-bold text-[#F04F5F] block text-center">
                        Active Table
                      </span>
                    ) : table.isOccupied ? (
                      <span className="text-xs font-medium text-gray-400 block text-center">
                        Occupied
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full bg-[#F04F5F] hover:bg-[#D03F4F] text-white text-xs h-8 rounded-xl font-bold"
                        onClick={() => handleTableSwitch(table)}
                      >
                        Switch Here
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
