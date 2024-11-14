import * as vscode from "vscode";
import { QuoteSholat } from "../constant/quote.constant";

function randomQuote<T>(array: T[]): T {
  const indeksAcak = Math.floor(Math.random() * array.length);
  return array[indeksAcak];
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

  const quote = randomQuote(QuoteSholat);

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
            <q>${quote.quote}</q>
            <h2>${quote.source}</h2>
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
        callback();
      }
    })
  );
}
