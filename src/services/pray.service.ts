import * as vscode from "vscode";
import { fetchSholatTime } from "../api/pray.api";
import {
  LocationResponse,
  Schedule,
  ScheduleResponse,
} from "../model/pray.model";
import { getCityID, saveCityName } from "../config/db";
import axios from "axios";

const baseUrl = "https://api.myquran.com";
const version = "v2";

export class PrayService {
  constructor(private context: vscode.ExtensionContext) {}

  async getSchedule(date: string): Promise<Schedule> {
    try {
      const schedule = await this.fetchSholatTime(date);
      return schedule;
    } catch (error) {
      vscode.window.showErrorMessage("Gagal mengambil jadwal sholat.");
      throw error;
    }
  }
  private async fetchSholatTime(date: string): Promise<Schedule> {
    try {
      const localCityID = getCityID(this.context);
      const cityID = localCityID || "1301";
      const response = await fetchSholatTime(cityID, date);
      saveCityName(this.context, response.lokasi);
      return response.jadwal;
    } catch (error) {
      console.error("Error fetching sholat time:", error);
      throw new Error("Gagal mengambil jadwal sholat.");
    }
  }
}
