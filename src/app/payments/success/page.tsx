"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState("결제 승인 중...");

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
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });

        if (!res.ok) throw new Error("승인 실패");
        const data = await res.json();
        setMsg("결제가 완료되었습니다 🎉");
        // TODO: 주문 완료 화면으로 이동/표시
        // router.replace(`/orders/${orderId}`);
      } catch (e) {
        setMsg("승인 처리 중 오류가 발생했습니다.");
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
