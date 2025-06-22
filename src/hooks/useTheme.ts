"use client";

import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        const isDarkMode =
          window.matchMedia("(prefers-color-scheme: dark)").matches ||
          document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
      }
    };

    checkTheme();

    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const observer = new MutationObserver(checkTheme);

    mediaQuery.addEventListener("change", checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mediaQuery.removeEventListener("change", checkTheme);
      observer.disconnect();
    };
  }, []);

  return isDark;
}
