"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const titles = [
  "Lifestyle scenarios for",
  "categories curated by",
  "FINDCATEGORYⓇ, built to last.",
  
];

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const updateScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrolled = -rect.top;
    const scrollableRange = sectionRef.current.offsetHeight - window.innerHeight;
    setProgress(Math.max(0, Math.min(1, scrolled / scrollableRange)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener("scroll", updateScroll);
  }, [updateScroll]);

  return (
    <section ref={sectionRef} style={{ height: "300vh" }}>
      <div 
        className="sticky top-0" 
        style={{ 
          position: "sticky", 
          top: 0, 
          height: "100vh", 
          perspective: "1000px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "150px", transformStyle: "preserve-3d" }}>
          {titles.map((title, i) => {
            const segment = 1 / titles.length;
            const start = i * segment;
            const end = (i + 1) * segment;
            
            let rotateX = 90;
            let opacity = 0;

            if (progress >= start && progress < end) {
              const localProgress = (progress - start) / segment;
              rotateX = (1 - localProgress) * 90;
              opacity = localProgress;
            } else if (progress >= end) {
              rotateX = i === titles.length - 1 ? 0 : -90;
              opacity = i === titles.length - 1 ? 1 : 0;
            }

            return (
              <h2 key={i} style={{
                position: "absolute", 
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center", 
                fontSize: "6vw",
                fontWeight: "medium",
                transform: `rotateX(${rotateX}deg)`, 
                opacity, 
                backfaceVisibility: "hidden",
                transition: "transform 0.1s ease-out"
              }}>
                {title}
              </h2>
            );
          })}
        </div>
      </div>
    </section>
  );
}