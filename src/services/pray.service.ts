import * as vscode from "vscode";
import { fetchInternationalSholatTime } from "../api/international.pray.api";
import { fetchSholatTime } from "../api/pray.api";
import { getCityID, getCountry, getState, saveCityName, State } from "../config/db";
import { Schedule, ScheduleMalaysiaResponse, SchedulePrayer } from "../model/pray.model";
import { convertSchedulePrayerToSchedule, convertScheduleTimingToSchedule } from "../utils/time";
import { fetchMalaysiaSholatTime } from "../api/malaysia.pray.api";
import { start } from "repl";

export class PrayService {
  constructor(private context: vscode.ExtensionContext) { }

  async getSchedule(date: string): Promise<Schedule> {
    try {
      const cityID = getCityID(this.context);
      if (cityID) {
        return await this.fetchSholatTime(date, cityID);
      }
      const state = getState(this.context);
      if (state) {
        if (state === undefined) {
          throw new Error(`Gagal mengambil jadwal sholat. ${state}`);
        }
        const country = getCountry(this.context);
        if (country?.code === "MY") {
          return await this.fetchMalaysiaSholatTime(date, state);
        } else {
          return await this.fetchInternationalSholatTime(date, state);
        }
      }

      return await this.fetchSholatTime(date, "1301");
    } catch (error) {
      vscode.window.showErrorMessage("Gagal mengambil jadwal sholat.");
      throw error;
    }
  }
  private async fetchSholatTime(
    date: string,
    cityID: string
  ): Promise<Schedule> {
    try {
      const response = await fetchSholatTime(cityID, date);
      saveCityName(this.context, response.lokasi);
      return response.jadwal;
    } catch (error) {
      console.error("Error fetching sholat time:", error);
      throw new Error("Gagal mengambil jadwal sholat.");
    }
  }

  private async fetchInternationalSholatTime(date: string, localState: State): Promise<Schedule> {
    try {

      const response = await fetchInternationalSholatTime(
        date,
        localState.latitude,
        localState.longitude
      );

      return convertScheduleTimingToSchedule(response.timings);
    } catch (error) {
      console.error("Error fetching sholat time:", error);
      throw new Error("Gagal mengambil jadwal sholat.");
    }
  }

  private async fetchMalaysiaSholatTime(date: string, localState: State): Promise<Schedule> {
    try {
      const [year, month, day] = date.split("-").map(Number);
      const searchDate = new Date(year, month - 1, day);
      let schedule: SchedulePrayer | undefined;
      let response: ScheduleMalaysiaResponse | undefined;
      let adjust = 0;
      do {
        if (!response) {
          response = await fetchMalaysiaSholatTime(
            searchDate,
            localState.latitude,
            localState.longitude
          );
        }
        const now = new Date().getTime();
        schedule = response?.prayers.find(e => e.isha * 1000 > now);
        searchDate.setDate(searchDate.getDate() + 1);
        console.log(`month: ${searchDate.getMonth()} ${month}`);


        if (searchDate.getMonth() + 1 !== month) {
          response = undefined;
        }
      } while (schedule === undefined && adjust++ < 1);

      if (schedule !== undefined) {
        return convertSchedulePrayerToSchedule(schedule);
      } else {
        throw new Error(`Gagal mengambil jadwal sholat.`);
      }
    } catch (error) {
      console.error("Error fetching sholat time:", error);
      throw new Error("Gagal mengambil jadwal sholat.");
    }
  }
}
