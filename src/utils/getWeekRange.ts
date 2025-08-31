import dayjs from "dayjs";

export function getWeekRange(today = dayjs()) {
  // 이번 주 일요일을 찾기 (오늘이 일요일이면 오늘, 아니면 이전 일요일)
  const thisWeekSunday = today.subtract(today.day(), "day");

  // 지난 주 일요일부터 이번 주 토요일까지
  const lastSunday = thisWeekSunday.subtract(7, "day");
  const thisSaturday = thisWeekSunday.subtract(1, "day");

  return {
    from: lastSunday.format("YYYY-MM-DD"),
    to: thisSaturday.format("YYYY-MM-DD"),
  };
}
