# Aplikasi Manajemen Produk

Aplikasi Express + Sequelize + PostgreSQL untuk autentikasi berbasis session dan CRUD produk. Halaman menggunakan EJS.

## Menjalankan aplikasi

1. Buat database PostgreSQL, misalnya:

```sql
CREATE DATABASE products_db;
```

2. Salin `.env.example` menjadi `.env`, lalu sesuaikan konfigurasi database dan `SESSION_SECRET`.
3. Install dependency dan jalankan server:

```bash
npm install
npm run dev
```

Tabel `users` dan `products` dibuat saat server pertama kali berjalan. Seeder opsional membuat akun dan produk contoh:

```bash
npm run seed
```

Akun contoh: `rizki` atau `budi`, dengan password `password123`.

## Route halaman

| Method | Route                  | Halaman/aksi                                             |
| ------ | ---------------------- | -------------------------------------------------------- |
| GET    | `/`                    | Arahkan ke daftar produk jika sudah login, atau ke login |
| GET    | `/auth/login`          | Form login                                               |
| POST   | `/auth/login`          | Proses login                                             |
| GET    | `/auth/register`       | Form registrasi                                          |
| POST   | `/auth/register`       | Proses registrasi                                        |
| POST   | `/auth/logout`         | Logout                                                   |
| GET    | `/products`            | Daftar produk pengguna                                   |
| GET    | `/products/create`     | Form tambah produk                                       |
| POST   | `/products`            | Simpan produk                                            |
| GET    | `/products/:id/edit`   | Form edit produk                                         |
| POST   | `/products/:id/update` | Perbarui produk                                          |
| POST   | `/products/:id/delete` | Hapus produk                                             |

Semua route produk memerlukan session login yang valid.

## Catatan

- Session ID disimpan di cookie `connect.sid`; aktifkan cookie saat menguji lewat Postman atau Insomnia.
- Untuk production, gunakan session store persisten agar session tidak hilang saat server restart.
