import * as vscode from "vscode";
import { PrayName } from "./constant/pray.constant";
import {
  calculateCountdown,
  getPrayerTimes,
  getToday,
  getTomorrowDate,
  parseTime,
} from "./utils/time";
import {
  buildStatusBar,
  generatePrayerTooltip,
  showFullScreenAlert,
} from "./utils/alert";
import {
  getCityName,
  getIsShowCityName,
  saveIsShowCityName,
  getReminderBeforePray,
} from "./config/db";
import {
  searchCityCommand,
  searchCityStateCommand,
  searchCountryCommand,
  searchStateCommand,
  setCityIDCommand,
} from "./commands/city.command";
import { setReminderBeforePrayCommand } from "./commands/reminder.command";
import { Command } from "./constant/command.constant";
import { PrayService } from "./services/pray.service";
import { Schedule } from "./model/pray.model";
import { PrayerTreeDataProvider } from "./provider/prayerTreeDataProvider";

export function activate(context: vscode.ExtensionContext) {
  if (getIsShowCityName(context) === undefined) {
    saveIsShowCityName(context, true);
  }
  context.subscriptions.push(
    vscode.commands.registerCommand(Command.SET_CITY_ID, () =>
      setCityIDCommand(context)
    ),
    vscode.commands.registerCommand(Command.SEARCH_CITY, async () =>
      searchCityCommand(context)
    ),
    vscode.commands.registerCommand(Command.SEARCH_COUNTRY, async () =>
      searchCountryCommand(context)
    ),
    vscode.commands.registerCommand(Command.SEARCH_STATE, async () =>
      searchStateCommand(context)
    ),
    vscode.commands.registerCommand(Command.SEARCH_CITY_STATE, async () =>
      searchCityStateCommand(context)
    ),
    vscode.commands.registerCommand(Command.TOGGLE_CITY_NAME, async () => {
      saveIsShowCityName(context, !getIsShowCityName(context));
    }),
    vscode.commands.registerCommand(Command.REFRESH, async () => {
      getSholatTime(getToday());
    }),
    vscode.commands.registerCommand(
      Command.SET_REMINDER_BEFORE_PRAY,
      async () => {
        setReminderBeforePrayCommand(context);
      }
    )
  );

  const prayerTreeDataProvider = new PrayerTreeDataProvider();
  vscode.window.registerTreeDataProvider("sholat-schedule", prayerTreeDataProvider);

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = "Mengambil jadwal sholat...";
  statusBar.show();
  context.subscriptions.push(statusBar);

  let interval: NodeJS.Timeout;

  async function getSholatTime(date: string) {
    try {
      statusBar.text = "Jadwal sholat berhasil diambil.";
      const service = new PrayService(context);
      const schedule = await service.getSchedule(date);
      prayerTreeDataProvider.refresh(schedule);
      const lokasi = getCityName(context);
      const nowDateTime = new Date();
      //Generate Pray Time
      const prayTime = getPrayerTimes(schedule);
      const markdownTooltip = generatePrayerTooltip(schedule);

      statusBar.tooltip = markdownTooltip;

      for (const sholat of prayTime) {
        const [hours, minutes] = parseTime(sholat.time);
        const prayTimeDate = new Date();
        prayTimeDate.setHours(hours, minutes, 0, 0);

        if (prayTimeDate > nowDateTime) {
          handlePrayerCountdown(prayTimeDate, sholat, statusBar, lokasi);
          break;
        }
        if (nowDateTime > prayTimeDate && sholat.name === PrayName.Isya) {
          handleTomorrowCountdown(
            getTomorrowDate()[0],
            schedule,
            statusBar,
            lokasi
          );
          break;
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage("Gagal mengambil jadwal sholat.");
      console.error(error);
    }
  }
  async function handlePrayerCountdown(
    prayTimeDate: Date,
    sholat: { name: string; time: string },
    statusBar: vscode.StatusBarItem,
    lokasi: string | undefined
  ) {
    clearInterval(interval);
    let reminderShown = false;
    const reminderMinutes = getReminderBeforePray(context);

    interval = setInterval(async () => {
      const now = new Date();
      const remainingTime = prayTimeDate.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));

      // Check for reminder
      if (
        reminderMinutes > 0 &&
        remainingMinutes === reminderMinutes &&
        !reminderShown &&
        remainingTime > 0
      ) {
        reminderShown = true;
        vscode.window.showInformationMessage(
          `${sholat.name} prayer time in ${reminderMinutes} minutes (${sholat.time})`
        );
      }

      if (remainingTime <= 0) {
        clearInterval(interval);
        vscode.window.showInformationMessage(
          `Waktu sholat ${sholat.name} telah tiba (${sholat.time}).`
        );
        await showFullScreenAlert(context, sholat.name, sholat.time, () =>
          getSholatTime(getToday())
        );
      } else {
        statusBar.text = buildStatusBar(
          context,
          sholat.name,
          sholat.time,
          calculateCountdown(remainingTime),
          lokasi
        );
      }
    }, 1000);
  }

  async function handleTomorrowCountdown(
    tommorowDate: Date,
    tomorrowSchedule: Schedule,
    statusBar: vscode.StatusBarItem,
    lokasi: string | undefined
  ) {
    clearInterval(interval);
    let reminderShown = false;
    const reminderMinutes = getReminderBeforePray(context);

    interval = setInterval(async () => {
      const now = new Date();
      const [subuhHours, subuhMinutes] = tomorrowSchedule.subuh
        .split(":")
        .map(Number);
      tommorowDate.setHours(subuhHours, subuhMinutes, 0, 0);
      const remainingTime = tommorowDate.getTime() - now.getTime();
      const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));

      // Check for reminder
      if (
        reminderMinutes > 0 &&
        remainingMinutes === reminderMinutes &&
        !reminderShown &&
        remainingTime > 0
      ) {
        reminderShown = true;
        vscode.window.showInformationMessage(
          `${PrayName.Subuh} prayer time in ${reminderMinutes} minutes (${tomorrowSchedule.subuh})`
        );
      }

      if (remainingTime <= 0) {
        clearInterval(interval);
        vscode.window.showInformationMessage(
          `Waktu sholat ${PrayName.Subuh} telah tiba (${tomorrowSchedule.subuh}).`
        );
        await showFullScreenAlert(
          context,
          PrayName.Subuh,
          tomorrowSchedule.subuh,
          () => getSholatTime(getToday())
        );
      } else {
        statusBar.text = buildStatusBar(
          context,
          PrayName.Subuh,
          tomorrowSchedule.subuh,
          calculateCountdown(remainingTime),
          lokasi
        );
      }
    }, 1000);
  }

  getSholatTime(getToday());
}

export function deactivate() { }
