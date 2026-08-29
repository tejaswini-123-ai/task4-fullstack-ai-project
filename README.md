# AI-Powered Project & Task Management Platform

A full-stack web application for managing projects and tasks with AI-powered task priority suggestions.

## 🚀 Features

* User registration and login
* Create, update, and delete projects
* Create, update, and delete tasks
* Assign tasks to projects
* Track task status
* AI-powered task priority suggestions
* Persistent SQLite database
* REST API built with FastAPI
* Interactive frontend built with React and Vite

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* Passlib
* BCrypt

## 📂 Project Structure

```text
task4-fullstack-app/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── projects.py
│   │   ├── tasks.py
│   │   └── ai.py
│   │
│   └── task4.db
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   └── package.json
│
└── README.md
```

## ⚙️ Backend Setup

Open a terminal inside the `backend` folder:

```bash
cd backend
```

Activate the virtual environment:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn sqlalchemy pydantic passlib bcrypt
```

Run the backend server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## 💻 Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

## 🤖 AI Priority Suggestion

The application includes an AI-inspired priority suggestion feature. Based on a task's title and description, the backend suggests an appropriate priority level to help users organize and manage their work.

## 👩‍💻 Author

Tejaswini Karpothula

Built as part of the Innovation Hacks Full Stack Development Internship.
