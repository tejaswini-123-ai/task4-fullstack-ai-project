import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Welcome back, ${data.username}!`);
      } else {
        setMessage(data.detail || "Invalid email or password.");
      }
    } catch (error) {
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Decorative background */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <div className="login-container">

        {/* Left branding section */}
        <section className="login-brand">

          <div className="brand-mark">
            N
          </div>

          <p className="brand-name">NEXORA AI</p>

          <h1>
            Turn ideas into
            <span> intelligent progress.</span>
          </h1>

          <p className="brand-description">
            A smarter workspace for managing projects, organizing tasks,
            and using AI-powered insights to work better.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span>✦</span>
              <div>
                <strong>Smart Workspace</strong>
                <small>Everything organized in one place</small>
              </div>
            </div>

            <div className="feature-item">
              <span>◈</span>
              <div>
                <strong>AI Insights</strong>
                <small>Make better task decisions faster</small>
              </div>
            </div>

            <div className="feature-item">
              <span>↗</span>
              <div>
                <strong>Track Progress</strong>
                <small>Stay focused on what matters</small>
              </div>
            </div>
          </div>
        </section>

        {/* Login card */}
        <section className="login-card">

          <div className="login-header">
            <p className="welcome">WELCOME BACK</p>

            <h2>Sign in to NEXORA</h2>

            <p>
              Continue managing your projects and tasks.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <button type="button">
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span>→</span>}
            </button>

          </form>

          {message && (
            <div
              className={`login-message ${
                message.includes("Welcome") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="divider">
            <span>SECURE WORKSPACE</span>
          </div>

          <p className="login-footer">
            New to NEXORA?{" "}
            <button type="button">Create an account</button>
          </p>

        </section>

      </div>

      <p className="copyright">
        NEXORA AI · Intelligent Project Management
      </p>

    </div>
  );
}

export default Login;