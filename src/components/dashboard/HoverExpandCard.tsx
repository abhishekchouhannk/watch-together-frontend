import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

type ExpansionDirection = "down" | "right";

export default function HoverExpandCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [direction, setDirection] = useState<ExpansionDirection>("down");
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hovered && cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      setRect(cardRect);

      // Calculate available space below
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - cardRect.bottom;
      
      // Estimated expanded height (you can adjust this based on your content)
      const estimatedExpandedHeight = 500; // Approximate height when expanded
      
      // If not enough space below (with some padding), expand right
      if (spaceBelow < estimatedExpandedHeight - cardRect.height + 40) {
        setDirection("right");
      } else {
        setDirection("down");
      }
    }
  }, [hovered]);

  useEffect(() => {
    if (!hovered || !rect) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!rect || !contentRef.current) return;

      const expandedRect = contentRef.current.getBoundingClientRect();
      const padding = 20;

      // Check if mouse is outside the expanded card area
      if (
        e.clientX < expandedRect.left - padding ||
        e.clientX > expandedRect.right + padding ||
        e.clientY < expandedRect.top - padding ||
        e.clientY > expandedRect.bottom + padding
      ) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hovered, rect]);

  const getAnimationProps = () => {
    if (!rect) return {};

    const baseProps = {
      initial: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        position: "fixed" as const,
        zIndex: 50,
      },
    };

    if (direction === "down") {
      return {
        ...baseProps,
        animate: {
          top: rect.top - 5,
          left: rect.left - 5,
          width: rect.width + 10,
          height: "auto",
          scale: 1.01,
        },
      };
    } else {
      // Right expansion
      return {
        ...baseProps,
        animate: {
          top: rect.top - 5,
          left: rect.left - 5,
          width: rect.width * 2 + 20, // Expand to roughly double width
          height: rect.height + 10,
          scale: 1,
        },
      };
    }
  };

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
            ref={contentRef}
            onMouseLeave={() => setHovered(false)}
            {...getAnimationProps()}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-xl shadow-2xl overflow-visible pointer-events-auto"
          >
            <div className="w-full h-full" data-expansion-direction={direction}>
              {children}
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}