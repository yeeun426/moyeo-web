"use client";

import Image from "next/image";

const KakaoLoginButton = () => {
  const handleLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <button onClick={handleLogin}>
      <Image
        src="/images/kakao.png"
        alt="카카오 로그인"
        width={40}
        height={40}
      />
    </button>
  );
};

export default KakaoLoginButton;
