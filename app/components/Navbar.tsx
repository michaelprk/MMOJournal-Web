import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export function Navbar() {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        userSelect: "none",
        textAlign: "center",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Clickable logo container */}
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img
          src="/images/MMOJournal_logo.svg"
          alt="MMO Journal Logo"
          style={{ height: "150px" }} // increased size
        />
      </div>

      {/* Nav links below logo, centered, smaller font, lowercase */}
      <div
        style={{
          marginTop: "0.5rem",
          opacity: hovered ? 1 : 0,
          maxHeight: hovered ? "40px" : "0",
          overflow: "hidden",
          transition: "opacity 0.3s ease, max-height 0.3s ease",
          whiteSpace: "nowrap",
          pointerEvents: hovered ? "auto" : "none",
          fontSize: "0.85rem", // smaller font size
          fontWeight: "400",
          textTransform: "lowercase", // lowercase text
          display: "inline-block",
          width: "100%",
          textAlign: "center",
        }}
      >
        <NavLink
          to="/pvp"
          style={({ isActive }) => ({
            color: isActive ? "#ffcb05" : "white",
            textDecoration: "none",
            margin: "0 1rem",
          })}
        >
          competitive compendium
        </NavLink>
        <span style={{ color: "#888" }}>|</span>
        <NavLink
          to="/shiny-hunt"
          style={({ isActive }) => ({
            color: isActive ? "#ffcb05" : "white",
            textDecoration: "none",
            margin: "0 1rem",
          })}
        >
          shiny showcase
        </NavLink>
        <span style={{ color: "#888" }}>|</span>
        <NavLink
          to="/journey"
          style={({ isActive }) => ({
            color: isActive ? "#ffcb05" : "white",
            textDecoration: "none",
            margin: "0 1rem",
          })}
        >
          journal
        </NavLink>
      </div>
    </nav>
  );
}
