"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Calendar } from "lucide-react";
import challengeApiService, {
  ChallengeListItem,
} from "service/challengeService";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

function getIconColor(type: string, status: string) {
  if (status === "RECRUITING") return "#10b981"; // green
  if (status === "INPROGRESS") return "#3b82f6"; // blue
  if (status === "CLOSED") return "#f59e0b"; // yellow
  return "#6b7280"; // gray
}

export default function SearchPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<ChallengeListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTagPress = (text: string) => {
    setSearchInput(text);
    handleSearch(text);
  };

  const handleSearch = async (keyword?: string) => {
    const query = keyword ?? searchInput;
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await challengeApiService.getChallenges({ search: query });
      setResults(res.data.content);
    } catch (err) {
      console.error("검색 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-5">
        {/* Search Header */}
        <div className="flex items-center mb-5">
          <button onClick={() => router.back()} className="mr-2">
            <ChevronLeft size={22} />
          </button>

          <div className="flex items-center flex-1 bg-gray-100 rounded-lg px-3 h-12">
            <input
              type="text"
              placeholder="Search Challenge"
              className="flex-1 bg-transparent text-sm text-black ml-2 outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={() => handleSearch()}>
              <Search size={18} className="text-black" />
            </button>
          </div>

          <button
            onClick={() => {
              setSearchInput("");
              setResults([]);
            }}
            className="ml-3 text-sm font-medium text-black"
          >
            취소
          </button>
        </div>

        {/* 검색 전 → 추천 검색어 */}
        {results.length === 0 && !loading && searchInput.trim() === "" && (
          <>
            <p className="text-[15px] text-[#7e7e7e] font-jua mb-3">
              최근 검색어
            </p>

            <div className="flex flex-wrap mb-3">
              {["프론트엔드", "알고리즘", "CS 스터디"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagPress(tag)}
                  className="border border-[#dedede] rounded-lg py-2 px-3 mr-2 mb-2 text-sm text-black"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap mb-5">
              <button
                onClick={() => handleTagPress("자바스크립트 알고리즘")}
                className="border border-[#dedede] rounded-lg py-2 px-5 mb-3 text-sm text-black"
              >
                자바스크립트 알고리즘
              </button>
            </div>

            <p className="text-[15px] text-[#7e7e7e] font-jua mb-3 mt-5">
              추천 검색어
            </p>

            <div className="flex justify-between mb-6">
              <p className="text-[16px] text-black leading-7 font-jua whitespace-pre-line">
                flutter{"\n"}QA{"\n"}데이터{"\n"}프론트엔드
              </p>
              <p className="text-[16px] text-black leading-7 font-jua whitespace-pre-line">
                승무원 면접{"\n"}spring{"\n"}경력직 개발자{"\n"}과제 전형
              </p>
            </div>
          </>
        )}

        {/* 검색 후 → 결과 */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500">검색 중...</p>
          ) : results.length === 0 && searchInput ? (
            <div className="text-center py-8 text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            results.map((challenge) => (
              <div
                key={challenge.challengeId}
                className="bg-white rounded-2xl shadow-md p-4 flex items-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  router.push(`/challenge-detail/${challenge.challengeId}`)
                }
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
    </div>
  );
}
