// app/create-challenge/page.tsx
import FixedBtn from "../../components/FixedBtn";
import Header from "../../components/Header";
import { Search, Calendar } from "lucide-react";

export default function Challenge() {
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
          />
        </div>

        {/* 챌린지 카드 목록 */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-4 flex items-center"
            >
              <Calendar
                size={22}
                color={idx === 0 ? "orange" : "#BABABA"}
                className="flex-shrink-0"
              />

              <div className="flex-1 ml-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">5.15 ~ 8.15</p>
                  <p className="text-base font-semibold text-gray-800">
                    알고리즘 같이해요 !
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">9:00 - 16:00</p>
                  <p className="text-sm font-semibold text-gray-800">10/10</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FixedBtn url="/make-challenge" label="Add Challenge" />
    </div>
  );
}
