import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    // Always scroll to top on route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
