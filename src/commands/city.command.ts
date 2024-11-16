import * as vscode from "vscode";
import { saveCityID, saveCityName } from "../config/db";
import { PrayService } from "../services/pray.service";
import { fetchCityList } from "../api/pray.api";
import { convertToQuickPickItems } from "../utils/location";
import { getToday } from "../utils/time";
import { Command } from "../constant/command.constant";

export async function setCityIDCommand(context: vscode.ExtensionContext) {
  const cityID = await vscode.window.showInputBox({
    placeHolder: "Masukkan City ID untuk jadwal sholat",
    prompt: "City ID",
  });

  if (cityID) {
    saveCityID(context, cityID);
    vscode.window.showInformationMessage(
      `City ID ${cityID} berhasil disimpan.`
    );
    const prayService = new PrayService(context);
    await prayService.getSchedule(getToday());
  } else {
    vscode.window.showErrorMessage("City ID tidak valid.");
  }
}

export async function searchCityCommand(context: vscode.ExtensionContext) {
  const quickPick = vscode.window.createQuickPick();
  quickPick.placeholder = "Pilih kota ...";

  try {
    // Fetch data kota
    const data = await fetchCityList();
    const items = convertToQuickPickItems(data);

    // Tampilkan kota
    quickPick.items = items;

    quickPick.onDidChangeSelection((selection) => {
      if (selection[0]) {
        const cityID = selection[0].detail || "";
        const cityName = selection[0].label;

        // Simpan ke storage
        saveCityID(context, cityID);
        saveCityName(context, cityName);

        vscode.window.showInformationMessage(
          `Kota ${cityName} dengan ID ${cityID} berhasil disimpan.`
        );

        // Trigger jadwal sholat ulang
        vscode.commands.executeCommand(Command.REFRESH);
        quickPick.hide();
      }
    });

    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  } catch (error) {
    vscode.window.showErrorMessage("Gagal memuat daftar kota.");
    console.error(error);
  }
}
