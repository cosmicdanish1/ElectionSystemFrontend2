// GlassEffect.jsx or .tsx (if using TypeScript)
import './GlassEffect.css';
import React from 'react';

interface GlassEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const GlassEffect: React.FC<GlassEffectProps> = ({ children, className = '', ...rest }) => {
  return (
    <>
      {/* Once per app: place in top-level layout like App.jsx if not already done */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="glass-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="60"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Glass effect div */}
      <div
        className={`glassBox ${className}`}
        {...rest}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default GlassEffect;
