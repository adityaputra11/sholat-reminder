import * as vscode from "vscode";
import { fetchInternationalSholatTime } from "../api/international.pray.api";
import { fetchSholatTime } from "../api/pray.api";
import { getCityID, getState, saveCityName } from "../config/db";
import { Schedule } from "../model/pray.model";
import { convertScheduleTimingToSchedule } from "../utils/time";

export class PrayService {
  constructor(private context: vscode.ExtensionContext) {}

  async getSchedule(date: string): Promise<Schedule> {
    try {
      const cityID = getCityID(this.context);
      if (cityID) {
        return await this.fetchSholatTime(date, cityID);
      }

      const state = getState(this.context);
      if (state) {
        return await this.fetchInternationalSholatTime(date);
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

  private async fetchInternationalSholatTime(date: string): Promise<Schedule> {
    try {
      const localState = getState(this.context);
      if (localState === undefined) {
        throw new Error("Gagal mengambil jadwal sholat.");
      }
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
}
