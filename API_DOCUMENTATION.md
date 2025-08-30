# 🏟️ BookMyField API

**BookMyField** adalah platform backend untuk sistem booking lapangan olahraga yang menyediakan solusi manajemen lapangan yang efisien dan andal untuk pengelola fasilitas olahraga dan pengguna. Dalam proyek ini, kami bertujuan untuk menyediakan API yang kuat dan terukur yang mendukung semua fungsi inti dari operasi booking lapangan modern. API ini mencakup fitur untuk mengelola pengguna, lapangan, booking, dan pembayaran dengan pengalaman yang seamless.

**Fitur:**

- 🔐 Otentikasi dengan JWT (Access & Refresh Token)
- 🔓 Otorisasi dengan RBAC (Role Based Access Control) (ADMIN, USER)
- 🏟️ Manajemen lapangan olahraga (CRUD operations)
- 📅 Sistem booking real-time dengan validasi tanggal/waktu
- 💳 Integrasi pembayaran dengan Stripe Payment Gateway (IDR support)
- 🎣 Implementasi webhook Stripe untuk payment status update otomatis
- 📄 Dokumentasi standar OpenAPI dengan Swagger UI
- ✅ Validasi data komprehensif dan error handling
- 🔒 JWT token blacklisting untuk keamanan ekstra
- 🔍 Advanced filtering untuk pencarian lapangan
- 📊 Auto-seeding admin user dan sample data untuk development

**Endpoints:**

- Auth endpoints untuk login, register, refresh token, dan logout
- Manajemen lapangan (Admin only)
- Sistem booking lapangan untuk user
- Track booking history pengguna
- Pembatalan booking dengan refund otomatis
- Payment processing dan webhook handling
- Health check endpoint

**Default Credentials:**

- Admin: admin@admin.com | password123
- User: user@user.com | password123

**Tech Stack:** Go, Gin Framework, PostgreSQL/SQLite, GORM, Stripe API, JWT, Redis, Swagger

**Repo:** https://github.com/qullDev/BookMyField  
**Swagger:** http://localhost:8080/swagger/index.html  
**Postman Collection:** https://github.com/qullDev/BookMyField/blob/main/postman_collection.json

