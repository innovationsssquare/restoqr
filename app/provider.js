"use client";

import { useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export function Providers({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const table = params.get("table");
      if (table) {
        localStorage.setItem("restoqr_table", table);
        console.log(`[RestoQR] Bound session to Table: ${table}`);
      }
    }
  }, []);

  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
