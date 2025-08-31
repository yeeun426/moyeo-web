"use client";

import Header from "components/Header";
import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Moon,
  BarChart3,
} from "lucide-react";
import dayjs from "dayjs";
import { getWeekRange } from "utils/getWeekRange";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const [reportError, setReportError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      console.warn("accessToken이 없습니다. 로그인 페이지로 이동합니다.");
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
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

        const days: ApiDay[] = json.data.days ?? [];

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
      } catch (error) {
        console.error("Failed to fetch weekly data:", error);
      }
    }

    async function fetchStats() {
      try {
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
        if (!res.ok) throw new Error(`stat fetch failed: ${res.status}`);
        const json = await res.json();
        setStat(json.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }

    async function fetchReport() {
      try {
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
        if (!res.ok) throw new Error(`report fetch failed: ${res.status}`);
        const json = await res.json();

        if (json.data && json.data.report) {
          setReport(json.data);
        } else {
          setReportError(true);
        }
      } catch (error) {
        console.error("Failed to fetch report:", error);
        setReportError(true);
      }
    }

    Promise.all([fetchData(), fetchReport(), fetchStats()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const hasData = weeklyData.some((d) => d.hours > 0);

  return (
    <div className="min-h-screen">
      <Header background="transparent" title="AI 피드백" />
      <div className="flex flex-col max-w-md mx-auto bg-white">
        {/* Chat Message */}
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
              <div className="text-white text-lg">😊</div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-sm p-4 shadow-sm">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5"></div>
                </div>
              ) : reportError || !report ? (
                <p className="text-gray-600 text-sm leading-relaxed">
                  아직 충분한 학습 데이터가 없어서 AI 분석을 제공할 수 없어요.
                  더 많은 학습 기록을 쌓으시면 개인화된 피드백을 받아볼 수
                  있습니다! 📚
                </p>
              ) : (
                <p className="text-gray-800 text-sm leading-relaxed">
                  {report.report.emotionalFeedback}
                </p>
              )}
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
            {/* Empty State */}
            {!hasData && !loading && (
              <div className="text-center py-6">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  아직 이번 주 학습 기록이 없어요
                </p>
                <p className="text-gray-400 text-xs">
                  학습을 시작하면 차트가 나타납니다
                </p>
              </div>
            )}
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
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          ) : reportError || !report ? (
            <p className="text-sm text-gray-500 leading-relaxed">
              더 많은 학습 데이터가 쌓이면 맞춤형 루틴 추천을 받아볼 수 있어요.
              꾸준히 학습해보세요! 💪
            </p>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed">
              {report.report.nextWeekRoutine}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyStudy;
