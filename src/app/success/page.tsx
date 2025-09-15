import { Suspense } from "react";
import SuccessScreenContent from "./SuccessScreenContent";
import LoadingSpinner from "components/common/LoadingSpinner";

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner contents="로딩 중" />}>
      <SuccessScreenContent />
    </Suspense>
  );
}
