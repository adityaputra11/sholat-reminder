import { PrayName } from "../constant/pray.constant";
import { Schedule, ScheduleTiming } from "../model/pray.model";

type CountDownTime = {
  hours: string;
  minutes: string;
  seconds: string;
};

export function calculateCountdown(selisihWaktu: number): CountDownTime {
  const hours = Math.floor((selisihWaktu / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((selisihWaktu / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((selisihWaktu / 1000) % 60)
    .toString()
    .padStart(2, "0");

  return {
    hours,
    minutes,
    seconds,
  };
}

export function getTomorrowDate(): [Date, string] {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 1);
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const stringDate = `${year}-${month}-${day}`;
  return [newDate, stringDate];
}

export function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const currentDate = `${year}-${month}-${day}`;
  return currentDate;
}

export function getInternationalToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const currentDate = `${day}-${month}-${year}`;
  return currentDate;
}

export function getPrayerTimes(schedule: Schedule) {
  return [
    { name: PrayName.Subuh, time: schedule.subuh },
    { name: PrayName.Dzuhur, time: schedule.dzuhur },
    { name: PrayName.Ashar, time: schedule.ashar },
    { name: PrayName.Maghrib, time: schedule.maghrib },
    { name: PrayName.Isya, time: schedule.isya },
  ];
}

/**
 * Parse a time string (HH:mm) into hours and minutes.
 * @param time - The time string in the format HH:mm
 * @returns An array containing hours and minutes as numbers
 */
export function parseTime(time: string): [number, number] {
  return time.split(":").map(Number) as [number, number];
}

export function convertScheduleTimingToSchedule(
  timing: ScheduleTiming
): Schedule {
  return {
    subuh: timing.Fajr,
    dzuhur: timing.Dhuhr,
    ashar: timing.Asr,
    maghrib: timing.Maghrib,
    isya: timing.Isha,
  };
}
