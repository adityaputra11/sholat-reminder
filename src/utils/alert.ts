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

  const backgroundUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "media", "background.jpg")
  );

  const quoteBgUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "media", "background.jpg")
  );

  const quote = await randomQuoteFromApi();

  panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
          
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('${backgroundUri}');
            background-size: cover;
            background-position: center;
            color: white;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            overflow: hidden;
          }
          
          .container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 40px;
            border-radius: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            max-width: 500px;
            width: 90%;
            animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .header {
            margin-bottom: 30px;
          }

          h1 {
            font-size: 2.2em;
            font-weight: 700;
            margin: 0;
            color: #4ade80;
            letter-spacing: -0.02em;
          }

          .time-info {
            font-size: 1.1em;
            font-weight: 400;
            margin-top: 8px;
            opacity: 0.8;
          }

          .quote-container {
            margin: 30px 0;
            padding: 30px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 20px;
            text-align: left;
            border-left: 4px solid #4ade80;
          }

          q {
            font-size: 1.1em;
            font-style: italic;
            line-height: 1.6;
            display: block;
            margin-bottom: 15px;
            color: rgba(255, 255, 255, 0.95);
          }

          .author {
            font-size: 0.9em;
            font-weight: 600;
            color: #4ade80;
            text-align: right;
            display: block;
          }

          button {
            margin-top: 10px;
            padding: 12px 32px;
            font-size: 1em;
            cursor: pointer;
            background: #4ade80;
            border: none;
            color: #064e3b;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 15px -3px rgba(74, 222, 128, 0.3);
          }

          button:hover {
            transform: scale(1.05);
            background: #22c55e;
            box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.4);
          }

          button:active {
            transform: scale(0.98);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Waktu Sholat ${sholatName}</h1>
            <div class="time-info">Telah tiba pada pukul ${sholatTime}</div>
          </div>
          <div class="quote-container">
            <q>${quote.content}</q>
            <span class="author">— ${quote.author}</span>
          </div>
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
    `;;

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
  const isJumah = new Date().getDay() === 5;
  const dzuhurTimeLabel = isJumah ? PrayName.Dzuhur + " (Jum'at)" : PrayName.Dzuhur;
  return new vscode.MarkdownString(
    `**Sholat**       **Waktu**  
     **${PrayName.Subuh}**:      ${schedule.subuh}  
     **${PrayName.Terbit}**:     ${schedule.terbit}  
     **${dzuhurTimeLabel}**:     ${schedule.dzuhur}  
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
