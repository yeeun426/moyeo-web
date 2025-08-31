import Header from "components/Header";
import React from "react";
import {
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Moon,
} from "lucide-react";

const page = () => {
  const weeklyData = [
    { day: "M", hours: 13 },
    { day: "T", hours: 3 },
    { day: "W", hours: 12 },
    { day: "T", hours: 4 },
    { day: "F", hours: 5 },
    { day: "S", hours: 0 },
    { day: "S", hours: 0 },
  ];
  const maxHours = Math.max(...weeklyData.map((d) => Math.abs(d.hours)));

  return (
    <div className="min-h-screen">
      <Header background="transparent" title="AI 피드백" />
      <div className="flex flex-col max-w-md mx-auto bg-white">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
              <div className="text-white text-lg">😊</div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-sm p-4 shadow-sm">
              <p className="text-gray-800 text-sm leading-relaxed">
                지난 하루 숙제서도 꾸준히 학습을 이어가시는 모습이 인상
                깊었습니다. 특히 반복되는 일상 속에서도 자신의 루틴을 지키기
                위해 노력한 점이 아주 멋졌어요. 한 주 동안 정말 수고 많으셨어요!
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Analysis */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            내 루틴 분석
          </h2>

          {/* Chart */}
          <div className="mb-6">
            <div className="flex items-end justify-between h-32 mb-2">
              {weeklyData.map((data, index) => {
                const height = (Math.abs(data.hours) / maxHours) * 100;
                const isNegative = data.hours < 0;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {data.hours > 0
                        ? `+${data.hours}h`
                        : data.hours < 0
                          ? `${data.hours}h`
                          : ""}
                    </div>
                    <div className="w-8 flex flex-col justify-end h-24">
                      <div
                        className={`w-full rounded-t bg-blue-500`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-600 mt-1">
                      {data.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-500">총 공부 시간</div>
              <div className="text-lg font-bold text-gray-800">20시간</div>
            </div>
            <div className="text-center">
              <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-500">하루 평균</div>
              <div className="text-lg font-bold text-gray-800">2.6시간</div>
            </div>
            <div className="text-center">
              <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">학습 시간 놓은 승한</div>
              <div className="text-lg font-bold text-gray-800">월, 수, 금</div>
            </div>
          </div>

          {/* Status Items */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-red-700">
                  집중 요일
                </div>
                <div className="text-xs text-red-600">수요일 (5시간)</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-yellow-700">
                  적게 공부한 요일
                </div>
                <div className="text-xs text-yellow-600">토요일 (1시간)</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Moon className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-700">
                  집중 시간대
                </div>
                <div className="text-xs text-blue-600">밤 10시~12시</div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Week Study Tip */}
        <div className="p-4 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            다음주 학습 루틴
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            현재의 패턴을 유지하면서도, 학습이 적었던 주말에는 가벼운 복습
            위주의 루틴을 넣어보는 걸 추천드립니다. 집중력이 높았던 밤 10~12시
            시간대를 적극 활용하고, 수요일과 금요일에는 핵심 과제를 배치하는
            것이 효율적일 것 같아요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
