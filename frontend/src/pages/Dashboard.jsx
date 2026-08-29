import { useEffect, useState } from "react";
import "../App.css";

function Dashboard() {
  // PROJECT STATES
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [updating, setUpdating] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  // TASK STATES
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState("");

  const [showTaskForm, setShowTaskForm] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [creatingTask, setCreatingTask] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("pending");
  const [updatingTask, setUpdatingTask] = useState(false);

  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // AI PRIORITY
  const [taskPriorities, setTaskPriorities] = useState({});

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  // LOAD DATA
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/projects/"
      );

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      } else {
        setError("Unable to load projects.");
      }
    } catch (err) {
      setError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      setTaskLoading(true);
      setTaskError("");

      const response = await fetch(
        "http://127.0.0.1:8000/tasks/"
      );

      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      } else {
        setTaskError("Unable to load tasks.");
      }
    } catch (err) {
      setTaskError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setTaskLoading(false);
    }
  };

  // CREATE PROJECT
  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!userId) {
      setError("User not found. Please log in again.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/projects/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: projectName,
            description: projectDescription,
            owner_id: Number(userId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Unable to create project.");
        return;
      }

      setProjectName("");
      setProjectDescription("");
      setShowForm(false);

      await fetchProjects();
    } catch (err) {
      setError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setCreating(false);
    }
  };

  // START EDITING PROJECT
  const startEditingProject = (project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || "");
    setShowForm(false);
    setError("");
  };

  // UPDATE PROJECT
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!editingProject) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/projects/${editingProject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            description: editDescription,
            owner_id: editingProject.owner_id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Unable to update project.");
        return;
      }

      setEditingProject(null);
      setEditName("");
      setEditDescription("");

      await fetchProjects();
    } catch (err) {
      setError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setUpdating(false);
    }
  };

  // DELETE PROJECT
  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(projectId);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Unable to delete project.");
        return;
      }

      await fetchProjects();
      await fetchTasks();
    } catch (err) {
      setError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // CREATE TASK
  const handleCreateTask = async (e, projectId) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setTaskError("Please enter a task title.");
      return;
    }

    try {
      setCreatingTask(true);
      setTaskError("");

      const response = await fetch(
        "http://127.0.0.1:8000/tasks/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            status: taskStatus,
            project_id: projectId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setTaskError(data.detail || "Unable to create task.");
        return;
      }

      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("pending");
      setShowTaskForm(null);

      await fetchTasks();
    } catch (err) {
      setTaskError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setCreatingTask(false);
    }
  };

  // START EDITING TASK
  const startEditingTask = (task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || "");
    setEditTaskStatus(task.status);
    setTaskError("");
  };

  // UPDATE TASK
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!editTaskTitle.trim()) {
      setTaskError("Please enter a task title.");
      return;
    }

    if (!editingTask) {
      return;
    }

    try {
      setUpdatingTask(true);
      setTaskError("");

      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${editingTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editTaskTitle,
            description: editTaskDescription,
            status: editTaskStatus,
            project_id: editingTask.project_id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setTaskError(data.detail || "Unable to update task.");
        return;
      }

      setEditingTask(null);

      await fetchTasks();
    } catch (err) {
      setTaskError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setUpdatingTask(false);
    }
  };

  // DELETE TASK
  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTaskId(taskId);
      setTaskError("");

      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setTaskError(data.detail || "Unable to delete task.");
        return;
      }

      await fetchTasks();
    } catch (err) {
      setTaskError(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setDeletingTaskId(null);
    }
  };

  // AI PRIORITY SUGGESTION
  const handleSuggestPriority = async (task) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai/suggest-priority",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: task.title,
            description: task.description || "",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTaskPriorities((previous) => ({
          ...previous,
          [task.id]: data.suggested_priority,
        }));
      } else {
        setTaskError(
          data.detail || "Unable to get AI priority."
        );
      }
    } catch (err) {
      setTaskError(
        "Unable to connect to the AI backend."
      );
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    window.location.href = "/";
  };

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">
        <div className="dashboard-logo">
          IH
        </div>

        <div className="dashboard-title">
          <h1>My Workspace</h1>

          <p>
            Welcome back{username ? `, ${username}` : ""}! Manage your projects and tasks.
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-content">

        <div className="dashboard-top">
          <div>
            <h2>Projects</h2>
            <p>Manage and organize your projects.</p>
          </div>

          <div className="dashboard-actions">
            <div className="project-count">
              {projects.length} Projects
            </div>

            <button
              className="create-project-button"
              onClick={() => {
                setShowForm(!showForm);
                setEditingProject(null);
                setError("");
              }}
            >
              {showForm ? "Cancel" : "+ New Project"}
            </button>
          </div>
        </div>

        {showForm && (
          <form
            className="project-form"
            onSubmit={handleCreateProject}
          >
            <h3>Create New Project</h3>

            <input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
            />

            <textarea
              placeholder="Project description (optional)"
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(e.target.value)
              }
            />

            <button
              type="submit"
              className="save-project-button"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Project"}
            </button>
          </form>
        )}

        {editingProject && (
          <form
            className="project-form"
            onSubmit={handleUpdateProject}
          >
            <h3>Edit Project</h3>

            <input
              type="text"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
            />

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(e.target.value)
              }
            />

            <div className="form-actions">
              <button
                type="submit"
                className="save-project-button"
                disabled={updating}
              >
                {updating
                  ? "Updating..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                className="cancel-project-button"
                onClick={() =>
                  setEditingProject(null)
                }
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading && (
          <div className="dashboard-state">
            Loading projects...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="dashboard-state">
              <h3>No projects yet</h3>
              <p>
                Create your first project to start organizing your work.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="project-grid">

              {projects.map((project) => {
                const projectTasks = tasks.filter(
                  (task) =>
                    task.project_id === project.id
                );

                return (
                  <div
                    className="project-card"
                    key={project.id}
                  >

                    <div className="project-card-top">
                      <span className="project-id">
                        PROJECT #{project.id}
                      </span>

                      <span className="task-count">
                        {projectTasks.length} Tasks
                      </span>
                    </div>

                    <h3>{project.name}</h3>

                    <p>
                      {project.description ||
                        "No description available."}
                    </p>

                    <div className="project-footer">
                      <span>
                        Owner ID: {project.owner_id}
                      </span>

                      <div className="project-buttons">
                        <button
                          className="edit-project-button"
                          onClick={() =>
                            startEditingProject(project)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-project-button"
                          onClick={() =>
                            handleDeleteProject(project.id)
                          }
                          disabled={
                            deletingId === project.id
                          }
                        >
                          {deletingId === project.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div className="task-section">

                      <div className="task-section-header">
                        <h4>Tasks</h4>

                        <button
                          className="add-task-button"
                          onClick={() => {
                            setShowTaskForm(
                              showTaskForm === project.id
                                ? null
                                : project.id
                            );

                            setEditingTask(null);
                            setTaskError("");
                          }}
                        >
                          {showTaskForm === project.id
                            ? "Cancel"
                            : "+ Add Task"}
                        </button>
                      </div>

                      {showTaskForm === project.id && (
                        <form
                          className="task-form"
                          onSubmit={(e) =>
                            handleCreateTask(
                              e,
                              project.id
                            )
                          }
                        >

                          <input
                            type="text"
                            placeholder="Task title"
                            value={taskTitle}
                            onChange={(e) =>
                              setTaskTitle(
                                e.target.value
                              )
                            }
                          />

                          <textarea
                            placeholder="Task description (optional)"
                            value={taskDescription}
                            onChange={(e) =>
                              setTaskDescription(
                                e.target.value
                              )
                            }
                          />

                          <select
                            value={taskStatus}
                            onChange={(e) =>
                              setTaskStatus(
                                e.target.value
                              )
                            }
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="in-progress">
                              In Progress
                            </option>

                            <option value="done">
                              Done
                            </option>
                          </select>

                          <button
                            type="submit"
                            className="save-task-button"
                            disabled={creatingTask}
                          >
                            {creatingTask
                              ? "Creating..."
                              : "Create Task"}
                          </button>

                        </form>
                      )}

                      {taskError && (
                        <div className="dashboard-error">
                          {taskError}
                        </div>
                      )}

                      {taskLoading && (
                        <div className="task-state">
                          Loading tasks...
                        </div>
                      )}

                      {!taskLoading &&
                        projectTasks.length === 0 && (
                          <div className="task-state">
                            No tasks yet.
                          </div>
                        )}

                      {!taskLoading &&
                        projectTasks.length > 0 && (
                          <div className="task-list">

                            {projectTasks.map((task) => (
                              <div
                                className="task-item"
                                key={task.id}
                              >

                                {editingTask &&
                                editingTask.id === task.id ? (

                                  <form
                                    className="task-form"
                                    onSubmit={
                                      handleUpdateTask
                                    }
                                  >

                                    <input
                                      type="text"
                                      value={
                                        editTaskTitle
                                      }
                                      onChange={(e) =>
                                        setEditTaskTitle(
                                          e.target.value
                                        )
                                      }
                                    />

                                    <textarea
                                      value={
                                        editTaskDescription
                                      }
                                      onChange={(e) =>
                                        setEditTaskDescription(
                                          e.target.value
                                        )
                                      }
                                    />

                                    <select
                                      value={
                                        editTaskStatus
                                      }
                                      onChange={(e) =>
                                        setEditTaskStatus(
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="pending">
                                        Pending
                                      </option>

                                      <option value="in-progress">
                                        In Progress
                                      </option>

                                      <option value="done">
                                        Done
                                      </option>
                                    </select>

                                    <div className="form-actions">
                                      <button
                                        type="submit"
                                        className="save-task-button"
                                        disabled={
                                          updatingTask
                                        }
                                      >
                                        {updatingTask
                                          ? "Updating..."
                                          : "Save"}
                                      </button>

                                      <button
                                        type="button"
                                        className="cancel-project-button"
                                        onClick={() =>
                                          setEditingTask(null)
                                        }
                                      >
                                        Cancel
                                      </button>
                                    </div>

                                  </form>

                                ) : (

                                  <>
                                    <div className="task-info">

                                      <h5>
                                        {task.title}
                                      </h5>

                                      <p>
                                        {task.description ||
                                          "No description"}
                                      </p>

                                      <span
                                        className={`task-status ${task.status}`}
                                      >
                                        {task.status}
                                      </span>

                                      <div>
                                        <button
                                          className="ai-priority-button"
                                          onClick={() =>
                                            handleSuggestPriority(
                                              task
                                            )
                                          }
                                        >
                                          ✨ AI Suggest Priority
                                        </button>

                                        {taskPriorities[
                                          task.id
                                        ] && (
                                          <span className="ai-priority-result">
                                            AI Priority:{" "}
                                            {
                                              taskPriorities[
                                                task.id
                                              ]
                                            }
                                          </span>
                                        )}
                                      </div>

                                    </div>

                                    <div className="task-buttons">

                                      <button
                                        className="edit-project-button"
                                        onClick={() =>
                                          startEditingTask(
                                            task
                                          )
                                        }
                                      >
                                        Edit
                                      </button>

                                      <button
                                        className="delete-project-button"
                                        onClick={() =>
                                          handleDeleteTask(
                                            task.id
                                          )
                                        }
                                        disabled={
                                          deletingTaskId ===
                                          task.id
                                        }
                                      >
                                        {deletingTaskId ===
                                        task.id
                                          ? "Deleting..."
                                          : "Delete"}
                                      </button>

                                    </div>

                                  </>
                                )}

                              </div>
                            ))}

                          </div>
                        )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </main>
    </div>
  );
}

export default Dashboard;