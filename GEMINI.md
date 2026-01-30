# GEMINI Documentation

## 1. Aplikasi & Fitur Saat Ini

**Sholat Reminder** adalah ekstensi Visual Studio Code yang dirancang untuk membantu pengguna muslim memantau waktu sholat tanpa meninggalkan editor. Ekstensi ini menyediakan jadwal sholat yang akurat berdasarkan lokasi (City ID) dan memberikan notifikasi visual.

### Fitur Utama:

- **Jadwal Sholat Real-time**: Menampilkan countdown menuju waktu sholat berikutnya di Status Bar.
- **Pencarian Lokasi**:
  - **Search City**: Mencari kota di Indonesia.
  - **Search Country**: Mencari jadwal untuk lokasi internasional.
  - **Set City ID**: Pengaturan manual menggunakan ID kota dari sumber data.
- **Notifikasi**:
  - **Status Bar**: Informasi waktu sholat selanjutnya.
  - **Full-Screen Notification**: Peringatan visual saat waktu sholat tiba.
  - **Pre-Reminder**: Pengingat beberapa menit sebelum waktu sholat (dapat dikonfigurasi).
- **Auto-Update**: Jadwal diperbarui otomatis dan ekstensi melakukan reload saat lokasi berubah.
- **Toggle Display**: Opsi untuk menyembunyikan/menampilkan nama kota di status bar.

### Sumber Data:

- **Indonesia**: [API myQuran](https://api.myquran.com/)
- **Internasional**: [API AlAdhan](https://aladhan.com/)
- **Malaysia**: [Waktu Solat API](https://api.waktusolat.app)

---

## 2. Standarisasi Development

Untuk menjaga kualitas kode, konsistensi, dan kemudahan pemeliharaan, berikut adalah standar pengembangan yang harus diikuti:

### A. Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js (VS Code Extension Host)
- **Bundler**: esbuild
- **Linter**: ESLint
- **Testing**: VS Code Test Electron / Mocha

### B. Struktur Direktori (`src/`)

Pastikan kode ditempatkan sesuai dengan fungsinya:

- `api/`: Berisi logic untuk fetch data dari API eksternal (MyQuran, AlAdhan, dll).
- `commands/`: Definisi command yang didaftarkan ke VS Code (`vscode.commands.registerCommand`).
- `config/`: Konfigurasi global atau constants yang bersifat konfigurasi.
- `constant/`: Konstanta statis (misal: nama-nama sholat, pesan error).
- `model/`: Interface dan Tipe Data (Types/Interfaces) untuk struktur data.
- `services/`: Business logic utama (perhitungan waktu, manajemen state, timer).
- `utils/`: Fungsi helper umum (formatter waktu, logger, notifikasi).
- `test/`: Unit test dan integration test.
- `extension.ts`: Entry point ekstensi (`activate` & `deactivate`).

### C. Naming Convention

- **File Names**: `camelCase.ts` atau `kebab-case.ts` (konsisten dalam satu folder).
  - Contoh: `prayerService.ts`, `alert-utils.ts`.
- **Class Names**: `PascalCase`.
  - Contoh: `PrayerService`, `NotificationManager`.
- **Functions & Variables**: `camelCase`.
  - Contoh: `getPrayerTimes()`, `nextPrayer`.
- **Constants**: `UPPER_SNAKE_CASE`.
  - Contoh: `DEFAULT_CITY_ID`.

### D. Coding Guidelines

1.  **Type Safety**: Hindari penggunaan `any`. Gunakan Interface atau Type yang jelas di folder `model/`.
2.  **Async/Await**: Gunakan `async/await` daripada promise chaining `.then()` untuk keterbacaan.
3.  **Error Handling**: Selalu gunakan `try-catch` pada operasi asynchronous (API call) dan berikan feedback user yang jelas via `vscode.window.showErrorMessage`.
4.  **Clean Code**:
    - Pecah fungsi yang terlalu panjang.
    - Satu fungsi sebaiknya hanya melakukan satu hal (Single Responsibility Principle).
5.  **Comments**: Tambahkan JSDoc pada fungsi public atau logika yang kompleks.

### E. Git Workflow

- **Commit Messages**: Gunakan format Conventional Commits.
  - `feat: ...` untuk fitur baru.
  - `fix: ...` untuk perbaikan bug.
  - `refactor: ...` untuk perubahan kode tanpa merubah fitur.
  - `docs: ...` untuk perubahan dokumentasi.
- **Branching**:
  - `main`: Branch produksi yang stabil.
  - `dev` / `feature/*`: Untuk pengembangan fitur baru.

### F. Langkah Build & Run

1.  Install dependencies: `bun install`.
2.  Jalankan dalam mode debug: Tekan `F5` di VS Code.
3.  Build production: `bun run build:prod` (menggunakan esbuild + minify).
4.  Linting: `bun run lint`.

## 3. Roadmap & Rencana Optimasi

Berikut adalah rencana pengembangan jangka menengah dan panjang untuk memastikan **Sholat Reminder** tetap reliabel, cepat, dan kaya fitur.

### Phase 1: Performance & Stability (Priority)

Fokus pada pondasi yang kuat dan efisiensi resource.

- [ ] **Optimasi Activation Time**:
  - Menerapkan _Lazy Loading_ pada modul yang berat.
  - Mengurangi dependensi yang di-load saat startup VS Code.
- [ ] **Offline Caching (Memento API)**:
  - Menyimpan jadwal sholat terakhir yang berhasil di-fetch ke local storage.
  - Jika internet mati atau API down, gunakan data cache ini agar user tetap mendapatkan jadwal (fallback mechanism).
- [ ] **Memory Management**:
  - Audit penggunaan `setInterval` untuk memastikan timer dibersihkan dengan benar saat ekstensi di-deactivate atau reload window.
- [ ] **Bundle Optimization**:
  - Review konfigurasi `esbuild` untuk memastikan _tree-shaking_ maksimal.

### Phase 2: User Experience (UX) Enhancement

Meningkatkan kenyamanan dan personalisasi pengguna.

- [ ] **Custom Notification Sound**:
  - Opsi bagi user untuk memilih suara notifikasi (Adzan penuh, beep, atau silent).
  - Support upload file audio custom (jika memungkinkan di environment VS Code).
- [ ] **"Zen Mode" Support**:
  - Fitur untuk mematikan notifikasi sementara (Do Not Disturb) saat user sedang dalam mode coding intensif, hanya tampilkan di status bar.
- [ ] **Enhanced Status Bar**:
  - Implementasi _Hover Tooltip_ pada status bar yang menampilkan jadwal lengkap 5 waktu sholat hari ini tanpa perlu membuka menu lain.
- [ ] **Auto-Location Detection (Optional)**:
  - Fitur eksperimental untuk mendeteksi lokasi via IP Address (sebagai opsi cepat bagi user baru), dengan tetap memprioritaskan City ID manual untuk akurasi.

### Phase 3: Maintainability & Expansion

Menjaga kesehatan codebase dan memperluas jangkauan.

- [ ] **Comprehensive Unit Testing**:
  - Meningkatkan coverage test hingga >80%, terutama untuk logic perhitungan waktu (`TimeUtils`) dan handling API.
- [ ] **Automated CI/CD**:
  - Setup GitHub Actions untuk menjalankan test otomatis setiap PR.
  - Otomatisasi publish ke VS Marketplace saat tag version baru di-push.
- [ ] **Multi-Language Support (i18n)**:
  - Menambahkan dukungan bahasa lain (Arab, Inggris global) untuk menjangkau pengguna internasional yang lebih luas.
