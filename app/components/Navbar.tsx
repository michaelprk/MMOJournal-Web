import { NavLink, useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        padding: "2rem",
        backgroundColor: "transparent",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        userSelect: "none",
        textAlign: "center",
        boxSizing: "border-box",
        zIndex: 1000,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      className="navbar"
    >
      {/* Clickable logo container */}
      <div
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          cursor: "pointer",
          marginBottom: "1.5rem"
        }}
        onClick={() => navigate("/")}
      >
        <img
          src="/images/MMOJournal_logo.svg"
          alt="MMO Journal Logo"
          style={{ height: "140px" }}
        />
      </div>

      {/* Nav links below logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          fontSize: "0.95rem",
          fontWeight: "500",
          textTransform: "lowercase",
          letterSpacing: "0.025em",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <NavLink
          to="/pvp"
          style={({ isActive }) => ({
            color: isActive ? "#ffcb05" : "white",
            textDecoration: "none",
            padding: "0.5rem 1.5rem",
            transition: "all 0.2s ease",
            borderRadius: "4px",
            whiteSpace: "nowrap",
          })}
        >
          competitive compendium
        </NavLink>
        
        <div style={{ 
          color: "rgba(255, 255, 255, 0.4)", 
          fontSize: "1rem",
          fontWeight: "300"
        }}>
          |
        </div>
        
        <NavLink
          to="/shiny-hunt"
          style={({ isActive }) => ({
            color: isActive ? "#ffcb05" : "white",
            textDecoration: "none",
            padding: "0.5rem 1.5rem",
            transition: "all 0.2s ease",
            borderRadius: "4px",
            whiteSpace: "nowrap",
          })}
        >
          shiny showcase
        </NavLink>
        
        <div style={{ 
          color: "rgba(255, 255, 255, 0.4)", 
          fontSize: "1rem",
          fontWeight: "300"
        }}>
          |
        </div>
        
        <NavLink
          to="/journey"
          style={({ isActive }) => ({
            color: isActive ? "#ffcb05" : "white",
            textDecoration: "none",
            padding: "0.5rem 1.5rem",
            transition: "all 0.2s ease",
            borderRadius: "4px",
            whiteSpace: "nowrap",
          })}
        >
          journal
        </NavLink>
      </div>
    </nav>
  );
}
