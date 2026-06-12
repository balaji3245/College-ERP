# SmartCampus ERP Management System

This is a complete, dynamic ERP Management System built for colleges and universities. 

## Technology Stack
* **Frontend**: React.js, Tailwind CSS, Vite
* **Backend**: Python, Flask, SQLAlchemy, JWT Authentication
* **Database**: MySQL / MariaDB

---

## 🚀 How to Run the Project on Your Machine

Since this project has a full backend and database, you need to set up MySQL, Python, and Node.js before running it.

### Prerequisites
Make sure you have the following installed on your computer:
1. **Node.js** (v18 or higher)
2. **Python** (v3.8 or higher)
3. **MySQL** or **MariaDB** Server

---

### Step 1: Database Setup (MongoDB)

You need to install MongoDB on your system.

**For Linux Users:**
Open your terminal in the project folder and run:
```bash
sudo bash install_mongodb.sh
```
*(This script will install MongoDB and start the `mongodb` service)*

**For Windows Users:**
1. Download MongoDB Community Server from the official website.
2. Install it with default settings.
3. Ensure the MongoDB service is running on `mongodb://localhost:27017`.

---

### Step 2: Backend Setup (Python Flask)

Open a terminal inside the project folder.

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   * **Linux/Mac**: `source venv/bin/activate`
   * **Windows**: `venv\Scripts\activate`
4. Install all dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Seed the database with initial dummy data (run this only once):
   ```bash
   python3 seed.py
   ```
6. Start the backend server:
   ```bash
   python3 app.py
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
*(This will start the frontend on `http://localhost:5173` or `5174`)*

---

## 🔑 Login Credentials

Once the frontend starts, you can log in using the data we seeded in Step 2:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@college.edu | `admin123` |
| **Teacher** | teacher@college.edu | `teacher123` |
| **Student** | student@college.edu | `student123` |

---

## Important Notes for Sharing
If you are sending this project to someone else, **DO NOT** send the `node_modules` or `backend/venv` folders. They are very large and system-specific. The other person must generate them on their own computer using the `npm install` and `python -m venv venv` commands mentioned above.
