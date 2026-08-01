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
    <section ref={sectionRef} style={{ height: "200vh" }}>
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

            const isLast = i === titles.length - 1;

            if (progress >= start && progress < end) {
              const localProgress = (progress - start) / segment;

              if (localProgress < 0.3) {
                // Animate in (first 30% of segment)
                const inProgress = localProgress / 0.3;
                rotateX = (1 - inProgress) * 90;
                opacity = inProgress;
              } else if (localProgress < 0.8 || isLast) {
                // Hold (middle 50% of segment)
                rotateX = 0;
                opacity = 1;
              } else {
                // Animate out (last 20% of segment)
                const outProgress = (localProgress - 0.8) / 0.2;
                rotateX = -outProgress * 90;
                opacity = 1 - outProgress;
              }
            } else if (progress >= end) {
              rotateX = isLast ? 0 : -90;
              opacity = isLast ? 1 : 0;
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