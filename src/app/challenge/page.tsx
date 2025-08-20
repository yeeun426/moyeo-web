"use client";

import { useState, useEffect } from "react";
import FixedBtn from "../../components/FixedBtn";
import Header from "../../components/Header";
import { Search, Calendar } from "lucide-react";
import challengeApiService from "service/challengeService";

interface ChallengeItem {
  challengeId: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
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
}

export default function Challenge() {
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChallenges, setFilteredChallenges] = useState<ChallengeItem[]>(
    []
  );

  // 챌린지 목록 불러오기
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await challengeApiService.getChallenges({
        page: 0,
        limit: 15,
      });

      if (response.status === "success") {
        setChallenges(response.data.content);
        setFilteredChallenges(response.data.content);
      } else {
        setError("챌린지를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
      console.error("챌린지 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 챌린지 목록 불러오기
  useEffect(() => {
    fetchChallenges();
  }, []);

  // 검색 기능
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredChallenges(challenges);
    } else {
      const filtered = challenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChallenges(filtered);
    }
  }, [searchTerm, challenges]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };

  // 시간 포맷팅 함수 (분을 시간:분 형태로 변환)
  // const formatTime = (minutes?: number) => {
  //   if (minutes == null) return "";
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  // };

  // 챌린지 타입별 아이콘 색상
  const getIconColor = (type: string, status: string) => {
    if (status !== "RECRUITING") return "#BABABA";
    return type === "TIME" ? "orange" : "#BABABA";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FCE3D2" }}>
      <Header background="#FCE3D2" title="" />

      <div className="px-5 pb-24 pt-5">
        <h1 className="text-2xl font-bold mb-5 leading-8">
          <span style={{ color: "#FE8C00" }}>모여모여님</span>
          <br />
          어떤 도전을 해볼까요?
        </h1>

        {/* 검색 입력 */}
        <div className="flex items-center bg-white/50 rounded-full px-4 h-12 mb-6">
          <Search size={20} className="text-gray-600" />
          <input
            type="text"
            placeholder="Search Challenge"
            className="flex-1 bg-transparent ml-2 text-base outline-none placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={fetchChallenges}
              className="ml-2 underline hover:no-underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 챌린지 카드 목록 */}
        <div className="space-y-4">
          {filteredChallenges.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? "검색 결과가 없습니다."
                : "등록된 챌린지가 없습니다."}
            </div>
          ) : (
            filteredChallenges.map((challenge) => (
              <div
                key={challenge.challengeId}
                className="bg-white rounded-2xl shadow-md p-4 flex items-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  // 챌린지 상세 페이지로 이동 로직 추가 가능
                  console.log("챌린지 선택:", challenge);
                }}
              >
                <Calendar
                  size={22}
                  color={getIconColor(challenge.type, challenge.status)}
                  className="flex-shrink-0"
                />

                <div className="flex-1 ml-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {formatDate(challenge.startDate)} ~{" "}
                      {formatDate(challenge.endDate)}
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {challenge.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {challenge.type === "TIME"
                        ? "시간 챌린지"
                        : challenge.type}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">
                      {challenge.type === "TIME" && challenge.option.time
                        ? `${Math.floor(challenge.option.time / 60)}시간`
                        : challenge.option.start && challenge.option.end
                          ? `${challenge.option.start} - ${challenge.option.end}`
                          : ""}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {challenge.participantsCount}/{challenge.maxParticipants}
                    </p>
                    <p className="text-xs text-gray-400">
                      {challenge.fee.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <FixedBtn url="/create-challenge" label="Add Challenge" />
    </div>
  );
}
