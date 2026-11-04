"use client";

import React, { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  HTMLMotionProps,
} from "framer-motion";

export interface SpotlightCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
}

export function SpotlightCard({
  children,
  className = "",
  tilt = true,
  style,
  ...motionProps
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Normalized mouse coordinates between 0 and 1, defaulting to center (0.5)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Physics-based spring tilt for high-end micro-interaction (max ±3.5 degrees)
  const rotateXSpring = useSpring(useTransform(mouseY, [0, 1], [3.5, -3.5]), {
    stiffness: 280,
    damping: 24,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [0, 1], [-3.5, 3.5]), {
    stiffness: 280,
    damping: 24,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables directly on DOM for 120fps GPU compositor speed
      card.style.setProperty("--card-mouse-x", `${x}px`);
      card.style.setProperty("--card-mouse-y", `${y}px`);

      if (tilt) {
        mouseX.set(x / rect.width);
        mouseY.set(y / rect.height);
      }
    },
    [tilt, mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.setProperty("--card-spotlight-opacity", "1");
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.setProperty("--card-spotlight-opacity", "0");
    }
    if (tilt) {
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
  }, [tilt, mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt ? rotateXSpring : 0,
        rotateY: tilt ? rotateYSpring : 0,
        transformStyle: "preserve-3d",
        ...(typeof style === "object" ? style : {}),
      }}
      className={`spotlight-card luxury-card relative group ${className}`}
      {...motionProps}
    >
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}
