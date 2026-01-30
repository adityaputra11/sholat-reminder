# Changelog

## [1.2.0] - 2026-01-30

- **Fix: Cleanup test command and fix search command typos**
- **Fix: Register missing state and city-state commands in package.json**

- **Feat: Enhanced Alert UI with Glassmorphism and modern aesthetics**
- **Feat: Improve full-screen notification layout and typography**

- **Fix: Monochromatic Activity Bar icon for better VS Code integration**
- **Refactor: Switch to SVG for activity bar icon**

- **Feat: Add Side Menu (Activity Bar) for Prayer Schedule**
- **Fix: Remove "Terbit" (Sunrise) from notification logic**
- **Doc: Add Roadmap and Development Standards to GEMINI.md**

## [1.1.9] - 2026-01-13

- **Feat: Add more Hadith quotes (HR Tirmidzi, An-Nasa'i, and Surah Al-Mudatstsir)**
- **Fix: Friday (Jum'at) label in prayer tooltip**
- **Fix: Quote constant syntax error**

## [1.1.8] - 2024-12-26

- **Chore: Improvement**

## [1.1.7] - 2024-12-26

- **Feat: Reminder before pray time**

## [1.1.6] - 2024-11-26

- **Chore: Downgrade Vscode Engine**

## [1.1.4] - 2024-11-26

- **Feat: Support Malaysian Time**

## [1.1.3] - 2024-11-26

- **Feat: Dynamic Quote**

## [1.1.2] - 2024-11-22

- **Fix: Crash**

## [1.1.1] - 2024-11-22

- **Fix: Extensions stop working when panel disposed via close tab**

## [1.1.0] - 2024-11-15

- **Support International Time**

## [1.0.15] - 2024-11-15

- **Bug Fix**

## [1.0.14] - 2024-11-15

- **Feat: Add Refresh Option**

## [1.0.12] - 2024-11-15

- **Fix: Invalid Date after Subuh**

## [1.0.11] - 2024-11-12

- **Fix: Pad Number**

## [1.0.10] - 2024-11-12

- **Refresh on close modal**

## [1.0.6] - 2024-11-12

- **Fix Crash Command**

## [1.0.5] - 2024-11-12

- **Fitur Search By City**: Pengguna dapat mencari berdasarkan City untuk menampilkan jadwal sholat sesuai lokasi mereka.

## [1.0.4] - 2024-11-12

- **Bug Fix**

## [1.0.0] - 2024-11-12

### Initial Release

- **Fitur Set City ID**: Pengguna dapat mengatur City ID untuk menampilkan jadwal sholat sesuai lokasi mereka.
- **Pengingat Waktu Sholat di Status Bar**: Tampilkan countdown menuju waktu sholat berikutnya di status bar Visual Studio Code.
- **Notifikasi Layar Penuh**: Saat waktu sholat tiba, pengguna akan mendapatkan notifikasi layar penuh di VSCode.
- **Dukungan Pengaturan Ulang Otomatis**: Ekstensi akan secara otomatis memuat ulang ketika City ID diperbarui.
- **Jadwal Sholat Hari Berikutnya**: Mendukung pengingat waktu Subuh pada hari berikutnya jika waktu saat ini sudah melewati Isya.
- **Database SQLite**: City ID disimpan di SQLite, memungkinkan pengaturan tersimpan dan diambil saat diperlukan.
- **Tooltip Status Bar**: Menampilkan daftar lengkap jadwal sholat untuk hari ini ketika pengguna mengarahkan mouse di atas status bar.
