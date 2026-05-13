# ⚕ MedBook - Healthcare Appointment System
### Built with MERN Stack (MongoDB · Express · React · Node.js)

---

## 📁 Project Structure

```
healthcare-app/
├── backend/
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT + Role-based auth
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js      # Global auth state
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Doctors.js
│   │   │   ├── DoctorDetail.js     # Booking page
│   │   │   ├── PatientDashboard.js
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── Profile.js
│   │   ├── utils/
│   │   │   └── api.js              # Axios instance
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
│
├── seeder.js              # Create admin account
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally OR MongoDB Atlas account
- npm or yarn

---

### Step 1: Clone / Extract the project
```bash
cd healthcare-app
```

### Step 2: Setup Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/healthcare_db
JWT_SECRET=any_long_random_secret_key_here
PORT=5000
```

Install dependencies:
```bash
npm install
```

### Step 3: Setup Frontend
```bash
cd ../frontend
npm install
```

### Step 4: Create Admin Account
```bash
# From root healthcare-app/ folder:
node seeder.js
```
This creates: `admin@medbook.com` / `admin123`

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Opens http://localhost:3000
```

---

## 👥 User Roles & Features

### 🧑 Patient
- Register / Login
- Browse doctors by specialization
- View doctor profiles and availability
- Book appointments with date & time slot
- View appointment history with status
- Cancel pending/approved appointments

### 🩺 Doctor
- Register (requires admin approval)
- View all patient appointments
- Approve / Reject / Complete appointments
- Update profile (fees, bio, hospital)

### 🔧 Admin
- View dashboard statistics
- Approve doctor registrations
- Block/unblock patients
- Delete users
- View all appointments system-wide

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile (protected) |
| PUT | /api/auth/profile | Update profile (protected) |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/doctors | Get all approved doctors |
| GET | /api/doctors/:id | Get doctor by ID |
| GET | /api/doctors/specializations | List all specializations |
| GET | /api/doctors/profile/me | Doctor's own profile |
| PUT | /api/doctors/profile | Update doctor profile |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/appointments/book | Book appointment |
| GET | /api/appointments/my | Patient's appointments |
| GET | /api/appointments/doctor | Doctor's appointments |
| PUT | /api/appointments/:id/status | Update status (doctor) |
| PUT | /api/appointments/:id/cancel | Cancel (patient) |
| GET | /api/appointments/all | All appointments (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/users | All patients |
| GET | /api/admin/doctors | All doctors |
| PUT | /api/admin/doctors/:id/approve | Approve doctor |
| PUT | /api/admin/users/:id/block | Block/unblock user |
| DELETE | /api/admin/users/:id | Delete user |

---

## 🛡️ Security Features
- JWT Authentication (7-day expiry)
- Password hashing with bcryptjs
- Role-based access control (patient / doctor / admin)
- Protected routes on both frontend and backend
- Input validation

---

## 🧑‍💻 Tech Stack
- **Frontend**: React 18, React Router v6, Axios, React Hot Toast
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JSON Web Tokens (JWT) + bcryptjs

---

## 📝 Test Accounts (after seeder)
- **Admin**: admin@medbook.com / admin123
- Register new doctor & patient accounts to test full flow
