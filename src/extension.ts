import * as vscode from "vscode";
import axios from "axios";
import {
  LocationPray,
  LocationResponse,
  Schedule,
  ScheduleResponse,
} from "./model/pray.model";
import { PrayName } from "./constant/pray.constant";
import { calculateCownDown, getTomorrowDate } from "./utils/time";
import { showFullScreenAlert } from "./utils/alert";
import {
  getCityID,
  saveCityID,
  getCityName,
  saveCityName,
  getIsShowCityName,
  saveIsShowCityName,
} from "./config/db";
import { convertToQuickPickItems } from "./utils/location";

const baseUrl = "https://api.myquran.com";
const version = "v2";

export function activate(context: vscode.ExtensionContext) {
  if (getIsShowCityName(context) === undefined) {
    saveIsShowCityName(context, true);
  }
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.setCityID", async () => {
      const cityID = await vscode.window.showInputBox({
        placeHolder: "Masukkan City ID untuk jadwal sholat",
        prompt: "City ID",
      });

      const quickPick = vscode.window.createQuickPick();
      quickPick.placeholder = "Pilih atau cari opsi...";

      if (cityID) {
        saveCityID(context, cityID);
        vscode.window.showInformationMessage(
          `City ID ${cityID} berhasil disimpan.`
        );
        getSholatTime(today);
      } else {
        vscode.window.showErrorMessage("City ID tidak valid.");
      }
    }),
    vscode.commands.registerCommand("extension.searchCity", async () => {
      const quickPick = vscode.window.createQuickPick();
      quickPick.placeholder = "Choose city ...";

      const data = await fetchCity();
      const items = convertToQuickPickItems(data);

      quickPick.items = items;

      quickPick.onDidChangeSelection((selection) => {
        if (selection[0]) {
          if (selection[0].detail) {
            saveCityID(context, selection[0].detail);
            vscode.window.showInformationMessage(
              `City ${selection[0].label} save succesfully.`
            );
            getSholatTime(today);
          }
          quickPick.hide();
        }
      });

      // Event ketika dropdown dibatalkan
      quickPick.onDidHide(() => quickPick.dispose());

      quickPick.show();
    }),
    vscode.commands.registerCommand("extension.toogleCityName", async () => {
      saveIsShowCityName(context, !getIsShowCityName(context));
    })
  );

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = "Mengambil jadwal sholat...";
  statusBar.show();
  context.subscriptions.push(statusBar);

  const today = new Date().toISOString().split("T")[0];
  let interval: NodeJS.Timeout;

  async function fetchSholatTime(date: string): Promise<Schedule> {
    try {
      const localCityID = getCityID(context);
      const cityID = localCityID || "1301";
      const url = `${baseUrl}/${version}/sholat/jadwal/${cityID}/${date}`;
      const response = await axios.get<ScheduleResponse>(url);
      saveCityName(context, response.data.data.lokasi);
      return response.data.data.jadwal;
    } catch (error) {
      console.error("Error fetching sholat time:", error);
      throw new Error("Gagal mengambil jadwal sholat.");
    }
  }

  async function fetchCity(): Promise<LocationResponse> {
    try {
      const url = `${baseUrl}/${version}/sholat/kota/semua`;
      const response = await axios.get<LocationResponse>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching sholat time:", error);
      throw new Error("Gagal mengambil jadwal sholat.");
    }
  }

  async function getSholatTime(date: string) {
    await showFullScreenAlert(context, "sholat.name", "sholat.time", () =>
      getSholatTime(today)
    );
    try {
      statusBar.text = "Jadwal sholat berhasil diambil.";
      const schedule = await fetchSholatTime(date);
      const lokasi = getCityName(context);
      const nowDateTime = new Date();
      const prayTime = [
        { name: PrayName.Subuh, time: schedule.subuh },
        { name: PrayName.Dzuhur, time: schedule.dzuhur },
        { name: PrayName.Ashar, time: schedule.ashar },
        { name: PrayName.Maghrib, time: schedule.maghrib },
        { name: PrayName.Isya, time: schedule.isya },
      ];

      const markdownTooltip = new vscode.MarkdownString(
        `**Sholat**       **Waktu**  
         **${PrayName.Subuh}**:      ${schedule.subuh}  
         **${PrayName.Dzuhur}**:     ${schedule.dzuhur}  
         **${PrayName.Ashar}**:      ${schedule.ashar}  
         **${PrayName.Maghrib}**:    ${schedule.maghrib}  
         **${PrayName.Isya}**:       ${schedule.isya}`
      );

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
              vscode.window.showInformationMessage(
                `waktu sholat ${sholat.name} telah tiba (${sholat.time}).`
              );
              await showFullScreenAlert(context, sholat.name, sholat.time, () =>
                getSholatTime(today)
              );
            } else {
              const cdTime = calculateCownDown(selisihWaktu);
              const lokasiLabel = getIsShowCityName(context)
                ? ` [${lokasi}]`
                : "";
              statusBar.text = `$(zap) ${sholat.name}(${sholat.time}):-${cdTime.hours}:${cdTime.minutes}:${cdTime.seconds}${lokasiLabel}`;
            }
          }, 1000);
          break;
        }
        if (nowDateTime > prayTimeDate && sholat.name === PrayName.Isya) {
          clearInterval(interval);

          const [tommorowDate, tommorowString] = getTomorrowDate();
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
              vscode.window.showInformationMessage(
                `waktu sholat ${PrayName.Subuh} telah tiba (${tomorrowSchedule.subuh}).`
              );
              await showFullScreenAlert(
                context,
                PrayName.Subuh,
                tomorrowSchedule.subuh,
                () => getSholatTime(today)
              );
            } else {
              const cdTime = calculateCownDown(selisihWaktu);
              const lokasiLabel = getIsShowCityName(context)
                ? ` [${lokasi}]`
                : "";
              statusBar.text = `$(zap) ${PrayName.Subuh}(${tomorrowSchedule.subuh}):-${cdTime.hours}:${cdTime.minutes}:${cdTime.seconds}${lokasiLabel}`;
            }
          }, 1000);
          break;
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage("Gagal mengambil jadwal sholat.");
      console.error(error);
    }
  }

  getSholatTime(today);
}

export function deactivate() {}
