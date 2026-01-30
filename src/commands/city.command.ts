import { ICity, IState } from "country-state-city";
import * as vscode from "vscode";
import {
  fetchAllCountry,
  fetchCityByStateAndCountryCode,
  fetchStateByCountryCode,
} from "../api/city.api";
import { fetchCityList } from "../api/pray.api";
import {
  getCountry,
  getState,
  saveCityID,
  saveCityName,
  setCityState,
  setCountry,
  setState,
} from "../config/db";
import { Command } from "../constant/command.constant";
import { PrayService } from "../services/pray.service";
import {
  buildCountryPickItem,
  convertToQuickPickItems,
} from "../utils/location";
import { getToday } from "../utils/time";

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
  quickPick.placeholder = "Choose kota ...";

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

        //Remove State and Country
        setState(context, undefined);
        setCountry(context, undefined);

        vscode.window.showInformationMessage(
          `${cityName} with ID ${cityID} save successfully.`
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

export async function searchCountryCommand(context: vscode.ExtensionContext) {
  const quickPick = vscode.window.createQuickPick();
  quickPick.placeholder = "Choose Country ...";

  try {
    // Fetch data kota
    const data = await fetchAllCountry();
    const items = buildCountryPickItem(data);

    // Tampilkan kota
    quickPick.items = items;

    quickPick.onDidChangeSelection((selection) => {
      if (selection[0]) {
        const countryCode = selection[0].detail || "";
        const countryName = selection[0].label;

        // Simpan ke storage
        setCountry(context, { code: countryCode, name: countryName });

        vscode.window.showInformationMessage(
          `${countryName} with ID ${countryCode} save succesfully.`
        );

        // Trigger jadwal sholat ulang
        vscode.commands.executeCommand(Command.SEARCH_STATE);
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

export async function searchStateCommand(context: vscode.ExtensionContext) {
  const quickPick = vscode.window.createQuickPick();
  quickPick.placeholder = "Choose state ...";

  try {
    // Fetch data state berdasarkan kode negara
    const countryCode = getCountry(context)?.code || "";
    const data = await fetchStateByCountryCode(countryCode);
    const items = data.map((state: IState) => ({
      label: state.name,
      detail: state.isoCode,
    }));

    // Tampilkan state
    quickPick.items = items;

    quickPick.onDidChangeSelection((selection) => {
      if (selection[0]) {
        const stateCode = selection[0].detail || "";
        const stateName = selection[0].label;

        const { latitude, longitude } = data.filter(
          (item) => item.name === stateName
        )[0];

        // Simpan ke storage
        setState(context, {
          code: stateCode,
          name: stateName,
          latitude: latitude || "",
          longitude: longitude || "",
        });

        //Remove local city
        saveCityID(context, undefined);
        saveCityName(context, undefined);

        vscode.window.showInformationMessage(
          `State ${stateName} dengan ID ${stateCode} berhasil disimpan.`
        );
        vscode.commands.executeCommand(Command.SEARCH_CITY_STATE);
        quickPick.hide();
      }
    });

    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  } catch (error) {
    vscode.window.showErrorMessage("Gagal memuat daftar state.");
    console.error(error);
  }
}

export async function searchCityStateCommand(context: vscode.ExtensionContext) {
  const quickPick = vscode.window.createQuickPick();
  quickPick.placeholder = "Choose city ...";

  try {
    // Fetch data state berdasarkan kode negara
    const countryCode = getCountry(context)?.code || "";
    const stateCode = getState(context)?.code || "";
    const data = await fetchCityByStateAndCountryCode(countryCode, stateCode);
    const items = data.map((city: ICity) => ({
      label: city.name,
      detail: "-",
    }));

    // Tampilkan state
    quickPick.items = items;

    quickPick.onDidChangeSelection((selection) => {
      if (selection[0]) {
        const cityCode = selection[0].detail || "";
        const cityName = selection[0].label;

        const { latitude, longitude } = data.filter(
          (item) => item.name === cityName
        )[0];

        setCityState(context, {
          code: cityCode,
          name: cityName,
          latitude: latitude || "",
          longitude: longitude || "",
        });

        saveCityName(context, cityName);

        vscode.window.showInformationMessage(
          `City ${cityName} dengan ID ${cityCode} berhasil disimpan.`
        );
        vscode.commands.executeCommand(Command.REFRESH);
        quickPick.hide();
      }
    });

    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  } catch (error) {
    vscode.window.showErrorMessage("Gagal memuat daftar state.");
    console.error(error);
  }
}
