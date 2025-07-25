"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const KakaoLoginButton = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      console.log("카카오 로그인 요청 시작");

      // 1. 백엔드에 로그인 요청 (백엔드가 카카오 로그인 리디렉션 처리)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login/kakao`,
        {
          method: "GET",
          credentials: "include", // 필요한 경우
        }
      );

      const data = await response.json();
      console.log("카카오 로그인 응답:", data);

      if (!data.data.jwtAccessToken) {
        console.error("jwtAccessToken이 없습니다!");
        return;
      }

      // 2. 로컬 스토리지 저장
      localStorage.setItem("accessToken", data.data.jwtAccessToken);

      // 3. 분기 처리
      if (!data.newUser) {
        router.push("/home");
      } else {
        router.push(`/info-name?provider=KAKAO&oauthId=${data.data.oauthId}`);
      }
    } catch (err) {
      console.error("카카오 로그인 실패", err);
    }
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
