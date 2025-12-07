---
# 🚗 Vehicle Rental Management System

A complete backend API built using **Node.js**, **TypeScript**, and **PostgreSQL**, featuring secure authentication, role-based access, dynamic booking calculations, and a clean modular architecture.
---

---

# Details

This is my assignment B6A2. TYPESCRIPT BASED CURD API SYSTEM

## 🌐 Live Demo

**URL:** _Your Deployment Link_

## 📦 GitHub Repository

**Repo:** _Your GitHub Repo Link_

---

# ✨ Features

## 🔐 Authentication & Security

- JWT-based authentication
- Secure password hashing using **bcrypt**
- Role-based access control (**Admin / Customer**)
- Protected routes with middleware validation

---

## 🚙 Vehicle Management

- Admin can **add, update, and delete** vehicles
- Auto-updating availability status
- Prevent booking of unavailable vehicles

---

## 📅 Booking System

- Auto price calculation based on rental duration
- Prevents double-booking
- Customer can cancel only **before start date**
- Admin can mark vehicle as **returned**
- Auto-update vehicle availability
- Admin: view all bookings
- Customers: view only their own bookings

---

## 👤 User Management

- Users can update their profile
- Admin can manage all users (list, update)

---

# 🛠️ Technology Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- `pg` Node client

## Authentication

- JSON Web Tokens (JWT)
- bcrypt password hashing

## Development Tools

- ts-node-dev
- ESLint & Prettier
- dotenv for environment variables

---

# ⚙️ Setup & Installation

## 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
cd vehicle-rental-backend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Configure Environment Variables

Create a `.env` file:

```
PORT=5000
DATABASE_URL=your database url
JWT_SECRET=your_secret_key
JWT_EXPIRE=token_expiry_time

```

## 4️⃣ Database Setup

Create your PostgreSQL database:

```sql
CREATE DATABASE vehiclerental;
```

Run migrations or table creation SQL (based on your setup).

## 5️⃣ Start Development Server

```bash
npm run dev
```

## 6️⃣ Build & Start Production Server

```bash
npm run build
npm start
```

---

# 📌 API Endpoints Overview

## 🔐 Auth Routes

| Method | Endpoint       | Access | Description       |
| ------ | -------------- | ------ | ----------------- |
| POST   | /auth/register | Public | Register new user |
| POST   | /auth/login    | Public | Login             |

---

## 👤 User Routes

| Method | Endpoint   | Access           |
| ------ | ---------- | ---------------- |
| GET    | /users/    | Admin            |
| PUT    | /users/:id | Admin / Customer |

---

## 🚗 Vehicle Routes

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| GET    | /vehicles/    | Public |
| POST   | /vehicles/    | Admin  |
| PUT    | /vehicles/:id | Admin  |
| DELETE | /vehicles/:id | Admin  |

---

## 📅 Booking Routes

| Method | Endpoint      | Access         | Description                 |
| ------ | ------------- | -------------- | --------------------------- |
| POST   | /bookings/    | Customer/Admin | Create a booking            |
| GET    | /bookings/    | Role-based     | Admin → all, Customer → own |
| PUT    | /bookings/:id | Role-based     | Cancel / Mark as returned   |

---

# 📜 Author

## MY NAME IS HABIBUR RHAMAN. I AM A STUDENT OF PROGRAMMING HERO

# 🤝 Contributing

NO Contributing Allow Because this my Assignment Repo ;

---

# 📞 Contact

# email devhabib2005@gmail.com

# phone 01605746821

---
