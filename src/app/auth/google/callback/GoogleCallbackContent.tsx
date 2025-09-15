"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "components/common/LoadingSpinner";
import { ERROR_MESSAGES, ERROR_ROUTES, STORAGE_KEYS } from "utils/constants";
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

interface ErrorState {
  hasError: boolean;
  message: string;
}

const GoogleCallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: "",
  });

  // 세션 스토리지 저장
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

    // OAuth state 정리
    sessionStorage.removeItem(STORAGE_KEYS.OAUTH_STATE);
  }, []);

  // 라우팅 처리 함수
  const handleNavigation = useCallback(
    (data: LoginResponse["data"]) => {
      if (data.newUser && data.oauthId) {
        router.push(`/info-name?provider=GOOGLE&oauthId=${data.oauthId}`);
      } else {
        router.push("/home");
      }
    },
    [router]
  );

  // 에러 처리 함수
  const handleError = useCallback(
    (message: string, route?: string) => {
      console.error("Google OAuth Error:", message);
      setError({ hasError: true, message });
      setLoading(false);

      if (route) {
        // 에러 페이지로 리다이렉트가 필요한 경우
        setTimeout(() => router.push(route), 2000);
      }
    },
    [router]
  );

  // OAuth State 검증 함수
  const validateState = useCallback(
    (receivedState: string | null): boolean => {
      const savedState = sessionStorage.getItem(STORAGE_KEYS.OAUTH_STATE);

      if (receivedState !== savedState) {
        handleError(ERROR_MESSAGES.STATE_MISMATCH, ERROR_ROUTES.STATE_MISMATCH);
        return false;
      }
      return true;
    },
    [handleError]
  );

  // API 호출 함수
  const sendCodeToBackend = useCallback(
    async (code: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login/google/callback`,
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

        // 응답 데이터 검증
        if (!data?.jwtAccessToken && !data?.newUser) {
          throw new Error(
            "Invalid response data - missing token and user info"
          );
        }

        // 세션 저장 및 라우팅
        saveToSessionStorage(data);
        handleNavigation(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("Google 로그인 처리 실패:", errorMessage);
        handleError(ERROR_MESSAGES.PROCESSING_ERROR, ERROR_ROUTES.LOGIN_FAILED);
      }
    },
    [saveToSessionStorage, handleNavigation, handleError]
  );

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      handleError(ERROR_MESSAGES.NO_CODE, ERROR_ROUTES.CODE_MISSING);
      return;
    }
    if (!validateState(state)) {
      return;
    }
    sendCodeToBackend(code);
  }, [searchParams, validateState, sendCodeToBackend, handleError]);

  const handleGoHome = useCallback(() => {
    router.push("/login");
  }, [router]);

  if (loading && !error.hasError) {
    return <LoadingSpinner contents="구글 로그인 처리중입니다" />;
  }

  if (error.hasError) {
    return <ErrorRouting error={error.message} handleGoHome={handleGoHome} />;
  }

  return null;
};

export default GoogleCallbackContent;
