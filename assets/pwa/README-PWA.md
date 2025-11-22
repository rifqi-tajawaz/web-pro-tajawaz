# Dokumentasi Teknis PWA - Tajawaz Solutions

Dokumen ini menjelaskan detail implementasi Progressive Web App (PWA) pada website Tajawaz Solutions. PWA ini dirancang untuk memberikan pengalaman pengguna yang cepat, dapat diandalkan (offline-ready), dan menarik layaknya aplikasi native.

## 🌟 Fitur Utama

1.  **Dukungan Offline (Offline Mode)**
    *   Website tetap dapat diakses meskipun pengguna tidak memiliki koneksi internet.
    *   Jika halaman belum pernah dikunjungi sebelumnya, pengguna akan diarahkan ke halaman khusus `offline.html` yang informatif dan sesuai dengan branding.
    *   Tombol "Coba Lagi" pada halaman offline akan otomatis memuat ulang halaman ketika koneksi kembali tersedia.

2.  **Instalasi Aplikasi (Add to Home Screen)**
    *   Pengguna dapat menginstal website ke perangkat mereka (Desktop/Mobile) layaknya aplikasi native.
    *   Menggunakan ikon resolusi tinggi yang adaptif untuk berbagai perangkat (Android, iOS, Windows).
    *   Prompt instalasi yang cerdas (tidak mengganggu pengguna) dikelola oleh `pwa-manager.js`.

3.  **Performa Tinggi (Smart Caching)**
    *   Aset statis (CSS, JS, Gambar, Font) disimpan di cache lokal browser untuk pemuatan instan pada kunjungan berikutnya.
    *   Strategi caching yang optimal menyeimbangkan antara kecepatan dan kesegaran konten.

4.  **Pembaruan Otomatis (Auto Update)**
    *   Service Worker mendeteksi jika ada versi baru dari website.
    *   Notifikasi "Update Tersedia" akan muncul memberitahu pengguna untuk memuat ulang halaman guna mendapatkan konten terbaru.

## 📂 Struktur File & Fungsi

Berikut adalah komponen inti dari sistem PWA ini:

### 1. `sw.js` (Service Worker)
Terletak di root direktori (`/sw.js`). Ini adalah "otak" dari PWA yang berjalan di latar belakang.
*   **Fungsi:** Mengatur caching, intercept request jaringan, dan menangani kondisi offline.
*   **Strategi Caching:**
    *   **Network First (HTML):** Selalu mencoba mengambil konten terbaru dari internet. Jika gagal (offline), baru mengambil dari cache atau menampilkan halaman offline. Ini menjamin pengguna selalu melihat berita/konten terbaru.
    *   **Stale-While-Revalidate (Aset Statis):** Memuat aset dari cache agar super cepat, sambil secara diam-diam mengecek ke server apakah ada versi baru untuk update cache di latar belakang.

### 2. `manifest.json` (Web App Manifest)
Terletak di root direktori (`/manifest.json`).
*   **Fungsi:** Memberikan metadata aplikasi kepada browser.
*   **Isi:** Nama aplikasi, warna tema (`theme_color`), orientasi layar, dan daftar ikon aplikasi dari ukuran kecil hingga besar (72px - 512px).

### 3. `assets/pwa/pwa-manager.js`
*   **Fungsi:** Script client-side yang menjembatani antara website dan Service Worker.
*   **Tugas:**
    *   Mendaftarkan Service Worker.
    *   Menangani event `beforeinstallprompt` untuk menampilkan banner instalasi kustom.
    *   Mendeteksi status online/offline dan menampilkan notifikasi toast.
    *   Mendeteksi adanya update konten dan memunculkan tombol "Update Sekarang".

### 4. `assets/pwa/offline.html`
*   **Fungsi:** Halaman cadangan (fallback) yang muncul saat pengguna membuka halaman yang belum ter-cache dalam kondisi tanpa internet.
*   **Desain:** Mengikuti standar desain Error Page website (Header, Footer, Style) namun menggunakan aset lokal yang sudah di-precache untuk menjamin tampilan tetap sempurna tanpa internet.

## 🛠️ Detail Teknis

### Strategi Precaching
Saat pertama kali dibuka, Service Worker akan otomatis mengunduh dan menyimpan (precache) file-file kritis berikut agar aplikasi bisa berjalan offline:
*   `offline.html`
*   `style.css`
*   `script.js` & `base-url.js`
*   Semua Ikon PWA & Favicon
*   Halaman-halaman utama (`index.html`, `about.html`, `service.html`, dll)
*   Halaman error standar (`404.html`, dll)

### Cache Versioning
Variabel `CACHE_VERSION` di dalam `sw.js` (contoh: `v4.2.0`) digunakan untuk mengontrol versi cache.
*   **Penting:** Setiap kali Anda melakukan perubahan pada kode website (terutama CSS/JS), Anda **harus** menaikkan versi ini di `sw.js` agar browser pengguna mengunduh file terbaru.

## 🧪 Cara Pengujian

1.  **Verifikasi PWA (Lighthouse):**
    *   Buka Chrome DevTools -> Tab **Lighthouse**.
    *   Pilih kategori **Progressive Web App**.
    *   Klik **Analyze page load**. Pastikan semua checklist hijau dan ikon "Installable" muncul.

2.  **Simulasi Offline:**
    *   Buka Chrome DevTools -> Tab **Network**.
    *   Ubah dropdown "No throttling" menjadi **Offline**.
    *   Reload halaman. Anda harusnya melihat halaman `offline.html` (jika halaman tersebut belum di-cache) atau halaman biasa (jika sudah di-cache).

3.  **Cek Service Worker:**
    *   Buka Chrome DevTools -> Tab **Application**.
    *   Pilih **Service Workers** di sidebar kiri.
    *   Pastikan Status berwarna hijau (Activated and is running).

## 📝 Panduan Maintenance

1.  **Menambah Halaman Baru:**
    Jika Anda membuat halaman HTML baru, tambahkan path-nya ke dalam array `PRECACHE_ASSETS` di file `sw.js` agar halaman tersebut juga bisa diakses offline.

2.  **Update Konten/Desain:**
    Setelah melakukan update pada file CSS, JS, atau HTML utama:
    *   Buka `sw.js`.
    *   Ubah `const CACHE_VERSION = 'v4.2.0';` menjadi versi yang lebih tinggi (misal: `v4.2.1`).
    *   Browser pengunjung akan otomatis mendeteksi perubahan ini dan memperbarui cache mereka.

3.  **Mengganti Ikon:**
    Ganti file gambar di `assets/images/favicon/` dengan nama yang sama. Pastikan resolusi tetap sesuai standar (192x192, 512x512, dst) agar ikon di layar utama pengguna terlihat tajam.
