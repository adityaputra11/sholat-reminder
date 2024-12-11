export type PrayTime = {
  name: string;
  time: string;
};

export type Schedule = {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
};

export type ScheduleResponse = {
  data: {
    lokasi: string;
    jadwal: Schedule;
  };
};

export type ScheduleInternationalResponse = {
  data: {
    timings: ScheduleTiming;
  };
};

export type ScheduleTiming = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
};

export type LocationPray = {
  id: string;
  lokasi: string;
};

export type LocationResponse = {
  data: LocationPray[];
};

export type LocationObj = {
  [key: string]: string;
};


export type ScheduleMalaysiaResponse = {
  zone: string,
  year: string,
  month: string,
  last_updated: string,
  prayers: Array<SchedulePrayer>;
};

export type SchedulePrayer = {
  hijri: string,
  day: number,
  fajr: number,
  syuruk: number,
  dhuhr: number,
  asr: number,
  maghrib: number,
  isha: number
}



