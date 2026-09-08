import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // SHOW DASHBOARD
  if (window.location.pathname === "/dashboard") {
    return <Dashboard />;
  }

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://task4-ai-backend.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);

        setMessage(`Login successful! Welcome, ${data.username}.`);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } else {
        setMessage(data.detail || "Invalid email or password.");
      }
    } catch (error) {
      setMessage(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://task4-ai-backend.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully! Please sign in.");

        setUsername("");
        setPassword("");

        setTimeout(() => {
          setIsSignup(false);
          setMessage("");
        }, 1500);
      } else {
        setMessage(data.detail || "Unable to create account.");
      }
    } catch (error) {
      setMessage(
        "Unable to connect to the backend. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    setIsSignup(true);
    setMessage("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const switchToLogin = () => {
    setIsSignup(false);
    setMessage("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-content">
          <div className="auth-logo">IH</div>

          <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>

          <p className="auth-subtitle">
            {isSignup
              ? "Create your account and start managing your projects."
              : "Sign in to continue to your workspace."}
          </p>

          {isSignup ? (
            <form onSubmit={handleRegister}>
              <div className="auth-input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="auth-input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}

          {message && (
            <div
              className={`auth-message ${
                message.toLowerCase().includes("success")
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}

          <p className="auth-switch">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={switchToLogin}>
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button type="button" onClick={switchToSignup}>
                  Create Account
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      <p className="auth-footer">
        © 2026 Innovation Workspace
      </p>
    </div>
  );
}

export default App;
