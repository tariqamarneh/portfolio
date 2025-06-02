'use client'
import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const ScrollAnimation = ({ children, className = "", delay = 0 }: ScrollAnimationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const y = useTransform(scrollYProgress,
    [0, 0.2, 0.8, 1],
    [50, 0, 0, -50]
  );

  const scale = useTransform(scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        y,
        scale,
        willChange: "transform, opacity",
        transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
