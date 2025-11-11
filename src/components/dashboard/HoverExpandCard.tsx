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
  const [isScrolling, setIsScrolling] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect scrolling in parent container
  useEffect(() => {
    const scrollContainer = cardRef.current?.closest('.overflow-y-auto');
    
    const handleScroll = () => {
      // Immediately close any hovered card
      if (hovered) {
        setHovered(false);
        setRect(null);
      }
      
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Allow hovering again after scroll stops
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

  // Handle wheel event - allow scrolling and close card
  const handleWheel = (e: React.WheelEvent) => {
    if (hovered) {
      setHovered(false);
      setRect(null);
    }
    // Don't prevent default - allow scroll to propagate
  };

  return (
    <>
      {/* Placeholder (keeps layout intact) */}
      <div
        ref={cardRef}
        onMouseEnter={() => {
          if (!isScrolling) {
            setHovered(true);
          }
        }}
        onWheel={handleWheel}
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
              width: rect.width + 10,
              scale: 1.01,
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