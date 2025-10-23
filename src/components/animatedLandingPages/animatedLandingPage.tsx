import React, { useEffect, useState, useMemo } from "react";
import AnimatedSun from "./themeComponents/animatedSun";
import TwinklingStars from "./themeComponents/twinklingStars";

interface CloudLayerProps {
  srcLeft?: string;
  srcRight?: string;
  srcFull?: string;
  delay: number;
  animationStarted: boolean;
  zIndex: number;
  scrollSpeed?: number; // in seconds for full scroll
}

const CloudLayer: React.FC<CloudLayerProps> = ({
  srcLeft,
  srcRight,
  srcFull,
  delay,
  animationStarted,
  zIndex,
  scrollSpeed = 60, // default 60 seconds for full scroll
}) => {
  const [showFullCloud, setShowFullCloud] = useState(false);

  useEffect(() => {
    if (animationStarted) {
      // Switch to full cloud after initial animation completes
      const timer = setTimeout(() => {
        setShowFullCloud(true);
      }, delay + 3200); // 2500ms is the transition duration
      
      return () => clearTimeout(timer);
    }
  }, [animationStarted, delay]);

  // Split cloud pieces (initial animation)
  if (!showFullCloud) {
    return (
      <>
        {srcLeft && (
          <div
            className="absolute top-0 h-full transition-transform ease-out"
            style={{
              zIndex,
              left: 0,
              transitionDuration: '2500ms',
              transitionDelay: `${delay}ms`,
              transform: animationStarted
                ? 'translateX(0)'
                : 'translateX(-100%)',
            }}
          >
            <img
              src={srcLeft}
              alt="Clouds left"
              className="w-[100vw] h-full"
            />
          </div>
        )}
        {srcRight && (
          <div
            className="absolute top-0 h-full transition-transform ease-out"
            style={{
              zIndex,
              right: 0,
              transitionDuration: '2500ms',
              transitionDelay: `${delay}ms`,
              transform: animationStarted
                ? 'translateX(0)'
                : 'translateX(100%)',
            }}
          >
            <img
              src={srcRight}
              alt="Clouds right"
              className="w-[100vw] h-full"
            />
          </div>
        )}
      </>
    );
  }

  // Full cloud with infinite scroll
  return (
    <div
      className="absolute top-0 left-0 w-full h-full overflow-hidden"
      style={{ zIndex }}
    >
      {/* We need two instances of the cloud image for seamless looping */}
      <div
        className="absolute top-0 h-full flex"
        style={{
          animation: `cloudScroll ${scrollSpeed}s linear infinite`,
          width: '200%',
        }}
      >
        <img
          src={srcFull}
          alt="Scrolling clouds"
          className="w-1/2 h-full"
        />
        <img
          src={srcFull}
          alt="Scrolling clouds duplicate"
          className="w-1/2 h-full"
        />
      </div>
      
      {/* Add CSS animation via style tag */}
      <style jsx>{`
        @keyframes cloudScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

// Theme configuration for different times of day
const TIME_THEMES = {
  morning: {
    name: 'morning',
    bgColor: 'bg-gradient-to-b from-orange-200 to-blue-300',
    skyImage: '/assets/morning1/1-sky.png',
    farClouds: {
      left: '/assets/morning1/2L-far.png',
      right: '/assets/morning1/2R-far.png',
      full: '/assets/morning1/2-far.png',
    },
    elementImage: '/assets/morning1/element.png', // Could be birds, hot air balloon, etc.
    nearClouds: {
      left: '/assets/morning1/3L-near.png',
      right: '/assets/morning1/3R-near.png',
      full: '/assets/morning1/3-near.png',
    },
    textColor: 'text-orange-900',
    buttonPrimary: 'bg-orange-500 hover:bg-orange-600 text-white',
    buttonSecondary: 'bg-orange-100/80 hover:bg-orange-200/90 text-orange-900',
  },
  afternoon: {
    name: 'afternoon',
    bgColor: 'bg-sky-300',
    skyImage: '/assets/afternoon1/1-sky.png',
    farClouds: {
      left: '/assets/afternoon1/2L-far.png',
      right: '/assets/afternoon1/2R-far.png',
      full: '/assets/afternoon1/2-far.png',
    },
    elementImage: null, // Uses animated blimp instead
    nearClouds: {
      left: '/assets/afternoon1/3L-near.png',
      right: '/assets/afternoon1/3R-near.png',
      full: '/assets/afternoon1/3-near.png',
    },
    textColor: 'text-white',
    buttonPrimary: 'bg-white text-sky-600 hover:bg-sky-50',
    buttonSecondary: 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/50',
  },
  evening: {
    name: 'evening',
    bgColor: 'bg-gradient-to-b from-purple-400 via-pink-300 to-orange-300',
    skyImage: '/assets/Evening/1-sky.png',
    farClouds: {
      left: '/assets/Evening/2L-far.png',
      right: '/assets/Evening/2R-far.png',
      full: '/assets/Evening/2-far.png',
    },
    elementImage: '/assets/Evening/3-element.png', // Could be flying birds, etc.
    nearClouds: {
      left: '/assets/Evening/4L-near.png',
      right: '/assets/Evening/4R-near.png',
      full: '/assets/Evening/4-near.png',
    },
    textColor: 'text-purple-900',
    buttonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
    buttonSecondary: 'bg-purple-100/80 hover:bg-purple-200/90 text-purple-900',
  },
  night: {
    name: 'night',
    bgColor: 'bg-gradient-to-b from-indigo-900 to-blue-900',
    skyImage: '/assets/Night/1-sky.png',
    farClouds: {
      left: '/assets/Night/2L-far.png',
      right: '/assets/Night/2R-far.png',
      full: '/assets/Night/2-far.png',
    },
    elementImage: '/assets/Night/3-element.png', // Could be stars, moon, etc.
    nearClouds: {
      left: '/assets/Night/4L-near.png',
      right: '/assets/Night/4R-near.png',
      full: '/assets/Night/4-near.png',
    },
    textColor: 'text-white',
    buttonPrimary: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    buttonSecondary: 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/30',
  },
};

// Helper function to determine time of day based on hour
const getTimeOfDay = (hour: number): keyof typeof TIME_THEMES => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'morning';
};

const AnimatedLandingPage: React.FC = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [blimpTrail, setBlimpTrail] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  // Determine current theme based on time
  const currentTheme = useMemo(() => {
    const hour = currentTime.getHours();
    const timeOfDay = getTimeOfDay(hour);
    return TIME_THEMES[timeOfDay];
  }, [currentTime]);

  useEffect(() => {
  console.log('Current hour:', currentTime.getHours());
  console.log('Time of day:', getTimeOfDay(currentTime.getHours()));
  console.log('Selected theme:', currentTheme.name);
  console.log('Sky image path:', currentTheme.skyImage);
}, [currentTheme, currentTime]);

  // Update time every minute to catch theme changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => setAnimationStarted(true), 200);

    // Only animate blimp in afternoon
    if (currentTheme.name === 'afternoon') {
      let progress = 0;
      const trail: Array<{ x: number; y: number }> = [];

      const blimpAnimation = setInterval(() => {
        if (progress <= 100) {
          const x = 10 + progress * 0.7;
          const y = 40 + Math.sin(progress * 0.05) * 15 - progress * 0.2;

          trail.push({ x, y });
          if (trail.length > 30) trail.shift();

          setBlimpTrail([...trail]);
          progress += 0.5;
        } else {
          clearInterval(blimpAnimation);
        }
      }, 30);

      return () => clearInterval(blimpAnimation);
    }
  }, [currentTheme]);

  // Render time-specific animated elements
  const renderAnimatedElement = () => {
    switch (currentTheme.name) {
      case 'afternoon':
        return (
          <>
            {/* Animated Sun for afternoon */}
            <AnimatedSun zIndex={10} />
            
            {/* Animated Blimp for afternoon */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 20 }}
            >
              {blimpTrail.map((point, i) => (
                <circle
                  key={i}
                  cx={`${point.x}%`}
                  cy={`${point.y}%`}
                  r={2 + i * 0.1}
                  fill="white"
                  opacity={0.1 + (i / blimpTrail.length) * 0.2}
                />
              ))}

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
                </g>
              )}
            </svg>
          </>
        );
      
      case 'morning':
        // Add morning-specific animations (e.g., rising sun)
        return (

           <>
          {/* Twinkling Stars */}
          <TwinklingStars 
            zIndex={5} 
            starCount={100} 
            animationStarted={animationStarted}
            density="sparse"
            showShootingStars={true}
          />
          <div
            className={`absolute transition-all duration-[3000ms] ${
              animationStarted ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              zIndex: 15,
              top: animationStarted ? '10%' : '50%',
              left: '80%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* You can add a rising sun animation or birds here */}
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-2xl" />
          </div>
          </>
        );
      
      case 'evening':
        // Add evening-specific animations
        return null; // Will use static element image
      
      case 'night':
        // Add night-specific animations (e.g., twinkling stars)
        return (
          <div className="absolute inset-0" style={{ zIndex: 5 }}>
            {/* Add stars or moon animation here */}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden ${currentTheme.bgColor}`}>
      {/* Layer 1: Sky Background */}
      <div
        className={`absolute inset-0 transition-all duration-[1000ms] ${
          animationStarted ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 0 }}
      >
        <img
          src={currentTheme.skyImage}
          alt="Sky"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layer 2: Time-specific animated elements */}
      {renderAnimatedElement()}

      {/* Layer 3: Static decorative element (if exists and not afternoon) */}
      {currentTheme.elementImage && currentTheme.name !== 'afternoon' && (
        <div
          className={`absolute inset-0 transition-all duration-[2000ms] ${
            animationStarted ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: 25 }}
        >
          <img
            src={currentTheme.elementImage}
            alt="Decorative Element"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Layer 4: Far Clouds */}
      <CloudLayer
        srcLeft={currentTheme.farClouds.left}
        srcRight={currentTheme.farClouds.right}
        srcFull={currentTheme.farClouds.full}
        delay={500}
        animationStarted={animationStarted}
        zIndex={30}
        scrollSpeed={80}
      />

      {/* Layer 5: Near Clouds */}
      <CloudLayer
        srcLeft={currentTheme.nearClouds.left}
        srcRight={currentTheme.nearClouds.right}
        srcFull={currentTheme.nearClouds.full}
        delay={1000}
        animationStarted={animationStarted}
        zIndex={40}
        scrollSpeed={40}
      />

      {/* UI Content */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 50 }}
      >
        <div
          className={`text-center px-6 transition-all duration-1000 transform ${
            animationStarted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "3000ms" }}
        >
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl ${currentTheme.textColor}`}>
            Watch Together
          </h1>
          <p className={`text-lg md:text-2xl mb-10 drop-shadow-lg max-w-2xl mx-auto ${
            currentTheme.name === 'morning' || currentTheme.name === 'evening' 
              ? 'text-gray-700/90' 
              : 'text-white/90'
          }`}>
            Experience movies with friends, anywhere in the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all shadow-xl ${currentTheme.buttonPrimary}`}>
              Start Watching
            </button>
            <button className={`backdrop-blur px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all ${currentTheme.buttonSecondary}`}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Time indicator for testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm" style={{ zIndex: 100 }}>
          {currentTheme.name} ({currentTime.toLocaleTimeString()})
        </div>
      )}
    </div>
  );
};

