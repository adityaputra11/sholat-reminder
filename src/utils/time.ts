import { PrayName } from "../constant/pray.constant";
import { Schedule } from "../model/pray.model";

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
  const stringDate = newDate.toISOString().split("T")[0];
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
