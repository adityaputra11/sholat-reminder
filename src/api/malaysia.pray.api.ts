import axios from "axios";
import {  ScheduleMalaysiaResponse } from "../model/pray.model";

const baseUrl = "https://api.waktusolat.app/";
const version = "v2";

export async function fetchMalaysiaSholatTime(
  date: Date,
  latitude: string,
  longitude: string
) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const url = `${baseUrl}/${version}/solat/gps/${latitude}/${longitude}`;
  const response = await axios.get<ScheduleMalaysiaResponse>(url);
  return response.data;
}
