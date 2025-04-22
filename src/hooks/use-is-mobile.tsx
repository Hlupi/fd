import { useState, useEffect } from "react";

export const useIsMobile = (breakpointEm = 37.5) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getRemInPx = () =>
      parseFloat(getComputedStyle(document.documentElement).fontSize);

    const checkScreenSize = () => {
      const remInPx = getRemInPx();
      const breakpointPx = breakpointEm * remInPx;
      setIsMobile(window.innerWidth < breakpointPx);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [breakpointEm]);

  return isMobile;
};
