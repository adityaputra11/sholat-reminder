# Sholat Reminder

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.14-brightgreen.svg)
![Maintained](https://img.shields.io/badge/maintained-yes-green.svg)
![Download](https://img.shields.io/visual-studio-marketplace/d/AdityaPutraPratama.sholat-reminder)

**Sholat Reminder** adalah ekstensi Visual Studio Code yang menampilkan pengingat waktu sholat berdasarkan **City ID** yang ditentukan. Ekstensi ini akan menampilkan countdown menuju waktu sholat berikutnya langsung di dalam VSCode.

## Fitur

- **Set City ID**: Atur City ID untuk jadwal sholat di lokasi Anda.
- **Search City**: Atur City untuk jadwal sholat di lokasi Anda.
- **Set Country**: Atur Country untuk jadwal sholat di lokasi Anda (Khusus diluar indonesia).
- **Status Bar Reminder**: Menampilkan countdown menuju waktu sholat berikutnya di status bar.
- **Full-Screen Notification**: Memberikan notifikasi layar penuh saat waktu sholat tiba.
- **Automatic Reload**: Mereload ekstensi secara otomatis setelah City ID diperbarui.

## Sumber API

Ekstensi ini menggunakan [API myQuran](https://api.myquran.com/) untuk mendapatkan jadwal sholat. Jadwal diperbarui setiap kali Anda mengatur atau mengubah City ID, sehingga memastikan waktu sholat yang akurat sesuai lokasi Anda.

#### NEW API

Untuk Jadwal internasional menggunakan [API AlAdhan](https://aladhan.com/) untuk mendapatkan jadwal sholat. khusus diluar indonesia, Perlu dicatat bahwa metode perhitungan jadwal sholat yang digunakan mungkin tidak sepenuhnya akurat karena perbedaan dalam metode perhitungan waktu sholat di berbagai negara. Beberapa API internasional, seperti AlAdhan, menyediakan berbagai metode perhitungan yang dapat dipilih sesuai preferensi pengguna. Namun, hasil perhitungan mungkin tidak selalu sesuai dengan jadwal yang ditetapkan oleh otoritas lokal atau masjid setempat. Untuk informasi lebih lanjut mengenai metode perhitungan yang tersedia, Anda dapat mengunjungi situs AlAdhan

## Cara Mendapatkan City ID

Untuk menggunakan ekstensi ini, Anda memerlukan City ID yang sesuai dengan lokasi Anda. Berikut cara mendapatkannya:

1. Buka [Dokumentasi API myQuran](https://api.myquran.com/).
2. Navigasi ke bagian yang menyediakan daftar **City ID** untuk berbagai kota. Anda dapat melihat endpoint seperti `https://api.myquran.com/v2/sholat/kota/semua` untuk mendapatkan semua City ID yang tersedia.
3. Cari City ID untuk kota Anda dan catat ID-nya. Contoh: `1301` untuk Jakarta.

## Instalasi

1. **Unduh dan Instal**: Anda bisa mengunduh ekstensi ini melalui Visual Studio Code Marketplace.
2. Setelah diinstal, ekstensi akan aktif secara otomatis.

## Cara Menggunakan

1. **Mengatur Berdasarkan Indonesia City**:

   - Buka Command Palette (tekan `Ctrl+Shift+P` atau `Cmd+Shift+P` di Mac).
   - Ketik `Sholat Reminder: Search Indonesia City` dan pilih perintah tersebut.
   - Masukkan City sesuai lokasi Anda untuk menampilkan jadwal sholat yang sesuai.

2. **Mengatur Berdasarkan Country (Khusus di luar indonesia)**:

   - Buka Command Palette (tekan `Ctrl+Shift+P` atau `Cmd+Shift+P` di Mac).
   - Ketik `Sholat Reminder: Search Country` dan pilih perintah tersebut.
   - Masukkan Country sesuai lokasi Anda untuk menampilkan jadwal sholat yang sesuai.

3. **Mengatur City ID**:

   - Buka Command Palette (tekan `Ctrl+Shift+P` atau `Cmd+Shift+P` di Mac).
   - Ketik `Sholat Reminder: Set City ID` dan pilih perintah tersebut.
   - Masukkan City ID sesuai lokasi Anda untuk menampilkan jadwal sholat yang sesuai.

4. **Menampilkan Pengingat Waktu Sholat**:

   - Ekstensi akan menampilkan waktu sholat berikutnya dalam bentuk countdown di status bar.
   - Ketika waktu sholat tiba, akan muncul notifikasi layar penuh di VSCode.

5. **Merubah City ID**:

   - Jika Anda berpindah lokasi, Anda dapat mengubah City ID dengan perintah yang sama di Command Palette.
   - Setelah City ID berhasil diperbarui, VSCode akan otomatis reload untuk menerapkan perubahan.

6. **Menampilkan/Menyembunyikan City Name**:
   - Buka Command Palette (tekan `Ctrl+Shift+P` atau `Cmd+Shift+P` di Mac).
   - Ketik `Sholat Reminder: Toogle City Name` dan pilih perintah tersebut.
   - Maka City Name pada Status Bar akan tampil/hilang sesuai kebutuhan Anda.

## Contoh Tampilan

<img width="102" alt="Screenshot 2024-11-12 at 11 10 27 PM" src="https://github.com/user-attachments/assets/cdcca550-837a-4e8f-8bc6-62ed56468e68">

## Lisensi

Ekstensi ini dilisensikan di bawah [MIT License](LICENSE.md).

## Kontribusi

Kami menyambut kontribusi dari komunitas! Silakan fork repositori ini dan buat pull request untuk perbaikan atau fitur baru.
silahkan email saya adityaputrapratama39@gmail.com jika kesulitan

## Catatan

Pastikan koneksi internet aktif agar dapat mengambil jadwal sholat terbaru dari server.
