"use client";
import React, { useEffect, useState } from "react";
import AnimatedSun from "./animatedSun";

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

const AnimatedLandingPage: React.FC = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [blimpTrail, setBlimpTrail] = useState<Array<{ x: number; y: number }>>(
    []
  );

  useEffect(() => {
    setTimeout(() => setAnimationStarted(true), 200);

    let progress = 0;
    const trail: Array<{ x: number; y: number }> = [];

    const blimpAnimation = setInterval(() => {
      if (progress <= 100) {
        const x = 10 + progress * 0.7; // Start 10%, end 80%
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
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-sky-300">
      {/* Layer 1: Sky Background */}
      <div
        className={`absolute inset-0 transition-all duration-[1000ms] ${
          animationStarted ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 0 }}
      >
        <img
          src="/assets/afternoon1/1-sky.png"
          alt="Sky"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layer 2: Sun */}
      <AnimatedSun zIndex={10} />

      {/* Layer 3: Animated Blimp */}
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

      {/* Layer 4: Far Clouds */}
      <CloudLayer
        srcLeft="/assets/afternoon1/2L-far.png"
        srcRight="/assets/afternoon1/2R-far.png"
        srcFull="/assets/afternoon1/2-far.png"
        delay={500}
        animationStarted={animationStarted}
        zIndex={30}
        scrollSpeed={80} // Slower for far clouds
      />

      {/* Layer 5: Near Clouds */}
      <CloudLayer
        srcLeft="/assets/afternoon1/4L-near.png"
        srcRight="/assets/afternoon1/4R-near.png"
        srcFull="/assets/afternoon1/4-near.png"
        delay={1000}
        animationStarted={animationStarted}
        zIndex={40}
        scrollSpeed={40} // Faster for near clouds (parallax effect)
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