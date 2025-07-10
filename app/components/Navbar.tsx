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
        boxSizing: "border-box",
        zIndex: 1000,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      className="navbar"
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Navigation Links - Elegant floating bar above logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            padding: "0.75rem 2rem",
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(15px)",
            borderRadius: "50px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "0.9rem",
            fontWeight: "500",
            textTransform: "lowercase",
            letterSpacing: "0.025em",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
          }}
        >
          <NavLink
            to="/pvp"
            style={({ isActive }) => ({
              color: isActive ? "#ffcb05" : "rgba(255, 255, 255, 0.9)",
              textDecoration: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: "25px",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
              position: "relative",
              overflow: "hidden",
              background: isActive 
                ? "linear-gradient(135deg, rgba(255, 203, 5, 0.2), rgba(255, 203, 5, 0.1))" 
                : "transparent",
              border: isActive ? "1px solid rgba(255, 203, 5, 0.3)" : "1px solid transparent",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.getAttribute("aria-current")) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "#ffcb05";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.getAttribute("aria-current")) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            competitive compendium
          </NavLink>

          <div style={{ 
            width: "1px",
            height: "20px",
            background: "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
          }} />

          <NavLink
            to="/shiny-hunt"
            style={({ isActive }) => ({
              color: isActive ? "#ffcb05" : "rgba(255, 255, 255, 0.9)",
              textDecoration: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: "25px",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
              position: "relative",
              overflow: "hidden",
              background: isActive 
                ? "linear-gradient(135deg, rgba(255, 203, 5, 0.2), rgba(255, 203, 5, 0.1))" 
                : "transparent",
              border: isActive ? "1px solid rgba(255, 203, 5, 0.3)" : "1px solid transparent",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.getAttribute("aria-current")) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "#ffcb05";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.getAttribute("aria-current")) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            shiny showcase
          </NavLink>

          <div style={{ 
            width: "1px",
            height: "20px",
            background: "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
          }} />

          <NavLink
            to="/journey"
            style={({ isActive }) => ({
              color: isActive ? "#ffcb05" : "rgba(255, 255, 255, 0.9)",
              textDecoration: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: "25px",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
              position: "relative",
              overflow: "hidden",
              background: isActive 
                ? "linear-gradient(135deg, rgba(255, 203, 5, 0.2), rgba(255, 203, 5, 0.1))" 
                : "transparent",
              border: isActive ? "1px solid rgba(255, 203, 5, 0.3)" : "1px solid transparent",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.getAttribute("aria-current")) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "#ffcb05";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.getAttribute("aria-current")) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            journal
          </NavLink>
        </div>

        {/* Logo - Centered below navigation */}
        <div
          style={{
            cursor: "pointer",
            transition: "all 0.3s ease",
            filter: "drop-shadow(0 0 20px rgba(255, 203, 5, 0.2))",
          }}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.filter = "drop-shadow(0 0 30px rgba(255, 203, 5, 0.4))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.filter = "drop-shadow(0 0 20px rgba(255, 203, 5, 0.2))";
          }}
        >
          <img
            src="/images/MMOJournal_logo.svg"
            alt="MMO Journal Logo"
            style={{ 
              height: "110px",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Responsive Design */}
      <style>{`
        @media (max-width: 768px) {
          .navbar div[style*="gap: 2rem"] {
            gap: 1rem !important;
            padding: 0.5rem 1rem !important;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .navbar div[style*="gap: 1.5rem"] {
            gap: 1rem !important;
          }
        }
        
        @media (max-width: 640px) {
          .navbar div[style*="gap: 2rem"] {
            flex-direction: column !important;
            gap: 0.5rem !important;
            padding: 1rem 1.5rem !important;
          }
          
          .navbar div[style*="width: 1px"] {
            display: none !important;
          }
          
          .navbar img {
            height: 90px !important;
          }
        }
        
        @media (max-width: 480px) {
          .navbar {
            padding: 1.5rem 1rem !important;
          }
          
          .navbar img {
            height: 80px !important;
          }
          
          .navbar a {
            padding: 0.4rem 1rem !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </nav>
  );
}
