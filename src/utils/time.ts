type CountDownTime = {
  hours: number;
  minutes: number;
  seconds: number;
};

export function calculateCownDown(selisihWaktu: number): CountDownTime {
  const hours = Math.floor((selisihWaktu / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((selisihWaktu / (1000 * 60)) % 60);
  const seconds = Math.floor((selisihWaktu / 1000) % 60);
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
