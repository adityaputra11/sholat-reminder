import * as vscode from "vscode";
import { QuoteSholat } from "../constant/quote.constant";
import { Schedule } from "../model/pray.model";
import { PrayName } from "../constant/pray.constant";
import { getIsShowCityName } from "../config/db";
import { fetchRandomQuote } from "../api/quote.api";
import { Quote } from "../model/quote.model";

function randomQuote<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

async function randomQuoteFromApi(): Promise<Quote> {
  const quote = await fetchRandomQuote();
  if (!quote) {
    return randomQuote(QuoteSholat);
  }
  return quote;
}

export async function showFullScreenAlert(
  context: vscode.ExtensionContext,
  sholatName: string,
  sholatTime: string,
  callback: () => void
) {
  const panel = vscode.window.createWebviewPanel(
    "sholatNotification",
    `Waktu Sholat ${sholatName} Telah Tiba`,
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  const quote = await randomQuoteFromApi();

  panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            font-family: Arial, sans-serif;
          }
          h1 {
            font-size: 3em;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.5em;
          }
          button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1.2em;
            cursor: pointer;
            background-color: #007acc;
            border: none;
            color: white;
            border-radius: 5px;
          }
          q {
              font-size: 2em;
              font-style: italic;
          }
        </style>
      </head>
      <body>
        <div>
          <h1>Waktu Sholat ${sholatName}</h1>
          <p>Telah tiba pada pukul ${sholatTime}</p>
            <q>${quote.content}</q>
            <h2>${quote.author}</h2>
          <button onclick="closePanel()">Tutup</button>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          function closePanel() {
            vscode.postMessage({ command: 'close' });
          }
        </script>
      </body>
      </html>
    `;

  context.subscriptions.push(
    panel.webview.onDidReceiveMessage((message) => {
      if (message.command === "close") {
        panel.dispose();
      }
    })
  );

  panel.onDidDispose(
    () => {
      callback();
    },
    null,
    context.subscriptions
  );
}

export function generatePrayerTooltip(
  schedule: Schedule
): vscode.MarkdownString {
  return new vscode.MarkdownString(
    `**Sholat**       **Waktu**  
     **${PrayName.Subuh}**:      ${schedule.subuh}  
     **${PrayName.Dzuhur}**:     ${schedule.dzuhur}  
     **${PrayName.Ashar}**:      ${schedule.ashar}  
     **${PrayName.Maghrib}**:    ${schedule.maghrib}  
     **${PrayName.Isya}**:       ${schedule.isya}`
  );
}

/**
 * Update the status bar text for a prayer time.
 * @param statusBar The status bar item to update
 * @param sholatName Name of the prayer
 * @param sholatTime Time of the prayer
 * @param countdown Countdown object {hours, minutes, seconds}
 * @param lokasi Optional location label
 */
export function buildStatusBar(
  context: vscode.ExtensionContext,
  sholatName: string,
  sholatTime: string,
  countdown: { hours: string; minutes: string; seconds: string },
  lokasi?: string
) {
  const isShhowCityName = getIsShowCityName(context);
  const lokasiLabel = isShhowCityName && lokasi ? ` [${lokasi}]` : "";
  return `$(zap) ${sholatName}(${sholatTime}):-${countdown.hours}:${countdown.minutes}:${countdown.seconds}${lokasiLabel}`;
}
