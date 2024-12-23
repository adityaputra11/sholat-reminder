import * as vscode from "vscode";
import { getReminderBeforePray, setReminderBeforePray } from "../config/db";
export async function setReminderBeforePrayCommand(
  context: vscode.ExtensionContext
) {
  const result = await vscode.window.showInputBox({
    prompt: "Set reminder minutes before prayer time (0 to disable)",
    placeHolder: "Enter minutes (e.g. 10)",
    value: getReminderBeforePray(context).toString(),
  });

  if (result !== undefined) {
    const minutes = parseInt(result);
    if (isNaN(minutes) || minutes < 0) {
      vscode.window.showErrorMessage(
        "Please enter a valid number of minutes (0 or greater)"
      );
      return;
    }
    setReminderBeforePray(context, minutes);
    vscode.window.showInformationMessage(
      `Prayer reminder set to ${minutes} minutes before prayer time`
    );
  }
}
