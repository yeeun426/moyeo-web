import { Suspense } from "react";
import AccountInfoContent from "./AccountInfoContent";

export default function AccountInfoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fce3d2] px-4">
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <AccountInfoContent />
    </Suspense>
  );
}
