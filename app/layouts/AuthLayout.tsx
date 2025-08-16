import { Outlet } from "react-router";
import { ScrollToTop } from "../components/ScrollToTop";

export default function AuthLayout() {
  return (
    <>
      <ScrollToTop />
      {/* Minimal auth layout with no global chrome, navbar, or footer */}
      <main style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
    </>
  );
}
