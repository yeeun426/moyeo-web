"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { ConfirmModal } from "components/Modal";
import { ChevronRight, ChevronDown, Plus, X } from "lucide-react";
import Challenge from "app/challenge/page";

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
  participating: boolean;
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

  const [isExpanded, setIsExpanded] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");

  const [showAuthPage, setShowAuthPage] = useState(false);
  const [authText, setAuthText] = useState("");

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

  useEffect(() => {
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
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff + 1)}`;
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

  const handleAddKeyword = () => {
    if (
      currentKeyword.trim() &&
      keywords.length < 3 &&
      !keywords.includes(currentKeyword.trim())
    ) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((kw) => kw !== keywordToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddKeyword();
    }
  };

  const handleSubmitKeywords = async () => {
    if (keywords.length !== 3) {
      alert("키워드 3개를 모두 입력해주세요.");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) throw new Error("토큰 없음");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${id}/keywords`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            keyword1: keywords[0],
            keyword2: keywords[1],
            keyword3: keywords[2],
          }),
        }
      );
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.message || "키워드 저장 실패");
      }
      // 성공 처리
      alert("키워드가 저장되었습니다!");
      // UI 갱신
      setIsExpanded(false);
      // -> myLog 다시 불러오기
      setMyLog(null);
      setKeywordsError(false);
      // 재호출
      fetchMyLog();
    } catch (err) {
      console.error("키워드 저장 실패:", err);
      alert("키워드 저장 중 오류가 발생했습니다.");
    }
  };

  const handleGoToAuth = () => {
    setShowAuthPage(true);
  };

  const handleSubmitAuth = async () => {
    if (!authText.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!myLog?.logId) {
      alert("logId가 없습니다. 먼저 키워드를 저장해주세요.");
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) throw new Error("토큰 없음");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${id}/logs/${myLog?.logId}/text`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            text: authText,
          }),
        }
      );

      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || "인증 실패");

      alert("인증이 완료되었습니다!");
      setAuthText("");
      setShowAuthPage(false);
    } catch (err) {
      console.error(err);
      alert("인증 중 오류가 발생했습니다.");
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
      {challenge?.participating && (
        <div className="p-6 border-b border-gray-200">
          {keywordsError ? (
            <div>
              {/* 아직 키워드 입력 X → 목표 설정 UI */}
              <button
                className="flex w-full items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✏️</span>
                  <p className="font-bold">오늘의 목표를 설정하세요</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    목표 설정 시간 : {challenge.option.start} ~{" "}
                    {challenge.option.end}
                  </span>
                  {isExpanded ? <ChevronDown /> : <ChevronRight />}
                </div>
              </button>
              {/* 키워드 입력 섹션 - 슬라이드 애니메이션 */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    목표 키워드 입력 (3개 필수)
                  </h3>

                  {/* 현재 입력된 키워드들 */}
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium"
                        >
                          # {keyword}
                          <button
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="hover:bg-purple-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 키워드 입력 필드 */}
                  {keywords.length < 3 && (
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="키워드를 입력하세요"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        maxLength={20}
                      />
                      <button
                        onClick={handleAddKeyword}
                        disabled={
                          !currentKeyword.trim() ||
                          keywords.includes(currentKeyword.trim())
                        }
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <Plus size={16} />
                        추가
                      </button>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    {keywords.length}/3개 입력됨
                    {keywords.length < 3 && (
                      <span className="text-red-500 font-medium ml-2">
                        3개 모두 입력해주세요
                      </span>
                    )}
                    {keywords.length === 3 && (
                      <span className="text-green-600 font-medium ml-2">
                        ✓ 완료
                      </span>
                    )}
                  </div>

                  {/* 저장 버튼 */}
                  <button
                    onClick={handleSubmitKeywords}
                    disabled={keywords.length !== 3}
                    className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {keywords.length === 3
                      ? "키워드 저장하기"
                      : `키워드 ${3 - keywords.length}개 더 입력해주세요`}
                  </button>
                </div>
              </div>
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
              {!showAuthPage && (
                <button
                  className="w-full py-3 bg-[#A3A0CA] rounded-xl font-bold text-white disabled:cursor-not-allowed"
                  onClick={handleGoToAuth}
                  disabled={myLog?.status === "SUCCESS"}
                >
                  {myLog?.status !== "SUCCESS"
                    ? "내용 인증 출석하러 가기 →"
                    : "인증 완료"}
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
      {showAuthPage ? (
        <div className="flex-1 flex flex-col">
          {/* 내용 인증 섹션 */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">내용 인증</h2>
              <span className="text-sm text-gray-500">
                {authText.length}자/100자
              </span>
            </div>

            <textarea
              value={authText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setAuthText(e.target.value)
              }
              placeholder="오늘 배운 내용을 키워드 위주로 정리해주세요."
              className="flex-1 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[300px]"
              maxLength={100}
            />

            <button
              onClick={handleSubmitAuth}
              disabled={!authText.trim()}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-6"
            >
              출석 하기
            </button>
          </div>
        </div>
      ) : (
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
              <p className="text-sm text-gray-400">
                아직 인증 내용이 없습니다.
              </p>
            )}
          </div>
        </div>
      )}
      {/* 하단 버튼 */}
      {!challenge?.participating && (
        <div className="absolute bottom-5 left-6 right-6">
          <button
            onClick={handleJoinChallenge}
            className="w-full bg-[#FF6A00] text-white py-4 rounded-xl font-bold text-base"
          >
            Join Challenge
          </button>
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayment}
      />
    </div>
  );
}
