"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface FixedBtnProps {
  url?: string; // Next.js router의 경로
  label?: string;
  onPress?: () => void; // 커스텀 onPress 지원
}

const FixedBtn = ({ url, label = "Add Challenge", onPress }: FixedBtnProps) => {
  const router = useRouter();

  const goToNext = () => {
    if (onPress) {
      onPress(); // 커스텀 onPress 우선
    } else if (url) {
      router.push(url);
    }
  };

  return (
    <div className="m-5 z-50">
      <button
        className="w-full bg-gradient-to-b from-[#FE8C00] to-[#FE6338] rounded-[14px] shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
        onClick={goToNext}
      >
        <div className="py-4 px-6 rounded-3 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{label}</span>
        </div>
      </button>
    </div>
  );
};

export default FixedBtn;
