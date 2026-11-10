"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ZomatoSwiggyMenu from "@/components/ui/Menu/ZomatoSwiggyMenu";
import { CheckCircle2 } from "lucide-react";

function TableSessionWatcher() {
  const searchParams = useSearchParams();
  const [welcomeToast, setWelcomeToast] = useState("");

  useEffect(() => {
    const tableParam = searchParams.get("table");
    if (tableParam) {
      const clean = tableParam.trim().toUpperCase();
      if (typeof window !== "undefined") {
        localStorage.setItem("restoqr_table", clean);
      }
      setWelcomeToast(`✓ QR Scanned: Connected to Table ${clean}`);
      setTimeout(() => setWelcomeToast(""), 3500);

      // Verify table session with backend
      fetch(`http://localhost:8081/api/v1/table/by-number/${clean}`).catch(() => {});
    }
  }, [searchParams]);

  return (
    <>
      {welcomeToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] bg-white/95 backdrop-blur-md border border-gray-200 text-gray-900 font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#F04F5F] shrink-0" />
          <span className="truncate">{welcomeToast}</span>
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] font-sans antialiased">
      <div className="w-full max-w-6xl mx-auto min-h-screen bg-white shadow-sm relative overflow-x-hidden">
        <Suspense fallback={null}>
          <TableSessionWatcher />
        </Suspense>

        {/* Responsive Authentic Zomato Dine-in Menu (#F04F5F Theme) */}
        <ZomatoSwiggyMenu />
      </div>
    </main>
  );
}
