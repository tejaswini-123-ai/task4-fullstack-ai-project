from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models
from app.auth import router as auth_router
from app.projects import router as projects_router
from app.tasks import router as tasks_router
from app.ai import router as ai_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Task 4 - AI Powered Project & Task Management Platform"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication routes
app.include_router(auth_router)

# Project routes
app.include_router(projects_router)

# Task routes
app.include_router(tasks_router)

# AI routes
app.include_router(ai_router)


@app.get("/")
def root():
    return {
        "message": "Task 4 API is running"
    }