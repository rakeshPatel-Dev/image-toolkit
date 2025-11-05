import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useReTriggerAnimation = (): void => {
  const location = useLocation();

  useEffect(() => {
    // Wait for page transition animations or preloader
    const timeout = setTimeout(() => {
      // Force scroll + reflow to restart observers used by TextAnimate
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("scroll"));

      // Manually reset Framer Motion elements that use intersection observers
      const els = document.querySelectorAll("[data-motion-id]");
      els.forEach((el) => {
        el.classList.remove("motion-safe");
        void el.clientHeight; // force reflow
        el.classList.add("motion-safe");
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [location.pathname]);
};
