# 🎓 Course Selling Platform

A full-stack **MERN application** for selling and managing online courses.

The platform allows users to register, log in, browse available courses, purchase courses, and view their purchased courses. It also includes an admin panel for managing courses.

---

## 🚀 Features

### 👤 User Features

- User Signup and Login
- JWT Authentication
- Protected Routes
- Browse Available Courses
- Purchase Courses
- View Purchased Courses
- Secure API Communication

### 🛠️ Admin Features

- Admin Signup and Login
- Admin Dashboard
- Create New Courses
- Update Existing Courses
- View and Manage Courses
- Protected Admin Routes

---

## 🧰 Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- REST APIs

### Database

- MongoDB
- Mongoose

---

## 📁 Project Structure

```text
courseapp/
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── config.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/
│   │   ├── components/
│   │   ├── assets/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication & Authorization

The application uses **JWT (JSON Web Tokens)** for authentication and authorization.

Features include:

- User Authentication
- Admin Authentication
- Protected User Routes
- Protected Admin Routes
- Middleware-based Authorization

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SurajPatil-Tech/course-selling-app.git
```

Move into the project folder:

```bash
cd course-selling-app
```

---

### 2. Backend Setup

Move into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add your environment variables:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

Open another terminal and move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

---

## 📌 Key Concepts Used

- MERN Stack Development
- RESTful API Development
- MVC-style Project Structure
- JWT Authentication
- Middleware
- Role-based Authorization
- CRUD Operations
- MongoDB and Mongoose
- React Components
- Protected Routes
- Full-Stack API Integration

---

## 👨‍💻 Author

**Suraj Patil**

MERN Stack Developer | React.js | Node.js | Express.js | MongoDB

GitHub: https://github.com/SurajPatil-Tech

LinkedIn: https://www.linkedin.com/in/surajpatil-tech