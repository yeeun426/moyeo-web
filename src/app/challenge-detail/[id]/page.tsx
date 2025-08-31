"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { ConfirmModal } from "components/Modal";

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

type ChallengeLog = {
  logId: string;
  nickname: string;
  content: {
    type: string;
    keywords: string[];
    text: string;
  };
  status: string;
};

type MyLogResponse = {
  logId: string;
  nickname: string;
  content: {
    type: string;
    keywords: string[];
    text: string;
  };
  status: string;
};

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nickname, setNickname] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [logs, setLogs] = useState<ChallengeLog[]>([]);
  const [myLog, setMyLog] = useState<MyLogResponse | null>(null);
  const [keywordsError, setKeywordsError] = useState(false);

  useEffect(() => {
    setNickname(sessionStorage.getItem("nickname"));
    setUserId(sessionStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("토큰이 없습니다.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${id}/logs`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        const body = await res.json();
        if (!res.ok) throw new Error(body?.message || `HTTP ${res.status}`);

        setLogs(body?.data?.content || []);
      } catch (err) {
        console.error("챌린지 로그 불러오기 실패:", err);
      }
    };

    if (id) fetchLogs();
  }, [id]);

  useEffect(() => {
    const fetchMyLog = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("토큰 없음");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${id}/logs/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!res.ok) {
          // 에러 → 아직 키워드 입력 전
          setKeywordsError(true);
          setMyLog(null);
          return;
        }

        const body = await res.json();
        setMyLog(body?.data || null);
        setKeywordsError(false);
      } catch (err) {
        console.error("내 로그 불러오기 실패:", err);
        setKeywordsError(true);
      }
    };

    if (id) fetchMyLog();
  }, [id]);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
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

  const handleJoinChallenge = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        router.replace("/login");
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${id}/check`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      const body = await res.json();

      if (!res.ok) {
        alert(body?.message || "참여할 수 없습니다.");
        return;
      }

      // 참여 가능하면 모달 열기
      setIsModalOpen(true);
    } catch (err) {
      alert("참여 확인 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handlePayment = async () => {
    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      await tossPayments.requestPayment("CARD", {
        amount: Number(challenge?.fee),
        orderId: `order_${Date.now()}_${userId}`, // 주문 고유값
        orderName: "챌린지 참여",
        customerName: nickname ?? "",
        successUrl: `${window.location.origin}/join/success?challengeId=${id}`,
        failUrl: `${window.location.origin}/join/fail?challengeId=${id}`,
      });
    } catch (err) {
      console.error(err);
      alert("결제 요청에 실패했습니다.");
    } finally {
      setIsModalOpen(false);
    }
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
      {/* 내 인증 영역 */}
      <div className="p-6 border-b border-gray-200">
        {keywordsError ? (
          // 아직 키워드 입력 X → 목표 설정 UI
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✏️</span>
              <p className="font-bold">오늘의 목표를 설정하세요</p>
            </div>
            <span className="text-sm text-gray-500">
              목표 설정 시간 : {challenge.option.start} ~ {challenge.option.end}
            </span>
          </div>
        ) : myLog ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold">오늘의 목표 키워드</p>
              <span className="text-xs text-red-500">
                목표 키워드는 변경이 불가능합니다.
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {myLog.content?.keywords?.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full bg-gray-200 text-sm font-medium"
                >
                  #{kw}
                </span>
              ))}
            </div>
            <button className="w-full py-3 bg-purple-300 rounded-xl font-bold text-white">
              내용 인증 출석하러 가기 →
            </button>
          </div>
        ) : null}
      </div>

      {/* 상세 내용 */}
      <div className="p-6 flex-1 border-b ">
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
        <div className="flex flex-row justify-between flex-wrap gap-5">
          {logs.length > 0 ? (
            logs.slice(0, 4).map((log) => (
              <div
                key={log.logId}
                className="w-[160px] h-[160px] rounded-[19px] border border-[#e5e5e5] flex flex-col items-center justify-center p-3 text-center"
              >
                <p className="text-sm font-bold">{log.nickname}</p>
                <p className="text-xs text-gray-600 line-clamp-3">
                  {log.content?.text}
                </p>
                <span
                  className={`mt-2 text-xs px-2 py-1 rounded ${
                    log.status === "SUCCESS"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">아직 인증 내용이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-5 left-6 right-6">
        <button
          onClick={handleJoinChallenge}
          className="w-full bg-[#FF6A00] text-white py-4 rounded-xl font-bold text-base"
        >
          Join Challenge
        </button>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayment}
      />
    </div>
  );
}
