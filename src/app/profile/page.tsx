"use client";

import Header from "components/Header";
import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Moon,
} from "lucide-react";
import dayjs from "dayjs";
import { getWeekRange } from "utils/getWeekRange";

type ApiDay = {
  date: string;
  totalMinutes: number;
};

type WeeklyData = {
  day: string;
  hours: number;
};

type WeeklyStat = {
  userId: string;
  startDate: string;
  totalMinutes: number;
  avgMinutes: number;
  focusDay: string;
  leastDay: string;
  highAttendanceDays: string[];
};

type RoutineReport = {
  userId: string;
  startDate: string;
  report: {
    routineAnalysis: string;
    emotionalFeedback: string;
    nextWeekRoutine: string;
  };
};

const weekMap = ["S", "M", "T", "W", "T", "F", "S"];

const WeeklyStudy = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [maxHours, setMaxHours] = useState(1);
  const [stat, setStat] = useState<WeeklyStat | null>(null);
  const [report, setReport] = useState<RoutineReport | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    async function fetchData() {
      const { from, to } = getWeekRange();
      console.log(from, to);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/studies/days?from=${from}&to=${to}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      const json = await res.json();

      const days: ApiDay[] = json.data.days;

      // 요일별 합산 (일:0 ~ 토:6)
      const weekly: WeeklyData[] = Array(7)
        .fill(0)
        .map((_, i) => ({ day: weekMap[i], hours: 0 }));

      days.forEach((d) => {
        const dayIndex = dayjs(d.date).day(); // 0=Sunday ~ 6=Saturday
        const hours = Math.floor(d.totalMinutes / 60);
        weekly[dayIndex].hours += hours;
      });

      setWeeklyData(weekly);
      setMaxHours(Math.max(...weekly.map((d) => d.hours), 1));
    }

    async function fetchStats() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/routines/stat/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      const json = await res.json();
      setStat(json.data);
    }

    async function fetchReport() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/routines/report/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      const json = await res.json();
      setReport(json.data);
    }

    fetchData();
    fetchReport();
    fetchStats();
  }, []);

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
                {report ? report.report.emotionalFeedback : "로딩 중..."}
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

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {data.hours > 0 ? `+${data.hours}h` : ""}
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
              <div className="text-lg font-bold text-gray-800">
                {stat ? `${Math.floor(stat.totalMinutes / 60)}시간` : "-"}
              </div>
            </div>
            <div className="text-center">
              <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-500">하루 평균</div>
              <div className="text-lg font-bold text-gray-800">
                {stat ? `${(stat.avgMinutes / 60).toFixed(1)}시간` : "-"}
              </div>
            </div>
            <div className="text-center">
              <Moon className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-500">집중 요일</div>
              <div className="text-lg font-bold text-gray-800">
                {stat ? stat.focusDay : "-"}
              </div>
            </div>
            <div className="text-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">적게 공부한 요일</div>
              <div className="text-lg font-bold text-gray-800">
                {stat ? stat.leastDay : "-"}
              </div>
            </div>
            <div className="text-center">
              <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="text-xs text-gray-500">출석률 높은 날</div>
              <div className="text-lg font-bold text-gray-800">
                {stat ? stat.highAttendanceDays.join(", ") : "-"}
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
            {report ? report.report.nextWeekRoutine : "로딩 중..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyStudy;
