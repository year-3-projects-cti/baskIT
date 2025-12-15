import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.classList.add("page-transition-active");
    const timeout = window.setTimeout(() => {
      document.body.classList.remove("page-transition-active");
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  return null;
};
