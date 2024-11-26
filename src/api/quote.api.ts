import axios from "axios";
import { Quote, QuoteResponse } from "../model/quote.model";

const baseUrl = "https://sholat-reminder.up.railway.app/api";
const version = "v1";
export async function fetchRandomQuote(): Promise<Quote | undefined> {
  try {
    const url = `${baseUrl}/${version}/quotes/random`;

    // Tambahkan konfigurasi header
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": "c2hvbGF0cmVtaW5kZXI0NTM1",
    };

    const response = await axios.get<QuoteResponse>(url, { headers });
    return response.data.data;
  } catch (error) {
    return undefined;
  }
}
