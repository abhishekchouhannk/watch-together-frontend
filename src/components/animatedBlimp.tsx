import React, { useEffect, useState } from 'react';

const AnimatedBlimp: React.FC<{ animationStarted: boolean }> = ({ animationStarted }) => {
  const [blimpPosition, setBlimpPosition] = useState({ x: 10, y: 30 });
  const [trailPoints, setTrailPoints] = useState<Array<{x: number, y: number}>>([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (!animationStarted) return;
    
    // Wait for backgrounds to start loading
    const startDelay = setTimeout(() => {
      let progress = 0;
      const points: Array<{x: number, y: number}> = [];
      
      const blimpAnimation = setInterval(() => {
        if (progress <= 100) {
          // Diagonal path: start at (10%, 30%), end at (80%, 45%)
          const x = 10 + (progress / 100) * 70; // Move from 10% to 80% horizontally
          const y = 30 + (progress / 100) * 15; // Move from 30% to 45% vertically (gentle downward slope)
          
          // Add slight natural wobble without dramatic curves
          const wobbleX = x + Math.sin(progress * 0.1) * 0.5;
          const wobbleY = y + Math.cos(progress * 0.15) * 0.3;
          
          setBlimpPosition({ x: wobbleX, y: wobbleY });
          
          // Build permanent trail
          if (progress % 2 === 0) { // Add point every other frame for smoother trail
            points.push({ x: wobbleX, y: wobbleY });
            setTrailPoints([...points]);
          }
          
          progress += 1;
        } else {
          setAnimationComplete(true);
          clearInterval(blimpAnimation);
        }
      }, 40); // Slower animation for more realistic movement

      return () => clearInterval(blimpAnimation);
    }, 2000); // Start after 2 seconds (when backgrounds are moving)

    return () => clearTimeout(startDelay);
  }, [animationStarted]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 40 }}>
      {/* Permanent smoke trail */}
      <g>
        {trailPoints.map((point, i) => (
          <g key={i}>
            {/* Multiple circles for thicker, more realistic trail */}
            <circle
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r="3"
              fill="white"
              opacity={0.15}
            />
            <circle
              cx={`${point.x}%`}
              cy={`${point.y + 0.2}%`}
              r="2"
              fill="white"
              opacity={0.2}
            />
            {/* Connect points with a line for continuous trail */}
            {i > 0 && (
              <line
                x1={`${trailPoints[i-1].x}%`}
                y1={`${trailPoints[i-1].y}%`}
                x2={`${point.x}%`}
                y2={`${point.y}%`}
                stroke="white"
                strokeWidth="2"
                opacity={0.15}
              />
            )}
          </g>
        ))}
        
        {/* Add dispersing effect at the end of trail */}
        {trailPoints.length > 10 && trailPoints.slice(-5).map((point, i) => (
          <circle
            key={`disperse-${i}`}
            cx={`${point.x + (i * 0.3)}%`}
            cy={`${point.y + (i * 0.1)}%`}
            r={4 + i * 0.5}
            fill="white"
            opacity={0.05}
          />
        ))}
      </g>
      
      {/* Blimp */}
      {animationStarted && (
        <g className={`transition-opacity duration-500 ${animationComplete ? 'opacity-90' : 'opacity-100'}`}>
          <ellipse
            cx={`${blimpPosition.x}%`}
            cy={`${blimpPosition.y}%`}
            rx="7"
            ry="3"
            fill="#FFB800"
            filter="url(#blimpShadow)"
          />
          {/* Gondola */}
          <rect
            x={`${blimpPosition.x - 1}%`}
            y={`${blimpPosition.y + 1.5}%`}
            width="2%"
            height="0.8%"
            fill="#444"
          />
          {/* Fins */}
          <ellipse
            cx={`${blimpPosition.x - 3}%`}
            cy={`${blimpPosition.y}%`}
            rx="1.5"
            ry="2"
            fill="#FFA500"
          />
        </g>
      )}
      
      {/* Filter for subtle shadow */}
      <defs>
        <filter id="blimpShadow">
          <feDropShadow dx="0.1" dy="0.1" stdDeviation="0.2" floodOpacity="0.3"/>
        </filter>
      </defs>
    </svg>
  );
};

export default AnimatedBlimp;