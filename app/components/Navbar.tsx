import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show navbar when at the top of the page
          if (currentScrollY === 0) {
            setIsVisible(true);
          } 
          // Hide navbar when scrolling down
          else if (currentScrollY > lastScrollY.current && currentScrollY > 20) {
            setIsVisible(false);
          }
          // Show navbar when scrolling up
          else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true);
          }
          
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array

  return (
    <nav
      style={{
        padding: "0.5rem 2rem",
        backgroundColor: "transparent",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        userSelect: "none",
        textAlign: "center",
        pointerEvents: "none", // Make navbar not block clicks
        transform: `translateY(${isVisible ? "0" : "-100%"})`, // Hide/show navbar
        willChange: "transform", // Optimize for animations
        boxSizing: "border-box", // Ensure proper box model
        transition: "transform 0.3s ease-in-out", // Smooth transition
      }}
      className="navbar"
    >
      {/* Clickable logo container */}
      <div
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          cursor: "pointer",
          pointerEvents: "auto" // Re-enable clicks for logo
        }}
        onClick={() => navigate("/")}
      >
        <img
          src="/images/MMOJournal_logo.svg"
          alt="MMO Journal Logo"
          style={{ height: "80px" }}
        />
      </div>

      {/* Nav links below logo, always visible now (no hover logic) */}
      <div
        style={{
          marginTop: "0.25rem",
          whiteSpace: "nowrap",
          fontSize: "0.85rem",
          fontWeight: "400",
          textTransform: "lowercase",
          display: "inline-block",
          width: "100%",
          textAlign: "center",
          pointerEvents: "auto", // Re-enable clicks for nav links
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
