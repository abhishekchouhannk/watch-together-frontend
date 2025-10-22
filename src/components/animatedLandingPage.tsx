import React, { useEffect, useState } from 'react';

interface CloudLayerProps {
  src: string;
  side: 'left' | 'right';
  delay: number;
  animationStarted: boolean;
  zIndex: number;
  splitPoint?: number; // Percentage where to split the image
}

const CloudLayer: React.FC<CloudLayerProps> = ({ 
  src, 
  side, 
  delay, 
  animationStarted, 
  zIndex,
  splitPoint = 50 
}) => {
  const isLeft = side === 'left';
  
  return (
    <div 
      className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} h-full transition-transform ease-out`}
      style={{ 
        width: `${splitPoint}%`,
        zIndex,
        transitionDuration: `${3000 + delay}ms`,
        transitionDelay: `${delay}ms`,
        transform: animationStarted 
          ? 'translateX(0)' 
          : `translateX(${isLeft ? '-100%' : '100%'})`
      }}
    >
      <img
        src={src}
        alt={`Clouds ${side}`}
        className="h-full object-cover"
        style={{ 
          width: `${10000 / splitPoint}%`,
          [isLeft ? 'left' : 'right']: '0',
          position: 'absolute'
        }}
      />
    </div>
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
      <CloudLayer 
        src="/assets/Clouds 1/2.png"
        side="left"
        delay={500}
        animationStarted={animationStarted}
        zIndex={20}
        splitPoint={55} // Adjust this to avoid cutting clouds
      />
      <CloudLayer 
        src="/assets/Clouds 1/2.png"
        side="right"
        delay={500}
        animationStarted={animationStarted}
        zIndex={20}
        splitPoint={45} // This will be 100% - 45% = 55% from right
      />

      {/* Layer 3: Near Clouds */}
      <CloudLayer 
        src="/assets/Clouds 1/4.png"
        side="left"
        delay={1000}
        animationStarted={animationStarted}
        zIndex={30}
        splitPoint={52}
      />
      <CloudLayer 
        src="/assets/Clouds 1/4.png"
        side="right"
        delay={1000}
        animationStarted={animationStarted}
        zIndex={30}
        splitPoint={48}
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