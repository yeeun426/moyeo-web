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
  "/search",
  "/profile",
  "/challenge-detail/[id]",
];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  const showTabBar = tabPages.some((page) =>
    page.includes("[id]")
      ? pathname.startsWith(page.replace("[id]", ""))
      : page === pathname
  );

  return (
    <div>
      <main className={showTabBar ? "pb-24" : ""}>{children}</main>
      {showTabBar && <TabBar currentPath={pathname} />}
    </div>
  );
}
