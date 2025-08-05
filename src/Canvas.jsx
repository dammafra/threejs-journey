import { Canvas as R3FCanvas } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'

// See:
// - https://github.com/pmndrs/drei/issues/720
// - https://github.com/IsaacUA/drei-html-fix/blob/main/src/components/CanvasWrapper.tsx

export default function Canvas({ children, ...props }) {
  const containerRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({
        width: width % 2 === 0 ? width + 1 : width,
        height: height % 2 !== 0 ? height - 1 : height,
      })
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100svh',
        overflow: 'hidden',
      }}
    >
      <R3FCanvas style={{ width: size.width, height: size.height }} {...props}>
        {children}
      </R3FCanvas>
    </div>
  )
}
