'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'left' | 'right' | 'zoom'
  delay?: number
  threshold?: number
  once?: boolean
}

const transforms = {
  up: 'translateY(30px)',
  left: 'translateX(-30px)',
  right: 'translateX(30px)',
  zoom: 'scale(0.95)',
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setRevealed(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'none' : transforms[direction],
        transition: `opacity 0.7s ease-out, transform 0.7s ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
