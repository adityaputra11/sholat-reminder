import * as vscode from "vscode";

export function saveCityID(cityID: string): Thenable<void> {
  return vscode.commands.executeCommand("setContext", "cityID", cityID);
}

export function getCityID(): string | undefined {
  return vscode.workspace.getConfiguration().get<string>("cityID");
}
