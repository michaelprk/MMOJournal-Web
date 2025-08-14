// login.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Modal from "../components/ui/Modal";



export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState<React.ReactNode>(null);
  const [modalVariant, setModalVariant] = useState<"success" | "error" | "info">("info");
  const redirectTimerRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const { signIn, loading, user, initializing } = useAuth();

  // Auth guard: if already signed in, redirect immediately without flicker
  useEffect(() => {
    if (!initializing && user) {
      navigate("/home", { replace: true });
    }
  }, [user, initializing, navigate]);

  useEffect(() => () => {
    if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
  }, []);

  const openModal = (title: string, body: React.ReactNode, variant: "success" | "error" | "info") => {
    setModalTitle(title);
    setModalBody(body);
    setModalVariant(variant);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    // If success modal closes, navigate immediately
    if (modalVariant === "success") {
      navigate("/home", { replace: true });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any previous modal state
    setModalOpen(false);
    setModalBody(null);

    const trimmedId = identifier.trim();
    const trimmedPw = password.trim();
    if (!trimmedId || !trimmedPw) {
      openModal("Incorrect details", "Please check your email and password.", "error");
      return;
    }

    try {
      await signIn(trimmedId, trimmedPw);
      // Show success modal then redirect after ~700ms
      openModal("Successfully logged in", null, "success");
      redirectTimerRef.current = window.setTimeout(() => {
        navigate("/pvp", { replace: true });
      }, 700);
    } catch (err: any) {
      const isNetwork = typeof err?.message === "string" && err.message.toLowerCase().includes("network");
      openModal(
        isNetwork ? "Network error" : "Incorrect details",
        isNetwork ? "Network error. Please try again." : "Please check your email and password.",
        "error"
      );
      setPassword("");
    }
  };

  const handleCreateAccount = () => {
    navigate("/create-account"); // create this route/page later
  };

  // Avoid flicker by not rendering the form when initializing or already authed
  if (initializing || user) return null;

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
          placeholder="Username or Email"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
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
          disabled={loading}
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
            opacity: loading ? 0.7 : 1,
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#e6b800")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#ffcb05")}
        >
          {loading ? 'Signing in...' : 'Login'}
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

        {/* Forgot password link */}
        <button
          type="button"
          onClick={() => navigate('/forgot')}
          style={{
            marginTop: '0.5rem',
            alignSelf: 'center',
            background: 'transparent',
            border: 'none',
            color: '#ffd700',
            fontStyle: 'italic',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Forgot password?
        </button>
      </form>

      <Modal isOpen={modalOpen} title={modalTitle} onClose={closeModal} variant={modalVariant}>
        {modalBody}
      </Modal>
    </div>
  );
}