import { useEffect } from "react";

export default function CalcRedirect() {
  useEffect(() => {
    // Client-side redirect for SPA mode
    window.location.href = "/pokemmo-damage-calc/index.html?gen=5";
  }, []);

  return null;
}



