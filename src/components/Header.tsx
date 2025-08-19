"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Users } from "lucide-react";

export default function Header({
  title,
  background = "white",
}: {
  title: string;
  background?: string;
}) {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-between py-5 px-4"
      style={{ backgroundColor: background }}
    >
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-bold text-center ml-1">{title}</h1>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => router.push("/search")}
          className="p-1 mr-3 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
        >
          <Search size={22} />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
          <Users size={22} />
        </button>
      </div>
    </div>
  );
}