[![Go Version](https://img.shields.io/badge/Go-1.18+-blue.svg)](https://golang.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![API Documentation](https://img.shields.io/badge/API-Swagger-orange.svg)](http://localhost:8080/swagger/index.html)

## 📚 API Documentation

Dokumentasi API lengkap tersedia melalui Swagger UI:

[http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)

### 📸 Screenshots Swagger UI

![Swagger Documentation](./images/swagger%201.png)
![Swagger API Endpoints](./images/swagger%202.png)

## ✨ Features

- **🔐 User Authentication**: Secure registration and login with JWT tokens
- **🏟️ Field Management**: Admins can create, update, and delete field information
- **📅 Booking System**: Users can book fields, view their booking history, and cancel bookings
- **💳 Payment Integration**: Seamless payment processing via Stripe with IDR support
- **👥 Role-Based Access Control**: Differentiated access for regular users and administrators
- **🔒 Security**: JWT blacklisting, input validation, and proper error handling
- **📊 Filtering**: Advanced field filtering by location and price range

## 🛠️ Tech Stack

- **Backend**: Go (Golang) v1.24+ with Gin framework
- **Database**: PostgreSQL with GORM (SQLite fallback for development)
- **Cache**: Redis for JWT token blacklisting and session management
- **Payments**: Stripe API with webhook support (IDR currency)
- **API Documentation**: Swagger/OpenAPI 3.0 with interactive UI
- **Authentication**: JWT with access & refresh tokens
- **Validation**: Gin validator with comprehensive input validation
- **Development Tools**: Air for live reloading

---

## 🚀 Getting Started

Follow these steps to get the backend server running on your local machine.

### 📋 Prerequisites

- Go (version 1.18 or higher)
- PostgreSQL (or SQLite will be used automatically for development)
- Redis
- [Air](https://github.com/cosmtrek/air) for live reloading (optional, but recommended)

### 🔧 Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/qullDev/BookMyField.git
    cd BookMyField
    ```

2.  **Install Go dependencies:**

    ```sh
    go mod tidy
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in the required values for your local setup (Database, Redis, JWT Secret, Stripe keys).

### ▶️ Running the Application

- The application will automatically create the necessary database tables on startup (`AutoMigrate`).
- It will also seed the database with an admin user, a regular user, and some initial field data.
- If no `DATABASE_URL` is provided, the app will automatically use SQLite for development.

**Sample seeded data includes:**

- Admin user and regular user accounts
- 3 sample fields: Futsal (Jakarta), Basket (Bandung), Badminton (Surabaya)

To run the server:

```sh
go run ./cmd/api/main.go
```

For development with live-reloading (requires `air`):

```sh
air
```

The API server will start on `http://localhost:8080`.

### 👤 Default Accounts

After running the application, you can use these default accounts for testing:

**Admin Account:**

- Email: `admin@admin.com`
- Password: `password123`

**Regular User Account:**

- Email: `user@user.com`
- Password: `password123`

---

## 📖 API Reference

**Base URL**: `/api/v1`

### 🔐 Authentication

Endpoints for user registration and login.

#### 1. User Registration

- **Endpoint**: `POST /api/v1/auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (`201 Created`):
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Error Response** (`400 Bad Request`):
  ```json
  {
    "error": "Email already registered"
  }
  ```

#### 2. User Login

- **Endpoint**: `POST /api/v1/auth/login`
- **Description**: Authenticates a user and returns access and refresh tokens.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "refresh_token": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Error Response** (`401 Unauthorized`):
  ```json
  {
    "error": "Invalid email or password"
  }
  ```

#### 3. User Logout

- **Endpoint**: `POST /api/v1/auth/logout`
- **Authorization**: `Bearer <access_token>`
- **Description**: Logs the user out by invalidating the access token and deleting the refresh token.
- **Request Body**:
  ```json
  {
    "refresh_token": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "message": "Logged out"
  }
  ```

#### 4. Refresh Access Token

- **Endpoint**: `POST /api/v1/auth/refresh`
- **Description**: Issues a new access token using a valid refresh token.
- **Request Body**:
  ```json
  {
    "refresh_token": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "refresh_token": "new-refresh-token-here"
  }
  ```
- **Error Response** (`401 Unauthorized`):
  ```json
  {
    "error": "Invalid refresh token"
  }
  ```

### 🏟️ Fields

Endpoints for retrieving and managing field information.

#### 1. Get All Fields

- **Endpoint**: `GET /api/v1/fields`
- **Description**: Retrieves a list of all available fields, with optional filters.
- **Query Parameters**:
  - `location` (string, optional): Filter fields by location (case-insensitive search).
  - `min_price` (number, optional): Filter for fields with a price greater than or equal to this value.
  - `max_price` (number, optional): Filter for fields with a price less than or equal to this value.
- **Success Response** (`200 OK`):
  ```json
  [
    {
      "id": "c1f8e4d9-8a2b-4b6e-9c1d-5a8f8c7b6a5d",
      "name": "Lapangan Futsal A",
      "location": "Jakarta",
      "price": 200000,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
  ```

#### 2. Get Field by ID

- **Endpoint**: `GET /api/v1/fields/:id`
- **Description**: Retrieves details for a specific field.
- **Success Response** (`200 OK`):
  ```json
  {
    "id": "c1f8e4d9-8a2b-4b6e-9c1d-5a8f8c7b6a5d",
    "name": "Lapangan Futsal A",
    "location": "Jakarta",
    "price": 200000,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
  ```
- **Error Response** (`404 Not Found`):
  ```json
  {
    "error": "Field not found"
  }
  ```

#### 3. Create Field (Admin Only)

- **Endpoint**: `POST /api/v1/fields/admin`
- **Authorization**: `Bearer <admin_access_token>`
- **Request Body**:
  ```json
  {
    "name": "Lapangan Tennis Baru",
    "location": "Bandung",
    "price": 150000
  }
  ```
- **Success Response** (`201 Created`):
  ```json
  {
    "id": "...",
    "name": "Lapangan Tennis Baru",
    "location": "Bandung",
    "price": 150000,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
  ```

#### 4. Update Field (Admin Only)

- **Endpoint**: `PUT /api/v1/fields/admin/:id`
- **Authorization**: `Bearer <admin_access_token>`
- **Request Body**:
  ```json
  {
    "name": "Lapangan Tennis Updated",
    "location": "Bandung Barat",
    "price": 175000
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "id": "...",
    "name": "Lapangan Tennis Updated",
    "location": "Bandung Barat",
    "price": 175000,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
  ```

#### 5. Delete Field (Admin Only)

- **Endpoint**: `DELETE /api/v1/fields/admin/:id`
- **Authorization**: `Bearer <admin_access_token>`
- **Success Response** (`200 OK`):
  ```json
  {
    "message": "Field deleted successfully"
  }
  ```

### 📅 Bookings

Endpoints for creating and managing user bookings.

#### 1. Get All Bookings (Admin Only)

- **Endpoint**: `GET /api/v1/bookings`
- **Authorization**: `Bearer <admin_access_token>`
- **Description**: Retrieves a list of all bookings from all users.
- **Success Response** (`200 OK`):
  ```json
  [
    {
      "id": "...",
      "user_id": "...",
      "field_id": "...",
      "start_time": "2024-09-15T10:00:00Z",
      "end_time": "2024-09-15T12:00:00Z",
      "status": "confirmed",
      "created_at": "2024-09-15T09:00:00Z",
      "updated_at": "2024-09-15T09:30:00Z"
    }
  ]
  ```

#### 2. Create a Booking

- **Endpoint**: `POST /api/v1/bookings`
- **Authorization**: `Bearer <user_access_token>`
- **Request Body**:
  ```json
  {
    "field_id": "c1f8e4d9-8a2b-4b6e-9c1d-5a8f8c7b6a5d",
    "start_time": "2024-09-15T10:00:00Z",
    "end_time": "2024-09-15T12:00:00Z"
  }
  ```
- **Success Response** (`201 Created`):
  ```json
  {
    "id": "...",
    "user_id": "...",
    "field_id": "c1f8e4d9-8a2b-4b6e-9c1d-5a8f8c7b6a5d",
    "start_time": "2024-09-15T10:00:00Z",
    "end_time": "2024-09-15T12:00:00Z",
    "status": "pending",
    "created_at": "2024-09-15T09:00:00Z",
    "updated_at": "2024-09-15T09:00:00Z"
  }
  ```
- **Error Response** (`409 Conflict`):
  ```json
  {
    "error": "Field is already booked for this time slot"
  }
  ```

#### 3. Get My Bookings

- **Endpoint**: `GET /api/v1/bookings/me`
- **Authorization**: `Bearer <user_access_token>`
- **Description**: Retrieves all bookings for the currently authenticated user.
- **Success Response** (`200 OK`):
  ```json
  [
    {
      "id": "...",
      "user_id": "...",
      "field_id": "...",
      "start_time": "2024-09-15T10:00:00Z",
      "end_time": "2024-09-15T12:00:00Z",
      "status": "confirmed",
      "created_at": "2024-09-15T09:00:00Z",
      "updated_at": "2024-09-15T09:30:00Z",
      "field": {
        "id": "...",
        "name": "Lapangan Futsal A",
        "location": "Jakarta",
        "price": 200000
      },
      "payments": [
        {
          "id": "...",
          "booking_id": "...",
          "amount": 200000,
          "currency": "idr",
          "status": "succeeded",
          "stripe_ref_id": "cs_test_..."
        }
      ]
    }
  ]
  ```

#### 4. Cancel a Booking

- **Endpoint**: `DELETE /api/v1/bookings/:id` atau `DELETE /api/v1/bookings/:id/cancel`
- **Authorization**: `Bearer <user_access_token>`
- **Description**: Cancels a user's booking. If already paid, it will attempt to refund via Stripe.
- **Success Response** (`200 OK`):
  ```json
  {
    "message": "Booking cancelled and payment refunded successfully",
    "refund_id": "re_...",
    "refund_status": "succeeded"
  }
  ```
- **Error Response** (`404 Not Found`):
  ```json
  {
    "error": "Booking not found"
  }
  ```

### 💳 Payments

Endpoints for handling payments with Stripe integration.

#### 1. Create Stripe Checkout Session

- **Endpoint**: `POST /api/v1/payments/create-checkout-session`
- **Authorization**: `Bearer <user_access_token>`
- **Description**: Creates a Stripe checkout session for a pending booking.
- **Request Body**:
  ```json
  {
    "booking_id": "c1f8e4d9-8a2b-4b6e-9c1d-5a8f8c7b6a5d"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "session_id": "cs_test_...",
    "session_url": "https://checkout.stripe.com/pay/cs_test_..."
  }
  ```
- **Error Response** (`400 Bad Request`):
  ```json
  {
    "error": "Payment already exists for this booking"
  }
  ```

#### 2. Stripe Webhook

- **Endpoint**: `POST /api/v1/payments/stripe-webhook`
- **Description**: Listens for events from Stripe to update payment and booking statuses. This is intended for Stripe to call, not the frontend.
- **Note**: This endpoint requires proper Stripe signature verification.

---

## 🏗️ Project Structure

```
BookMyField/
├── cmd/
│   └── api/
│       ├── main.go                 # Application entry point
│       ├── docs/                   # Swagger documentation
│       └── tmp/                    # Air build artifacts
├── internal/
│   ├── config/
│   │   ├── db.go                   # Database configuration
│   │   ├── jwt.go                  # JWT utilities
│   │   ├── redis.go                # Redis configuration
│   │   └── stripe.go               # Stripe configuration
│   ├── controllers/
│   │   ├── auth_controller.go      # Authentication endpoints
│   │   ├── booking_controller.go   # Booking management
│   │   ├── field_controller.go     # Field management
│   │   └── payment_controller.go   # Payment processing
│   ├── middlewares/
│   │   ├── jwt.go                  # JWT authentication middleware
│   │   └── role.go                 # Role-based access control
│   ├── models/
│   │   ├── booking.go              # Booking model
│   │   ├── field.go                # Field model
│   │   ├── payment.go              # Payment model
│   │   └── user.go                 # User model
│   ├── routes/
│   │   ├── auth.go                 # Authentication routes
│   │   ├── booking.go              # Booking routes
│   │   ├── field.go                # Field routes
│   │   └── payment.go              # Payment routes
│   └── seed/
│       ├── admin.go                # Admin user seeding
│       ├── field.go                # Field data seeding
│       └── user.go                 # Regular user seeding
├── images/                         # Documentation images
├── .env.example                    # Environment variables template
├── go.mod                          # Go module file
├── go.sum                          # Go dependencies checksum
└── README.md                       # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Database Configuration (PostgreSQL)
# If not provided, SQLite will be used automatically for development
DATABASE_URL=postgres://username:password@host:port/dbname

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Redis Configuration
REDIS_URL=redis://default:password@host:port

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Server Configuration
PORT=8080
```

## ��� Error Handling

The API uses conventional HTTP response codes to indicate the success or failure of requests:

- **200**: Success
- **201**: Created
- **400**: Bad Request - Invalid request format or missing required fields
- **401**: Unauthorized - Invalid or missing authentication token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource conflict (e.g., duplicate booking)
- **500**: Internal Server Error - Server-side error

### Common Error Response Format

```json
{
  "error": "Descriptive error message"
}
```

## ��� Security Features

- **JWT Authentication**: Secure token-based authentication
- **Token Blacklisting**: Logout functionality with token invalidation
- **Refresh Token Rotation**: Enhanced security with token rotation
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: GORM ORM with prepared statements
- **CORS Support**: Cross-origin resource sharing configuration
- **Role-Based Access**: Admin and user role differentiation

## ��� Testing

### Manual Testing with cURL

**Register a new user:**

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@admin.com",
    "password": "password123"
  }'
```

**Get all fields:**

```bash
curl -X GET http://localhost:8080/api/v1/fields
```

**Create a booking (requires authentication):**

```bash
curl -X POST http://localhost:8080/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "field_id": "FIELD_UUID",
    "start_time": "2024-09-15T10:00:00Z",
    "end_time": "2024-09-15T12:00:00Z"
  }'
```

## ��� Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `role` (VARCHAR: 'user' | 'admin')
- `created_at`, `updated_at` (Timestamps)

### Fields Table

- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `location` (VARCHAR)
- `price` (DECIMAL)
- `created_at`, `updated_at` (Timestamps)

### Bookings Table

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `field_id` (UUID, Foreign Key)
- `start_time`, `end_time` (TIMESTAMP)
- `status` (VARCHAR: 'pending' | 'confirmed' | 'cancelled')
- `created_at`, `updated_at` (Timestamps)

### Payments Table

- `id` (UUID, Primary Key)
- `booking_id` (UUID, Foreign Key)
- `amount` (DECIMAL)
- `currency` (VARCHAR: 'idr')
- `status` (VARCHAR: 'pending' | 'succeeded' | 'failed' | 'refunded')
- `stripe_ref_id` (VARCHAR)
- `created_at`, `updated_at` (Timestamps)

## ��� Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature')
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ��� License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ���‍��� Author

**qullDev**

- GitHub: [@qullDev](https://github.com/qullDev)

---

**Happy Coding! ���**
