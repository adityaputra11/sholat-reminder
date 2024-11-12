import * as path from "path";
import * as sqlite3 from "sqlite3";

const dbPath = path.join(__dirname, "settings.db");
const db = new sqlite3.Database(dbPath);

export function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
}

export function saveCityID(cityID: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO settings (key, value) VALUES ('cityID', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [cityID],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export function getCityID(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT value FROM settings WHERE key = ?",
      ["cityID"],
      (err, row: { value: string } | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.value : null);
        }
      }
    );
  });
}
