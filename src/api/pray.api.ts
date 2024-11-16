import axios from "axios";
import { ScheduleResponse, LocationResponse } from "../model/pray.model";

const baseUrl = "https://api.myquran.com";
const version = "v2";

export async function fetchSholatTime(cityID: string, date: string) {
  const url = `${baseUrl}/${version}/sholat/jadwal/${cityID}/${date}`;
  const response = await axios.get<ScheduleResponse>(url);
  return response.data.data;
}

export async function fetchCityList() {
  const url = `${baseUrl}/${version}/sholat/kota/semua`;
  const response = await axios.get<LocationResponse>(url);
  return response.data;
}
