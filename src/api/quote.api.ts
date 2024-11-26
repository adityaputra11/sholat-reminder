import axios from "axios";
import { Quote, QuoteResponse } from "../model/quote.model";

const baseUrl = "https://sholat-reminder.up.railway.app/api";
const version = "v1";
export async function fetchQuotes(): Promise<Quote[]> {
  try {
    const url = `${baseUrl}/${version}/quotes`;

    // Tambahkan konfigurasi header
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": "c2hvbGF0cmVtaW5kZXI0NTM1",
    };

    const response = await axios.get<Quote[]>(url, { headers });
    return response.data;
  } catch (error) {
    const resp: QuoteResponse = { data: [] };
    return resp.data;
  }
}
