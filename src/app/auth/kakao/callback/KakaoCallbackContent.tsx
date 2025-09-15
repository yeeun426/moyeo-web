"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "components/common/LoadingSpinner";
import { ERROR_MESSAGES, STORAGE_KEYS } from "utils/constants";
import ErrorRouting from "components/common/ErrorRouting";

interface LoginResponse {
  data: {
    jwtAccessToken?: string;
    userId?: number;
    nickname?: string;
    character?: string;
    newUser?: boolean;
    oauthId?: string;
  };
}

const KakaoCallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 세션 스토리지 저장 함수
  const saveToSessionStorage = useCallback((data: LoginResponse["data"]) => {
    const { jwtAccessToken, userId, nickname, character } = data;

    if (jwtAccessToken) {
      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, jwtAccessToken);
    }
    if (userId != null) {
      sessionStorage.setItem(STORAGE_KEYS.USER_ID, String(userId));
    }
    if (nickname) {
      sessionStorage.setItem(STORAGE_KEYS.NICKNAME, nickname);
    }
    if (character) {
      sessionStorage.setItem(STORAGE_KEYS.CHARACTER, character);
    }
  }, []);

  // 라우팅 함수
  const handleNavigation = useCallback(
    (data: LoginResponse["data"]) => {
      if (data.newUser && data.oauthId) {
        router.push(`/info-name?provider=KAKAO&oauthId=${data.oauthId}`);
      } else {
        router.push("/home");
      }
    },
    [router]
  );

  // API 호출 함수 분리
  const sendCodeToBackend = useCallback(
    async (code: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login/kakao/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: LoginResponse = await response.json();
        const { data } = result;

        if (!data?.jwtAccessToken && !data?.newUser) {
          throw new Error("Invalid response data");
        }

        // 세션 저장 및 라우팅
        saveToSessionStorage(data);
        handleNavigation(data);
      } catch (err) {
        console.error("카카오 로그인 처리 실패:", err);
        setError(ERROR_MESSAGES.PROCESSING_ERROR);
      } finally {
        setLoading(false);
      }
    },
    [saveToSessionStorage, handleNavigation]
  );

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError(ERROR_MESSAGES.NO_CODE);
      setLoading(false);
      return;
    }

    sendCodeToBackend(code);
  }, [searchParams, sendCodeToBackend]);

  // 홈으로 이동
  const handleGoHome = useCallback(() => {
    router.push("/login");
  }, [router]);

  if (loading) {
    return <LoadingSpinner contents="로그인 처리중입니다" />;
  }

  if (error) {
    return <ErrorRouting error={error} handleGoHome={handleGoHome} />;
  }
  return null;
};

export default KakaoCallbackContent;
