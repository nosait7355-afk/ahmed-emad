"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/** Shared easing — matches `--ease-out` in globals.css. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Fades and lifts its children into place the first time they scroll into
 * view. Use `delay` (seconds) to stagger siblings. Honors the user's
 * reduced-motion setting through the app-level MotionConfig.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
