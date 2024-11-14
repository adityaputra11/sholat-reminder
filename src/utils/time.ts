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
