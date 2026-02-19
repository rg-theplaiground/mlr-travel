
"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

interface ScrollFlyInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode; // Initial content (Welcome Text)
  revealContent?: React.ReactNode; // Content to show after plane (Logo)
  imageUrl: string;
  imageAlt?: string;
}

const ScrollFlyIn = React.forwardRef<HTMLDivElement, ScrollFlyInProps>(
  ({ children, revealContent, imageUrl, imageAlt = "Animated image", className, ...props }, ref) => {
    const targetRef = React.useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start start", "end end"],
    });

    // --- Animation Timeline (0.0 to 1.0 scroll progress) ---
    
    // 1. Initial Text: Fades out quickly [0.0 - 0.2]
    const textOpacity = useTransform(scrollYProgress, [0.05, 0.25], [1, 0]);
    const textScale = useTransform(scrollYProgress, [0.05, 0.25], [1, 0.9]);
    const textBlur = useTransform(scrollYProgress, [0.05, 0.25], ["0px", "10px"]);

    // 2. Plane: Flies from left to right [0.2 - 0.6]
    // Using -120vw to 120vw ensures it starts/ends completely off-screen
    const planeX = useTransform(scrollYProgress, [0.15, 0.65], ["-120vw", "120vw"]);
    
    // 3. Reveal Content: Fades in after plane clears [0.6 - 0.8]
    const revealOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
    const revealScale = useTransform(scrollYProgress, [0.6, 0.8], [0.9, 1]);
    const revealY = useTransform(scrollYProgress, [0.6, 0.8], [50, 0]);

    return (
      <div ref={targetRef} className={cn("relative h-[400vh] bg-stone-50", className)} {...props}>
        {/* Sticky container holds the stage fixed while user scrolls "time" */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* Layer 1: Initial Text (Absolute centered) */}
          <motion.div 
            style={{ opacity: textOpacity, scale: textScale, filter: `blur(${textBlur})` }} 
            className="absolute inset-0 flex items-center justify-center z-10 p-4"
          >
            {children}
          </motion.div>

          {/* Layer 2: Plane (Absolute, flies across) */}
          <motion.div 
            style={{ x: planeX }} 
            className="absolute top-1/2 left-0 -translate-y-1/2 z-20 w-full flex items-center justify-center pointer-events-none will-change-transform"
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-[90vw] md:w-[60vw] max-w-none h-auto object-contain drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>

          {/* Layer 3: Reveal Content (Absolute centered, appears last) */}
          <motion.div
            style={{ opacity: revealOpacity, scale: revealScale, y: revealY }}
            className="absolute inset-0 flex items-center justify-center z-10 p-4 pointer-events-auto"
          >
             {revealContent}
          </motion.div>

        </div>
      </div>
    );
  }
);

ScrollFlyIn.displayName = "ScrollFlyIn";

export { ScrollFlyIn };
