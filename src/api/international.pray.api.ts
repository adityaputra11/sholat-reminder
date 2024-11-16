import axios from "axios";
import { ScheduleInternationalResponse } from "../model/pray.model";

const baseUrl = "http://api.aladhan.com";
const version = "v1";

export async function fetchInternationalSholatTime(
  date: string,
  latitude: string,
  longitude: string
) {
  const url = `${baseUrl}/${version}/timings/${date}?latitude=${latitude}&longitude=${longitude}`;
  const response = await axios.get<ScheduleInternationalResponse>(url);
  return response.data.data;
}
