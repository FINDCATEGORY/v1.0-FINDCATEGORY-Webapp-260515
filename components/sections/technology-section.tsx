"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function ScrollRevealText({ text }: { text: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Slower animation - more viewport range
      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.1;
      
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      
      const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lines = text.split("\n");
  
  return (
    <p
      ref={containerRef}
      className="text-2xl leading-snug text-white md:text-4xl lg:text-4xl text-center"
      style={{ whiteSpace: "pre-line" }}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        const lineProgress = Math.max(0, Math.min(1, progress * lines.length - lineIndex));

        return (
          <span key={lineIndex} className="block">
            {words.map((word, index) => {
              const appearProgress = lineProgress * (words.length + 1);
              const wordAppearProgress = Math.max(0, Math.min(1, appearProgress - index));
              const wordOpacity = wordAppearProgress;
              const wordBlur = (1 - wordAppearProgress) * 40;

              return (
                <span
                  key={index}
                  className="inline-block"
                  style={{
                    opacity: wordOpacity,
                    filter: `blur(${wordBlur}px)`,
                    transition: 'opacity 0.1s linear, filter 0.1s linear',
                    marginRight: '0.3em',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </span>
        );
      })}
    </p>
  );
}

const sideImages = [
  {
    src: "/images/04gallery05.jpg",
    alt: "Interior view with landscape",
    position: "left",
  },
  {
    src: "/images/04gallery06.jpg",
    alt: "Rusted metal texture",
    position: "right",
  },
];

const textCycles = [
  "Life & Scenario",
  "Business Store",
  "   ",
];

export function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textProgress, setTextProgress] = useState(0);
  
  const descriptionText = `Lifestyle Business Store 
FINDCATEGORYⓇ
`;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 1; // Increased for 3 text cycles
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      
      setScrollProgress(progress);

      // Text scroll progress
      if (textSectionRef.current) {
        const textRect = textSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const startOffset = windowHeight * 0.9;
        const endOffset = windowHeight * 0.1;
        
        const totalDistance = startOffset - endOffset;
        const currentPosition = startOffset - textRect.top;
        
        const newTextProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
        setTextProgress(newTextProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Title fades out first (0 to 0.2)
  const titleOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  
  // Image transforms start after title fades (0.2 to 1)
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.1));
  
  // Smooth interpolations
  const centerWidth = 100 - (imageProgress * 60); // 100% to 42%
  const centerHeight = 100 - (imageProgress * 70); // 100% to 70%
  const sideWidth = imageProgress * 30; // 0% to 22%
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100); // -100% to 0%
  const sideTranslateRight = 100 - (imageProgress * 100); // 100% to 0%
  const gap = imageProgress * 10; // 0px to 16px

  // Calculate grayscale for text section based on textProgress
  const grayscaleAmount = Math.round((1 - textProgress) * 100);

  return (
    <section ref={sectionRef} className="relative bg-[#171717]]">
      {/* Sticky container for scroll animation */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          {/* Bento Grid Container */}
          <div 
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 10}px` }}
          >
            
            {/* Left Column */}
            <div 
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${sideWidth}%`,
                height: "100%",
                transform: `translateX(${sideTranslateLeft}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <Image
                  key={idx}
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
              ))}
            </div>

            {/* Main Center Image */}
            <div 
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${centerWidth}%`,
                height: "100%",
                flex: "1 1 auto",
              }}
            >
              {/* Layered Images - Progressive Fade In */}
              {/* Image 1 - Base layer - Sunrise/Sunset with sun rays */}
              <Image
                src="/images/04gallery01.jpg"
                alt="Modern architecture at sunrise"
                fill
                className="object-cover"
                style={{
                  opacity: scrollProgress < 0.25 ? 1 : 1,
                }}
              />
              
              {/* Image 2 - Daytime scene - Fades in during first text cycle */}
              <Image
                src="/images/04gallery02.jpg"
                alt="Modern architecture in daylight"
                fill
                className="absolute inset-0 object-cover"
                style={{
                  opacity: Math.max(0, Math.min(1, (scrollProgress - 0) / 0.1)),
                  transition: 'opacity 0.3s ease',
                }}
              />
              
              {/* Image 3 - Dusk/Evening - Fades in during second text cycle */}
              <Image
                src="/images/04gallery03.jpg"
                alt="Modern architecture at dusk"
                fill
                className="absolute inset-0 object-cover"
                style={{
                  opacity: Math.max(0, Math.min(1, (scrollProgress - 0.7) / 0.2)),
                  transition: 'opacity 0.3s ease',
                }}
              />
              
              {/* Image 4 - Night with stars - Fades in during third text cycle */}
              <Image
                src="/images/04gallery04.jpg"
                alt="Modern architecture at night"
                fill
                className="absolute inset-0 object-cover"
                style={{
                  opacity: Math.max(0, Math.min(1, (scrollProgress - 0.7) / 0.2)),
                  transition: 'opacity 0.3s ease',
                }}
              />
              
              <div className="absolute inset-0 bg-transparent" />
              
              {/* Title Text - Cycles through 3 texts with blur effect */}
              <div 
                className="absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
              >
                {textCycles.map((text, cycleIndex) => {
                  // Each text cycle takes 1/3 of the scroll progress
                  const cycleStart = cycleIndex / textCycles.length;
                  const cycleEnd = (cycleIndex + 1) / textCycles.length;
                  const cycleMid = (cycleStart + cycleEnd) / 2;
                  
                  const words = text.split(" ");
                  
                  return (
                    <h2 
                      key={cycleIndex}
                      className="absolute z-50max-w-3xl font-light leading-tight tracking-tight text-white md:text-5xl lg:text-7xl text-3xl"
                    >
                      {words.map((word, wordIndex) => {
                        let wordOpacity = 0;
                        let wordBlur = 40;
                        
                        if (scrollProgress >= cycleStart && scrollProgress < cycleEnd) {
                          const localProgress = (scrollProgress - cycleStart) / (cycleEnd - cycleStart);
                          
                          // First half: appear (blur 40→0, opacity 0→1)
                          if (localProgress < 0.5) {
                            const appearProgress = (localProgress / 0.5) * (words.length + 1);
                            const wordAppearProgress = Math.max(0, Math.min(1, appearProgress - wordIndex));
                            wordOpacity = wordAppearProgress;
                            wordBlur = (1 - wordAppearProgress) * 40;
                          } 
                          // Second half: disappear (blur 0→40, opacity 1→0)
                          else {
                            const disappearProgress = ((localProgress - 0.5) / 0.5) * (words.length + 1);
                            const wordDisappearProgress = Math.max(0, Math.min(1, disappearProgress - wordIndex));
                            wordOpacity = 1 - wordDisappearProgress;
                            wordBlur = wordDisappearProgress * 40;
                          }
                        }
                        
                        return (
                          <span
                            key={wordIndex}
                            className="inline-block"
                            style={{
                              opacity: wordOpacity,
                              filter: `blur(${wordBlur}px)`,
                              transition: 'opacity 0.1s linear, filter 0.1s linear',
                              marginRight: '0.3em',
                            }}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </h2>
                  );
                })}
              </div>
            </div>

            {/* Right Column */}
            <div 
              className="relative overflow-hidden will-change-transform"
              style={{
                width: `${sideWidth}%`,
                height: "100%",
                transform: `translateX(${sideTranslateRight}%)`,
                opacity: sideOpacity,
              }}
            >
              {sideImages.filter(img => img.position === "right").map((img, idx) => (
                <Image
                  key={idx}
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll space to enable animation - increased for 3 text cycles */}
      <div className="h-[200vh]" />

      
    </section>
  );
}
