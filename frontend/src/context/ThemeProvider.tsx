import React, { useEffect, useState } from "react";
import {
  ThemeContext,
  type Theme,
} from "./ThemeContext";

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("blogweb_theme") as Theme | null;

    if (saved === "light" || saved === "dark") {
      return saved;
    }

    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("blogweb_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) =>
      prev === "dark" ? "light" : "dark"
    );
  };

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};