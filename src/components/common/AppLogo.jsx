import logo from "../../assets/logo.png";

/**
 * AppLogo — reusable TeamUp logo icon component
 * Uses the exact original logo image file zoomed & cropped to fit the container box.
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} className - extra tailwind classes
 */
const AppLogo = ({ size = "md", className = "" }) => {
  const containerSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`${containerSizes[size]} rounded-xl bg-white border border-[#ca0019]/30 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0 relative ${className}`}
      title="TeamUp Logo"
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {/* Shifted lower down (translate-y-[32%]) and rightward (translate-x-[6%]) */}
        <img
          src={logo}
          alt="TeamUp Logo"
          className="w-full h-full object-contain scale-[3.3] translate-x-[6%] translate-y-[32%] transform origin-center transition-transform"
        />
      </div>
    </div>
  );
};

export default AppLogo;
