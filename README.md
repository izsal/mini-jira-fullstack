# Mini Jira — SvelteKit + Bun Fullstack

Aplikasi manajemen proyek dan pelacakan tiket bergaya Jira minimalis yang dibangun menggunakan arsitektur modern: **Bun + Hono + Drizzle ORM** pada backend dan **SvelteKit + Tailwind CSS v4 + shadcn UI** pada frontend.

---

## 📁 Struktur Direktori Proyek

```text
mini-jira/
├── docker-compose.yml          # Konfigurasi multi-container Docker (Postgres, Backend, Frontend)
├── README.md                   # Dokumentasi panduan instalasi, migrasi, dan arsitektur
│
├── backend/                    # REST API Server (Bun + Hono + Drizzle)
│   ├── drizzle/                # File SQL migrasi database yang digenerate oleh Drizzle Kit
│   │   └── 0000_*.sql
│   ├── src/
│   │   ├── db/
│   │   │   ├── client.ts       # Koneksi database PostgreSQL dengan Drizzle ORM
│   │   │   ├── schema.ts       # Definisi schema tabel (users, projects, tickets, dll.)
│   │   │   └── migrate.ts      # Script eksekutor migrasi otomatis
│   │   ├── middleware/
│   │   │   └── auth.ts         # Middleware otentikasi JWT via HTTP-only Cookie
│   │   ├── routes/
│   │   │   ├── auth.ts         # Endpoints: POST /register, POST /login, POST /logout
│   │   │   ├── projects.ts     # Endpoints: GET/POST /projects, GET /projects/:id
│   │   │   ├── tickets.ts      # Endpoints: GET/POST /tickets, PATCH status
│   │   │   └── comments.ts     # Endpoints: GET/POST komentar tiket
│   │   └── index.ts            # Entrypoint Hono app & CORS middleware
│   ├── drizzle.config.ts       # Konfigurasi Drizzle Kit untuk PostgreSQL
│   ├── Dockerfile              # Docker container untuk backend
│   └── package.json            # Script & dependensi backend
│
└── frontend/                   # Web Application (SvelteKit + Tailwind v4 + shadcn UI)
    ├── src/
    │   ├── lib/
    │   │   ├── components/
    │   │   │   ├── ui/         # Komponen shadcn UI (Button, Card, Badge, Input)
    │   │   │   │   ├── badge/
    │   │   │   │   ├── button/
    │   │   │   │   ├── card/
    │   │   │   │   └── input/
    │   │   │   ├── KanbanColumn.svelte  # Kolom kanban board (To Do, In Progress, Done)
    │   │   │   ├── Modal.svelte         # Accessible dialog modal
    │   │   │   └── TicketCard.svelte    # Kartu tiket bergaya Jira modern
    │   │   ├── stores/
    │   │   │   └── ui.ts       # Store global untuk Toast notifikasi
    │   │   └── utils.ts        # Helper utilitas Tailwind (fungsi cn)
    │   ├── routes/
    │   │   ├── (public)/       # Route publik (tidak butuh auth)
    │   │   │   ├── login/      # Halaman Login
    │   │   │   └── register/   # Halaman Pendaftaran Akun Baru
    │   │   ├── (app)/          # Route terproteksi dengan sidebar dashboard
    │   │   │   ├── +layout.svelte       # Shell sidebar navigasi & topbar
    │   │   │   ├── +layout.server.ts    # Auth guard (cek validitas sesi token)
    │   │   │   └── projects/
    │   │   │       ├── +page.svelte     # List seluruh project & search
    │   │   │       └── [id]/            # Papan Kanban Board per project
    │   │   ├── +layout.svelte  # Root layout & floating toast alert
    │   │   └── +page.server.ts # Redirect otomatis dari '/' ke '/projects'
    │   ├── app.css             # Tailwind CSS v4 directives & tema warna Slate
    │   └── app.html            # Template HTML dasar dengan Google Font Inter
    ├── vite.config.ts          # Konfigurasi Vite dengan Tailwind CSS v4 & SvelteKit
    ├── Dockerfile              # Docker container untuk frontend
    └── package.json            # Script & dependensi frontend
```

