import { NavLink } from "react-router-dom";



export function Navbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#222", color: "white" }}>
      <h1>MMOJournal-Web</h1>
      <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
        <li>
          <NavLink to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/pvp" style={{ color: "white", textDecoration: "none" }}>
            PvP Compendium
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shiny-hunt"
            style={{ color: "white", textDecoration: "none" }}
          >
            Shiny Showcase
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/journey"
            style={{ color: "white", textDecoration: "none" }}
          >
            Journey Journal
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
