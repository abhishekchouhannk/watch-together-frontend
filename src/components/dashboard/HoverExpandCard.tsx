import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function HoverExpandCard({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hovered && cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  }, [hovered]);

  useEffect(() => {
  if (!hovered || !rect) return;

  const handleMouseMove = (e: MouseEvent) => {
    if (!rect) return;

    // If the mouse is outside the floating card area → close it
    if (
      e.clientX < rect.left - 20 ||
      e.clientX > rect.right + 20 ||
      e.clientY < rect.top - 20 ||
      e.clientY > rect.bottom + 20
    ) {
      setHovered(false);
    }
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, [hovered, rect]);

  return (
    <>
      {/* Placeholder (keeps layout intact) */}
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        className="relative"
      >
        {hovered ? (
          // Transparent skeleton placeholder
          <div className="invisible h-full w-full">{children}</div>
        ) : (
          children
        )}
      </div>

      {/* Floating expanded card (in portal) */}
      {hovered && rect &&
  createPortal(
    <motion.div
      onMouseLeave={() => setHovered(false)}
      initial={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        position: "fixed",
        zIndex: 50,
      }}
      animate={{
        top: rect.top - 20,
        left: rect.left - 20,
        width: rect.width + 40,
        // remove height here — let content decide
        scale: 1.05,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="rounded-xl shadow-2xl overflow-visible pointer-events-auto"
    >
      <div className="w-full h-auto">{children}</div>
    </motion.div>,
    document.body
  )}
    </>
  );
}
