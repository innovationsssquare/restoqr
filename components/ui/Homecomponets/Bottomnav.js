"use client";
import * as React from "react";
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { HomeIcon, GridIcon, ClipboardListIcon, ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Bottomnav() {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = React.useState("Home");

  React.useEffect(() => {
    switch (pathname) {
      case "/":
        setSelected("Home");
        break;
      case "/Category":
        setSelected("Category");
        break;
      case "/Cart":
        setSelected("Cart");
        break;
      case "/Table":
        setSelected("Table");
        break;
      case "/Order-status":
        setSelected("Cart");
        break;
      default:
        setSelected("Home");
    }
  }, [pathname]);

  const handleTabChange = (key) => {
    setSelected(key);
    switch (key) {
      case "Home":
        router.push("/");
        break;
      case "Category":
        router.push("/Category");
        break;
      case "Cart":
        router.push("/Cart");
        break;
      case "Table":
        router.push("/Table");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full right-0 flex justify-center items-center bg-white border-t border-gray-200">
      <Tabs
        className="w-full"
        aria-label="Bottom Navigation"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative   rounded-none p-2  border-b border-divider",
          cursor: "w-full bg-[#F04F5F] ",
          tab: "w-full px-0 h-12 flex flex-col justify-center items-center",
          tabContent: "group-data-[selected=true]:text-[#F04F5F] ",
        }}
        selectedKey={selected}
        onSelectionChange={handleTabChange}
      >
        <Tab
          key="home"
          title={
            <div className="flex flex-col justify-center items-center gap-1">
              <HomeIcon className="h-6 w-6" />
              <span>Home</span>
            </div>
          }
        />
        <Tab
          key="Category"
          title={
            <div className="flex flex-col justify-center items-center gap-1">
              <GridIcon className="h-6 w-6" />
              <span>Categories</span>
            </div>
          }
        />
        <Tab
          key="Table"
          title={
            <div className="flex flex-col justify-center items-center gap-1">
              <ClipboardListIcon className="h-6 w-6" />
              <span>Table</span>
            </div>
          }
        />
        <Tab
          key="Cart"
          title={
            <div className="flex flex-col justify-center items-center gap-1">
              <ShoppingCartIcon className="h-6 w-6" />
              <span>Cart</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
