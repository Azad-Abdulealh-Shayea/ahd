"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";

const softEase = [0.22, 1, 0.36, 1] as const;

export const motionTransition = {
  duration: 0.36,
  ease: softEase,
};

export const pageStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTransition,
  },
};

export const softScale: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: motionTransition,
  },
};

export const subtleListItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: softEase },
  },
};

export const heightReveal = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.34, ease: softEase },
      opacity: { duration: 0.2, ease: softEase },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.24, ease: softEase },
      opacity: { duration: 0.16, ease: softEase },
    },
  },
} as const;

export function AhdMotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={motionTransition}>
      {children}
    </MotionConfig>
  );
}

export function MotionPage({
  className,
  children,
  ...props
}: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageStagger}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionMain({
  className,
  children,
  ...props
}: ComponentProps<typeof motion.main>) {
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageStagger}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.main>
  );
}

export function MotionSection({
  className,
  children,
  variants = fadeUp,
  ...props
}: ComponentProps<typeof motion.section>) {
  return (
    <motion.section
      variants={variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function MotionListItem({
  className,
  children,
  ...props
}: ComponentProps<typeof motion.article>) {
  return (
    <motion.article variants={subtleListItem} className={cn(className)} {...props}>
      {children}
    </motion.article>
  );
}

export { AnimatePresence, motion };
