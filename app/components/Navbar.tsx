import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

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
        transition: "all 0.4s ease",
      }}
      className="navbar"
    >
              <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            gap: isMenuExpanded ? "3rem" : "0",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            width: "100%",
          }}
        >
                  {/* Logo Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isMenuExpanded 
                ? "translateX(-200px) scale(0.85)" 
                : "translateX(0) scale(1)",
              position: "relative",
              zIndex: 10,
            }}
            onClick={toggleMenu}
          >
          <img
            src="/images/MMOJournal_logo.svg"
            alt="MMO Journal Logo"
            style={{ 
              height: "120px",
              transition: "all 0.4s ease",
              filter: isMenuExpanded ? "drop-shadow(0 0 10px rgba(255, 203, 5, 0.3))" : "none",
            }}
          />
          
          {/* Subtitle - Hidden when menu is expanded */}
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.6)",
              fontStyle: "italic",
              opacity: isMenuExpanded ? 0 : 1,
              transform: isMenuExpanded ? "translateY(-10px)" : "translateY(0)",
              transition: "all 0.3s ease",
              pointerEvents: isMenuExpanded ? "none" : "auto",
              whiteSpace: "nowrap",
            }}
          >
            Click the logo to open navigation menu
          </div>
        </div>

                  {/* Navigation Links - Slide in from right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              opacity: isMenuExpanded ? 1 : 0,
              transform: isMenuExpanded ? "translateX(0)" : "translateX(100px)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: isMenuExpanded ? "0.1s" : "0s",
              pointerEvents: isMenuExpanded ? "auto" : "none",
              fontSize: "0.95rem",
              fontWeight: "500",
              textTransform: "lowercase",
              letterSpacing: "0.025em",
              position: "absolute",
              right: "2rem",
            }}
          >
          <NavLink
            to="/pvp"
            style={({ isActive }) => ({
              color: isActive ? "#ffcb05" : "white",
              textDecoration: "none",
              padding: "0.75rem 1.5rem",
              transition: "all 0.2s ease",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: isActive ? "rgba(255, 203, 5, 0.1)" : "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.style.color.includes("#ffcb05")) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.style.color.includes("#ffcb05")) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            competitive compendium
          </NavLink>

          <NavLink
            to="/shiny-hunt"
            style={({ isActive }) => ({
              color: isActive ? "#ffcb05" : "white",
              textDecoration: "none",
              padding: "0.75rem 1.5rem",
              transition: "all 0.2s ease",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: isActive ? "rgba(255, 203, 5, 0.1)" : "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.style.color.includes("#ffcb05")) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.style.color.includes("#ffcb05")) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            shiny showcase
          </NavLink>

          <NavLink
            to="/journey"
            style={({ isActive }) => ({
              color: isActive ? "#ffcb05" : "white",
              textDecoration: "none",
              padding: "0.75rem 1.5rem",
              transition: "all 0.2s ease",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: isActive ? "rgba(255, 203, 5, 0.1)" : "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.style.color.includes("#ffcb05")) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.style.color.includes("#ffcb05")) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            journal
          </NavLink>
        </div>
      </div>

      {/* Responsive behavior for smaller screens */}
      <style>{`
        @media (max-width: 768px) {
          .navbar div[style*="position: absolute"] {
            position: static !important;
            transform: translateX(0) !important;
            margin-top: 1.5rem;
            justify-content: center !important;
            right: auto !important;
          }
          
          .navbar div[style*="translateX"] {
            transform: translateX(0) scale(0.9) !important;
          }
          
          .navbar div[style*="gap: 2rem"] {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: center !important;
          }
        }
        
        @media (max-width: 480px) {
          .navbar {
            padding: 1.5rem 1rem !important;
          }
          
          .navbar img {
            height: 100px !important;
          }
          
          .navbar div[style*="translateX"] {
            transform: translateX(0) scale(0.85) !important;
          }
        }
      `}</style>
    </nav>
  );
}
