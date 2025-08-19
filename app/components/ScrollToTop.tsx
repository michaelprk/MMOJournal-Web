import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    // Always scroll to top on route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // Also reset any route-level scroll panes if present
    try {
      const panes = document.querySelectorAll('[data-route-scrollpane="true"]');
      panes.forEach((el) => {
        (el as HTMLElement).scrollTop = 0;
      });
    } catch {}
  }, [location.pathname, location.search, location.hash]);

  return null;
}
