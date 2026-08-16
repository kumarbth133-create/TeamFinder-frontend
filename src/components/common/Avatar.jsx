import { useState, useEffect } from "react";

const Avatar = ({ src, name, size = "md", className = "" }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  const getInitials = (n) => {
    if (!n) return "?";
    return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  };

  const imageSrc = src && src.startsWith("/uploads") ? src : src;

  if (imageSrc && !imgError) {
    return (
      <img
        src={imageSrc}
        alt={name || "avatar"}
        className={`${sizes[size]} rounded-full object-cover border-2 border-primary-500/40 flex-shrink-0 shadow-sm ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center font-extrabold flex-shrink-0 shadow-sm ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
