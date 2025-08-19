import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { AuthBar } from "../components/AuthBar";
import { Footer } from "../components/layout/Footer";
import { ScrollToTop } from "../components/ScrollToTop";

export default function MainLayout() {
  const location = useLocation();
  const [plainDamageCalcBg, setPlainDamageCalcBg] = useState(false);
  
  // Measure navbar height and expose as CSS variable --nav-h
  useEffect(() => {
    const root = document.documentElement;
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    if (!navbar) {
      try { root.style.setProperty('--nav-h', '0px'); } catch {}
      return;
    }
    const apply = () => {
      try { root.style.setProperty('--nav-h', `${navbar.offsetHeight}px`); } catch {}
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(navbar);
    window.addEventListener('resize', apply);
    return () => {
      try { ro.disconnect(); } catch {}
      window.removeEventListener('resize', apply);
    };
  }, []);

  // Measure footer height and expose as CSS variable --footer-h so pages can reserve space at bottom
  useEffect(() => {
    const root = document.documentElement;
    const footer = document.querySelector('footer') as HTMLElement | null;
    if (!footer) {
      try { root.style.setProperty('--footer-h', '0px'); } catch {}
      return;
    }
    const apply = () => {
      try { root.style.setProperty('--footer-h', `${footer.offsetHeight}px`); } catch {}
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(footer);
    window.addEventListener('resize', apply);
    return () => {
      try { ro.disconnect(); } catch {}
      window.removeEventListener('resize', apply);
      try { root.style.removeProperty('--footer-h'); } catch {}
    };
  }, []);

  // TEMP DIAGNOSTIC (to be removed after verification)
  // useEffect(() => { console.log('[MAIN_LAYOUT] mounted'); }, []);

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
            location.pathname === "/pvp/teams" ||
            location.pathname === "/shiny-hunt" ||
            location.pathname === "/journal" ||
            location.pathname === "/damage-calc"
              ? "transparent"
              : "rgba(0,0,0,0.7)",
          // Reserve space for the navbar globally so content never underlaps
          paddingTop: 'var(--nav-h)',
          paddingBottom: 0,
          backdropFilter: "none",
        }}
      >
        <Outlet />
      </main>

      {/* Footer rendered once by layout except on routes with in-pane footer */}
      {!(location.pathname === "/pvp" || location.pathname === "/shiny-hunt") && <Footer />}
    </div>
  );
}
