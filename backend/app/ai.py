from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .database import get_db
from .models import Project, Task


router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    message = request.message.lower().strip()

    # ==========================================
    # GET REAL WORKSPACE DATA
    # ==========================================

    projects = db.query(Project).all()
    tasks = db.query(Task).all()

    total_projects = len(projects)
    total_tasks = len(tasks)

    completed_tasks = [
        task for task in tasks
        if task.status == "done"
    ]

    pending_tasks = [
        task for task in tasks
        if task.status == "pending"
    ]

    progress_tasks = [
        task for task in tasks
        if task.status == "in-progress"
    ]


    # ==========================================
    # PROJECT STATISTICS HELPER
    # ==========================================

    def get_project_stats(project):

        project_tasks = [
            task for task in tasks
            if task.project_id == project.id
        ]

        total = len(project_tasks)

        completed = len([
            task for task in project_tasks
            if task.status == "done"
        ])

        in_progress = len([
            task for task in project_tasks
            if task.status == "in-progress"
        ])

        pending = len([
            task for task in project_tasks
            if task.status == "pending"
        ])

        if total > 0:
            progress_percentage = round(
                (completed / total) * 100
            )
        else:
            progress_percentage = 0

        return {
            "total": total,
            "completed": completed,
            "in_progress": in_progress,
            "pending": pending,
            "progress_percentage": progress_percentage
        }


    # ==========================================
    # GREETINGS
    # ==========================================

    if message in [
        "hi",
        "hello",
        "hey",
        "hii",
        "hai"
    ]:

        reply = (
            "Hello! 👋 I am your DevFlow AI Assistant. 🤖\n\n"
            f"Your workspace currently contains "
            f"{total_projects} project(s) and "
            f"{total_tasks} task(s).\n\n"
            f"✓ Completed: {len(completed_tasks)}\n"
            f"⏳ In Progress: {len(progress_tasks)}\n"
            f"📌 Pending: {len(pending_tasks)}\n\n"
            "Ask me for a project summary, task analysis, "
            "priorities, or productivity suggestions!"
        )

        return {
            "reply": reply
        }


    # ==========================================
    # DEVFLOW INFORMATION
    # ==========================================

    if (
        "devflow" in message
        or "what is this" in message
        or "what can you do" in message
    ):

        reply = (
            "🤖 DevFlow is your intelligent project and "
            "task management workspace.\n\n"
            "I can analyze your real workspace data and help you:\n\n"
            "📁 Summarize projects\n"
            "📊 Analyze project progress\n"
            "📋 Organize tasks\n"
            "📌 Find pending tasks\n"
            "⏳ Track in-progress work\n"
            "🎯 Suggest priorities\n"
            "✨ Improve productivity\n"
            "💡 Suggest new project ideas"
        )

        return {
            "reply": reply
        }


    # ==========================================
    # PROJECT SUMMARY
    # ==========================================

    if (
        "summary of my projects" in message
        or "summarize my projects" in message
        or "project summary" in message
        or "my projects" in message
        or "show projects" in message
    ):

        if total_projects == 0:

            reply = (
                "📁 You don't have any projects yet.\n\n"
                "Create your first project from the Projects "
                "page, and I can analyze its progress."
            )

        else:

            project_details = []

            for project in projects:

                stats = get_project_stats(project)

                project_details.append(
                    f"📁 {project.name}\n"
                    f"   📋 Total Tasks: {stats['total']}\n"
                    f"   ✓ Completed: {stats['completed']}\n"
                    f"   ⏳ In Progress: {stats['in_progress']}\n"
                    f"   📌 Pending: {stats['pending']}\n"
                    f"   📊 Progress: {stats['progress_percentage']}%"
                )

            project_list = "\n\n".join(
                project_details
            )

            reply = (
                f"📁 PROJECT SUMMARY\n\n"
                f"You currently have {total_projects} project(s):\n\n"
                f"{project_list}\n\n"
                f"📋 Total workspace tasks: {total_tasks}"
            )

        return {
            "reply": reply
        }


    # ==========================================
    # PROJECT PROGRESS
    # ==========================================

    if (
        "project progress" in message
        or "project status" in message
        or "how are my projects" in message
        or "progress of projects" in message
    ):

        if total_projects == 0:

            reply = (
                "You don't have any projects yet."
            )

        else:

            reply = (
                "📊 PROJECT PROGRESS\n\n"
            )

            for project in projects:

                stats = get_project_stats(project)

                reply += (
                    f"📁 {project.name}: "
                    f"{stats['progress_percentage']}% complete "
                    f"({stats['completed']}/{stats['total']} tasks)\n"
                )

            reply += (
                "\n💡 Focus on projects with tasks already "
                "in progress before starting too many new tasks."
            )

        return {
            "reply": reply
        }


    # ==========================================
    # TASK SUMMARY
    # ==========================================

    if (
        "task summary" in message
        or "summarize my tasks" in message
        or "how many tasks" in message
        or "task overview" in message
        or "my tasks" in message
    ):

        completion_percentage = 0

        if total_tasks > 0:

            completion_percentage = round(
                (len(completed_tasks) / total_tasks) * 100
            )

        reply = (
            "📊 TASK OVERVIEW\n\n"
            f"📋 Total Tasks: {total_tasks}\n"
            f"✓ Completed: {len(completed_tasks)}\n"
            f"⏳ In Progress: {len(progress_tasks)}\n"
            f"📌 Pending: {len(pending_tasks)}\n\n"
            f"🎯 Overall Completion: "
            f"{completion_percentage}%"
        )

        return {
            "reply": reply
        }


    # ==========================================
    # PENDING TASKS
    # ==========================================

    if (
        "pending" in message
        or "not started" in message
        or "waiting tasks" in message
    ):

        if len(pending_tasks) == 0:

            reply = (
                "🎉 Great news! You currently have "
                "no pending tasks."
            )

        else:

            task_names = []

            for task in pending_tasks:

                project = next(
                    (
                        project for project in projects
                        if project.id == task.project_id
                    ),
                    None
                )

                project_name = (
                    project.name
                    if project
                    else "Unknown Project"
                )

                task_names.append(
                    f"📌 {task.title} "
                    f"— {project_name}"
                )

            reply = (
                f"📌 You have {len(pending_tasks)} "
                f"pending task(s):\n\n"
                + "\n".join(task_names)
                + "\n\n💡 Choose one important task and "
                "start it instead of working on too many tasks at once."
            )

        return {
            "reply": reply
        }


    # ==========================================
    # IN PROGRESS TASKS
    # ==========================================

    if (
        "progress" in message
        or "in-progress" in message
        or "in progress" in message
        or "currently working" in message
        or "working on" in message
    ):

        if len(progress_tasks) == 0:

            reply = (
                "You currently don't have any tasks "
                "marked as In Progress. ⏳"
            )

        else:

            task_names = []

            for task in progress_tasks:

                project = next(
                    (
                        project for project in projects
                        if project.id == task.project_id
                    ),
                    None
                )

                project_name = (
                    project.name
                    if project
                    else "Unknown Project"
                )

                task_names.append(
                    f"⏳ {task.title} "
                    f"— {project_name}"
                )

            reply = (
                f"⏳ You currently have "
                f"{len(progress_tasks)} task(s) in progress:\n\n"
                + "\n".join(task_names)
                + "\n\n🎯 Recommendation: Finish these tasks "
                "before starting additional pending work."
            )

        return {
            "reply": reply
        }


    # ==========================================
    # COMPLETED TASKS
    # ==========================================

    if (
        "completed" in message
        or "done" in message
        or "finished" in message
    ):

        if len(completed_tasks) == 0:

            reply = (
                "You don't have any completed tasks yet. "
                "Once you finish a task, mark it as Done! ✓"
            )

        else:

            task_names = "\n".join(
                [
                    f"✓ {task.title}"
                    for task in completed_tasks
                ]
            )

            reply = (
                f"🎉 You have completed "
                f"{len(completed_tasks)} task(s):\n\n"
                f"{task_names}\n\n"
                "Great progress! Keep building! 🚀"
            )

        return {
            "reply": reply
        }


    # ==========================================
    # ORGANIZE TASKS
    # ==========================================

    if (
        "organize" in message
        or "organise" in message
        or "manage my tasks" in message
        or "help me organize" in message
    ):

        if total_tasks == 0:

            reply = (
                "📋 You don't have any tasks yet.\n\n"
                "Create tasks for your projects first, "
                "and I can help you organize and prioritize them."
            )

        else:

            reply = (
                "🤖 SMART TASK ORGANIZATION PLAN\n\n"
            )

            if len(progress_tasks) > 0:

                reply += (
                    f"1️⃣ First, finish your "
                    f"{len(progress_tasks)} task(s) already "
                    f"in progress.\n\n"
                )

            if len(pending_tasks) > 0:

                reply += (
                    f"2️⃣ Then select the most important "
                    f"of your {len(pending_tasks)} pending task(s).\n\n"
                )

            if len(completed_tasks) > 0:

                reply += (
                    f"3️⃣ You already completed "
                    f"{len(completed_tasks)} task(s). "
                    "Keep tracking your progress! 🎉\n\n"
                )

            reply += (
                "💡 Best productivity rule: "
                "Finish important work in progress before "
                "starting too many new tasks."
            )

        return {
            "reply": reply
        }


    # ==========================================
    # PRIORITY / PRODUCTIVITY
    # ==========================================

    if (
        "priority" in message
        or "prioritize" in message
        or "prioritise" in message
        or "productivity" in message
        or "productive" in message
        or "what should i do" in message
        or "what should i work on" in message
    ):

        if len(progress_tasks) > 0:

            reply = (
                "🎯 PRIORITY RECOMMENDATION\n\n"
                "Your highest priority should be completing "
                "these tasks already in progress:\n\n"
            )

            for task in progress_tasks:

                reply += (
                    f"⏳ {task.title}\n"
                )

            reply += (
                "\nOnce these are completed, choose one "
                "important pending task.\n\n"
                "💡 Avoid switching between too many tasks."
            )

        elif len(pending_tasks) > 0:

            first_task = pending_tasks[0]

            reply = (
                "🎯 PRIORITY RECOMMENDATION\n\n"
                "You don't currently have any tasks in progress.\n\n"
                f"I recommend starting with:\n"
                f"📌 {first_task.title}\n\n"
                "Mark it as In Progress and focus on completing it."
            )

        else:

            reply = (
                "🎉 Excellent work!\n\n"
                "Your workspace has no pending or in-progress "
                "tasks right now."
            )

        return {
            "reply": reply
        }


    # ==========================================
    # PROJECT IDEAS
    # ==========================================

    if (
        "project idea" in message
        or "project ideas" in message
        or "suggest project" in message
        or "give me idea" in message
        or "give me ideas" in message
    ):

        reply = (
            "🚀 Here are some strong project ideas:\n\n"
            "1️⃣ AI Resume Analyzer\n"
            "Analyze resumes and suggest missing skills.\n\n"
            "2️⃣ Smart Expense Tracker\n"
            "Track expenses with analytics and budgeting.\n\n"
            "3️⃣ Job Application Tracker\n"
            "Manage applications, interviews, and results.\n\n"
            "4️⃣ AI Study Planner\n"
            "Generate personalized study schedules.\n\n"
            "5️⃣ Smart Interview Preparation Platform\n"
            "Practice interview questions with AI feedback.\n\n"
            "💡 Since you already built DevFlow, a great "
            "next step is adding real AI task prioritization "
            "and automated project insights!"
        )

        return {
            "reply": reply
        }


    # ==========================================
    # WORKSPACE STATUS
    # ==========================================

    if (
        "workspace" in message
        or "workspace status" in message
        or "workspace overview" in message
    ):

        completion_percentage = 0

        if total_tasks > 0:

            completion_percentage = round(
                (len(completed_tasks) / total_tasks) * 100
            )

        reply = (
            "📊 DEVFLOW WORKSPACE STATUS\n\n"
            f"📁 Projects: {total_projects}\n"
            f"📋 Total Tasks: {total_tasks}\n"
            f"✓ Completed: {len(completed_tasks)}\n"
            f"⏳ In Progress: {len(progress_tasks)}\n"
            f"📌 Pending: {len(pending_tasks)}\n\n"
            f"🎯 Overall Completion: "
            f"{completion_percentage}%"
        )

        return {
            "reply": reply
        }


    # ==========================================
    # DEFAULT SMART RESPONSE
    # ==========================================

    reply = (
        "🤖 I can analyze your real DevFlow workspace data.\n\n"
        "Try asking me:\n\n"
        "📁 Give me a summary of my projects\n"
        "📊 Show project progress\n"
        "📋 Summarize my tasks\n"
        "📌 Show my pending tasks\n"
        "⏳ What tasks are in progress?\n"
        "✓ Show completed tasks\n"
        "✨ Help me organize my tasks\n"
        "🎯 What should I prioritize?\n"
        "💡 Give me project ideas"
    )

    return {
        "reply": reply
    }