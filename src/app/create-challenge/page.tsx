"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomDropdown from "../../components/CustomDropdown";
import FixedBtn from "../../components/FixedBtn";
import Header from "../../components/Header";
import { loadTossPayments } from "@tosspayments/payment-sdk";

export default function MakeChallengePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [peopleCnt, setPeopleCnt] = useState("");
  const [weekAttend, setWeekAttend] = useState("");
  const [authType, setAuthType] = useState("타이머 인증");
  const [timerValue, setTimerValue] = useState("");
  const [attendanceTimeRange, setAttendanceTimeRange] = useState("");
  const [fee, setFee] = useState("");
  const [description, setDescription] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);

  const [nickname, setNickname] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setNickname(sessionStorage.getItem("nickname"));
    setUserId(sessionStorage.getItem("userId"));
  }, []);

  const handleSelectAuthType = (value: string) => {
    setAuthType(value);
    setIsExpanded(true);
  };

  const handleCreateChallenge = async () => {
    if (!title.trim() || !startDate || !endDate || !fee || Number(fee) <= 0) {
      alert("필수 입력값을 확인해주세요.");
      return;
    }

    const payload = {
      title,
      startDate,
      endDate,
      type:
        authType === "타이머 인증"
          ? "TIME"
          : authType === "출석 인증"
            ? "ATTENDANCE"
            : "CONTENT",
      maxParticipants: Number(peopleCnt),
      fee: Number(fee),
      description,
      option:
        authType === "타이머 인증"
          ? (() => {
              if (!timerValue.includes(":")) return { time: 0 };
              const [h, m, s] = timerValue.split(":").map(Number);
              return { time: h * 60 + m };
            })()
          : {
              start: attendanceTimeRange.split("~")[0],
              end: attendanceTimeRange.split("~")[1],
            },
      rule: Number(weekAttend),
    };

    sessionStorage.setItem("challengePayload", JSON.stringify(payload));

    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );
      await tossPayments.requestPayment("CARD", {
        amount: Number(fee),
        orderId: `order_${Date.now()}_${userId}`,
        orderName: title,
        customerName: nickname ?? "",
        successUrl: `${window.location.protocol}//${window.location.host}/payments/success`,
        failUrl: `${window.location.protocol}//${window.location.host}/payments/fail`,
      });
    } catch (err) {
      console.error(err);
      alert("결제 요청에 실패했습니다.");
    }
  };

  const handleModalClose = () => {
    setIsSummaryModalVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header background="transparent" title="챌린지 생성" />
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">
              1. 제목을 입력하세요.
            </label>
            <input
              className="mt-1 w-full p-3 rounded-lg border bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="모각코"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              2-1. 시작일을 입력하세요
            </label>
            <input
              className="mt-1 w-full p-3 rounded-lg border bg-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="2025-05-15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              2-2. 종료일을 입력하세요
            </label>
            <input
              className="mt-1 w-full p-3 rounded-lg border bg-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="2025-06-15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              3. 인원을 입력하세요.
            </label>
            <input
              className="mt-1 w-full p-3 rounded-lg border bg-white"
              value={peopleCnt}
              onChange={(e) => setPeopleCnt(e.target.value)}
              placeholder="(ex) 10"
              type="number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              4. 주에 참여 횟수를 입력하세요.
            </label>
            <input
              className="mt-1 w-full p-3 rounded-lg border bg-white"
              value={weekAttend}
              onChange={(e) => setWeekAttend(e.target.value)}
              placeholder="(ex) 3"
            />
          </div>

          <CustomDropdown
            label="5. 인증 방식을 선택하세요."
            options={["타이머 인증", "출석 인증", "내용 인증"]}
            value={authType}
            onSelect={handleSelectAuthType}
          />

          {isExpanded && (
            <>
              <div>
                <label className="block text-sm font-medium">
                  {authType === "타이머 인증"
                    ? "5-1. 타이머 시간을 입력하세요. (예: 13:00:00)"
                    : authType === "출석 인증"
                      ? "5-1. 출석 시간 범위를 입력하세요. (예: 09:00 ~ 18:00)"
                      : "5-1. 키워드 설정 가능 시간을 입력하세요. (예: 09:00 ~ 18:00)"}
                </label>
                <input
                  className="mt-1 w-full p-3 rounded-lg border bg-white"
                  value={
                    authType === "타이머 인증"
                      ? timerValue
                      : attendanceTimeRange
                  }
                  onChange={(e) =>
                    authType === "타이머 인증"
                      ? setTimerValue(e.target.value)
                      : setAttendanceTimeRange(e.target.value)
                  }
                  placeholder={
                    authType === "타이머 인증" ? "13:00:00" : "09:00 ~ 18:00"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  6. 참가비를 입력하세요.
                </label>
                <input
                  className="mt-1 w-full p-3 rounded-lg border bg-white"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="(ex) 20000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  7. 챌린지 세부 설명을 입력하세요.
                </label>
                <textarea
                  className="mt-1 w-full p-3 rounded-lg border bg-white h-40"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="설명 작성"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <FixedBtn label="Create Challenge" onPress={handleCreateChallenge} />

      {isSummaryModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[85%] space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">기간:</span>
              <span>
                {startDate} - {endDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">인원 수:</span>
              <span>{peopleCnt}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">인증 방식:</span>
              <span>{authType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">출석 인증시간:</span>
              <span>
                {authType === "타이머 인증" ? timerValue : attendanceTimeRange}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">참가비:</span>
              <span>{fee}</span>
            </div>
            <button
              className="mt-4 w-full bg-black text-white py-2 rounded-lg"
              onClick={() => {
                router.push(`/challenge-detail/${challengeId}`);
                handleModalClose();
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
