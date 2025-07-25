"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import KakaoLoginButton from "../../components/KakaoLoginButton";
import PrimaryInput from "../../components/PrimaryInput";
import PrimaryButton from "../../components/PrimaryButton";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    router.push("/info-name");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fde6d9] px-[55px]">
      {/* 로고 이미지 */}
      <Image
        src="/images/icon.png" // public/images/icon.png
        alt="logo"
        width={150}
        height={150}
        className="mb-6"
        priority
      />

      {/* 입력 필드 */}
      <PrimaryInput
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <PrimaryInput
        type="password"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />

      {/* 로그인 버튼 */}
      <PrimaryButton onClick={handleLogin}>
        <span className="text-white text-[18px]">Login</span>
      </PrimaryButton>

      {/* 소셜 로그인 */}
      <div className="flex flex-row gap-[20px] mt-[20px]">
        <GoogleLoginButton />
        <KakaoLoginButton />
      </div>
    </div>
  );
}
