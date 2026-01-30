import * as vscode from 'vscode';
import { PrayName } from '../constant/pray.constant';
import { Schedule } from '../model/pray.model';
import { getPrayerTimes } from '../utils/time';

export class PrayerTreeDataProvider implements vscode.TreeDataProvider<PrayerItem> {
  private _ondDidChangeTreeData: vscode.EventEmitter<PrayerItem | undefined | null | void> = new vscode.EventEmitter<PrayerItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<PrayerItem | undefined | null | void> = this._ondDidChangeTreeData.event;

  private schedule: Schedule | undefined;

  constructor() { }

  refresh(schedule: Schedule): void {
    this.schedule = schedule;
    this._ondDidChangeTreeData.fire();
  }

  getTreeItem(element: PrayerItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: PrayerItem): Thenable<PrayerItem[]> {
    if (element) {
      return Promise.resolve([]);
    }

    if (!this.schedule) {
      return Promise.resolve([new PrayerItem('Waiting for schedule...', '', vscode.TreeItemCollapsibleState.None)]);
    }

    const prayerTimes = getPrayerTimes(this.schedule);
    const isFriday = new Date().getDay() === 5;

    // Add Terbit manually for display since we removed it from getPrayerTimes
    // We want to display it in the list, just not trigger notifications
    const displayPrayerTimes = [
      ...prayerTimes.slice(0, 1), // Subuh
      { name: PrayName.Terbit, time: this.schedule.terbit },
      ...prayerTimes.slice(1) // Dzuhur onwards
    ];

    return Promise.resolve(displayPrayerTimes.map(p => {
      let label = p.name;
      if (p.name === PrayName.Dzuhur && isFriday) {
        label = `${PrayName.Dzuhur} (Jum'at)`;
      }
      return new PrayerItem(label, p.time, vscode.TreeItemCollapsibleState.None);
    }));
  }
}

class PrayerItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly time: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}: ${this.time}`;
    this.description = this.time;
    this.iconPath = new vscode.ThemeIcon('clock');
  }
}