export default AnimatedLandingPage;


// Can you help me write a small code block or React component (with Tailwind)?

// I have built a thematic afternoon sky landing page with clouds, a sun, and an animated blimp passing through the sky behind the clouds. However, it still looks really barebones, and I want to make the clouds appear to be moving as well. 

// Right now, I have utilized 2 layers of clouds, where one is for far-off clouds and one is for nearer clouds (which look more whitish). Both are split into left and right pieces that come in from left and right to make a background of clouds along with other elements to make the afternoon sky. 

// This is the code for CloudLayer

// const CloudLayer: React.FC<CloudLayerProps> = ({
//   src,
//   side,
//   delay,
//   animationStarted,
//   zIndex,
// }) => {
//   const isLeft = side === "left";

//   return (
//     <div
//       className={`absolute top-0 h-full transition-transform ease-out`}
//       style={{
//         zIndex,
//         [isLeft ? "left" : "right"]: 0,
//         transitionDuration: "2500ms",
//         transitionDelay: `${delay}ms`,
//         transform: animationStarted
//           ? "translateX(0)"
//           : `translateX(${isLeft ? "-100%" : "100%"})`,
//       }}
//     >
//       <img
//         src={src}
//         alt={`Clouds ${side}`}
//         className="w-full h-full object-cover"
//       />
//     </div>
//   );
// };