---

## 🗄️ Database & Cara Menjalankan Migrasi

Backend menggunakan **Drizzle ORM** dan **PostgreSQL**.

### 1. Perintah Migrasi Database

Masuk ke folder `backend`:

```bash
cd backend
```

Tersedia beberapa perintah database di `backend/package.json`:

| Perintah | Deskripsi |
| :--- | :--- |
| `bun run db:generate` | Membaca `src/db/schema.ts` lalu men-generate file SQL migrasi ke folder `./drizzle`. |
| `bun run db:migrate` | **Menjalankan file migrasi SQL** ke database PostgreSQL aktif (menggunakan `src/db/migrate.ts`). |
| `bun run db:push` | Menerapkan perubahan schema secara langsung ke PostgreSQL (cocok untuk prototyping cepat). |
| `bun run db:studio` | Membuka Drizzle Studio di browser untuk melihat dan mengelola data tabel secara visual. |

### 2. Langkah Menjalankan Migrasi Pertama Kali

Pastikan PostgreSQL sudah berjalan dan variabel `DATABASE_URL` di `backend/.env` sudah benar:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mini_jira
JWT_SECRET=rahasia-banget
PORT=3000
```

Jalankan perintah berikut:

```bash
# Generate file migrasi (jika mengubah schema.ts)
bun run db:generate

# Jalankan migrasi ke database yang masih kosong
bun run db:migrate
```

Output yang diharapkan:
```text
⏳ Menjalankan migrasi database...
✅ Migrasi database berhasil diterapkan!
```

Tabel yang dibuat:
- `users` (id, name, email, password_hash, role, created_at)
- `projects` (id, name, description, owner_id, created_at)
- `tickets` (id, project_id, title, description, status, assignee_id, created_at)
- `comments` (id, ticket_id, author_id, body, created_at)
- `activity_logs` (id, ticket_id, actor_id, action, meta, created_at)

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

Pastikan [Bun](https://bun.sh/) sudah terinstal:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Langkah 1: Jalankan PostgreSQL

Gunakan Docker untuk menjalankan PostgreSQL secara mudah:
```bash
docker run -d --name mini-jira-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mini_jira \
  -p 5432:5432 \
  postgres:16-alpine
```

### Langkah 2: Jalankan Backend

Di terminal pertama:
```bash
cd backend

# Salin file environment jika belum ada
cp .env.example .env

# Install dependensi
bun install

# Jalankan migrasi tabel
bun run db:migrate

# Jalankan backend dev server (port 3000)
bun run dev
```
Backend berjalan di: `http://localhost:3000`

### Langkah 3: Jalankan Frontend

Di terminal kedua:
```bash
cd frontend

# Salin file environment jika belum ada
cp .env.example .env

# Install dependensi
bun install

# Jalankan frontend dev server (port 5173)
bun run dev
```
Buka di browser: `http://localhost:5173`

---

## 🐳 Menjalankan Menggunakan Docker Compose

Jika ingin menjalankan seluruh stack (PostgreSQL + Backend + Frontend) sekaligus:

```bash
docker compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/health
- **PostgreSQL**: port 5432

---

## 🔑 Autentikasi & Akun

- **Register**: Buka `http://localhost:5173/register` untuk mendaftarkan akun baru (`name`, `email`, `password`).
- **Login**: Buka `http://localhost:5173/login` untuk masuk ke akun yang sudah terdaftar.
- **Auto Session**: Token JWT disimpan secara aman di HTTP-only cookie untuk melindungi rute internal `(app)`.

## menjalankan dengan docker untuk di up deploy
docker compose config --quiet && echo OK
docker compose up -d --build
docker compose ps
docker compose exec frontend env | grep -E "ORIGIN|PUBLIC_API_URL"


## tambahan ketika di up deploy run migrate dengan docker
docker compose exec backend bunx drizzle-kit push
