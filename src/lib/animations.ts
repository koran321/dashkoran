import { Variants } from 'framer-motion'

export const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export const tabVariants: Variants = {
  initial: { opacity: 0, x: 20, filter: 'blur(6px)' },
  animate: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    x: -20, 
    filter: 'blur(6px)',
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
  }
}

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const modalPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 40 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 26 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.94, 
    y: 20,
    transition: { duration: 0.2 }
  }
}

export const shakeVariants: Variants = {
  shake: {
    x: [0, -12, 12, -8, 8, 0],
    transition: { duration: 0.4 }
  }
}

export const textSwapVariants: Variants = {
  initial: { opacity: 0, y: -8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    y: 8,
    transition: { duration: 0.2 }
  }
}
