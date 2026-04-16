## 📘 **Natours Backend - README.md**

Here's a professional README for your backend repository:

---


# 🏔️ Natours API - Backend

RESTful API for the Natours adventure travel platform - a production-ready backend with authentication, tour management, booking system, and Stripe payment integration.

## ✨ Live API

[![API Status](https://img.shields.io/website?url=https%3A%2F%2Fnatours.nexotechit.com%2Fapi%2Fv1%2Ftours&label=API&color=22c55e)](https://natours.nexotechit.com/api/v1/tours)

**Base URL:** `https://natours.nexotechit.com/api/v1`

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [License](#license)

---

## 🎯 Overview

Natours Backend is a robust, production-ready REST API built with Node.js, Express, and MongoDB. It powers the Natours travel platform with features including JWT authentication, role-based access control, tour management, review system, booking engine, and Stripe payment integration.

### Key Highlights

- ✅ **JWT Authentication** with HttpOnly cookies
- ✅ **Role-Based Access** (Admin, Lead Guide, Guide, User)
- ✅ **Advanced Query Features** - Filtering, sorting, pagination, field limiting
- ✅ **Geo-Spatial Queries** - Find tours within radius, calculate distances
- ✅ **Stripe Payments** - Checkout sessions and webhook handling
- ✅ **Cloudinary Integration** - Automatic image upload and optimization
- ✅ **Email Support** - Welcome emails, password reset, notifications
- ✅ **Security Features** - Rate limiting, Helmet, CORS, XSS protection
- ✅ **MVC Architecture** - Clean, maintainable code structure

---

## 🛠️ Tech Stack

```json
{
  "runtime": "Node.js (v18+)",
  "framework": "Express.js",
  "database": "MongoDB with Mongoose ODM",
  "authentication": "JWT (HttpOnly Cookies)",
  "payments": "Stripe",
  "fileUpload": "Multer + Cloudinary",
  "email": "Nodemailer + Mailtrap",
  "security": "Helmet, express-rate-limit, hpp, xss-clean",
  "validation": "express-validator"
}
```

---

## 🚀 Features

### Authentication & Users
- User signup with email verification
- Login with JWT (HttpOnly cookie)
- Password reset via email
- Update password, profile, and photo
- Soft delete account
- Role-based permissions (admin/guide/user)

### Tours Management
- CRUD operations with role protection
- Advanced filtering, sorting, pagination
- Geo-spatial queries (tours within radius)
- Tour statistics and monthly plans
- Image upload to Cloudinary
- Tour guides population

### Reviews System
- Nested routes (`/tours/:tourId/reviews`)
- CRUD operations with ownership checks
- Automatic rating aggregation
- Duplicate review prevention

### Bookings & Payments
- Stripe Checkout integration
- Webhook for payment confirmation
- Automatic booking creation
- Booking history for users

### Security Features
- Rate limiting (100 requests/hour)
- Helmet.js for security headers
- HPP protection with whitelisted fields
- XSS sanitization
- CORS enabled

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/signup` | Register new user |
| POST | `/api/v1/users/login` | Login user |
| POST | `/api/v1/users/forgotPassword` | Send password reset token |
| PATCH | `/api/v1/users/resetPassword/:token` | Reset password |
| PATCH | `/api/v1/users/updatePassword` | Update password (auth) |
| PATCH | `/api/v1/users/updateMe` | Update profile |
| DELETE | `/api/v1/users/deleteMe` | Deactivate account |

### Tours

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tours` | Get all tours (with filters) |
| GET | `/api/v1/tours/top-5-cheap` | Get top 5 cheapest |
| GET | `/api/v1/tours/:id` | Get single tour |
| GET | `/api/v1/tours/tour-stats` | Get tour statistics (admin) |
| GET | `/api/v1/tours/monthly-plan/:year` | Monthly plan (admin/guide) |
| GET | `/api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit` | Tours within radius |
| POST | `/api/v1/tours` | Create tour (admin) |
| PATCH | `/api/v1/tours/:id` | Update tour (admin) |
| DELETE | `/api/v1/tours/:id` | Delete tour (admin) |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tours/:tourId/reviews` | Get tour reviews |
| POST | `/api/v1/tours/:tourId/reviews` | Create review (auth) |
| PATCH | `/api/v1/reviews/:id` | Update review (owner) |
| DELETE | `/api/v1/reviews/:id` | Delete review (owner/admin) |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/bookings/checkout-session/:tourId` | Create Stripe session |
| GET | `/api/v1/bookings/my-bookings` | Get user bookings |
| POST | `/api/v1/bookings/webhook` | Stripe webhook (raw body) |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/stats` | Dashboard statistics |
| GET | `/api/v1/admin/users` | Get all users |
| PATCH | `/api/v1/admin/users/:id/role` | Update user role |
| DELETE | `/api/v1/admin/users/:id` | Delete user |
| GET | `/api/v1/admin/bookings` | Get all bookings |
| DELETE | `/api/v1/admin/bookings/:id` | Delete booking |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Stripe Account
- Cloudinary Account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/natours-backend.git
cd natours-backend

# Install dependencies
pnpm install

# Set up environment variables (see below)
cp .env.example .env

# Run in development mode
pnpm run dev

# Run in production mode
pnpm start
```

---

## 🔐 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE=mongodb://localhost:27017/natours
DATABASE_PASSWORD=your_password

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your-username
EMAIL_PASSWORD=your-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  photo: String,
  role: ['user', 'guide', 'lead-guide', 'admin'],
  password: String (hashed),
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: Boolean
}
```

### Tour Model
```javascript
{
  name: String,
  slug: String,
  duration: Number,
  maxGroupSize: Number,
  difficulty: ['easy', 'medium', 'difficult'],
  ratingAverage: Number,
  ratingQuantity: Number,
  price: Number,
  priceDiscount: Number,
  summary: String,
  description: String,
  imageCover: String,
  images: [String],
  startDates: [Date],
  startLocation: GeoJSON,
  locations: [GeoJSON],
  guides: [{ type: ObjectId, ref: 'User' }]
}
```

### Booking Model
```javascript
{
  tour: { type: ObjectId, ref: 'Tour' },
  user: { type: ObjectId, ref: 'User' },
  price: Number,
  paid: Boolean,
  createdAt: Date
}
```

---

## 🚢 Deployment

### Deploy to Production

```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Build and start
pnpm install --production
pnpm start
```

### Recommended Hosting

| Platform | Link |
|----------|------|
| **Render** | [render.com](https://render.com) |
| **Railway** | [railway.app](https://railway.app) |
| **DigitalOcean** | [digitalocean.com](https://digitalocean.com) |

---

## 📁 Project Structure

```
natours-backend/
├── controllers/      # Business logic
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── middleware/      # Custom middleware
├── utils/           # Helper functions
├── config/          # Configuration files
├── public/          # Static files
├── server.js        # Entry point
└── .env             # Environment variables
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [yourname](https://linkedin.com/in/yourname)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

---

## 🙏 Acknowledgments

- [Jonas Schmedtmann](https://github.com/jonasschmedtmann) - Course inspiration
- [Stripe](https://stripe.com) - Payment infrastructure
- [Cloudinary](https://cloudinary.com) - Image hosting
- [MongoDB](https://mongodb.com) - Database

---

**Built with ❤️ using Node.js, Express, and MongoDB**
```

---

## 🎯 **Save this as `README.md` in your backend repository!** 🚀
