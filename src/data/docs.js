// =====================================================================
//  DATA HALAMAN DOKUMENTASI  (/dokumentasi)
// =====================================================================
//  Susunannya bertingkat supaya tidak berantakan:
//
//    GRUP  ->  PROJECT  ->  CATATAN PENGERJAAN
//
//  - GRUP     : kelompok besar, misalnya "Website Klien" atau "Internal".
//  - PROJECT  : tiap project punya NAMA sendiri dan alamat sendiri
//               (/dokumentasi/<slug>).
//  - CATATAN  : satu baris kerja per tanggal. Urutan di file bebas,
//               halaman otomatis mengurutkan dari yang terbaru dan
//               mengelompokkannya per bulan.
//
//  CARA MENAMBAH
//  1. Project baru   -> salin satu blok project di dalam `projects`
//                       sebuah grup, lalu ganti isinya.
//  2. Grup baru      -> salin satu blok grup di `DOC_GROUPS`.
//  3. Catatan baru   -> tambahkan satu objek di `entries` project-nya.
//
//  ATURAN SINGKAT
//  - `slug` huruf kecil, tanpa spasi, dipisah tanda minus, dan TIDAK boleh
//    kembar antar project (contoh: 'toko-kopi-senja').
//  - `date` selalu berformat 'TAHUN-BULAN-TANGGAL' (contoh: '2026-11-02').
//  - `type`   : rilis | fitur | perbaikan | performa | catatan
//  - `status` : berjalan | selesai | jeda
//  - `notes`  : daftar poin singkat (boleh dikosongkan dengan []).
//
//  PENTING: isi file ini ikut terkirim ke browser pengunjung. Jangan
//  menulis password, API key, atau data pribadi klien di sini.
// =====================================================================

export const ENTRY_TYPES = {
  rilis: 'Rilis',
  fitur: 'Fitur',
  perbaikan: 'Perbaikan',
  performa: 'Performa',
  catatan: 'Catatan',
};

export const PROJECT_STATUS = {
  berjalan: 'Berjalan',
  selesai: 'Selesai',
  jeda: 'Dijeda',
};

