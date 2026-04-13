import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="app-layout">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="app-main">{children}</main>
    </div>
  );
}