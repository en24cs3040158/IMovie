# 🎬 IMovies - Online Movie Ticket Booking Platform

**IMovies** ek modern, full-stack online movie ticket booking platform hai jisme users latest running movies browse kar sakte hain, cinema showtimes aur screens choose kar sakte hain, interactive visual seating chart me real-time seat availability ke sath seats select kar sakte hain, aur instant checkout & booking management kar sakte hain.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React.js (Vite), HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Bootstrap Icons, Axios, React Router v6
- **Backend:** Node.js, Express.js (RESTful APIs with modular MVC pattern)
- **Database:** MongoDB (NoSQL) with Mongoose ODM
- **Authentication & Security:** JWT (JSON Web Tokens), bcryptjs password hashing, protected auth middlewares
- **Testing & Tools:** Postman Collection included, Morgan logger, CORS support

---

## 📂 Directory Structure

```text
IMovies/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── movieController.js    # Movie CRUD & genre/search filters
│   │   ├── showtimeController.js # Showtimes & real-time seat matrix
│   │   └── bookingController.js  # Atomic seat booking & cancellation
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification & admin check
│   │   └── errorMiddleware.js    # Centralized JSON error handling
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hashing
│   │   ├── Movie.js              # Movie details schema
│   │   ├── Showtime.js           # Showtime & bookedSeats schema
│   │   └── Booking.js            # Booking history & payment status
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── movieRoutes.js        # /api/movies endpoints
│   │   ├── showtimeRoutes.js     # /api/showtimes endpoints
│   │   └── bookingRoutes.js      # /api/bookings endpoints
│   ├── seeder/
│   │   ├── seedData.js           # Sample movies, shows, and users
│   │   └── seeder.js             # Database seeding execution script
│   ├── .env                      # Local environment variables
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express app initialization & server entry
│
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML entry point with fonts & meta
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Responsive navigation & user menu
│   │   │   ├── Footer.jsx        # Cinema aesthetic footer
│   │   │   ├── MovieCard.jsx     # Movie card with ratings & book CTA
│   │   │   ├── ProtectedRoute.jsx# Auth route guard for protected pages
│   │   │   └── TicketModal.jsx   # Printable movie ticket boarding pass
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & JWT token sync
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero section, genre filter, search, grid
│   │   │   ├── MovieDetails.jsx  # Banner, synopsis, cast, date & showtimes
│   │   │   ├── SeatSelection.jsx # Screen curve, tiers, real-time matrix
│   │   │   ├── Login.jsx         # Sign in with demo account quick-fill
│   │   │   ├── Register.jsx      # New user registration
│   │   │   └── Dashboard.jsx     # User tickets, cancel booking, history
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT auto-injection
│   │   ├── App.jsx               # Application routes
│   │   ├── index.css             # Cinema dark theme & custom styling
│   │   └── main.jsx              # React DOM entry point
│   ├── .env                      # Frontend environment variables
│   ├── .env.example              # Frontend template
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration with API proxy
│
├── postman/
│   └── IMovies_API_Collection.json # Ready-to-import Postman API collection
├── package.json                  # Root runner scripts
└── README.md                     # Documentation
```

---

## ⚡ Key Features Implemented

### 1. User Authentication & Authorization (JWT & bcrypt)
- User registration (`POST /api/auth/register`) with automatic password hashing via `bcryptjs`.
- Login authentication (`POST /api/auth/login`) generating a signed JWT token valid for 7 days.
- Protected routes using `authMiddleware.js` for checkout and booking history.
- Pre-configured demo accounts for instant testing.

### 2. Movie Browsing & Search
- Filter movies dynamically by Genre (`Action`, `Sci-Fi`, `Thriller`, `Adventure`, `Drama`, `Animation`, `Mythology`).
- Real-time text search by title, cast members, or directors.
- Detailed Movie view with high-res banner, certificate tags (U/A, A), duration, rating, synopsis, and direct YouTube trailer launch.

### 3. Interactive Seating Layout with Real-Time Availability
- Curved visual cinema screen (*"Cinema Screen This Way"*).
- 3 distinct tiered pricing zones:
  - **Platinum** (Rows A-B): Premium seating @ ₹380
  - **Gold** (Rows C-E): Center prime seating @ ₹260
  - **Silver** (Rows F-H): Standard seating @ ₹180
- Central aisle spacing and visual color codes:
  - 🟢 **Selected** (Active glow with checkmark)
  - 🔘 **Available** (Hover zoom effect)
  - ⚫ **Sold Out / Booked** (Occupied seats disabled)
- Floating live bill calculation with subtotal and convenience fees.

### 4. Concurrency Protection & Atomic Reservations
- Prevents race conditions and double-booking using MongoDB's atomic operator:
  ```js
  Showtime.findOneAndUpdate(
    { _id: showtimeId, bookedSeats: { $nin: selectedSeatNumbers } },
    { $push: { bookedSeats: { $each: selectedSeatNumbers } } },
    { new: true }
  );
  ```
  Agar koi aur user simultaneously wahi seat book karne ki koshish karega, system `409 Conflict` return karke seats matrix refresh kar deta hai.

### 5. Booking Management & User Dashboard
- Users can view their active and past movie tickets.
- **Cancel Booking:** Users can cancel a confirmed ticket, which automatically releases the seats back to the auditorium via `$pull` in MongoDB and marks ticket status as `Refunded`.
- **Printable Ticket:** Formatted cinema pass view with ticket ID, auditorium info, seat numbers, barcode visual, and 1-click `Print / Save Ticket`.

---

## 🚀 How to Run Locally

### Prerequisites:
- **Node.js** (v18 or higher installed)
- **MongoDB** (Local MongoDB Community Server running or a free cloud MongoDB Atlas cluster connection string)

---

### Step 1: Clone or Open the Project
Open terminal in the project directory:
```bash
cd c:\Users\Student\Desktop\IMovies
```

---

### Step 2: Configure Environment Variables

1. Backend `.env` check karein (`backend/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/imovies
   JWT_SECRET=imovies_super_secret_jwt_key_2026_xyz
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
   *(Note: Agar aap MongoDB Atlas use kar rahe hain, to apna cloud URI `MONGO_URI` me paste karein).*

2. Frontend `.env` check karein (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

### Step 3: Seed Sample Data
MongoDB me movies, upcoming showtimes aur demo accounts seed karne ke liye:
```bash
cd backend
npm run seed
```

> **Default Seed Accounts:**
> - **Demo User:** `demo@imovies.com` | Password: `password123`
> - **Admin:** `admin@imovies.com` | Password: `admin123`

---

### Step 4: Start Backend & Frontend

#### Terminal 1 (Backend API):
```bash
cd backend
npm run dev
```
Backend API will start at: `http://localhost:5000`

#### Terminal 2 (Frontend React):
```bash
cd frontend
npm run dev
```
Frontend will start at: `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## 📮 Postman API Collection

`postman/IMovies_API_Collection.json` file ko Postman me direct **Import** karein. Isme sabhi endpoints pre-configured hain:
1. `GET /api/health` - API status check
2. `POST /api/auth/register` - Create user
3. `POST /api/auth/login` - Login & auto-save JWT token variable
4. `GET /api/auth/me` - Profile check
5. `GET /api/movies` - List all movies & query filters
6. `GET /api/movies/:id` - Movie details & showtimes
7. `GET /api/showtimes/:id` - Showtime & real-time seat matrix
8. `POST /api/bookings` - Reserve seats (atomic transaction)
9. `GET /api/bookings/my-bookings` - Logged in user ticket history
10. `PUT /api/bookings/:id/cancel` - Cancel booking & release seats