// Isi awal di bawah diambil dari riwayat commit repo ini, jadi
// semuanya pekerjaan yang benar-benar terjadi. Ganti, hapus, atau
// tambah sesuka kamu.
export const DOC_GROUPS = [
  {
    id: 'website-goding',
    name: 'Website Goding Grup',
    description: 'Semua pekerjaan untuk situs resmi Goding: tampilan, panel admin, dan sistem pesanan.',
    projects: [
      {
        slug: 'website-utama',
        name: 'Website Utama',
        status: 'berjalan',
        summary: 'Landing page Goding: hero, layanan, proses, klien, harga, dan portfolio, lengkap dengan animasi scroll.',
        stack: ['React 19', 'Vite', 'Tailwind CSS 4', 'Framer Motion', 'Lenis'],
        link: 'https://www.godingofficial.com/',
        entries: [
          {
            date: '2026-04-29',
            type: 'rilis',
            title: 'Rilis pertama dan deploy ke Vercel',
            notes: [
              'Website premium Goding dengan data dari Supabase.',
              'Menambah vercel.json agar routing SPA jalan di Vercel.',
              'Merapikan konfigurasi Vite dan urutan import CSS.',
            ],
          },
          {
            date: '2026-04-29',
            type: 'fitur',
            title: 'Tampilan responsif semua perangkat',
            notes: [
              'Layout disesuaikan untuk HP, tablet, dan desktop.',
              'Pembatas gelombang antar section.',
            ],
          },
          {
            date: '2026-05-04',
            type: 'fitur',
            title: 'Carousel harga dan animasi 3D',
            notes: [
              'Paket harga menjadi carousel horizontal.',
              'Animasi 3D di hero dan beberapa section.',
              'Memperbaiki kartu harga yang saling menimpa.',
            ],
          },
          {
            date: '2026-05-06',
            type: 'fitur',
            title: 'Halaman Portfolio dan logo dari Supabase',
            notes: [
              'Portfolio diambil dari Supabase, hanya yang aktif yang tampil.',
              'Logo di navbar dan footer dibuat bulat dan bisa diganti dari admin.',
            ],
          },
          {
            date: '2026-05-08',
            type: 'perbaikan',
            title: 'Merapikan tampilan di layar kecil (320px)',
            notes: [
              'Section proses ditulis ulang dengan pendekatan mobile-first.',
              'Mencegah overflow horizontal di HP.',
            ],
          },
          {
            date: '2026-05-13',
            type: 'fitur',
            title: 'SEO dan tautan sosial media',
            notes: [
              'Sitemap dan verifikasi Google Search Console.',
              'Favicon logo Goding.',
              'Tautan email, Instagram, dan TikTok di footer.',
            ],
          },
          {
            date: '2026-09-15',
            type: 'perbaikan',
            title: 'Kontak WhatsApp disederhanakan',
            notes: ['Tersisa dua nomor: Owner dan Admin.'],
          },
          {
            date: '2026-10-25',
            type: 'fitur',
            title: 'Animasi scroll halus',
            notes: [
              'Smooth scroll memakai Lenis.',
              'Section bertumpuk, judul muncul dari balik garis, kartu miring saat scroll cepat.',
            ],
          },
          {
            date: '2026-10-27',
            type: 'performa',
            title: 'Mode ringan otomatis',
            notes: ['Perangkat yang kewalahan otomatis memakai mode ringan agar tetap lancar.'],
          },
          {
            date: '2026-10-28',
            type: 'perbaikan',
            title: 'Halaman Harga tanpa efek scroll',
            notes: ['Kartu harga dibuat statis supaya mudah dibaca.'],
          },
        ],
      },
      {
        slug: 'panel-admin',
        name: 'Panel Admin',
        status: 'berjalan',
        summary: 'Dashboard untuk mengelola harga, portfolio, testimoni, klien, marquee, dan logo.',
        stack: ['React', 'Supabase Auth', 'Supabase Database'],
        entries: [
          {
            date: '2026-04-30',
            type: 'fitur',
            title: 'Panel admin pertama',
            notes: [
              'Login admin dengan Supabase Auth.',
              'CRUD paket harga, lengkap dengan fitur utama dan tech stack.',
            ],
          },
          {
            date: '2026-04-30',
            type: 'fitur',
            title: 'CRUD testimoni, klien, dan pengaturan animasi',
            notes: [
              'Tambah, ubah, dan hapus testimoni serta klien.',
              'Pengaturan animasi per komponen.',
            ],
          },
          {
            date: '2026-05-06',
            type: 'fitur',
            title: 'Manajemen portfolio dan upload gambar',
            notes: [
              'Tab Portfolio di admin.',
              'Gambar proyek bisa diunggah langsung dari laptop.',
            ],
          },
        ],
      },
      {
        slug: 'sistem-pesanan',
        name: 'Sistem Pesanan dan Pembayaran',
        status: 'berjalan',
        summary: 'Pemesanan paket langsung dari halaman harga, dengan tautan pembayaran Lynk.',
        stack: ['Supabase', 'Lynk'],
        entries: [
          {
            date: '2026-09-15',
            type: 'fitur',
            title: 'Integrasi pesanan dan tautan pembayaran',
            notes: [
              'Setiap pesanan dicatat di tabel payment_orders dengan kode unik berawalan GDN.',
              'Pembeli diarahkan ke tautan pembayaran Lynk.',
              'Status pesanan bisa dicek lewat kode pesanan.',
            ],
          },
        ],
      },
    ],
  },

  // ---- CONTOH GRUP KEDUA (hapus tanda // di setiap baris untuk memakai) ----
  // {
  //   id: 'website-klien',
  //   name: 'Website Klien',
  //   description: 'Project pesanan dari klien.',
  //   projects: [
  //     {
  //       slug: 'toko-kopi-senja',
  //       name: 'Toko Kopi Senja',
  //       status: 'jeda',
  //       summary: 'Website katalog dan pemesanan untuk Toko Kopi Senja.',
  //       stack: ['React', 'Tailwind CSS'],
  //       link: '',
  //       entries: [
  //         { date: '2026-11-02', type: 'catatan', title: 'Rapat awal dengan klien', notes: ['Menentukan halaman yang dibutuhkan.'] },
  //       ],
  //     },
  //   ],
  // },
];
