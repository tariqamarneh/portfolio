"use client";

import { MotionConfig } from "motion/react";

// With reducedMotion="user", Motion drops transform animations and keeps opacity fades.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
