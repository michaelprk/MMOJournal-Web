import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Route } from "./+types/root";
import "./app.css";

import { Navbar } from "./components/Navbar";
import { AuthBar } from "./components/AuthBar";
import { AuthProvider } from "./contexts/AuthContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
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
  const showNavbar = location.pathname !== "/login" && location.pathname !== "/create-account";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, minHeight: "100vh", position: "relative" }}>
        <AuthProvider>
        {/* Background video container (replaces static image) */}
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: location.pathname === "/damage-calc" && plainDamageCalcBg ? "none" : "block",
            filter:
              location.pathname === "/login" || location.pathname === "/create-account"
                ? "grayscale(50%) brightness(80%) contrast(95%) blur(4px)"
                : "grayscale(70%) brightness(40%) contrast(90%) blur(1px)",
            zIndex: -1,
            pointerEvents: "none",
          }}
        >
          {/* MP4 default source - Snowpoint background */}
              {/* Background assets live under /public/images/backgrounds/ for future rotations. */}
              {/* Example alternate: /images/backgrounds/recording-2025-08-10-004639.mp4 */}
              <source src="/images/Snowpoint.mp4" type="video/mp4" />
        </video>

        {showNavbar && <Navbar />}
        <AuthBar />

        {/* Main content */}
        <main
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            backgroundColor:
              location.pathname === "/login" ||
              location.pathname === "/create-account" ||
              location.pathname === "/" ||
              location.pathname === "/pvp" ||
              location.pathname === "/shiny-hunt" ||
              location.pathname === "/journal" ||
              location.pathname === "/damage-calc"
            ? "transparent"
            : "rgba(0,0,0,0.7)",
            paddingTop: showNavbar ? "200px" : "0", // Add padding to account for fixed navbar
            paddingBottom: "2rem",
            backdropFilter: "none", // Ensure no blur effect on content
          }}
        >
          {children}
        </main>

        <footer style={{ position: "relative", zIndex: 1 }}>{/* Optional footer */}</footer>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
