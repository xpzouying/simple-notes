import { useState, useEffect } from "react";
import { NotePanel } from "./components/NotePanel";
import "./styles/globals.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div className={`app ${isDarkMode ? "dark" : ""}`}>
      <NotePanel />
    </div>
  );
}

export default App;