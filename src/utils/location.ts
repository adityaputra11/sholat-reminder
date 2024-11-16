import * as vscode from "vscode";
import {
  LocationObj,
  LocationPray,
  LocationResponse,
} from "../model/pray.model";
import { ICountry } from "country-state-city";

export function convertToQuickPickItems(
  data: LocationResponse
): vscode.QuickPickItem[] {
  return data.data.map((location: LocationPray) => ({
    label: location.lokasi,
    detail: location.id,
  }));
}

export function buildCountryPickItem(data: ICountry[]): vscode.QuickPickItem[] {
  return data.map((item: ICountry) => ({
    label: item.name,
    detail: item.isoCode,
  }));
}
