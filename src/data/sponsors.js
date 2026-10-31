// =====================================================================
//  DATA HALAMAN SPONSOR  (/sponsor)
// =====================================================================
//  CARA MENAMBAH SPONSOR
//  1. Taruh logo di folder  public/sponsors/  (contoh: public/sponsors/kopi-senja.png)
//  2. Tambahkan satu objek di `SPONSORS` di bawah.
//
//  Contoh:
//    {
//      name: 'Kopi Senja',
//      tier: 'gold',                       // platinum | gold | silver | supporter
//      logo: '/sponsors/kopi-senja.png',   // boleh dikosongkan, nanti tampil huruf awal
//      website: 'https://kopisenja.id',    // boleh dikosongkan
//      since: '2026',                      // boleh dikosongkan
//      note: 'Mendukung kegiatan belajar coding.', // boleh dikosongkan
//    },
//
//  Selama `SPONSORS` masih kosong, halaman otomatis menampilkan ajakan
//  "jadi sponsor pertama".
// =====================================================================

// Tingkatan sponsor. Urutannya = urutan tampil di halaman.
// `benefits` hanya contoh, ubah sesuai kesepakatan yang benar-benar
// bisa kalian berikan ke sponsor.
export const SPONSOR_TIERS = [
  {
    id: 'platinum',
    name: 'Platinum',
    tagline: 'Mitra utama',
    benefits: [
      'Logo terbesar di halaman Sponsor',
      'Tautan ke website sponsor',
      'Disebut di sosial media Goding',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Pendukung besar',
    benefits: ['Logo besar di halaman Sponsor', 'Tautan ke website sponsor'],
  },
  {
    id: 'silver',
    name: 'Silver',
    tagline: 'Pendukung',
    benefits: ['Logo di halaman Sponsor', 'Tautan ke website sponsor'],
  },
  {
    id: 'supporter',
    name: 'Supporter',
    tagline: 'Sahabat Goding',
    benefits: ['Nama dicantumkan di halaman Sponsor'],
  },
];

// Daftar sponsor. Kosong dulu, isi saat sudah ada.
export const SPONSORS = [];
