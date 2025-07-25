"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const bankCodeMap: Record<string, string> = {
  국민은행: "KB",
  신한은행: "SHINHAN",
  우리은행: "WOORI",
  하나은행: "HANA",
  카카오뱅크: "KAKAO",
  농협은행: "NH",
  토스뱅크: "TOSS",
};

export default function AccountInfo() {
  const router = useRouter();
  const params = useSearchParams();
  const provider = params.get("provider") || "";
  const oauthId = params.get("oauthId") || "";
  const nickname = params.get("nickname") || "";

  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleNext = () => {
    const bankCode = bankCodeMap[selectedBank] || "";
    router.push(
      `/info-character?provider=${provider}&oauthId=${oauthId}&nickname=${nickname}&bank=${bankCode}&account=${accountNumber}`
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fce3d2] px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-xl font-bold">계좌 정보를 입력해주세요.</h1>

        {/* 은행 선택 */}
        <button
          onClick={() => setModalVisible(true)}
          className="w-full border-b-2 border-orange-400 py-3 text-left text-lg"
        >
          {selectedBank || "은행을 선택해주세요"}
        </button>

        {/* 계좌번호 입력 */}
        <input
          type="text"
          inputMode="numeric"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="계좌번호"
          className="w-full border-b-2 border-orange-400 bg-transparent py-3 text-lg outline-none placeholder:text-[#bababa]"
        />

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!selectedBank || accountNumber.length <= 5}
          className={`w-full rounded-[15px] bg-[#fe8c00] py-4 text-lg text-white transition-opacity ${
            !selectedBank || accountNumber.length <= 5
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100"
          }`}
        >
          Next
        </button>
      </div>

      {/* 은행 선택 모달 */}
      {modalVisible && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30">
          <div className="w-80 rounded-lg bg-white p-4 shadow-lg">
            {Object.keys(bankCodeMap).map((bank) => (
              <button
                key={bank}
                onClick={() => {
                  setSelectedBank(bank);
                  setModalVisible(false);
                }}
                className="w-full border-b py-3 text-center text-sm hover:bg-gray-100"
              >
                {bank}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
