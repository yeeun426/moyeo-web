"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "components/common/LoadingSpinner";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const challengeId = searchParams.get("challengeId");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          alert("로그인이 필요합니다.");
          router.replace("/login");
          return;
        }

        // 1. 결제 승인 API (백엔드에 confirm 요청)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/payments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              method: "카드",
              paymentKey,
              orderId,
              totalAmount: Number(amount),
            }),
          }
        );

        const body = await res.json();
        if (!res.ok) {
          alert(body?.message || "결제 승인 실패");
          router.replace(`/join/fail`);
          return;
        }

        const paymentId = body?.data?.paymentId;

        // 2. 챌린지 참가 API
        const joinRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${challengeId}/participates`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              paymentId,
            }),
          }
        );

        const joinBody = await joinRes.json();

        if (!joinRes.ok) {
          alert(joinBody?.message || "챌린지 참가 실패");
          router.replace(`/challenge-detail/${challengeId}`);
          return;
        }

        // 성공 → 상세 페이지로 이동
        router.replace(`/challenge-detail/${challengeId}`);
      } catch (err) {
        console.error(err);
        alert("결제 처리 중 오류 발생");
      }
    };

    if (paymentKey && orderId && amount && challengeId) {
      confirmPayment();
    }
  }, [paymentKey, orderId, amount, challengeId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">결제 승인 중...</h1>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner contents="로딩 중" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
