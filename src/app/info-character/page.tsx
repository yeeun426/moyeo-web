import { Suspense } from "react";
import CharacterSelectContent from "./CharacterSelectContent";
import LoadingSpinner from "components/common/LoadingSpinner";

export default function CharacterSelectPage() {
  return (
    <Suspense fallback={<LoadingSpinner contents="로딩 중" />}>
      <CharacterSelectContent />
    </Suspense>
  );
}
