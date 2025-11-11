import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function HoverExpandCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [expandDirection, setExpandDirection] = useState<"down" | "right">("down");
  const cardRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hovered && cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      setRect(cardRect);
      
      // Calculate if card would overflow viewport when expanded downward
      // Estimate expanded height (original height + expansion content ~200-250px)
      const estimatedExpandedHeight = cardRect.height + 250;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - cardRect.bottom;
      
      // If not enough space below, expand to the right
      if (spaceBelow < estimatedExpandedHeight - cardRect.height) {
        setExpandDirection("right");
      } else {
        setExpandDirection("down");
      }
    }
  }, [hovered]);

  useEffect(() => {
    if (!hovered || !rect) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!rect) return;

      // Adjust detection area based on expansion direction
      let isOutside = false;
      
      if (expandDirection === "down") {
        isOutside = 
          e.clientX < rect.left - 20 ||
          e.clientX > rect.right + 20 ||
          e.clientY < rect.top - 20 ||
          e.clientY > rect.bottom + 270; // Account for expanded height
      } else {
        isOutside = 
          e.clientX < rect.left - 20 ||
          e.clientX > rect.right + rect.width + 30 || // Account for side expansion
          e.clientY < rect.top - 20 ||
          e.clientY > rect.bottom + 20;
      }

      if (isOutside) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hovered, rect, expandDirection]);

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
      {hovered &&
        rect &&
        createPortal(
          <motion.div
            ref={floatingRef}
            onMouseLeave={() => setHovered(false)}
            initial={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              position: "fixed",
              zIndex: 50,
            }}
            animate={{
              top: rect.top - 5,
              left: rect.left - 5,
              width: expandDirection === "right" ? rect.width * 2 + 20 : rect.width + 10,
              scale: 1.01,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-xl shadow-2xl overflow-visible pointer-events-auto"
          >
            <div className="w-full h-auto" data-expand-direction={expandDirection}>
              {children}
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}