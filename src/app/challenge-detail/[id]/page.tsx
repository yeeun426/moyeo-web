"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Challenge = {
  challengeId: string;
  title: string;
  startDate: string;
  endDate: string;
  type: "TIME" | "ATTENDANCE" | "CONTENT";
  maxParticipants: number;
  participantsCount: number;
  fee: number;
  description: string;
  status: string;
  option: {
    time?: number;
    start?: string;
    end?: string;
  };
  rule: number;
};

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const token = sessionStorage.getItem("accessToken"); // RN의 AsyncStorage → localStorage
        if (!token) {
          throw new Error("토큰이 없습니다.");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(body?.message || `HTTP ${res.status}`);
        }
        setChallenge(body?.data);
      } catch (error) {
        console.error("챌린지 상세 불러오기 실패:", error);
      }
    };

    if (id) fetchChallenge();
  }, [id]);

  if (!challenge) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  // D-Day 계산
  const getDday = (dateStr: string) => {
    const now = new Date();
    const startDate = new Date(dateStr);
    const diff = Math.ceil(
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? `D-${diff}` : "진행중";
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Header */}
      <div className="bg-[#FE8C00] p-6 text-center">
        <h1 className="text-[25px] font-jua text-center mb-3 text-white">
          {challenge.title}
        </h1>
        <div className="flex justify-center mb-4">
          <span className="text-[32px] text-white bg-[#fe8c00] p-2 rounded-lg">
            {getDday(challenge.startDate)}
          </span>
        </div>
      </div>

      {/* 상세 내용 */}
      <div className="p-6 flex-1">
        <h2 className="text-lg font-bold mt-4 mb-2">Introduce</h2>
        <p className="text-sm leading-[22px] text-[#4f4f4f] mb-4">
          {challenge.description}
        </p>

        <h2 className="text-lg font-bold mt-4 mb-2">Rules</h2>
        <p className="text-sm leading-[22px] text-[#4f4f4f] mb-4 whitespace-pre-line">
          인증 방식:{" "}
          {challenge.type === "TIME"
            ? "타이머 인증"
            : challenge.type === "ATTENDANCE"
              ? "출석 인증"
              : "내용 인증"}
          {"\n"}
          주간 인증 횟수: {challenge.rule}회{"\n"}
          참가비: {challenge.fee}원{"\n"}
          참여 인원: {challenge.participantsCount}/{challenge.maxParticipants}
          {"\n"}
          {typeof challenge.option?.time === "number"
            ? `타이머 시간: ${challenge.option.time}분`
            : challenge.option?.start && challenge.option?.end
              ? `출석 범위: ${challenge.option.start} ~ ${challenge.option.end}`
              : "인증 옵션 정보 없음"}
        </p>

        <h2 className="text-lg font-bold mb-3">Similar Challenge</h2>
        <div className="flex flex-row justify-between flex-wrap gap-5">
          <div className="w-[160px] h-[160px] rounded-[19px] border border-[#e5e5e5] flex items-center justify-center" />
          <div className="w-[160px] h-[160px] rounded-[19px] border border-[#e5e5e5] flex items-center justify-center" />
          <div className="w-[160px] h-[160px] rounded-[19px] border border-[#e5e5e5] flex items-center justify-center" />
          <div className="w-[160px] h-[160px] rounded-[19px] border border-[#e5e5e5] flex items-center justify-center" />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-5 left-6 right-6">
        <button
          onClick={() => router.push("/creates-challenge")}
          className="w-full bg-[#FF6A00] text-white py-4 rounded-xl font-bold text-base"
        >
          Join Challenge
        </button>
      </div>
    </div>
  );
}
