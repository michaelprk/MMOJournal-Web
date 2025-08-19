import { Outlet } from "react-router";
import { Footer } from "../components/layout/Footer";
import { ScrollToTop } from "../components/ScrollToTop";

export default function AuthLayout() {
  return (
    <div style={{ margin: 0, minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
      <ScrollToTop />
      {/* Auth content */}
      <main style={{ position: "relative", zIndex: 1, flex: 1, minHeight: 0 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
