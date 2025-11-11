// HoverExpandCard.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface HoverExpandCardProps {
  children: React.ReactNode;
  onScrollContainer?: () => void;
}

export default function HoverExpandCard({
  children,
  onScrollContainer,
}: HoverExpandCardProps) {
  const [hovered, setHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [expandDirection, setExpandDirection] = useState<"down" | "right">("down");
  const [isScrolling, setIsScrolling] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close card when scrolling starts
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      setHovered(false);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    // Listen to scroll on window and parent containers
    window.addEventListener("scroll", handleScroll, true);
    
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Update rect when hovered
  useEffect(() => {
    if (hovered && cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      setRect(cardRect);
      
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

  // Handle mouse movement for closing
  useEffect(() => {
    if (!hovered || !rect) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!rect) return;

      let isOutside = false;
      
      if (expandDirection === "down") {
        isOutside = 
          e.clientX < rect.left - 30 ||
          e.clientX > rect.right + 30 ||
          e.clientY < rect.top - 30 ||
          e.clientY > rect.bottom + 300;
      } else {
        isOutside = 
          e.clientX < rect.left - 30 ||
          e.clientX > rect.right + rect.width + 40 ||
          e.clientY < rect.top - 30 ||
          e.clientY > rect.bottom + 30;
      }

      if (isOutside) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hovered, rect, expandDirection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isScrolling) return;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isScrolling) {
        setHovered(true);
      }
    }, 100);
  }, [isScrolling]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHovered(false);
  }, []);

  // Allow scroll events to pass through
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Don't stop propagation - let the scroll event bubble up
    setHovered(false);
  }, []);

  return (
    <>
      {/* Placeholder (keeps layout intact) */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        className="relative"
      >
        <div className={hovered ? "invisible" : "visible"}>
          {children}
        </div>
      </div>

      {/* Floating expanded card (in portal) */}
      <AnimatePresence>
        {hovered && rect && !isScrolling && (
          createPortal(
            <motion.div
              initial={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                top: rect.top - 5,
                left: rect.left - 5,
                width: expandDirection === "right" ? rect.width * 2 + 20 : rect.width + 10,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
                transition: { duration: 0.15 }
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              style={{ position: "fixed", zIndex: 50 }}
              className="rounded-xl shadow-2xl overflow-visible pointer-events-auto"
              onWheel={(e) => {
                e.stopPropagation();
                setHovered(false);
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