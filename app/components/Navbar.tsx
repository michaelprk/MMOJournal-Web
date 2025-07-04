import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#222", color: "white" }}>
      <h1>MMOJournal-Web</h1>
      <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
        <li>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/pvp" style={{ color: "white", textDecoration: "none" }}>
            PvP Compendium
          </Link>
        </li>
        <li>
          <Link
            to="/shiny-hunt"
            style={{ color: "white", textDecoration: "none" }}
          >
            Shiny Showcase
          </Link>
        </li>
        <li>
          <Link
            to="/journey"
            style={{ color: "white", textDecoration: "none" }}
          >
            Journey Journal
          </Link>
        </li>
      </ul>
    </nav>
  );
}
