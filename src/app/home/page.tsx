"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type Challenge = {
  challengeId: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  fee: number;
  description: string;
  status: string;
  option?: {
    time?: number;
    start?: string;
    end?: string;
  };
  rule: number;
};

const Home = () => {
  const { formattedDate, today } = useMemo(() => {
    const today = new Date();
    const formatted = `Today, ${today.getDate()} ${monthNames[today.getMonth()]}`;
    return {
      formattedDate: formatted,
      today: today.toISOString().split("T")[0],
    };
  }, []);

  const nickname = sessionStorage.getItem("nickname");
  const character = sessionStorage.getItem("character");

  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);

  // 챌린지를 상태별로 분류
  const categorizedChallenges = useMemo(() => {
    const ongoing: Challenge[] = [];
    const upcoming: Challenge[] = [];
    const completed: Challenge[] = [];

    myChallenges.forEach((challenge) => {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      const todayDate = new Date(today);

      if (todayDate < startDate) {
        upcoming.push(challenge);
      } else if (todayDate > endDate) {
        completed.push(challenge);
      } else {
        ongoing.push(challenge);
      }
    });

    return { ongoing, upcoming, completed };
  }, [myChallenges, today]);

  useEffect(() => {
    const fetchMyChallenges = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        const body = await res.json();

        if (res.ok) {
          const challenges =
            body?.data?.content?.map((item: any) => item.challenge) ?? [];
          setMyChallenges(challenges);
        } else {
          console.error("내 챌린지 불러오기 실패:", body?.message);
        }
      } catch (err) {
        console.error("API 호출 실패:", err);
      }
    };

    fetchMyChallenges();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 남은 일수 계산
  const getDaysUntilStart = (startDate: string) => {
    const start = new Date(startDate);
    const todayDate = new Date(today);
    const diffTime = start.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 챌린지 카드 컴포넌트
  const ChallengeCard = ({
    challenge,
    type,
  }: {
    challenge: Challenge;
    type: "ongoing" | "upcoming" | "completed";
  }) => {
    const baseClasses = "rounded-2xl p-4 mb-3 border-2 transition-all";

    let cardClasses = "";
    let statusText = "";
    let statusColor = "";

    switch (type) {
      case "ongoing":
        cardClasses =
          "bg-gradient-to-r from-orange-400 to-orange-500 text-white border-orange-300";
        statusText = `진행중 (${formatDate(challenge.endDate)}까지)`;
        statusColor = "bg-orange-600";
        break;
      case "upcoming":
        const daysLeft = getDaysUntilStart(challenge.startDate);
        cardClasses =
          "bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-300";
        statusText = `${daysLeft}일 후 시작 (${formatDate(challenge.startDate)})`;
        statusColor = "bg-blue-600";
        break;
      case "completed":
        cardClasses =
          "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 border-gray-200";
        statusText = "완료됨";
        statusColor = "bg-gray-500";
        break;
    }

    return (
      <Link
        key={challenge.challengeId}
        href={`/challenge-detail/${challenge.challengeId}`}
        className="block"
      >
        <div
          className={`${baseClasses} ${cardClasses} hover:scale-[1.02] cursor-pointer`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-lg">{challenge.title}</h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} text-white`}
            >
              {challenge.type}
            </span>
          </div>

          <p className="text-sm opacity-90 mb-2">{statusText}</p>

          <div className="flex justify-between items-end">
            <span className="text-sm font-medium">
              {challenge.fee.toLocaleString()}원
            </span>
            {challenge.option?.start && challenge.option?.end && (
              <span className="text-xs opacity-80">
                {challenge.option.start} - {challenge.option.end}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main className="bg-white">
      <div className="w-full h-[200px] relative">
        <Image
          src="/images/header_home.png"
          alt="header"
          fill
          className="object-cover rounded-b-3xl"
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center">
            <Image
              src={`/images/${character}.png`}
              alt={`${character}`}
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          <p className="mt-2 text-lg font-medium text-black">{nickname}</p>
        </div>
      </div>

      <section className="flex flex-col px-6 mt-6">
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">{formattedDate}</p>
          <h2 className="text-2xl font-bold font-paperlogy mt-1">내 챌린지</h2>
        </div>

        {/* 진행중인 챌린지 */}
        {categorizedChallenges.ongoing.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-orange-600">
              🔥 오늘의 챌린지
            </h3>
            {categorizedChallenges.ongoing.map((challenge) => (
              <ChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
                type="ongoing"
              />
            ))}
          </div>
        )}

        {/* 예정된 챌린지 */}
        {categorizedChallenges.upcoming.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-blue-600">
              ⏰ 예정된 챌린지
            </h3>
            {categorizedChallenges.upcoming.map((challenge) => (
              <ChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
                type="upcoming"
              />
            ))}
          </div>
        )}

        {/* 완료된 챌린지 */}
        {categorizedChallenges.completed.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-600">
              ✅ 완료한 챌린지
            </h3>
            {categorizedChallenges.completed.map((challenge) => (
              <ChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
                type="completed"
              />
            ))}
          </div>
        )}

        {/* 참여한 챌린지가 없을 때 */}
        {myChallenges.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg mb-4">
              아직 참여한 챌린지가 없어요
            </p>
            <p className="text-gray-400 text-sm">새로운 도전을 시작해보세요!</p>
          </div>
        )}

        <h3 className="text-lg font-bold w-full text-left mt-8 mb-4">
          🌟 새로운 챌린지를 찾아보세요!
        </h3>
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {[
            { name: "모각코", price: 20000, color: "bg-green-400" },
            { name: "운동", price: 15000, color: "bg-purple-400" },
            { name: "독서", price: 10000, color: "bg-blue-400" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} rounded-2xl h-32 w-28 flex-shrink-0 p-4 text-white text-sm flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer`}
            >
              <span className="font-medium">{item.name}</span>
              <span className="font-bold">₩ {item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl px-6 py-4 flex items-center gap-4 text-white w-full mb-6">
          <p className="text-lg flex-1">맘에 드는 챌린지가 없나요?</p>
          <Link href="/create-challenge">
            <button className="bg-white text-purple-500 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              직접 만들기
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
