import { Suspense } from "react";
import KakaoCallbackContent from "./KakaoCallbackContent";

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <p className="mt-4 text-gray-600">로그인 처리 중입니다...</p>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
