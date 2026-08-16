import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme mode"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm border ${
        isDark
          ? "bg-dark-800/80 hover:bg-dark-750 text-primary-300 border-primary-600/30 hover:border-primary-500/60 shadow-dark-950/20"
          : "bg-white/90 hover:bg-white text-primary-700 border-primary-400 hover:border-primary-600 shadow-gray-200/80"
      } backdrop-blur-md cursor-pointer group active:scale-95 ${className}`}
    >
      <span className="relative flex items-center justify-center w-5 h-5 rounded-full transition-transform duration-300">
        {isDark ? (
          <FiSun className="w-4 h-4 text-amber-400 transform group-hover:rotate-45 transition-transform duration-300" />
        ) : (
          <FiMoon className="w-4 h-4 text-primary-500 transform group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </span>
      <span className="hidden sm:inline-block">
        {isDark ? "" : ""}
      </span>
    </button>
  );
};

export default ThemeToggle;
