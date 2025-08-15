import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BackgroundProvider } from "./contexts/BackgroundContext";
import { BackgroundLayer } from "./components/layout/BackgroundLayer";

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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
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

  const hideBackground = location.pathname === "/damage-calc" && plainDamageCalcBg;

  return (
    <AuthProvider>
      <BackgroundProvider>
        <div style={{ display: hideBackground ? "none" : "block" }}>
          <BackgroundLayer />
        </div>
        <Outlet />
      </BackgroundProvider>
    </AuthProvider>
  );
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