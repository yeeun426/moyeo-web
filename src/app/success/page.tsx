import { Suspense } from "react";
import SuccessScreenContent from "./SuccessScreenContent";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#FCE3D2] to-white flex items-center justify-center">
          <p className="text-[#979797] text-lg">로딩 중...</p>
        </div>
      }
    >
      <SuccessScreenContent />
    </Suspense>
  );
}
