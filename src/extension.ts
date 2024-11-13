import * as vscode from "vscode";
import axios from "axios";
import { Schedule, ScheduleResponse } from "./model/pray.model";
import { PrayName } from "./constant/pray.constant";
import { calculateCownDown, getTomorrowDate } from "./utils/time";
import { showFullScreenAlert } from "./utils/alert";
import { getCityID, initializeDatabase, saveCityID } from "./config/db";

export function activate(context: vscode.ExtensionContext) {
  initializeDatabase();

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.setCityID", async () => {
      const cityID = await vscode.window.showInputBox({
        placeHolder: "Masukkan City ID untuk jadwal sholat",
        prompt: "City ID",
      });

      if (cityID) {
        saveCityID(cityID);
        vscode.window.showInformationMessage(
          `City ID ${cityID} berhasil disimpan.`
        );
        vscode.commands.executeCommand("workbench.action.reloadWindow");
      } else {
        vscode.window.showErrorMessage("City ID tidak valid.");
      }
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
      const baseUrl = "https://api.myquran.com";
      const version = "v2";
      const localCityID = await getCityID();
      const cityID = localCityID || "1301";
      const url = `${baseUrl}/${version}/sholat/jadwal/${cityID}/${date}`;
      const response = await axios.get<ScheduleResponse>(url);
      return response.data.data.jadwal;
    } catch (error) {
      console.error("Error fetching sholat time:", error);
      throw new Error("Gagal mengambil jadwal sholat.");
    }
  }

  async function getSholatTime(date: string) {
    try {
      statusBar.text = "Jadwal sholat berhasil diambil.";
      const schedule = await fetchSholatTime(date);
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
              await showFullScreenAlert(context, sholat.name, sholat.time);
            } else {
              const cdTime = calculateCownDown(selisihWaktu);
              statusBar.text = `$(zap) ${sholat.name}(${sholat.time}):-${cdTime.hours}:${cdTime.minutes}:${cdTime.seconds}`;
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
                tomorrowSchedule.subuh
              );
            } else {
              const cdTime = calculateCownDown(selisihWaktu);
              statusBar.text = `$(zap) ${PrayName.Subuh}(${tomorrowSchedule.subuh}):-${cdTime.hours}:${cdTime.minutes}:${cdTime.seconds}`;
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
