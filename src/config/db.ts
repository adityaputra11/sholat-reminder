import * as vscode from "vscode";

export type Country = {
  name: string;
  code: string;
};

export type State = {
  name: string;
  code: string;
  latitude: string;
  longitude: string;
};

export type CityState = {
  name: string;
  code: string;
  latitude: string;
  longitude: string;
};

export function saveCityID(
  context: vscode.ExtensionContext,
  cityID: string | undefined
): Thenable<void> {
  return context.globalState.update("cityID", cityID);
}

export function getCityID(
  context: vscode.ExtensionContext
): string | undefined {
  return context.globalState.get<string>("cityID");
}

export function saveCityName(
  context: vscode.ExtensionContext,
  cityName: string | undefined
): Thenable<void> {
  return context.globalState.update("cityName", cityName);
}

export function getCityName(
  context: vscode.ExtensionContext
): string | undefined {
  return context.globalState.get<string>("cityName");
}

export function saveIsShowCityName(
  context: vscode.ExtensionContext,
  status: boolean
): Thenable<void> {
  return context.globalState.update("isShowCityName", status);
}

export function getIsShowCityName(
  context: vscode.ExtensionContext
): boolean | undefined {
  return context.globalState.get<boolean>("isShowCityName");
}

export function setCountry(
  context: vscode.ExtensionContext,
  country: Country | undefined
): Thenable<void> {
  return context.globalState.update("country", country);
}

export function getCountry(
  context: vscode.ExtensionContext
): Country | undefined {
  return context.globalState.get<Country>("country");
}

export function setState(
  context: vscode.ExtensionContext,
  country: State | undefined
): Thenable<void> {
  return context.globalState.update("state", country);
}

export function getState(context: vscode.ExtensionContext): State | undefined {
  return context.globalState.get<State>("state");
}

export function setCityState(
  context: vscode.ExtensionContext,
  country: CityState | undefined
): Thenable<void> {
  return context.globalState.update("state", country);
}

export function getCityState(
  context: vscode.ExtensionContext
): CityState | undefined {
  return context.globalState.get<State>("state");
}

export function getReminderBeforePray(
  context: vscode.ExtensionContext
): number {
  return context.globalState.get("reminderMinutes", 0); // default to 0 (no reminder)
}

export function setReminderBeforePray(
  context: vscode.ExtensionContext,
  minutes: number
) {
  context.globalState.update("reminderMinutes", minutes);
}
