"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { userService } from "service/userApiService";

const CHARACTER_IMAGES = [
  "/images/cat_profile.png",
  "/images/bear_profile.png",
  "/images/rabbit_profile.png",
  "/images/pig_profile.png",
];
const CHARACTER_NAMES = ["CAT", "BEAR", "RABBIT", "PIG"];

export default function CharacterSelectScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const provider = searchParams.get("provider") || "";
  const oauthId = searchParams.get("oauthId") || "";
  const nickname = searchParams.get("nickname") || "";
  const bank = searchParams.get("bank") || "";
  const account = searchParams.get("account") || "";

  const handleGoToSuccess = async () => {
    try {
      const data = await userService.postUsers({
        provider,
        oauthId,
        nickname,
        character: CHARACTER_NAMES[selectedIndex],
        bank,
        accountNumber: account,
      });
      console.log("회원 등록 완료:", data);

      router.replace(
        `/success?nickname=${nickname}&selectedCharacter=${CHARACTER_NAMES[selectedIndex]}`
      );
    } catch (err) {
      console.error("회원 등록 실패:", err);
      alert("회원 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fde6d9] px-6">
      <h1 className="text-xl font-bold font-paperlogy-bold mb-2">
        모여모여에서 사용할 캐릭터를 골라주세요.
      </h1>
      <p className="text-sm text-gray-500 font-paperlogy-regular mb-8">
        캐릭터는 한 번 고른 후 변경이 어렵습니다.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-10">
        {CHARACTER_IMAGES.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`rounded-[30px] border-4 transition-all duration-200 ${
              selectedIndex === idx
                ? "border-[#fe8c00] opacity-100"
                : "border-transparent opacity-70"
            }`}
          >
            <Image
              src={src}
              alt={`character-${CHARACTER_NAMES[idx]}`}
              width={150}
              height={150}
              className="rounded-[30px] shadow-md"
            />
          </button>
        ))}
      </div>

      <button
        onClick={handleGoToSuccess}
        className="w-full max-w-md rounded-[15px] bg-[#fe8c00] py-4 text-white text-lg font-paperlogy-bold"
      >
        START
      </button>
    </div>
  );
}
