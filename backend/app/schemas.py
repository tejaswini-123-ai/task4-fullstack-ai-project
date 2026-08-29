from pydantic import BaseModel
from typing import Optional


# ---------------- USER ----------------

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


# ---------------- PROJECT ----------------

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    owner_id: int


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int

    class Config:
        from_attributes = True


# ---------------- TASK ----------------

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"
    project_id: int


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    project_id: int

    class Config:
        from_attributes = True