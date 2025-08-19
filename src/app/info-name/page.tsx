import { Suspense } from "react";
import InfoNameContent from "./InfoNameContent";

export default function InfoNamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#fce3d2]">
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <InfoNameContent />
    </Suspense>
  );
}
