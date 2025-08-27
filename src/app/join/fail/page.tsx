"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-500">결제 실패</h1>
      <p className="mt-4">사유: {message || "알 수 없는 오류"}</p>
      <p className="text-sm text-gray-500 mt-2">(에러 코드: {code})</p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg font-bold"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
