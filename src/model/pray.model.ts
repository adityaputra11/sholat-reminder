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
    jadwal: Schedule;
  };
};
