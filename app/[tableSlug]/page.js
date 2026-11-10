"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ZomatoSwiggyMenu from "@/components/ui/Menu/ZomatoSwiggyMenu";
import { CheckCircle2 } from "lucide-react";

export default function TableDynamicRoute() {
  const router = useRouter();
  const params = useParams();
  const rawSlug = params?.tableSlug || "";
  const [tableNumber, setTableNumber] = useState("");
  const [welcomeToast, setWelcomeToast] = useState("");

  useEffect(() => {
    if (!rawSlug) return;

    // Parse slugs like 'table21', 'tableA1', 'table-21', 'table_5', or '21'
    let slugStr = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    let clean = slugStr.trim();

    // Check if starts with table prefix
    const lower = clean.toLowerCase();
    if (lower.startsWith("table-") || lower.startsWith("table_")) {
      clean = clean.substring(6);
    } else if (lower.startsWith("table")) {
      clean = clean.substring(5);
    } else if (lower.startsWith("t-") || lower.startsWith("t_")) {
      clean = clean.substring(2);
    }

    clean = clean.trim().toUpperCase() || "A1";

    setTableNumber(clean);
    if (typeof window !== "undefined") {
      localStorage.setItem("restoqr_table", clean);
    }

    setWelcomeToast(`✓ QR Scanned: Welcome to Table ${clean}!`);
    const timer = setTimeout(() => setWelcomeToast(""), 3500);

    // Verify table session with backend API
    const apiBase =
      typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.hostname}:8081/api/v1`
        : "http://localhost:8081/api/v1";
    fetch(`${apiBase}/table/by-number/${clean}`).catch(() => {});

    return () => clearTimeout(timer);
  }, [rawSlug]);

  return (
    <main className="min-h-screen bg-[#F8F9FA] font-sans antialiased">
      <div className="w-full max-w-6xl mx-auto min-h-screen bg-white shadow-sm relative overflow-x-hidden">
        {welcomeToast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] bg-white/95 backdrop-blur-md border border-gray-200 text-gray-900 font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#F04F5F] shrink-0" />
            <span className="truncate">{welcomeToast}</span>
          </div>
        )}

        {/* Dynamic customer dine-in menu for this scanned table */}
        <ZomatoSwiggyMenu initialTable={tableNumber} />
      </div>
    </main>
  );
}
