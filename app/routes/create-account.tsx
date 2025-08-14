import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function CreateAccount() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (!usernameRegex.test(username.trim())) {
      setError("Username must be 3-20 characters, letters/numbers/underscore only");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp(username.trim(), email.trim(), password);
      navigate("/pvp");
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create account';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "1rem",
        paddingTop: "13rem",
      }}
    >
      <img
        src="/images/MMOJournal_logo.svg"
        alt="MMO Journal Logo"
        style={{ width: 400, marginBottom: "2rem" }}
      />

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: 300, gap: "1rem" }}>
        {error && (
          <div style={{ color: '#ff6b6b', fontWeight: 'bold', fontSize: '0.95rem' }}>{error}</div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: 4,
            border: "1px solid #555",
            backgroundColor: "#111",
            color: "#fff",
          }}

        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: 4,
            border: "1px solid #555",
            backgroundColor: "#111",
            color: "#fff",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: 4,
            border: "1px solid #555",
            backgroundColor: "#111",
            color: "#fff",
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: 4,
            border: "1px solid #555",
            backgroundColor: "#111",
            color: "#fff",
          }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: "#ffcb05",
            border: "none",
            borderRadius: 4,
            padding: "0.75rem",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#000",
            transition: "background-color 0.3s ease",
            opacity: isSubmitting ? 0.7 : 1,
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e6b800")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffcb05")}
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #fff",
            borderRadius: 4,
            padding: "0.75rem",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#fff",
            marginTop: "0.5rem",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#333";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}


