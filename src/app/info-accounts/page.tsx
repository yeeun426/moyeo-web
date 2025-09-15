import { Suspense } from "react";
import AccountInfoContent from "./AccountInfoContent";
import LoadingSpinner from "components/common/LoadingSpinner";

export default function AccountInfoPage() {
  return (
    <Suspense fallback={<LoadingSpinner contents="로딩 중" />}>
      <AccountInfoContent />
    </Suspense>
  );
}
