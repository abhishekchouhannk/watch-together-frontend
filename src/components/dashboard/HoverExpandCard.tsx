import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect scrolling in parent container
  useEffect(() => {
    const scrollContainer = cardRef.current?.closest('.overflow-y-auto');
    
    const handleScroll = () => {
      setIsScrolling(true);
      setHovered(false); // Immediately close on scroll
      
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
  }, []);

  // Update rect position on scroll or resize
  useEffect(() => {
    if (!hovered || !cardRef.current) return;

    const updatePosition = () => {
      if (cardRef.current) {
        const newRect = cardRef.current.getBoundingClientRect();
        setRect(newRect);
      }
    };

    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [hovered]);

  const calculateExpansionDirection = useCallback((cardRect: DOMRect): "down" | "right" => {
    const estimatedExpandedHeight = 300; // Estimated height of expanded content
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - cardRect.bottom;
    
    return spaceBelow < estimatedExpandedHeight ? "right" : "down";
  }, []);

  const handleMouseEnter = () => {
    if (isScrolling) return;
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      setRect(cardRect);
      setExpandDirection(calculateExpansionDirection(cardRect));
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHovered(false);
    setRect(null);
  };

  useEffect(() => {
    if (!hovered || !rect) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!rect) return;

      // More generous boundaries for mouse tracking
      const padding = 30;
      let isOutside = false;
      
      if (expandDirection === "down") {
        const expandedHeight = 320; // Adjust based on actual expanded content
        isOutside = 
          e.clientX < rect.left - padding ||
          e.clientX > rect.right + padding ||
          e.clientY < rect.top - padding ||
          e.clientY > rect.top + rect.height + expandedHeight + padding;
      } else {
        const expandedWidth = rect.width; // Same width as original
        isOutside = 
          e.clientX < rect.left - padding ||
          e.clientX > rect.right + expandedWidth + padding ||
          e.clientY < rect.top - padding ||
          e.clientY > rect.bottom + padding;
      }

      if (isOutside) {
        setHovered(false);
        setRect(null);
      }
    };

    // Small delay before enabling global mouse tracking
    const timeoutId = setTimeout(() => {
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [hovered, rect, expandDirection]);

  // Prevent scroll blocking - allow wheel events to bubble up
  const handleWheel = (e: React.WheelEvent) => {
    // Don't stop propagation - let it bubble to parent container
    setHovered(false);
    setRect(null);
  };

  return (
    <>
      {/* Placeholder (keeps layout intact) */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        className="relative"
        style={{ pointerEvents: isScrolling ? 'none' : 'auto' }}
      >
        {hovered ? (
          <div className="invisible h-full w-full">{children}</div>
        ) : (
          children
        )}
      </div>

      {/* Floating expanded card (in portal) */}
      <AnimatePresence>
        {hovered && rect && (
          createPortal(
            <motion.div
              onMouseLeave={handleMouseLeave}
              onWheel={handleWheel}
              initial={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                position: "fixed",
                zIndex: 9999,
                opacity: 0,
              }}
              animate={{
                top: rect.top - 5,
                left: rect.left - 5,
                width: rect.width + 10,
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                opacity: { duration: 0.15 }
              }}
              className="rounded-xl shadow-2xl overflow-visible pointer-events-auto"
              style={{
                pointerEvents: 'auto',
              }}
            >
              <div 
                className="w-full h-auto" 
                data-expand-direction={expandDirection}
              >
                {children}
              </div>
            </motion.div>,
            document.body
          )
        )}
      </AnimatePresence>
    </>
  );
}