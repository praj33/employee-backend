# Employee Productivity Tracker

A full-stack web application for assigning, tracking, and analyzing employee tasks — built with Node.js, Supabase, HTML/CSS/JS, and deployed on Vercel and Render. It includes employee and manager panels, dashboard analytics, and basic AI anomaly detection.

---

## 🔗 Live Links

- **Frontend (Vercel)**:  
  [https://employee-backend-drab.vercel.app](https://employee-backend-drab.vercel.app)

- **Backend API (Render)**:  
  [https://employee-backend-ef3o.onrender.com/api/tasks](https://employee-backend-ef3o.onrender.com/api/tasks)

- **🎥 Video Walkthrough**:  
  [Watch on Loom](https://www.loom.com/share/b4ba8650ac944fa687a251a3817bb6c1)

---

## ✅ Features

### Manager Panel
- Assign new tasks with title, due date, status, and employee ID
- View all tasks and filter by employee
- Edit and delete tasks
- Live dashboard with task stats
- Dark mode toggle

### Employee Panel
- View and manage only their own tasks
- Submit task status updates
- View task history

### Anomaly Detection (AI Agent 1)
- Detects overdue tasks
- Detects tasks missing due dates
- Detects employees with too many pending tasks

---

## 🧱 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Render (backend), Vercel (frontend)

---

## ⚙️ Setup Instructions

### Backend Setup

1. Go to the `/backend` folder and create a `.env` file:SUPABASE_URL=your_supabase_url  
SUPABASE_KEY=your_supabase_anon_key

2. Run backend locally:
```bash
cd backend
npm install
node index.js

---

### Frontend Setup (HTML + JavaScript)

1. Navigate to the `frontend/` folder:
```bash
cd frontend

## 👤 Author

**Raj**  
GitHub: [@praj33](https://github.com/praj33)