// (Below is usage in main AnimatedPage.)
// {/* Layer 4: Far Clouds */}
//       <CloudLayer
//         src="/assets/afternoon1/2L.png"
//         side="left"
//         delay={500}
//         animationStarted={animationStarted}
//         zIndex={30}
//       />
//       <CloudLayer
//         src="/assets/afternoon1/2R.png"
//         side="right"
//         delay={500}
//         animationStarted={animationStarted}
//         zIndex={30}
//       />

//       {/* Layer 5: Near Clouds */}
//       <CloudLayer
//         src="/assets/afternoon1/4L.png"
//         side="left"
//         delay={1000}
//         animationStarted={animationStarted}
//         zIndex={40}
//       />
//       <CloudLayer
//         src="/assets/afternoon1/4R.png"
//         side="right"
//         delay={1000}
//         animationStarted={animationStarted}
//         zIndex={40}
//       />

// I want the clouds to be moving now. So, once the 4th layer (i.e., 2L, 2R) and 5th layer (4L, 4R) are in place, the code switches to utilize the full 2.png and 4.png background (the change would not be noticeable as it would just swap the already there background). 

// Once the new full background is in, I want to translate both 2.png and 4.png indefinitely from left to right. The speed should be slow.

// Also, once the part passes to the right, it should come back in from the left, kind of like a looping animation of the PNG across the webpage from left to right.