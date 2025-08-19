"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const CHARACTER_IMAGES: Record<string, string> = {
  CAT: "/images/cat.png",
  BEAR: "/images/bear.png",
  RABBIT: "/images/rabbit.png",
  PIG: "/images/pig.png",
};

export default function SuccessScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nickname = searchParams.get("nickname") || "";
  const selectedCharacter = searchParams.get("selectedCharacter") || "CAT";

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2.4,
        ease: "easeInOut",
        repeat: Infinity,
      },
    });
  }, [controls]);

  const handleStart = () => {
    router.replace("/home"); // 또는 /tabs/home 등 라우터 규칙에 따라
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCE3D2] to-white flex flex-col justify-between items-center px-6 pt-24 pb-12">
      <div className="flex flex-col items-center">
        <motion.div animate={controls}>
          <Image
            src={CHARACTER_IMAGES[selectedCharacter]}
            alt="캐릭터 이미지"
            width={220}
            height={240}
            priority
          />
        </motion.div>
        <p className="text-[#979797] text-sm mt-4 font-paperlogy-regular">
          회원가입 완료!
        </p>
        <p className="text-xl font-paperlogy-bold mt-1">{nickname}님</p>
        <p className="text-xl font-paperlogy-bold">환영해요!</p>
      </div>

      <button
        onClick={handleStart}
        className="w-full max-w-md bg-[#fe8c00] text-white text-lg font-paperlogy-bold py-4 rounded-[15px]"
      >
        START
      </button>
    </div>
  );
}
