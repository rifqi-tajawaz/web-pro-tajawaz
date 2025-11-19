# Dokumentasi Proyek Website Tajawaz Solutions

Selamat datang di dokumentasi proyek website Tajawaz Solutions. Dokumen ini bertujuan untuk memberikan panduan kepada developer dalam memahami struktur, konvensi, dan cara memelihara kualitas kode codebase ini.

## Daftar Isi
1.  [Struktur Direktori](#1-struktur-direktori)
2.  [Konvensi Penamaan](#2-konvensi-penamaan)
3.  [Panduan Kualitas Kode](#3-panduan-kualitas-kode)
    -   [HTML](#html)
    -   [CSS](#css)
    -   [JavaScript](#javascript)
4.  [Cara Menjaga Kualitas Kode](#4-cara-menjaga-kualitas-kode)

---

### 1. Struktur Direktori

Struktur direktori proyek diatur untuk memisahkan antara konten (HTML), styling (CSS), logika (JavaScript), dan aset lainnya.

```
/
├── component/                # Komponen HTML yang dapat digunakan kembali (header, footer, dll.)
├── assets/
│   ├── css/                  # File CSS
│   │   ├── style.css         # File CSS utama
│   │   └── vendor/           # Pustaka CSS pihak ketiga
│   ├── js/                   # File JavaScript
│   │   ├── script.js         # Skrip utama & inisialisasi
│   │   └── vendor/           # Pustaka JS pihak ketiga
│   ├── images/               # Gambar & ikon
│   └── fonts/                # File font
│
├── index.html                # Halaman utama
├── about.html                # Halaman Tentang Kami
├── ... (file HTML lainnya)
└── README.md                 # Dokumentasi ini
```

-   **`component/`**: Berisi potongan HTML yang dimuat secara dinamis oleh `assets/js/script.js` untuk membentuk halaman lengkap.
-   **`assets/`**: Direktori untuk semua aset statis.
-   **File `.html` di root**: Merupakan halaman-halaman utama dari website.

### 2. Konvensi Penamaan

-   **CSS**:
    -   Nama class menggunakan format **kebab-case** (contoh: `.card-testimonial`).
    -   Struktur penamaan class diusahakan mengikuti metodologi **BEM** (Block, Element, Modifier) secara longgar untuk menjaga keterbacaan (contoh: `.card__header--active`).
-   **JavaScript**:
    -   Nama variabel dan fungsi menggunakan format **camelCase** (contoh: `initScrollAnimations`).
    -   Variabel yang menyimpan elemen DOM diawali dengan `$` jika merupakan objek jQuery (contoh: `$header`).
    -   Konstanta menggunakan format **UPPER_CASE** (contoh: `WHATSAPP_NUMBER`).
-   **File**:
    -   File HTML, CSS, dan JS menggunakan format **kebab-case** (contoh: `single-post.html`, `swiper-script.js`).

### 3. Panduan Kualitas Kode

#### HTML

-   **Indentasi**: 2 spasi.
-   **Struktur**: Gunakan tag HTML semantik (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, dll.) untuk meningkatkan aksesibilitas dan SEO.
-   **Komentar**: Setiap bagian utama halaman harus diberi komentar pembuka dan penutup untuk memudahkan navigasi.
    ```html
    <!-- ==========================================================================
       SECTION: BANNER
       ========================================================================== -->
    <section class="section-banner">
      ...
    </section>
    ```
-   **Atribut**: Atribut diurutkan secara alfabetis (`alt`, `class`, `href`, `id`, `src`).
-   **Skrip**: Semua tag `<script>` ditempatkan di akhir `<body>` dan menggunakan atribut `defer` untuk pemuatan non-blocking.

#### CSS

-   **Struktur File**: File `style.css` diorganisir berdasarkan bagian:
    1.  `IMPORTS`
    2.  `CSS VARIABLES / DESIGN TOKENS`
    3.  `KEYFRAMES`
    4.  `RESET & BASE STYLES`
    5.  `GLOBAL LAYOUT`
    6.  `COMPONENTS` (diurutkan secara alfabetis)
    7.  `UTILITIES`
    8.  `MEDIA QUERIES`
-   **Pengurutan Properti**: Properti di dalam setiap rule diurutkan secara **alfabetis**.
-   **Variabel**: Gunakan variabel CSS (`var(--nama-variabel)`) untuk semua nilai yang berulang (warna, ukuran font, spasi) untuk konsistensi.
-   **Komentar**: Setiap bagian utama dan komponen kompleks diberi komentar header.

#### JavaScript

-   **Mode Ketat**: Selalu gunakan `'use strict';` di awal setiap file.
-   **Struktur File**: File diorganisir dengan struktur berikut:
    1.  Header file (deskripsi, author, versi).
    2.  `'use strict';`
    3.  `KONSTANTA & ELEMEN DOM`
    4.  `FUNGSI UTAMA & INISIALISASI`
    5.  `FUNGSI PEMBANTU (HELPERS)`
    6.  `EVENT LISTENERS`
-   **Dokumentasi**: Gunakan **JSDoc** untuk mendokumentasikan setiap fungsi, termasuk deskripsi, parameter (`@param`), dan nilai kembalian (`@returns`).
-   **Variabel**: Gunakan `const` secara default. Gunakan `let` hanya jika variabel perlu diubah nilainya. Hindari penggunaan `var`.
-   **Logging**: Hindari `console.log` di kode produksi. Gunakan hanya untuk debugging selama pengembangan.

### 4. Cara Menjaga Kualitas Kode

1.  **Ikuti Panduan**: Sebelum membuat atau mengubah kode, pastikan Anda memahami konvensi dan panduan yang dijelaskan di dokumen ini.
2.  **Konsisten**: Terapkan gaya pengkodean yang sudah ada. Jika Anda menemukan bagian kode yang tidak konsisten, luangkan waktu untuk merapikannya.
3.  **Komentari Kode Anda**: Jika Anda menulis logika yang kompleks, tambahkan komentar singkat untuk menjelaskan tujuannya.
4.  **Refactor Secara Berkala**: Jangan takut untuk merapikan kode yang ada jika Anda menemukan cara yang lebih baik atau lebih efisien untuk menuliskannya.
5.  **Verifikasi Perubahan**: Setelah membuat perubahan, selalu periksa hasilnya di browser untuk memastikan tidak ada yang rusak secara visual maupun fungsional.

Dengan mengikuti panduan ini, kita dapat memastikan bahwa codebase website Tajawaz Solutions tetap bersih, terorganisir, dan mudah dipelihara untuk pengembangan di masa mendatang.
