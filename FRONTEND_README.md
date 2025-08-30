# BookMyField Frontend

Frontend sederhana untuk demonstrasi API BookMyField yang dibangun dengan Next.js 15, TypeScript, dan Tailwind CSS.

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup environment variables:**
   Pastikan file `.env.local` sudah ada dengan konfigurasi:

   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
   ```

3. **Jalankan development server:**

   ```bash
   npm run dev
   ```

4. **Buka aplikasi di browser:**
   ```
   http://localhost:3000
   ```

## 📱 Features

### Landing Page

- Overview fitur BookMyField
- Link ke halaman login/register
- Informasi demo account

### Authentication

- Login dan Register form
- Demo buttons untuk quick login
- JWT token management
- Auto redirect berdasarkan role

### Admin Dashboard

- 👑 **Admin Panel** (login: admin@admin.com / password123)
  - CRUD operations untuk lapangan
  - Monitor semua booking
  - Dashboard statistik
  - Management lapangan (create, edit, delete)

### User Dashboard

- 👤 **User Panel** (login: user@user.com / password123)
  - Browse dan filter lapangan
  - Booking lapangan dengan date/time picker
  - Riwayat booking dengan status
  - Integrasi pembayaran Stripe
  - Cancel booking dengan refund

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **State Management:** React Hooks (useState, useEffect)

## 📁 Project Structure

```
app/
├── auth/                 # Login/Register page
├── admin/               # Admin dashboard
├── user/                # User dashboard
├── layout.tsx           # Root layout with Toaster
└── page.tsx             # Landing page

components/
├── Navbar.tsx           # Navigation component
└── LoadingSpinner.tsx   # Loading component

lib/
├── api.ts              # Axios configuration
├── authService.ts      # Authentication API calls
├── fieldService.ts     # Field management API calls
├── bookingService.ts   # Booking API calls
└── paymentService.ts   # Payment API calls

types/
└── index.ts            # TypeScript type definitions
```

## 🔐 Demo Accounts

Aplikasi ini menyediakan 2 demo account untuk testing:

### Admin Account

- **Email:** admin@admin.com
- **Password:** password123
- **Features:**
  - Manage fields (CRUD)
  - View all bookings
  - Admin dashboard

### User Account

- **Email:** user@user.com
- **Password:** password123
- **Features:**
  - Browse and filter fields
  - Create bookings
  - Payment integration
  - View booking history

## 🔌 API Integration

Frontend ini terintegrasi penuh dengan BookMyField API:

### Auth Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token

### Fields Endpoints

- `GET /fields` - Get all fields (with filters)
- `GET /fields/:id` - Get field by ID
- `POST /fields/admin` - Create field (admin only)
- `PUT /fields/admin/:id` - Update field (admin only)
- `DELETE /fields/admin/:id` - Delete field (admin only)

### Bookings Endpoints

- `GET /bookings` - Get all bookings (admin only)
- `GET /bookings/me` - Get user's bookings
- `POST /bookings` - Create booking
- `DELETE /bookings/:id` - Cancel booking

### Payments Endpoints

- `POST /payments/create-checkout-session` - Create Stripe checkout

## 🎨 UI/UX Features

- **Responsive Design:** Mobile-first approach dengan Tailwind CSS
- **Role-based Navigation:** Berbeda untuk admin dan user
- **Loading States:** Loading spinners untuk better UX
- **Toast Notifications:** Success/error feedback
- **Form Validation:** Client-side validation
- **Modal Forms:** Clean modal interfaces
- **Date/Time Pickers:** Native HTML5 datetime inputs
- **Filtering:** Advanced field filtering
- **Currency Formatting:** IDR currency display

## 🚦 Getting Started untuk Presentasi

1. **Start Backend API** (di terminal terpisah):

   ```bash
   # Pastikan Go backend running di port 8080
   go run ./cmd/api/main.go
   ```

2. **Start Frontend** (di terminal ini):

   ```bash
   npm run dev
   ```

3. **Demo Flow:**
   - Buka http://localhost:3000
   - Klik "Mulai Sekarang"
   - Login sebagai admin (klik "👑 Login Admin")
   - Demo admin features: create field, view bookings
   - Logout dan login sebagai user (klik "👤 Login User")
   - Demo user features: browse fields, create booking
   - Test payment flow dengan Stripe

## 🔧 Environment Configuration

Pastikan backend API running di `http://localhost:8080` atau update `NEXT_PUBLIC_API_BASE_URL` di `.env.local` sesuai dengan URL backend Anda.

## 📝 Notes

- Frontend ini dibuat untuk **demo/presentasi** API BookMyField
- Authentication menggunakan JWT dengan localStorage
- Role detection berdasarkan email (demo purposes)
- Error handling dengan toast notifications
- Auto-redirect berdasarkan authentication status

---

**Happy Coding!** 🚀
