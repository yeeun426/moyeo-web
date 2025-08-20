// components/CustomTabBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, PenTool, Home, Search, MapPin } from "lucide-react";

interface CustomTabBarProps {
  currentPath: string;
}

const tabRoutes = [
  {
    name: "challenge",
    path: "/challenge",
    icon: Trophy,
    label: "Challenge",
  },
  {
    name: "create",
    path: "/create-challenge",
    icon: PenTool,
    label: "Create",
  },
  { name: "home", path: "/home", icon: Home, label: "Home" },
  { name: "success", path: "/success", icon: Search, label: "Success" },
  {
    name: "info-accounts",
    path: "/info-accounts",
    icon: MapPin,
    label: "Profile",
  },
];

export default function TabBar({ currentPath }: CustomTabBarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 max-w-[600px] -translate-x-1/2 w-full bg-white h-24 flex justify-around items-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-5 z-50">
      {tabRoutes.map((route) => {
        const Icon = route.icon;
        const isActive = currentPath === route.path;
        const isHome = route.name === "home";

        if (isHome) {
          return (
            <Link key={route.name} href={route.path} className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FD371F] to-[#FF844B] flex items-center justify-center mb-5 shadow-[0_12px_6px_rgba(241,82,35,0.2)]">
                <Icon size={18} color="white" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={route.name}
            href={route.path}
            className="flex flex-col items-center flex-1"
          >
            {!isActive && (
              <Icon size={22} color={isActive ? "#FF6A00" : "#ccc"} />
            )}
            {isActive && (
              <>
                <span className="text-xs text-black font-bold">
                  {route.label}
                </span>
                <div className="w-1 h-1 bg-[#FF6A00] rounded-full mt-0.5" />
              </>
            )}
          </Link>
        );
      })}
    </div>
  );
}
