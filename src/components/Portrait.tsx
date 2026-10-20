"use client";

import { motion } from "motion/react";
import Image from "next/image";
import portrait from "../../public/images/tariq-portrait.png";
import { profile } from "@/content/profile";

const ease = [0.23, 1, 0.32, 1] as const;

// The photo box is 125% of the frame's width and bottom-aligned, so the circle
// (the frame's width, sitting on its bottom edge) maps to these mask coordinates.
const photoScale = 1.25;
const photoAspect = portrait.height / portrait.width;
const radiusX = 50 / photoScale; // % of photo width
const radiusY = 50 / (photoScale * photoAspect); // % of photo height
const centerY = 100 - radiusY;
// Above this line (the collar) the photo shows unclipped, so the head rises out of the circle.
const headLine = 36;

const mask = [
  `radial-gradient(${radiusX}% ${radiusY}% at 50% ${centerY}%, #000 99.5%, transparent 100%)`,
  `linear-gradient(to bottom, #000 ${headLine}%, transparent ${headLine}%)`,
].join(", ");

export function Portrait({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease }}
      className={`relative aspect-[1/1.22] ${className}`}
    >
      <div
        className="absolute inset-x-0 bottom-0 aspect-square rounded-full bg-ink-3"
        aria-hidden
      />
      <div
        className="absolute bottom-0"
        style={{
          left: `${-((photoScale - 1) / 2) * 100}%`,
          width: `${photoScale * 100}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        <Image
          src={portrait}
          alt={`Portrait of ${profile.name}`}
          sizes="(min-width: 1024px) 420px, 70vw"
          className="block h-auto w-full"
        />
      </div>
    </motion.div>
  );
}
