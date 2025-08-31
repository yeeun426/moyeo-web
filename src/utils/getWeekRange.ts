import dayjs from "dayjs";

export function getWeekRange(today = dayjs()) {
  let monday;

  if (today.day() === 0) {
    // 오늘이 일요일이면 지난 월요일 = 오늘 - 6일
    monday = today.subtract(6, "day");
  } else {
    // 월~토요일이면 이번 주 월요일 = 오늘 - (day() - 1)
    monday = today.subtract(today.day() - 1, "day");
  }

  const sunday = monday.add(6, "day");

  return {
    from: monday.format("YYYY-MM-DD"),
    to: sunday.format("YYYY-MM-DD"),
  };
}
