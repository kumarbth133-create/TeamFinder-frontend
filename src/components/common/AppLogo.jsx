import logo from "../../assets/logo.png";

/**
 * AppLogo — reusable TeamUp logo icon component
 * Cleanly centered, properly scaled without cutting off or zooming.
 * @param {string} size - "xs" | "sm" | "md" | "lg" | "xl"
 * @param {string} className - extra tailwind classes
 */
const AppLogo = ({ size = "md", className = "" }) => {
  const containerSizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const sizeClass = containerSizes[size] || "w-10 h-10";

  return (
    <div
      className={`${sizeClass} flex items-center justify-center flex-shrink-0 relative ${className}`}
      title="TeamUp Logo"
    >
      <img
        src={logo}
        alt="TeamUp Logo"
        className="w-full h-full object-contain pointer-events-none select-none drop-shadow-xs"
      />
    </div>
  );
};

export default AppLogo;

