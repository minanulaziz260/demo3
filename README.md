# Undangan Digital Green Burgundy (Nuansa Islami) - Vitopia REA

Projek ini adalah hasil reverse engineering & rekonstruksi mandiri (standalone) dari template undangan pernikahan digital Vitopia:
**Green Burgundy** (`https://vitopia.co/templates/preview/green-burgundy`).

Website ini sudah dibuat **100% mandiri (self-contained)**, semua gambar, font styling, skrip interaktif, dan lagu audio tersimpan secara lokal dan dapat dibuka langsung secara offline maupun diunggah ke hosting (Netlify, Vercel, GitHub Pages, cPanel, dll).

---

## 📁 Struktur Direktori

```text
undangan-green-burgundy/
├── index.html                 # Halaman utama undangan (Responsive Split-screen & Mobile)
├── README.md                  # Dokumentasi & panduan penggunaan
└── assets/
    ├── audio/
    │   └── 6oSgxW3SDRqt84xvi80FtOuUUjxXPoZaMsDzbWjv.mp3 # Lagu romantis (Elliot James Reay)
    ├── css/
    │   ├── app.css            # Framework Tailwind CSS dari bundle Vitopia
    │   ├── resolver.css       # Style komponen & keyframes Vitopia
    │   └── style.css          # Variabel warna kustom, animasi, & styling
    ├── images/                # 18 aset gambar lokal (ornamen bunga, foto mempelai, kaligrafi, vinyl)
    └── js/
        └── main.js            # Interaktivitas (Musik, Countdown, RSVP, Doa, Lightbox, Salin Rekening)
```

---

## ✨ Fitur-Fitur Interaktif

1. **Audio Music Player & Vinyl Spinning**:
   - Tombol vinyl piringan hitam di pojok kiri bawah yang berputar saat lagu dimainkan (`vinyl.png`).
   - Otomatis memutar lagu saat tamu menekan tombol **"Buka Undangan"**.
   - Mendukung jeda (pause) & lanjut (play) dengan kontrol klik.
2. **Kustomisasi Nama Tamu (Dynamic URL Param)**:
   - Mendukung parameter URL `?to=Nama+Tamu` atau `?u=Nama+Tamu`.
   - Contoh: `index.html?to=Bapak+Joko+&+Keluarga` -> Otomatis mengubah nama pada amplop/kartu sambutan.
3. **Countdown Timer Acara**:
   - Menghitung mundur (Hari, Jam, Menit, Detik) menuju hari H (Akad & Resepsi: Sabtu, 12 April 2025).
4. **Formulir Konfirmasi Kehadiran (RSVP)**:
   - Tamu dapat mengisi nama, jumlah tamu, opsi (Hadir, Tidak Hadir, Masih Ragu), dan ucapan singkat.
   - Data tersimpan otomatis di `localStorage` peramban.
5. **Amplop Digital / Hadiah (Gift)**:
   - Kartu rekening Bank BRI & Mandiri.
   - Tombol **"Salin Nomor Rekening"** interaktif dengan notifikasi toast modern.
   - Tombol konfirmasi transfer langsung via WhatsApp.
6. **Buku Tamu (Doa & Ucapan)**:
   - Tamu dapat meninggalkan nama dan doa restu secara langsung.
   - Ucapan baru langsung muncul di daftar komentar secara real-time dan tersimpan di `localStorage`.
7. **Galeri Foto & Lightbox Modal**:
   - Grid foto momen kenangan mempelai.
   - Klik pada foto untuk membuka tampilan popup layar penuh (Lightbox).
8. **Floating Menu Navigasi**:
   - Menu pintas melayang di pojok kanan atas untuk melompat langsung ke bagian Opening, Quotes, Couple, Event, Love Story, RSVP, Gift, Comment, Gallery, atau Penutup.

---

## 🚀 Cara Menjalankan

### Cara 1: Buka Langsung (Offline)
Cukup ekstrak file ZIP, lalu klik dua kali file `index.html` di peramban (Chrome, Edge, Firefox, Safari).

### Cara 2: Jalankan dengan Web Server Lokal (Opsional)
Jika ingin menguji fitur audio tanpa batasan peramban lokal:
```bash
# Menggunakan Python
python3 -m http.server 8000

# Buka http://localhost:8000 di browser
```

---

Dibuat dengan bantuan Antigravity AI & REA.
