"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { userService } from "../../service/userApiService";

export default function InfoNameContent() {
  const router = useRouter();
  const params = useSearchParams();
  const provider = params.get("provider");
  const oauthId = params.get("oauthId");

  const [nickname, setNickname] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 간단한 fade-in + slide-in 애니메이션용
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await userService.postValidNickname({ nickname });
      console.log("닉네임 유효성 통과", res);

      router.push(
        `/info-accounts?provider=${provider}&oauthId=${oauthId}&nickname=${nickname}`
      );
    } catch (err) {
      console.error("닉네임 오류", err);
      alert("닉네임이 유효하지 않습니다. 다시 입력해주세요.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fce3d2]">
      <div
        className={`w-[340px] px-6 transition-all duration-500 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-xl font-bold font-paperlogy mb-6">
          닉네임을 알려주세요.
        </h1>

        <div className="border-b-2 border-[#fe8c00] mb-10">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="w-full text-[18px] font-medium h-[50px] text-black bg-transparent outline-none placeholder-[#bababa] font-inter"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={nickname.length <= 1}
          className={`w-full rounded-[15px] px-5 py-3 text-white text-[18px] transition-opacity ${
            nickname.length > 1
              ? "bg-[#fe8c00] opacity-100"
              : "bg-[#fe8c00] opacity-50 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
