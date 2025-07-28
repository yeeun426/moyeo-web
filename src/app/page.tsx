"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// 2.5초 후 라우팅
const splashTimeout = 2500;
const BACKGROUND_COLOR = "#FDE6D9";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, splashTimeout);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className={`flex justify-center items-center h-screen `}
      style={{
        backgroundColor: BACKGROUND_COLOR,
        fontFamily: "var(--font-paperlogy-regular)",
      }}
    >
      테스트
      <Image
        src="/images/icon.png"
        alt="Logo"
        width={200}
        height={200}
        priority
      />
    </div>
  );
}
