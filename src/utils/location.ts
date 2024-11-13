import * as vscode from "vscode";
import {
  LocationObj,
  LocationPray,
  LocationResponse,
} from "../model/pray.model";

export function convertToQuickPickItems(
  data: LocationResponse
): vscode.QuickPickItem[] {
  return data.data.map((location: LocationPray) => ({
    label: location.lokasi,
    detail: location.id,
    description: `ID: ${location.id}`,
  }));
}
