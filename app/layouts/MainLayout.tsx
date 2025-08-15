import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { AuthBar } from "../components/AuthBar";
import { Footer } from "../components/layout/Footer";
import { ScrollToTop } from "../components/ScrollToTop";

export function MainLayout() {
  const location = useLocation();
  const [plainDamageCalcBg, setPlainDamageCalcBg] = useState(false);

  useEffect(() => {
    if (location.pathname === "/damage-calc") {
      try {
        const flag = window.localStorage.getItem("damageCalcPlainBg");
        setPlainDamageCalcBg(flag === "true");
      } catch {}
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === "damageCalcPlainBg" && location.pathname === "/damage-calc") {
        setPlainDamageCalcBg(e.newValue === "true");
      }
    };
    const onCustom = (e: Event) => {
      const ce = e as CustomEvent<{ plain: boolean }>;
      if (location.pathname === "/damage-calc") setPlainDamageCalcBg(!!ce.detail?.plain);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("damageCalc:bg", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("damageCalc:bg", onCustom as EventListener);
    };
  }, [location.pathname]);

  return (
    <div style={{ margin: 0, minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
      <ScrollToTop />

      <Navbar />
      <AuthBar />

      {/* Main content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          backgroundColor:
            location.pathname === "/" ||
            location.pathname === "/home" ||
            location.pathname === "/pvp" ||
            location.pathname === "/shiny-hunt" ||
            location.pathname === "/journal" ||
            location.pathname === "/damage-calc"
              ? "transparent"
              : "rgba(0,0,0,0.7)",
          // No padding needed - using fixed scroll containers for /pvp and /shiny-hunt
          paddingTop: 
            location.pathname !== "/pvp" && 
            location.pathname !== "/shiny-hunt" 
              ? "200px" 
              : "0",
          paddingBottom: 0,
          backdropFilter: "none",
        }}
      >
        <Outlet />
      </main>

      {/* Footer only shows on pages that don't have scroll containers */}
      {location.pathname !== "/pvp" && location.pathname !== "/shiny-hunt" && <Footer />}
    </div>
  );
}
