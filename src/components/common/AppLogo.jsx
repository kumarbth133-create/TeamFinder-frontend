import logo from "../../assets/logo.png";

/**
 * AppLogo — reusable TeamUp logo icon component
 * Replaces the old "T" letter badge with the handshake image logo.
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} className - extra tailwind classes
 */
const AppLogo = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <img
      src={logo}
      alt="TeamUp Logo"
      className={`${sizes[size]} rounded-xl object-contain bg-white shadow-sm border border-slate-200 dark:border-dark-600 flex-shrink-0 ${className}`}
    />
  );
};

export default AppLogo;
