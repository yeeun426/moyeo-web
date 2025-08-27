"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState("결제 승인 중...");
  const token = sessionStorage.getItem("accessToken") || "";
  useEffect(() => {
    const paymentKey = sp.get("paymentKey");
    const orderId = sp.get("orderId");
    const amount = sp.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setMsg("필수 파라미터가 없습니다.");
      return;
    }

    (async () => {
      try {
        // 1. 결제 생성 API 호출
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

        if (!res.ok) throw new Error("결제 생성 실패");
        const payData = await res.json();
        const paymentId = payData.data.paymentId;

        // 2. 세션에 저장된 챌린지 payload 가져오기
        const payloadStr = sessionStorage.getItem("challengePayload");
        if (!payloadStr) throw new Error("챌린지 데이터 없음");
        const payload = JSON.parse(payloadStr);

        // 3. 챌린지 생성 API 호출
        const challengeRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({ ...payload, paymentId }),
          }
        );

        if (!challengeRes.ok) throw new Error("챌린지 생성 실패");
        const challengeData = await challengeRes.json();

        const challengeId = challengeData.data.challengeId;

        // 4. 상세 페이지로 이동
        router.replace(`/challenge-detail/${challengeId}`);
      } catch (e) {
        console.error(e);
        setMsg("챌린지 생성 중 오류가 발생했습니다.");
      }
    })();
  }, [sp, router]);

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-2 text-xl font-semibold">결제 결과</h1>
      <p>{msg}</p>
    </div>
  );
}
