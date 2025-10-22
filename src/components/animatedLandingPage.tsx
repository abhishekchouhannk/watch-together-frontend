import React, { useEffect, useState } from 'react';

interface CloudLayerProps {
  src: string;
  splitPoint: number; // Percentage where to split (e.g., 20 means split at 20%)
  delay: number;
  animationStarted: boolean;
  zIndex: number;
}

const CloudLayerSplit: React.FC<CloudLayerProps> = ({ 
  src, 
  splitPoint, 
  delay, 
  animationStarted, 
  zIndex
}) => {
  // Use the same duration for both parts to ensure simultaneous arrival
  const animationDuration = 2000;
  
  // Calculate different speeds (distance/time) by adjusting easing
  const leftEasing = `cubic-bezier(0.4, 0, ${0.2 + (splitPoint / 100) * 0.3}, 1)`;
  const rightEasing = `cubic-bezier(0.4, 0, ${0.2 + ((100 - splitPoint) / 100) * 0.3}, 1)`;
  
  return (
    <>
      {/* Left part */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ 
          width: `${splitPoint}%`,
          zIndex,
          transition: `transform ${animationDuration}ms ${leftEasing} ${delay}ms`,
          transform: animationStarted ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        <img
          src={src}
          alt="Clouds left"
          className="h-full object-cover absolute left-0"
          style={{ 
            width: `${(100 / splitPoint) * 100}%`,
            maxWidth: 'none'
          }}
        />
      </div>

      {/* Right part */}
      <div 
        className="absolute top-0 right-0 h-full overflow-hidden"
        style={{ 
          width: `${100 - splitPoint}%`,
          zIndex,
          transition: `transform ${animationDuration}ms ${rightEasing} ${delay}ms`,
          transform: animationStarted ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <img
          src={src}
          alt="Clouds right"
          className="h-full object-cover absolute right-0"
          style={{ 
            width: `${(100 / (100 - splitPoint)) * 100}%`,
            maxWidth: 'none',
            right: '0'
          }}
        />
      </div>
    </>
  );
};

const AnimatedLandingPageEnhanced: React.FC = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [blimpTrail, setBlimpTrail] = useState<Array<{x: number, y: number}>>([]);

  useEffect(() => {
    setAnimationStarted(true);

    let progress = 0;
    const trail: Array<{x: number, y: number}> = [];
    
    const blimpAnimation = setInterval(() => {
      if (progress <= 100) {
        const x = 10 + progress * 0.7; // Start at 10%, end at 80%
        const y = 40 + Math.sin(progress * 0.05) * 15 - (progress * 0.2);
        
        trail.push({ x, y });
        if (trail.length > 30) trail.shift(); // Limit trail length
        
        setBlimpTrail([...trail]);
        progress += 0.5;
      } else {
        clearInterval(blimpAnimation);
      }
    }, 30);

    return () => clearInterval(blimpAnimation);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Layer 1: Sky Background - Fade in */}
      <div 
        className={`absolute inset-0 transition-all duration-2000 ${
          animationStarted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-400">
          <img
            src="/assets/Clouds 1/1.png"
            alt="Sky"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
      </div>

      {/* Layer 2: Far-off Clouds - Adjust splitPoint based on your image */}
      <CloudLayerSplit 
        src="/assets/Clouds 1/2.png"
        splitPoint={38}
        delay={500}
        animationStarted={animationStarted}
        zIndex={20}
      />

      {/* Layer 3: Near Clouds */}
      <CloudLayerSplit 
        src="/assets/Clouds 1/4.png"
        delay={1000}
        animationStarted={animationStarted}
        zIndex={30}
        splitPoint={24}
      />

      {/* Layer 4: Animated Blimp with Trail */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 40 }}>
        {/* Smoke trail with gradient opacity */}
        {blimpTrail.map((point, i) => (
          <circle
            key={i}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r={2 + (i * 0.1)}
            fill="white"
            opacity={0.1 + (i / blimpTrail.length) * 0.2}
          />
        ))}
        
        {/* Blimp (last position in trail) */}
        {blimpTrail.length > 0 && (
          <g>
            <ellipse
              cx={`${blimpTrail[blimpTrail.length - 1].x}%`}
              cy={`${blimpTrail[blimpTrail.length - 1].y}%`}
              rx="6"
              ry="2.5"
              fill="#FFA500"
              opacity="0.9"
            />
            {/* Small gondola */}
            <rect
              x={`${blimpTrail[blimpTrail.length - 1].x - 0.5}%`}
              y={`${blimpTrail[blimpTrail.length - 1].y + 0.5}%`}
              width="1%"
              height="0.5%"
              fill="#666"
            />
          </g>
        )}
      </svg>

      {/* UI Content */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
        <div 
          className={`text-center px-6 transition-all duration-1000 transform ${
            animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '3500ms' }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Watch Together
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-10 drop-shadow-lg max-w-2xl mx-auto">
            Experience movies with friends, anywhere in the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-sky-600 px-8 py-4 rounded-full font-semibold hover:bg-sky-50 transform hover:scale-105 transition-all shadow-xl">
              Start Watching
            </button>
            <button className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transform hover:scale-105 transition-all border-2 border-white/50">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedLandingPageEnhanced;