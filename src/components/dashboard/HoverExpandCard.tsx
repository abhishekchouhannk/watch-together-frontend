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
  const [isScrolling, setIsScrolling] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect scrolling in parent container - close hover on scroll
  useEffect(() => {
    const scrollContainer = cardRef.current?.closest('.overflow-y-auto');
    
    const handleScroll = () => {
      // Immediately close hover state when scrolling
      if (hovered) {
        setHovered(false);
        setRect(null);
      }
      
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [hovered]);

  useEffect(() => {
    if (hovered && cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      setRect(cardRect);
      
      // Calculate if card would overflow viewport when expanded downward
      const estimatedExpandedHeight = cardRect.height + 250;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - cardRect.bottom;
      
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

      let isOutside = false;
      
      if (expandDirection === "down") {
        isOutside = 
          e.clientX < rect.left - 20 ||
          e.clientX > rect.right + 20 ||
          e.clientY < rect.top - 20 ||
          e.clientY > rect.bottom + 270;
      } else {
        isOutside = 
          e.clientX < rect.left - 20 ||
          e.clientX > rect.right + rect.width + 30 ||
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

  // Handle wheel events - close hover and allow scroll to propagate
  const handleWheel = (e: React.WheelEvent) => {
    if (hovered) {
      setHovered(false);
      setRect(null);
    }
    // Don't stop propagation - let scroll bubble up to container
  };

  const handleMouseEnter = () => {
    // Don't open hover if currently scrolling
    if (isScrolling) return;
    setHovered(true);
  };

  return (
    <>
      {/* Placeholder (keeps layout intact) */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onWheel={handleWheel}
        className="relative"
      >
        {hovered ? (
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
            onMouseLeave={() => setHovered(false)}
            onWheel={handleWheel}
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