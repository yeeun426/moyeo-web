import { Suspense } from "react";
import GoogleCallbackContent from "./GoogleCallbackContent";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>로그인 처리 중...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
