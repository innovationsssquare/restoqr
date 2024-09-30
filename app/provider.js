"use client";

import Bottomnav from "@/components/ui/Homecomponets/Bottomnav";
import FoodCategories from "@/components/ui/Homecomponets/Categories";
import Header from "@/components/ui/Homecomponets/Header";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

export function Providers({ children }) {
  const pathname = usePathname();

  return <NextUIProvider>
  {(pathname !== '/Cart' && pathname !== '/Order-status' ) && <Header/>}
  { (pathname !== '/Cart' && pathname !== '/Order-status' ) &&<FoodCategories/>}
  {children}
 { pathname !== '/Order-status' && <Bottomnav/>}
  </NextUIProvider>;
}
