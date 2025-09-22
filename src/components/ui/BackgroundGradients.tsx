import React from "react"

interface GradientCircleProps {
  width: string
  height: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  background: string
  blur?: string
  borderRadius?: string
  transform?: string
  flexShrink?: string
}

/**
 * Individual gradient circle component
 * Creates a blurred gradient circle with customizable properties
 */
const GradientCircle: React.FC<GradientCircleProps> = ({
  width,
  height,
  top,
  bottom,
  left,
  right,
  background,
  blur = "100px",
  borderRadius,
  transform = "rotate(-130.768deg)",
  flexShrink = "0"
}) => {
  return (
    <div 
      className="absolute"
      style={{
        width,
        height,
        top,
        bottom,
        left,
        right,
        transform,
        flexShrink,
        borderRadius: borderRadius || width,
        background,
        filter: `blur(${blur})`
      }}
    />
  )
}

/**
 * Background gradients component for signup pages
 * Provides consistent gradient background across the application
 */
const BackgroundGradients: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top left gradient */}
      <GradientCircle
        width="300.82px"
        height="400.82px"
        top="0px"
        left="-10px"
        background="rgba(224, 220, 50, 0.79)"
        blur="100px"
        borderRadius="584.82px"
      />
      
      {/* Below first gradient */}
      <GradientCircle
        width="310.98px"
        height="310.98px"
        top="400px"
        left="20px"
        background="rgba(245, 187, 24, 0.57)"
        blur="80px"
        borderRadius="310.98px"
      />

      {/* Bottom right gradient - upper */}
      <GradientCircle
        width="500px"
        height="350px"
        bottom="-50px"
        right="-70px"
        background="rgba(70, 183, 83, 0.74)"
        blur="100px"
        borderRadius="565.772px"
      />

      {/* Bottom right gradient - lower */}
      <GradientCircle
        width="300px"
        height="300px"
        bottom="300px"
        right="70px"
        background="rgba(245, 187, 24, 0.57)"
        blur="100px"
        borderRadius="357.976px"
      />
    </div>
  )
}

/**
 * Custom gradient background component
 * Allows creating custom gradient backgrounds with multiple circles
 */
interface CustomGradientBackgroundProps {
  children: React.ReactNode
  gradients?: GradientCircleProps[]
  className?: string
}

const CustomGradientBackground: React.FC<CustomGradientBackgroundProps> = ({
  children,
  gradients = [],
  className = ""
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        {gradients.map((gradient, index) => (
          <GradientCircle key={index} {...gradient} />
        ))}
      </div>
      {children}
    </div>
  )
}

export { BackgroundGradients, GradientCircle, CustomGradientBackground }
