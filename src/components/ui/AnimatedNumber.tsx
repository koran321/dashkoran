'use client'

import { useMotionValue, useSpring, motion, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

export function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(value) {
        setDisplayValue(Math.round(value))
      },
    })
    return () => controls.stop()
  }, [value])

  return <motion.span>{displayValue.toLocaleString()}</motion.span>
}
