"use client";

import TabBar from "./TabBar";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const tabPages = [
  "/home",
  "/challenge",
  "/create-challenge",
  "/success",
  "/info-accounts",
];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const showTabBar = tabPages.includes(pathname);

  return (
    <div>
      <main className={showTabBar ? "pb-24" : ""}>{children}</main>
      {showTabBar && <TabBar currentPath={pathname} />}
    </div>
  );
}
