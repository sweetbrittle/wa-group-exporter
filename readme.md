# 📱 WA Group Contact Exporter

Sebuah *command-line tool* sederhana berbasis Node.js untuk mengekstrak seluruh daftar kontak (Nama, Nomor WhatsApp, dan Role Admin/Member) dari dalam sebuah Grup WhatsApp dan menyimpannya secara otomatis ke dalam format `.csv`.

## 🚀 Fitur
- **Tanpa Scroll Manual:** Mengambil data langsung lewat API WhatsApp Web.
- **Interaktif:** Meminta *input* nama grup langsung dari terminal.
- **Auto-Format File:** Nama file `.csv` otomatis menyesuaikan dengan nama grup yang diekstrak.
- **Deteksi Role:** Membedakan antara *Admin* dan *Member* grup.

## 🛠️ Persyaratan Sistem
1. [Node.js](https://nodejs.org/) (versi LTS direkomendasikan).
2. Browser **Google Chrome** terinstal di PC/Laptop (path default: `C:\Program Files\Google\Chrome\Application\chrome.exe`).

## 📦 Cara Instalasi

1. *Clone repository* ini atau *download* sebagai ZIP:
   ```bash
   git clone https://github.com/sweetbrittle/wa-group-exporter.git
   cd wa-group-exporter
   ```

2. Install semua *dependency* yang dibutuhkan:
   ```bash
   npm install
   ```

## 💻 Cara Penggunaan

1. Jalankan *script* menggunakan perintah berikut di terminal:
   ```bash
   node index.js
   ```
2. Ketikkan nama Grup WhatsApp yang ingin diekstrak (Perhatikan besar/kecil huruf, spasi, dan emoji harus persis sama).
3. Akan muncul **QR Code** di terminal. Buka aplikasi WhatsApp di HP Anda > **Perangkat Tertaut (Linked Devices)** > **Tautkan Perangkat**, lalu *scan* QR Code tersebut.
4. Tunggu beberapa saat, *script* akan berjalan secara otomatis.
5. Selesai! File *export* akan muncul di dalam folder yang sama dengan format `Export_nama_grup.csv`.

## ⚠️ Troubleshooting (Penyelesaian Masalah)

**Error: `EBUSY: resource busy or locked` atau `evaluate error`**
Ini terjadi karena ada proses Chrome di latar belakang yang menyangkut atau *session* yang korup. Cara mengatasinya (di Windows):
1. Buka PowerShell/Command Prompt.
2. Matikan paksa Google Chrome: `taskkill /F /IM chrome.exe /T`
3. Hapus folder `.wwebjs_auth` di dalam folder *project* ini.
4. Jalankan ulang `node index.js` (Anda harus melakukan *scan* QR Code lagi).

## 📝 Lisensi
Bebas digunakan dan dimodifikasi (MIT License).
