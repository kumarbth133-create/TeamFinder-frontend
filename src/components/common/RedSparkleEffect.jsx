import { useEffect } from "react";

/**
 * RedSparkleEffect Component
 * Spawns dynamic glowing crimson red particle sparkles wherever the user clicks!
 */
const RedSparkleEffect = () => {
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Create sparkle particles count
      const particleCount = 10;
      const colors = ["#ca0019", "#ff2e48", "#f43f5e", "#ff4d6d", "#fb7185", "#ffd1d7"];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "red-sparkle-particle";

        // Randomize direction and distance
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
        const velocity = 25 + Math.random() * 45;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 15; // slightly upward bias
        const scale = 0.5 + Math.random() * 0.8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.floor(6 + Math.random() * 10);

        // Styling the sparkle particle
        Object.assign(particle.style, {
          position: "fixed",
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          borderRadius: "50%",
          boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 3}px ${color}`,
          pointerEvents: "none",
          zIndex: "99999",
          transform: "translate(-50%, -50%) scale(1)",
          transition: "transform 0.65s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.65s ease-out",
          opacity: "1",
        });

        document.body.appendChild(particle);

        // Animate frame
        requestAnimationFrame(() => {
          particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale}) rotate(${Math.random() * 180}deg)`;
          particle.style.opacity = "0";
        });

        // Clean up DOM after animation completes
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 700);
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return null;
};

export default RedSparkleEffect;
