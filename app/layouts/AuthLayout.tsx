import { Outlet } from "react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ScrollToTop } from "../components/ScrollToTop";

export function AuthLayout() {
  return (
    <AuthProvider>
      <ScrollToTop />
      {/* Minimal auth layout with no global chrome, navbar, or footer */}
      <main style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
    </AuthProvider>
  );
}
