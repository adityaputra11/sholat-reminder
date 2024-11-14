import * as vscode from "vscode";

export function saveCityID(
  context: vscode.ExtensionContext,
  cityID: string
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
  cityName: string
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
