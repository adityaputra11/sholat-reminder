"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showFullScreenAlert = showFullScreenAlert;
const vscode = __importStar(require("vscode"));
async function showFullScreenAlert(context, sholatName, sholatTime) {
    const panel = vscode.window.createWebviewPanel("sholatNotification", `Waktu Sholat ${sholatName} Telah Tiba`, vscode.ViewColumn.One, { enableScripts: true });
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
        </style>
      </head>
      <body>
        <div>
          <h1>Waktu Sholat ${sholatName}</h1>
          <p>Telah tiba pada pukul ${sholatTime}</p>
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
    context.subscriptions.push(panel.webview.onDidReceiveMessage((message) => {
        if (message.command === "close") {
            panel.dispose();
        }
    }));
}
//# sourceMappingURL=alert.js.map