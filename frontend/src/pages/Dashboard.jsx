import { useEffect, useState } from "react";
import "./Dashboard.css";
import logo from "../assets/df.png";

function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

  // SEARCH
  const [searchTerm, setSearchTerm] = useState("");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [selectedProject, setSelectedProject] = useState("");

  // AI CHAT
  const [chatMessage, setChatMessage] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 👋 I am DevFlow AI Assistant. How can I help you with your projects and tasks?",
    },
  ]);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // LOAD DATA
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const projectResponse = await fetch(
        "https://task4-ai-backend.onrender.com/projects/"
      );

      const taskResponse = await fetch(
        "https://task4-ai-backend.onrender.com/tasks/"
      );

      const projectData = await projectResponse.json();
      const taskData = await taskResponse.json();

      if (projectResponse.ok) {
        setProjects(projectData);
      }

      if (taskResponse.ok) {
        setTasks(taskData);
      }
    } catch {
      setError(
        "Unable to connect to FastAPI. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE PROJECT
  // =========================

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    try {
      const response = await fetch(
        "https://task4-ai-backend.onrender.com/projects/",
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
      setShowProjectForm(false);
      setError("");

      loadData();
    } catch {
      setError("Unable to create project.");
    }
  };

  // =========================
  // DELETE PROJECT
  // =========================

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await fetch(
        `https://task4-ai-backend.onrender.com/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      loadData();
    } catch {
      setError("Unable to delete project.");
    }
  };

  // =========================
  // CREATE TASK
  // =========================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim() || !selectedProject) {
      setError("Please enter task details.");
      return;
    }

    try {
      const response = await fetch(
        "https://task4-ai-backend.onrender.com/tasks/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            status: taskStatus,
            project_id: Number(selectedProject),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Unable to create task.");
        return;
      }

      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("pending");
      setSelectedProject("");
      setShowTaskForm(false);
      setError("");

      loadData();
    } catch {
      setError("Unable to create task.");
    }
  };

  // =========================
  // UPDATE TASK STATUS
  // =========================

  const handleUpdateTaskStatus = async (
    task,
    newStatus
  ) => {
    try {
      const response = await fetch(
        `https://task4-ai-backend.onrender.com/tasks/${task.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: task.title,
            description: task.description,
            status: newStatus,
            project_id: task.project_id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || "Unable to update task status."
        );
        return;
      }

      setError("");

      loadData();
    } catch {
      setError("Unable to update task status.");
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await fetch(
        `https://task4-ai-backend.onrender.com/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      loadData();
    } catch {
      setError("Unable to delete task.");
    }
  };

  // =========================
  // AI CHAT
  // =========================

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!chatMessage.trim()) return;

    const userMessage = {
      sender: "user",
      text: chatMessage,
    };

    setChatMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    const messageToSend = chatMessage;

    setChatMessage("");

    try {
      const response = await fetch(
        "https://task4-ai-backend.onrender.com/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: messageToSend,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Unable to get AI response");
      }

      setChatMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "ai",
          text: data.reply,
        },
      ]);
    } catch {
      setChatMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "ai",
          text: "Sorry, I am unable to connect to the AI assistant right now.",
        },
      ]);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    window.location.href = "/";
  };

  // =========================
  // TASK COUNTS
  // =========================

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  );

  const progressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  );

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  );

  // =========================
  // SEARCH RESULTS
  // =========================

  const normalizedSearch = searchTerm.toLowerCase().trim();

  const filteredProjects = normalizedSearch
    ? projects.filter((project) =>
        `${project.name} ${project.description || ""}`
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : [];

  const filteredTasks = normalizedSearch
    ? tasks.filter((task) =>
        `${task.title} ${task.description || ""}`
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : [];

  const handleSearchProject = () => {
    setActivePage("Projects");
    setSearchTerm("");
  };

  const handleSearchTask = () => {
    setActivePage("Tasks");
    setSearchTerm("");
  };

  // =========================
  // PAGE CONTENT
  // =========================

  const getPageContent = () => {
    // =========================
    // DASHBOARD
    // =========================

    if (activePage === "Dashboard") {
      return (
        <>
          <div className="page-heading">
            <div>
              <div className="robot-page-label">
                ✦ DEVFLOW WORKSPACE
              </div>

              <h1>
                Welcome back, {username}! 👋
              </h1>

              <p>
                Your intelligent workspace is ready.
                Here's your project overview.
              </p>
            </div>

            <div className="notification">
              🔔
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                📁
              </div>

              <div>
                <p>Total Projects</p>
                <h2>{projects.length}</h2>
                <span>Active workspace projects</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                ✓
              </div>

              <div>
                <p>Completed Tasks</p>
                <h2>{completedTasks.length}</h2>
                <span>Tasks successfully completed</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                ⏳
              </div>

              <div>
                <p>In Progress</p>
                <h2>{progressTasks.length}</h2>
                <span>Currently active tasks</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                📌
              </div>

              <div>
                <p>Pending Tasks</p>
                <h2>{pendingTasks.length}</h2>
                <span>Waiting to start</span>
              </div>
            </div>
          </div>

          <div className="dashboard-panels">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Recent Projects</h2>

                  <p>
                    Your latest projects and task progress.
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    setActivePage("Projects")
                  }
                >
                  View Projects →
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="empty-state">
                  No projects yet. Create your first project!
                </div>
              ) : (
                projects.slice(0, 5).map((project) => {
                  const projectTaskCount =
                    tasks.filter(
                      (task) =>
                        task.project_id === project.id
                    ).length;

                  return (
                    <div
                      className="recent-project-item"
                      key={project.id}
                    >
                      <div className="project-folder">
                        📁
                      </div>

                      <div className="recent-project-info">
                        <h3>
                          {project.name}
                        </h3>

                        <p>
                          {project.description ||
                            "No description available"}
                        </p>
                      </div>

                      <div className="recent-project-tasks">
                        <strong>
                          {projectTaskCount}
                        </strong>

                        <span>
                          Tasks
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="panel overview-card">
              <div className="panel-header">
                <div>
                  <h2>Task Overview</h2>

                  <p>
                    Current task distribution
                  </p>
                </div>
              </div>

              <div
                className="donut-chart"
                style={{
                  background: `conic-gradient(
                    #354c9f 0 ${
                      tasks.length
                        ? (completedTasks.length /
                            tasks.length) *
                          100
                        : 0
                    }%,
                    #7a69d8 ${
                      tasks.length
                        ? (completedTasks.length /
                            tasks.length) *
                          100
                        : 0
                    }% ${
                      tasks.length
                        ? ((completedTasks.length +
                            progressTasks.length) /
                            tasks.length) *
                          100
                        : 0
                    }%,
                    #dfe4f5 ${
                      tasks.length
                        ? ((completedTasks.length +
                            progressTasks.length) /
                            tasks.length) *
                          100
                        : 0
                    }% 100%
                  )`,
                }}
              >
                <div className="donut-center">
                  <strong>
                    {tasks.length}
                  </strong>

                  <span>
                    Total Tasks
                  </span>
                </div>
              </div>

              <div className="chart-legend">
                <div>
                  <span className="legend-dot completed-dot"></span>
                  Completed
                  <strong>
                    {completedTasks.length}
                  </strong>
                </div>

                <div>
                  <span className="legend-dot progress-dot"></span>
                  In Progress
                  <strong>
                    {progressTasks.length}
                  </strong>
                </div>

                <div>
                  <span className="legend-dot pending-dot"></span>
                  Pending
                  <strong>
                    {pendingTasks.length}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    // =========================
    // PROJECTS
    // =========================

    if (activePage === "Projects") {
      return (
        <>
          <div className="page-heading">
            <div>
              <div className="robot-page-label">
                📁 PROJECT WORKSPACE
              </div>

              <h1>Projects</h1>

              <p>
                Manage and organize your workspace projects.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setShowProjectForm(!showProjectForm)
              }
            >
              + New Project
            </button>
          </div>

          {showProjectForm && (
            <form
              className="workspace-form"
              onSubmit={handleCreateProject}
            >
              <h2>
                Create New Project
              </h2>

              <input
                type="text"
                placeholder="Project name"
                value={projectName}
                onChange={(e) =>
                  setProjectName(e.target.value)
                }
              />

              <textarea
                placeholder="Project description"
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
              />

              <button
                type="submit"
                className="primary-button"
              >
                Create Project
              </button>
            </form>
          )}

          <div className="projects-list">
            {projects.length === 0 ? (
              <div className="empty-state">
                No projects yet.
              </div>
            ) : (
              projects.map((project) => {
                const projectTaskCount =
                  tasks.filter(
                    (task) =>
                      task.project_id === project.id
                  ).length;

                return (
                  <div
                    className="project-list-card"
                    key={project.id}
                  >
                    <div>
                      <div className="project-list-icon">
                        📁
                      </div>

                      <h2>
                        {project.name}
                      </h2>

                      <p>
                        {project.description ||
                          "No description available."}
                      </p>

                      <span className="task-badge">
                        {projectTaskCount} Tasks
                      </span>
                    </div>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteProject(project.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </>
      );
    }

    // =========================
    // TASKS
    // =========================

    if (activePage === "Tasks") {
      return (
        <>
          <div className="page-heading">
            <div>
              <div className="robot-page-label">
                ✓ TASK CONTROL
              </div>

              <h1>Tasks</h1>

              <p>
                Track and manage all your project tasks.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setShowTaskForm(!showTaskForm)
              }
            >
              + New Task
            </button>
          </div>

          {showTaskForm && (
            <form
              className="workspace-form"
              onSubmit={handleCreateTask}
            >
              <h2>
                Create New Task
              </h2>

              <input
                type="text"
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(e.target.value)
                }
              />

              <textarea
                placeholder="Task description"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(e.target.value)
                }
              />

              <select
                value={selectedProject}
                onChange={(e) =>
                  setSelectedProject(e.target.value)
                }
              >
                <option value="">
                  Select Project
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={taskStatus}
                onChange={(e) =>
                  setTaskStatus(e.target.value)
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
                className="primary-button"
              >
                Create Task
              </button>
            </form>
          )}

          <div className="tasks-table">
            {tasks.length === 0 ? (
              <div className="empty-state">
                No tasks yet. Create your first task!
              </div>
            ) : (
              tasks.map((task) => {
                const project =
                  projects.find(
                    (item) =>
                      item.id === task.project_id
                  );

                return (
                  <div
                    className="task-row"
                    key={task.id}
                  >
                    <div>
                      <h3>
                        {task.title}
                      </h3>

                      <p>
                        {task.description ||
                          "No description"}
                      </p>

                      <p>
                        Project:{" "}
                        {project
                          ? project.name
                          : "Unknown"}
                      </p>
                    </div>

                    <select
                      className={`status-badge ${task.status}`}
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateTaskStatus(
                          task,
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
                      className="delete-button"
                      onClick={() =>
                        handleDeleteTask(task.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </>
      );
    }

    // =========================
    // ANALYTICS
    // =========================

    if (activePage === "Analytics") {
      return (
        <>
          <div className="page-heading">
            <div>
              <div className="robot-page-label">
                ▤ WORKSPACE INSIGHTS
              </div>

              <h1>Analytics</h1>

              <p>
                Track your workspace activity and task progress.
              </p>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="analytics-card">
              <h2>
                Task Status Overview
              </h2>

              <p>
                Distribution of your current tasks.
              </p>

              <div className="bar-chart">
                <div className="bar-row">
                  <span>Completed</span>

                  <div className="bar-track">
                    <div
                      className="bar completed-bar"
                      style={{
                        width: `${
                          tasks.length
                            ? (completedTasks.length /
                                tasks.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <strong>
                    {completedTasks.length}
                  </strong>
                </div>

                <div className="bar-row">
                  <span>
                    In Progress
                  </span>

                  <div className="bar-track">
                    <div
                      className="bar progress-bar"
                      style={{
                        width: `${
                          tasks.length
                            ? (progressTasks.length /
                                tasks.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <strong>
                    {progressTasks.length}
                  </strong>
                </div>

                <div className="bar-row">
                  <span>Pending</span>

                  <div className="bar-track">
                    <div
                      className="bar pending-bar"
                      style={{
                        width: `${
                          tasks.length
                            ? (pendingTasks.length /
                                tasks.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <strong>
                    {pendingTasks.length}
                  </strong>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h2>
                Workspace Summary
              </h2>

              <p>
                Overall project and task statistics.
              </p>

              <div className="summary-numbers">
                <div>
                  <strong>
                    {projects.length}
                  </strong>

                  <span>
                    Projects
                  </span>
                </div>

                <div>
                  <strong>
                    {tasks.length}
                  </strong>

                  <span>
                    Total Tasks
                  </span>
                </div>

                <div>
                  <strong>
                    {completedTasks.length}
                  </strong>

                  <span>
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-card line-chart-card">
            <div className="panel-header">
              <div>
                <h2>
                  Workspace Activity
                </h2>

                <p>
                  Task activity overview
                </p>
              </div>

              <span className="last-months">
                Last 6 Months
              </span>
            </div>

            <div className="line-chart">
              <svg
                viewBox="0 0 700 280"
                preserveAspectRatio="none"
              >
                <line
                  className="grid-line"
                  x1="0"
                  y1="40"
                  x2="700"
                  y2="40"
                />

                <line
                  className="grid-line"
                  x1="0"
                  y1="100"
                  x2="700"
                  y2="100"
                />

                <line
                  className="grid-line"
                  x1="0"
                  y1="160"
                  x2="700"
                  y2="160"
                />

                <line
                  className="grid-line"
                  x1="0"
                  y1="220"
                  x2="700"
                  y2="220"
                />

                <polyline
                  className="activity-line"
                  points="
                    20,200
                    140,170
                    260,190
                    380,120
                    500,145
                    680,70
                  "
                />

                <circle cx="20" cy="200" r="6" />
                <circle cx="140" cy="170" r="6" />
                <circle cx="260" cy="190" r="6" />
                <circle cx="380" cy="120" r="6" />
                <circle cx="500" cy="145" r="6" />
                <circle cx="680" cy="70" r="6" />
              </svg>

              <div className="months">
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>
        </>
      );
    }

    // =========================
    // AI ASSISTANT
    // =========================

    if (activePage === "AI Assistant") {
      return (
        <div className="ai-page">
          <div className="ai-page-top">
            <div>
              <div className="robot-page-label">
                ✦ INTELLIGENT ASSISTANT
              </div>

              <h1>
                DevFlow AI Assistant
              </h1>

              <p>
                Your intelligent workspace companion.
              </p>
            </div>

            <div className="ai-status">
              <span></span>
              AI Online
            </div>
          </div>

          <div className="ai-chat-layout">
            <div className="ai-info-card">
              <div className="robot-avatar-large">
                <div className="robot-head">
                  <span className="robot-eye"></span>
                  <span className="robot-eye"></span>
                </div>
              </div>

              <h2>
                Hello, {username}! 👋
              </h2>

              <p>
                I'm your DevFlow AI Assistant.
                Ask me anything about your projects,
                tasks, productivity, or workspace.
              </p>

              <div className="ai-suggestions">
                <button
                  onClick={() =>
                    setChatMessage(
                      "Give me a summary of my projects"
                    )
                  }
                >
                  📁 Summarize my projects
                </button>

                <button
                  onClick={() =>
                    setChatMessage(
                      "Help me organize my tasks"
                    )
                  }
                >
                  ✓ Organize my tasks
                </button>

                <button
                  onClick={() =>
                    setChatMessage(
                      "Give me productivity suggestions"
                    )
                  }
                >
                  ✨ Improve productivity
                </button>
              </div>
            </div>

            <div className="ai-chat-card">
              <div className="ai-chat-card-header">
                <div className="mini-robot">
                  🤖
                </div>

                <div>
                  <h2>
                    DevFlow Assistant
                  </h2>

                  <span>
                    ● Online and ready to help
                  </span>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.map(
                  (message, index) => (
                    <div
                      key={index}
                      className={`chat-message ${message.sender}`}
                    >
                      {message.sender === "ai" && (
                        <span className="message-robot">
                          🤖
                        </span>
                      )}

                      <div>
                        {message.text}
                      </div>
                    </div>
                  )
                )}
              </div>

              <form
                className="chat-input"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  placeholder="Ask DevFlow AI anything..."
                  value={chatMessage}
                  onChange={(e) =>
                    setChatMessage(e.target.value)
                  }
                />

                <button type="submit">
                  ➤
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    // =========================
    // SETTINGS
    // =========================

    if (activePage === "Settings") {
      return (
        <div className="empty-state settings-page">
          <div className="settings-icon">
            ⚙
          </div>

          <h2>
            Settings
          </h2>

          <p>
            Workspace settings will be available here.
          </p>
        </div>
      );
    }

    return null;
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-robot">
          🤖
        </div>

        <p>
          Loading your intelligent workspace...
        </p>
      </div>
    );
  }

  // =========================
  // MAIN RETURN
  // =========================

  return (
    <div className="app-dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            src={logo}
            alt="DevFlow Logo"
            className="sidebar-logo-image"
          />

          <div>
            <h2>
              DevFlow
            </h2>

            <span>
              SMART WORKSPACE
            </span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {[
            ["▦", "Dashboard"],
            ["▣", "Projects"],
            ["✓", "Tasks"],
            ["▤", "Analytics"],
            ["🤖", "AI Assistant"],
          ].map(([icon, page]) => (
            <button
              key={page}
              className={
                activePage === page
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActivePage(page)
              }
            >
              <span className="menu-icon">
                {icon}
              </span>

              <span>
                {page}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={
              activePage === "Settings"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("Settings")
            }
          >
            <span className="menu-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </button>

          <button
            onClick={handleLogout}
          >
            <span className="menu-icon">
              ↪
            </span>

            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD */}

      <div className="main-dashboard">

        <header className="top-header">

          <div className="top-search">
            <span>
              🔍
            </span>

            <input
              placeholder="Search projects and tasks..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            {searchTerm.trim() && (
              <div className="search-results">

                {filteredProjects.length === 0 &&
                  filteredTasks.length === 0 && (
                    <div className="search-empty">
                      No results found
                    </div>
                  )}

                {filteredProjects.map((project) => (
                  <button
                    key={`project-${project.id}`}
                    className="search-result-item"
                    onClick={handleSearchProject}
                  >
                    📁
                    <div>
                      <strong>
                        {project.name}
                      </strong>

                      <span>
                        Project
                      </span>
                    </div>
                  </button>
                ))}

                {filteredTasks.map((task) => (
                  <button
                    key={`task-${task.id}`}
                    className="search-result-item"
                    onClick={handleSearchTask}
                  >
                    ✓
                    <div>
                      <strong>
                        {task.title}
                      </strong>

                      <span>
                        Task
                      </span>
                    </div>
                  </button>
                ))}

              </div>
            )}
          </div>

          <div className="top-profile">
            <div>
              <strong>
                {username}
              </strong>

              <span>
                Developer
              </span>
            </div>

            <div className="top-avatar">
              {username
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>

        </header>

        <main className="dashboard-main-content">

          {error && (
            <div className="dashboard-alert">
              {error}
            </div>
          )}

          {getPageContent()}

        </main>

      </div>

    </div>
  );
}

export default Dashboard;
