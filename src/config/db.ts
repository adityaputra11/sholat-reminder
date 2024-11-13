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
