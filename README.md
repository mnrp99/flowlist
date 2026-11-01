# WorthIt Flow — Mindful Personal Finance PWA (Tahap 1)

A modern, experiential personal finance Progressive Web App (PWA) built with **Next.js (App Router, TypeScript)**, **Tailwind CSS**, and **Lucide Icons**, implementing the Google Stitch design system for **WorthIt Flow**.

---

## 🌟 Fitur Utama Tahap 1 (Interactive UI Prototype)

### 1. Home & Cashflow Dashboard
- **Dynamic Hero Card (3 Indikator Saldo)**:
  - `Safe-to-Spend Balance`: Otomatis dihitung secara real-time dari `Real Balance - Locked in Drafts`.
  - `Real Balance`: Saldo nyata yang tersedia.
  - `Locked in Drafts`: Total estimasi yang diproteksi/dialokasikan untuk item-item yang sedang dirancangkan.
  - **Dynamic Progress Bar**: Menampilkan perbandingan persentase antara *Available* dan *Guarded*.
  - **Privacy Toggle**: Ikon mata untuk menyembunyikan/menampilkan saldo (`Rp ••••••••`).
- **Deficit Alert Otomatis (Banner Merah)**:
  - Banner darurat berwarna merah secara otomatis muncul jika `Safe-to-Spend` bernilai minus / kurang dari 0 (`safeToSpend < 0`).
  - Contextual banner peringatan amber jika saldo masih positif namun mendekati batas cadangan.
- **Quick Action Shortcut Tiles**:
  - `Quick Add`: Membuka modal tambah draft.
  - `Wishlist`: Menavigasi ke tab Drafts dengan counter aktif.
  - `Analytics`: Pintasan ke tab Insights.
  - `Set Balance`: Simulator untuk menyesuaikan nominal Real Balance secara langsung.
- **Daftar Recent Activity / Transactions**:
  - Filter kategori fleksibel (`All`, `Expenses`, `Income`).
  - Badge Worth-It Rating dinamis: `🔥 Worth It`, `🤔 So-So`, `❌ Regret`, dan `💰 Income`.
- **Mindful Flow Score Card**: Skor 82% kesadaran finansial (*conscious spending*).

---

### 2. Drafts & Wishlist (Guard Budget Before Spending)
- **Segmented Control 3 Tab**:
  - `📍 To-Go`: Tempat/Restoran (contoh: *Izakaya Ramen Blok M*).
  - `🛍️ To-Buy`: Barang/Kebutuhan (contoh: *Kacamata Minus Anti-Radiasi*).
  - `📅 To-Do`: Aktivitas/Workshop (contoh: *Clay Studio Ceramic Class*, *Gym Monthly Pass*).
- **Summary Banner**: Total dana terkunci (`Locked in Drafts`) dan jumlah rencana aktif.
- **Kartu Item Draft**:
  - Thumbnail visual, tag sumber (TikTok Saved, Shopee Wishlist, IG Saved, Recurring), dan badge kategori.
  - Estimasi biaya, jumlah pax/prioritas/tanggal.
  - Tombol integrasi Google Calendar / External Link.
  - Tombol `✅ Mark Done / Scan Bill` yang langsung memunculkan Bottom Sheet Resolution.
- **Modal `+ Add Draft`**: Formulir interaktif untuk menambah item baru ke dalam draft lokal.

---

### 3. Bottom Sheet Modal (Mark Done & AI Receipt Scanner)
- Muncul saat user menekan tombol tengah **Scan Receipt** di navigasi bawah atau menekan tombol `✅ Mark Done` pada kartu draft.
- **Simulasi `✨ Scan Receipt` (AI OCR)**:
  - Simulasi loading 1,2 detik dengan indikator OCR.
  - Otomatis mengisi angka nominal asli dan menampilkan preview nota pembayaran.
- **Input Nominal Asli**:
  - Dapat diedit dengan preview dampak pengurangan saldo terhadap `Safe-to-Spend`.
- **Evaluasi Wajib Worth-It Rating**:
  - `🔥 Again!`: Loved it / Def coming back.
  - `🤔 Sometimes`: Okay, maybe occasionally.
  - `❌ Never Again`: Waste of money / Regret.
- **Simpan & Potong Saldo**:
  - Memindahkan item dari Draft ke daftar Transaksi.
  - Mengurangi `Real Balance` secara otomatis.
  - Memperbarui seluruh metrik dashboard secara real-time.

---

### 4. Worth-It Insights
- **Dual Stat Bento Grid**:
  - Total pengeluaran `❌ Never Again (Wasted Money)` vs `🔥 Again (Best Value)`.
  - Persentase alokasi penyesalan (*Regret spend rate*).
- **Tab My Favorites vs Blacklist**:
  - `My Favorites`: Menampilkan transaksi bernilai tinggi (*Verified High-Value List*) beserta kutipan refleksi kepuasan.
  - `Blacklist`: Riwayat transaksi yang disesali (*Never Again*), lengkap dengan alasan (*Why Regretted*) dan pembelajaran (*Lesson Learned*).
- **Pencarian & Pengurutan Interaktif**: Filter cepat berdasarkan kata kunci.
- **Flow Recommendation Banner**: Rekomendasi mindful spending bulanan.

---

### 5. Profile & Simulator Tab
- Manajemen profil pengguna (**Rian Adiputra**).
- Simulator nominal saldo untuk menguji skenario Safe-to-Spend surplus maupun defisit.
- Tombol **Reset Dummy Data** untuk mengembalikan data awal.
- Status PWA (*Add to Home Screen*).

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Google Fonts (`Plus Jakarta Sans`)
- **Icons**: Lucide Icons (`lucide-react`)
- **State Management**: React State + LocalStorage (Persistent Dummy Data)
- **Design System**: Sesuai spec Google Stitch "WorthIt Flow Mobile App"

---

## 🚀 Cara Menjalankan

```bash
# Instalasi dependensi
npm install

# Jalankan server pengembangan lokal
npm run dev

# Buka di browser
# http://localhost:3000
```
