# 🎓 SmartCampus ERP Management System

This is a complete, dynamic ERP Management System built for colleges and universities.

## 🛠️ Technology Stack
* **Frontend**: React.js, Tailwind CSS, Vite
* **Backend**: Python, Flask, JWT Authentication
* **Database**: MongoDB (MongoEngine)

---

## 🚀 How to Run the Project on Your Machine (Local Setup)

This project has a frontend, a backend, and a database. You need to run them all locally.

### Prerequisites
Make sure you have the following installed on your computer:
1. **Node.js** (v18 or higher)
2. **Python** (v3.8 or higher)
3. **MongoDB Community Server** 

---

### Step 1: Database Setup (MongoDB)

You need MongoDB running on your system for the backend to connect.

**For Windows Users:**
1. Download MongoDB Community Server from the official MongoDB website.
2. Install it with default settings (Next -> Next -> Install).
3. Ensure the MongoDB service is running in the background.

**For Mac/Linux Users:**
- Run the MongoDB service (e.g., `sudo systemctl start mongod` or using Homebrew `brew services start mongodb-community`).

---

### Step 2: Backend Setup (Python Flask)

Open a terminal inside the project folder.

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   * **Windows**: `venv\Scripts\activate`
   * **Linux/Mac**: `source venv/bin/activate`
4. Install all dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. **Seed the database** with initial dummy data (run this ONLY ONCE):
   ```bash
   python seed.py
   ```
6. Start the backend server:
   ```bash
   python app.py
   ```
*(Leave this terminal open. The backend server runs on `http://localhost:5000`)*

---

### Step 3: Frontend Setup (React)

Open a **NEW** terminal window in the main project folder (`ERP-Management-System`).

1. Install Node modules:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
*(This will start the frontend on `http://localhost:5173`. Open this link in your browser!)*

---

## 🔑 Login Credentials

Once the frontend starts, you can log in using the data we seeded in Step 2:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@college.edu | `admin123` |
| **Teacher** | teacher@college.edu | `teacher123` |
| **Student** | student@college.edu | `student123` |

---

## ⚠️ Important Notes for Sharing
If you are sending this project folder to your client, **DO NOT** send the `node_modules` or `backend/venv` folders. They are very large and system-specific. The client must generate them on their own computer using the `npm install` and `python -m venv venv` commands mentioned above.
