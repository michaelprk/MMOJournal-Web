// login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export async function loader() {
  return null; // no data needed here for now
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add real auth logic here
    if (username.trim() && password.trim()) {
      // Mock login success: redirect to pvp page
      navigate("/pvp");
    } else {
      alert("Please enter username and password");
    }
  };

  const handleCreateAccount = () => {
    navigate("/create-account"); // create this route/page later
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",  // <-- Changed from "#000" to "transparent"
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Align items to the top
        alignItems: "center",
        padding: "1rem",
        paddingTop: "13rem", // Add top padding to push content down a bit
      }}
    >
      {/* Logo */}
      <img
        src="/images/MMOJournal_logo.svg"
        alt="MMO Journal Logo"
        style={{ width: 400, marginBottom: "2rem" }}
      />

      {/* Login form */}
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", width: 300, gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: 4,
            border: "1px solid #555",
            backgroundColor: "#111",
            color: "#fff",
          }}
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: 4,
            border: "1px solid #555",
            backgroundColor: "#111",
            color: "#fff",
          }}
        />

        {/* Buttons */}
        <button
          type="submit"
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
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#e6b800")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#ffcb05")}
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleCreateAccount}
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
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = "#333";
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}