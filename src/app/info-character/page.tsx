import { Suspense } from "react";
import CharacterSelectContent from "./CharacterSelectContent";

export default function CharacterSelectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fde6d9] px-6">
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <CharacterSelectContent />
    </Suspense>
  );
}
