---
# 🚗 Vehicle Rental Management System

A complete backend API built using **Node.js**, **TypeScript**, and **PostgreSQL**, featuring secure authentication, role-based access, dynamic booking calculations, and a clean modular architecture.
---

---

# Details

This is my assignment B6A2. TYPESCRIPT BASED CURD API SYSTEM

# 🌟 Challenges / চ্যালেঞ্জসমূহ

Vehicle Rental System assignment Assignment-এ অনেক ফিচার বা মডিউল সরাসরি দেখানো হয়নি। কিন্তু অনলাইন টিউটোরিয়াল এবং ডকুমেন্টেশন থেকে শিখে আমি নিচের সমস্যাগুলো সমাধান করতে পেরেছি।

---

## 1️⃣ Handling Foreign Keys and Vehicle Deletion

-Vehicles টেবিল থেকে কোনো রেকর্ড ডিলিট করলে Bookings টেবিল ভেঙে না যায় তা নিশ্চিত করতে PostgreSQL এর `ON DELETE CASCADE` ব্যবহার করেছি। এতে vehicle ডিলিট করলে সেই vehicle এর সাথে সম্পর্কিত সব booking রেকর্ড স্বয়ংক্রিয়ভাবে মুছে যায় এবং foreign key error আর আসে না।

---

## 2️⃣ Joining Tables for Data Retrieval

- Booking এর বিস্তারিত তথ্য যেমন customer এবং vehicle ডিটেইল পেতে `bookings`, `users` এবং `vehicles` টেবিলের মধ্যে `INNER JOIN` ব্যবহার করেছি।

---

## 3️⃣ Date Formatting and Comparison

- PostgreSQL তারিখ স্ট্যান্ডার্ড ফরম্যাটে রাখে। Dates `"YYYY-MM-DD"` ফরম্যাটে দেখানোর জন্য এবং যেমন validation করা, যেমন Booking start date আজকের তারিখের আগে না, এর জন্য JavaScript `Date` object ব্যবহার করে date format করেছি।

---

## 4️⃣ Data Transformation and Response Formatting

- API response structure অনুযায়ী output দেখানোর জন্য raw query result কে structured JSON আকারে রূপান্তর করেছি। Booking এর মধ্যে `customer` এবং `vehicle` আলাদা nested object হিসেবে দেখানো হয়েছে।

## Final Thought

এই অ্যাসাইনমেন্টটি আমার জন্য অনেক চ্যালেঞ্জিং ছিল। তবে, এই চ্যালেঞ্জগুলো আমাকে অনেক কিছু শেখার সুযোগ দিয়েছে।

এই প্রজেক্ট আমাকে পরবর্তী লেভেলের **Team Project** বা বড় স্কেল অ্যাপ্লিকেশন তৈরি করার জন্য প্রস্তুত করেছে। আমি এখন আরও advance features, performance optimization, এবং scalable architecture নিয়ে কাজ চাই

এই অ্যাসাইনমেন্ট আমার জন্য **Learning Curve** ছিল এবং আমাকে বাস্তব প্রকল্পের মতো চিন্তাভাবনা ও সমাধান করার অভিজ্ঞতা দিয়েছে।

## Thanks - Next Lavel Team

---

## 🌐 Live Demo

**URL:** https://bd-vehicle-rental.vercel.app/

## 📦 GitHub Repository

**Repo:** https://github.com/habiburRhaman05/MY-ASSIGNMENT--B6A2

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
