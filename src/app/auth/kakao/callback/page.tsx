"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";

const KakaoCallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("인증 코드가 없습니다.");
      setLoading(false);
      return;
    }

    const sendCodeToBackend = async () => {
      try {
        setLoading(true);
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

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.data?.jwtAccessToken && !data?.data.newUser) {
          setError("로그인에 실패했습니다.");
          setLoading(false);
          return;
        }

        localStorage.setItem("accessToken", data.data.jwtAccessToken);

        if (data?.data.newUser) {
          router.push(`/info-name?provider=KAKAO&oauthId=${data.data.oauthId}`);
        } else {
          router.push("/home");
        }
      } catch (err) {
        console.error("로그인 처리 중 오류가 발생했습니다.", err);
        setError("로그인 처리 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    sendCodeToBackend();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <ClipLoader />
        <p className="mt-4 text-gray-600">로그인 처리 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>로그인 처리 중입니다...</p>
    </div>
  );
};

export default KakaoCallbackPage;
