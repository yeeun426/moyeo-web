"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GoogleCallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const savedState = sessionStorage.getItem("oauth_state");

    if (!code) {
      console.error("Google code 없음");
      router.push("/auth/error?message=authorization_code_missing");
      return;
    }

    if (state !== savedState) {
      console.error("state 불일치");
      return;
    }

    const sendCodeToBackend = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login/google/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        const data = await res.json();

        if (!data.data?.jwtAccessToken && !data?.data.newUser) {
          console.error("JWT 없음");
          return;
        }

        sessionStorage.setItem("accessToken", data.data.jwtAccessToken);
        sessionStorage.setItem("userId", data.data.userId);
        sessionStorage.setItem("nickname", data.data.nickname);
        sessionStorage.setItem("character", data.data.character);

        if (data?.data.newUser) {
          router.push(
            `/info-name?provider=GOOGLE&oauthId=${data.data.oauthId}`
          );
        } else {
          router.push("/home");
        }
      } catch (err) {
        console.error("구글 로그인 실패:", err);
        router.push("/auth/error?message=authorization_code_missing");
      }
    };

    sendCodeToBackend();
  }, [searchParams, router]);

  return <p>로그인 처리 중입니다...</p>;
};

export default GoogleCallbackContent;
