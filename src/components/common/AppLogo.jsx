import logo from "../../assets/logo.png";

/**
 * AppLogo — reusable TeamUp logo icon component
 * Cleanly centered, properly scaled without cutting off or zooming.
 * @param {string} size - "xs" | "sm" | "md" | "lg" | "xl"
 * @param {string} className - extra tailwind classes
 */
const AppLogo = ({ size = "md", className = "" }) => {
  const containerSizes = {
    xs: "w-6 h-6 rounded-lg",
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
    xl: "w-16 h-16 rounded-2xl",
  };

  const sizeClass = containerSizes[size] || "w-10 h-10 rounded-xl";

  return (
    <div
      className={`${sizeClass} bg-white border border-[#ca0019]/40 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0 relative ${className}`}
      title="TeamUp Logo"
    >
      <img
        src={logo}
        alt="TeamUp Logo"
        className="w-full h-full object-contain scale-[1.45] transform origin-center pointer-events-none select-none"
      />
    </div>
  );
};

export default AppLogo;

