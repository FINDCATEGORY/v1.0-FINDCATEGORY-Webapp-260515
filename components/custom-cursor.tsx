"use client";

import { useEffect, useState, useRef } from "react";

interface Ripple {
  id: string;
  x: number;
  y: number;
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isMobileDevice, setIsMobileDevice] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const handleDeviceChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileDevice(!e.matches);
    };
    
    handleDeviceChange(mediaQuery);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleDeviceChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleDeviceChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || isMobileDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mounted, isMobileDevice]);

  useEffect(() => {
    if (!mounted) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const id = Math.random().toString(36).substring(2, 9);
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };

    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        /* Hide native cursor on PC */
        @media (pointer: fine) {
          html, body, a, button, input, select, textarea, [role="button"] {
            cursor: none !important;
          }
        }
        
        @keyframes ripple-pc {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.0);
            opacity: 0;
          }
        }
        
        .ripple-pc-wave {
          animation: ripple-pc 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>

      {/* PC Custom Cursor */}
      {!isMobileDevice && (
        <div
          ref={cursorRef}
          className={`pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out ${
            isClicking ? "scale-90" : isHovered ? "scale-125" : "scale-100"
          }`}
          style={{
            left: "-100px",
            top: "-100px",
          }}
        >
          <div className="relative flex h-10 w-10 items-center justify-center">
            {/* Outer pulsating circle */}
            <div className="absolute h-full w-full animate-ping rounded-full bg-[#1A1A1A]/20" />
            {/* Inner solid circle */}
            <div className={`h-4 w-4 rounded-full bg-[#1A1A1A] transition-colors duration-200 ${isHovered ? "bg-[#1A1A1A]/80" : ""}`} />
          </div>
        </div>
      )}

      {/* PC Click Ripples */}
      {!isMobileDevice &&
        ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="ripple-pc-wave pointer-events-none fixed z-[99998] h-10 w-10 rounded-full border-2 border-[#1A1A1A] opacity-75"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}

      {/* Mobile Click/Touch Ripples */}
      {isMobileDevice &&
        ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          >
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 animate-ping rounded-full border-4 border-[#1A1A1A] opacity-75" />
              <div className="absolute inset-2 animate-ping rounded-full border-2 border-[#1A1A1A] opacity-50 [animation-delay:0.2s]" />
            </div>
          </div>
        ))}
    </>
  );
}
