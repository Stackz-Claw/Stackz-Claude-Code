import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MoneyCounter({ target, prefix = '$', suffix = '', className = '', duration = 2000 }) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef()
  const startRef = useRef(Date.now())
  const startValueRef = useRef(0)

  useEffect(() => {
    startRef.current = Date.now()
    startValueRef.current = display

    const animate = () => {
      const elapsed = Date.now() - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress)
      const current = Math.round(startValueRef.current + (target - startValueRef.current) * eased)
      setDisplay(current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target])

  const formatted = new Intl.NumberFormat('en-US').format(display)

  return (
    <motion.span
      key={target}
      className={className}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  )
}
