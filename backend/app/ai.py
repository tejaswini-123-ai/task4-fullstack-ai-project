from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/ai",
    tags=["AI Features"]
)


class TaskSuggestion(BaseModel):
    title: str
    description: str = ""


class ProjectSuggestion(BaseModel):
    project_name: str
    project_description: str = ""


@router.post("/suggest-priority")
def suggest_priority(task: TaskSuggestion):

    text = f"{task.title} {task.description}".lower()

    high_keywords = [
        "urgent",
        "critical",
        "important",
        "deadline",
        "bug",
        "error",
        "production",
        "security"
    ]

    medium_keywords = [
        "feature",
        "update",
        "improve",
        "review",
        "testing",
        "design"
    ]

    if any(keyword in text for keyword in high_keywords):
        priority = "High"

    elif any(keyword in text for keyword in medium_keywords):
        priority = "Medium"

    else:
        priority = "Low"

    return {
        "task": task.title,
        "suggested_priority": priority
    }


@router.post("/suggest-tasks")
def suggest_tasks(project: ProjectSuggestion):

    text = (
        f"{project.project_name} "
        f"{project.project_description}"
    ).lower()

    suggestions = [
        {
            "title": "Plan project requirements",
            "description": "Define the main goals and requirements."
        },
        {
            "title": "Create project design",
            "description": "Design the structure and user interface."
        },
        {
            "title": "Develop core features",
            "description": "Implement the main functionality."
        },
        {
            "title": "Test the application",
            "description": "Test features and fix identified issues."
        }
    ]

    if "website" in text or "web" in text:

        suggestions = [
            {
                "title": "Design website layout",
                "description": "Create the structure and UI layout."
            },
            {
                "title": "Develop frontend",
                "description": "Build the user interface."
            },
            {
                "title": "Connect backend API",
                "description": "Integrate frontend with backend services."
            },
            {
                "title": "Test the website",
                "description": "Test all features before deployment."
            }
        ]

    elif "ai" in text or "machine learning" in text:

        suggestions = [
            {
                "title": "Collect project requirements",
                "description": "Define the AI problem and expected output."
            },
            {
                "title": "Prepare dataset",
                "description": "Collect and prepare required data."
            },
            {
                "title": "Develop AI model",
                "description": "Build and test the AI functionality."
            },
            {
                "title": "Evaluate model",
                "description": "Test accuracy and improve performance."
            }
        ]

    return {
        "project": project.project_name,
        "suggested_tasks": suggestions
    }