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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const pray_constant_1 = require("./constant/pray.constant");
const time_1 = require("./utils/time");
const alert_1 = require("./utils/alert");
const db_1 = require("./config/db");
const location_1 = require("./utils/location");
const baseUrl = "https://api.myquran.com";
const version = "v2";
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("extension.setCityID", async () => {
        const cityID = await vscode.window.showInputBox({
            placeHolder: "Masukkan City ID untuk jadwal sholat",
            prompt: "City ID",
        });
        const quickPick = vscode.window.createQuickPick();
        quickPick.placeholder = "Pilih atau cari opsi...";
        if (cityID) {
            (0, db_1.saveCityID)(cityID);
            vscode.window.showInformationMessage(`City ID ${cityID} berhasil disimpan.`);
            getSholatTime(today);
        }
        else {
            vscode.window.showErrorMessage("City ID tidak valid.");
        }
    }), vscode.commands.registerCommand("extension.searchCity", async () => {
        const quickPick = vscode.window.createQuickPick();
        quickPick.placeholder = "Choose city ...";
        const data = await fetchCity();
        const items = (0, location_1.convertToQuickPickItems)(data);
        quickPick.items = items;
        quickPick.onDidChangeSelection((selection) => {
            if (selection[0]) {
                vscode.window.showInformationMessage(`You Choose: ${selection[0].detail}`);
                if (selection[0].detail) {
                    (0, db_1.saveCityID)(selection[0].detail);
                    vscode.window.showInformationMessage(`City ${selection[0].label} save succesfully.`);
                    getSholatTime(today);
                }
                quickPick.hide();
            }
        });
        // Event ketika dropdown dibatalkan
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }));
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = "Mengambil jadwal sholat...";
    statusBar.show();
    context.subscriptions.push(statusBar);
    const today = new Date().toISOString().split("T")[0];
    let interval;
    async function fetchSholatTime(date) {
        try {
            const localCityID = await (0, db_1.getCityID)();
            const cityID = localCityID || "1301";
            const url = `${baseUrl}/${version}/sholat/jadwal/${cityID}/${date}`;
            const response = await axios_1.default.get(url);
            return response.data.data.jadwal;
        }
        catch (error) {
            console.error("Error fetching sholat time:", error);
            throw new Error("Gagal mengambil jadwal sholat.");
        }
    }
    async function fetchCity() {
        try {
            const localCityID = await (0, db_1.getCityID)();
            const cityID = localCityID || "1301";
            const url = `${baseUrl}/${version}/sholat/kota/semua`;
            const response = await axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching sholat time:", error);
            throw new Error("Gagal mengambil jadwal sholat.");
        }
    }
    async function getSholatTime(date) {
        try {
            statusBar.text = "Jadwal sholat berhasil diambil.";
            const schedule = await fetchSholatTime(date);
            const nowDateTime = new Date();
            const prayTime = [
                { name: pray_constant_1.PrayName.Subuh, time: schedule.subuh },
                { name: pray_constant_1.PrayName.Dzuhur, time: schedule.dzuhur },
                { name: pray_constant_1.PrayName.Ashar, time: schedule.ashar },
                { name: pray_constant_1.PrayName.Maghrib, time: schedule.maghrib },
                { name: pray_constant_1.PrayName.Isya, time: schedule.isya },
            ];
            const markdownTooltip = new vscode.MarkdownString(`**Sholat**       **Waktu**  
         **${pray_constant_1.PrayName.Subuh}**:      ${schedule.subuh}  
         **${pray_constant_1.PrayName.Dzuhur}**:     ${schedule.dzuhur}  
         **${pray_constant_1.PrayName.Ashar}**:      ${schedule.ashar}  
         **${pray_constant_1.PrayName.Maghrib}**:    ${schedule.maghrib}  
         **${pray_constant_1.PrayName.Isya}**:       ${schedule.isya}`);
            statusBar.tooltip = markdownTooltip;
            for (const sholat of prayTime) {
                const [hours, minutes] = sholat.time.split(":").map(Number);
                const prayTimeDate = new Date();
                prayTimeDate.setHours(hours, minutes, 0, 0);
                if (prayTimeDate > nowDateTime) {
                    clearInterval(interval);
                    interval = setInterval(async () => {
                        const now = new Date();
                        const selisihWaktu = prayTimeDate.getTime() - now.getTime();
                        if (selisihWaktu <= 0) {
                            clearInterval(interval);
                            vscode.window.showInformationMessage(`waktu sholat ${sholat.name} telah tiba (${sholat.time}).`);
                            await (0, alert_1.showFullScreenAlert)(context, sholat.name, sholat.time);
                        }
                        else {
                            const cdTime = (0, time_1.calculateCownDown)(selisihWaktu);
                            statusBar.text = `$(zap) ${sholat.name}(${sholat.time}):-${cdTime.hours}:${cdTime.minutes}:${cdTime.seconds}`;
                        }
                    }, 1000);
                    break;
                }
                if (nowDateTime > prayTimeDate && sholat.name === pray_constant_1.PrayName.Isya) {
                    clearInterval(interval);
                    const [tommorowDate, tommorowString] = (0, time_1.getTomorrowDate)();
                    const tomorrowSchedule = await fetchSholatTime(tommorowString);
                    interval = setInterval(async () => {
                        const now = new Date();
                        const [subuhHours, subuhMinutes] = tomorrowSchedule.subuh
                            .split(":")
                            .map(Number);
                        tommorowDate.setHours(subuhHours, subuhMinutes, 0, 0);
                        const selisihWaktu = tommorowDate.getTime() - now.getTime();
                        if (selisihWaktu <= 0) {
                            clearInterval(interval);
                            vscode.window.showInformationMessage(`waktu sholat ${pray_constant_1.PrayName.Subuh} telah tiba (${tomorrowSchedule.subuh}).`);
                            await (0, alert_1.showFullScreenAlert)(context, pray_constant_1.PrayName.Subuh, tomorrowSchedule.subuh);
                        }
                        else {
                            const cdTime = (0, time_1.calculateCownDown)(selisihWaktu);
                            statusBar.text = `$(zap) ${pray_constant_1.PrayName.Subuh}(${tomorrowSchedule.subuh}):-${cdTime.hours}:${cdTime.minutes}:${cdTime.seconds}`;
                        }
                    }, 1000);
                    break;
                }
            }
        }
        catch (error) {
            vscode.window.showErrorMessage("Gagal mengambil jadwal sholat.");
            console.error(error);
        }
    }
    getSholatTime(today);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map