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
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
  // Save logged-in user information
  localStorage.setItem("userId", data.id);
  localStorage.setItem("username", data.username);
  localStorage.setItem("email", data.email);

  setMessage(`Login successful! Welcome, ${data.username}.`);

  setTimeout(() => {
    window.location.href = "/dashboard";
  }, 1000);
}else {
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
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Account created successfully! You can now sign in."
        );

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

  // DEMO
  const handleDemo = () => {
    setEmail("demo@example.com");
    setPassword("demo123");
    setMessage("Demo account details filled.");
  };

  // SWITCH TO SIGNUP
  const switchToSignup = (e) => {
    e.preventDefault();

    setIsSignup(true);
    setMessage("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  // SWITCH TO LOGIN
  const switchToLogin = (e) => {
    e.preventDefault();

    setIsSignup(false);
    setMessage("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT BRANDING SECTION */}
        <div className="login-brand">

          <div className="brand-logo">
            IH
          </div>

          <h1>
            Build. Manage.
            <br />
            Grow.
          </h1>

          <p>
            A smart workspace designed to help teams organize
            projects, manage tasks, and stay productive.
          </p>

          <div className="feature-list">
            <div>
              <span>✓</span>
              Organize projects effortlessly
            </div>

            <div>
              <span>✓</span>
              Track tasks in one place
            </div>

            <div>
              <span>✓</span>
              Stay focused and productive
            </div>
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="login-card">

          <div className="login-header">

            <div className="welcome">
              {isSignup ? "CREATE ACCOUNT" : "WELCOME BACK"}
            </div>

            <h2>
              {isSignup
                ? "Create your workspace account"
                : "Sign in to your workspace"}
            </h2>

            <p className="subtitle">
              {isSignup
                ? "Enter your details to get started."
                : "Enter your details to continue."}
            </p>

          </div>

          {/* SIGNUP FORM */}
          {isSignup ? (

            <form onSubmit={handleRegister}>

              <div className="input-group">
                <label>Username</label>

                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Email address</label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

          ) : (

            /* LOGIN FORM */
            <form onSubmit={handleLogin}>

              <div className="input-group">
                <label>Email address</label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">

                <div className="password-label">
                  <label>Password</label>

                  <a href="#forgot">
                    Forgot password?
                  </a>
                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
                {!loading && <span>→</span>}
              </button>

            </form>
          )}

          {/* MESSAGE */}
          {message && (
            <div className="login-message">
              {message}
            </div>
          )}

          {/* DEMO */}
          {!isSignup && (
            <>
              <div className="divider">
                <span>or</span>
              </div>

              <button
                className="demo-button"
                onClick={handleDemo}
                type="button"
              >
                Continue with Demo
              </button>
            </>
          )}

          {/* SWITCH LOGIN / SIGNUP */}
          <p className="signup-text">

            {isSignup ? (
              <>
                Already have an account?{" "}

                <a
                  href="#login"
                  onClick={switchToLogin}
                >
                  Sign in
                </a>
              </>
            ) : (
              <>
                New to the workspace?{" "}

                <a
                  href="#signup"
                  onClick={switchToSignup}
                >
                  Create an account
                </a>
              </>
            )}

          </p>

        </div>
      </div>

      <div className="footer-text">
        © 2026 Innovation Workspace
      </div>

    </div>
  );
}

export default App;