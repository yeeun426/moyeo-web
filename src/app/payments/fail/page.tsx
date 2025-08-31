"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentFailContent() {
  const sp = useSearchParams();
  const router = useRouter();

  // Toss가 넘겨주는 대표 파라미터들
  const { code, message, orderId, challengeId } = useMemo(
    () => ({
      code: sp.get("code") ?? "UNKNOWN_ERROR",
      message: sp.get("message") ?? "결제가 취소되었거나 실패했습니다.",
      orderId: sp.get("orderId") ?? "",
      // 우리가 결제 시 success/fail URL에 같이 실어 보낸 값(선택)
      challengeId: sp.get("challengeId") ?? "",
    }),
    [sp]
  );

  const goBackToCheckout = () => {
    // 결제 재시도: 챌린지 생성 요약 모달로 돌아가거나 해당 상세/체크아웃으로 이동
    if (challengeId) {
      router.replace(`/challenge-detail/${challengeId}`); // 네 라우트에 맞게 조정
      return;
    }
    router.replace("/");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">결제에 실패했어요</h1>
        <p className="text-sm text-gray-600">
          결제가 정상적으로 완료되지 않았습니다. 아래 정보를 확인해 주세요.
        </p>
      </div>

      <div className="w-full rounded-xl border bg-white p-4 text-left">
        <dl className="space-y-2 text-sm">
          <div className="flex items-start justify-between">
            <dt className="font-medium">오류 코드</dt>
            <dd className="ml-4 break-all text-gray-700">{code}</dd>
          </div>
          <div className="flex items-start justify-between">
            <dt className="font-medium">오류 메시지</dt>
            <dd className="ml-4 break-all text-gray-700">{message}</dd>
          </div>
          {orderId && (
            <div className="flex items-start justify-between">
              <dt className="font-medium">주문 번호</dt>
              <dd className="ml-4 break-all text-gray-700">{orderId}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={goBackToCheckout}
          className="w-full rounded-xl bg-black py-3 text-white"
        >
          결제 다시 시도
        </button>
        <button
          onClick={() => router.replace("/")}
          className="w-full rounded-xl border border-gray-300 bg-white py-3"
        >
          홈으로 가기
        </button>
      </div>

      <p className="text-xs text-gray-500">
        같은 문제가 반복되면 브라우저 시크릿 모드, 다른 결제수단을 사용하거나
        잠시 후 다시 시도해 주세요.
      </p>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          로딩 중...
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
