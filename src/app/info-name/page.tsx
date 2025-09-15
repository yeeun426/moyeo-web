import { Suspense } from "react";
import InfoNameContent from "./InfoNameContent";
import LoadingSpinner from "components/common/LoadingSpinner";

export default function InfoNamePage() {
  return (
    <Suspense fallback={<LoadingSpinner contents="로딩 중" />}>
      <InfoNameContent />
    </Suspense>
  );
}
