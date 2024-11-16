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
