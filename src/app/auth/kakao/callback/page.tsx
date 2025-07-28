"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const KakaoCallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const sendCodeToBackend = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login/kakao/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        const data = await res.json();
        console.log("카카오 로그인 응답:", data);

        if (!data.data?.jwtAccessToken) {
          console.error("JWT 없음");
          return;
        }

        localStorage.setItem("accessToken", data.data.jwtAccessToken);

        if (data?.data.newUser) {
          router.push(`/info-name?provider=KAKAO&oauthId=${data.data.oauthId}`);
        } else {
          router.push("/home");
        }
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
      }
    };

    sendCodeToBackend();
  }, [searchParams, router]);

  return <p>로그인 처리 중입니다...</p>;
};

export default KakaoCallbackPage;
