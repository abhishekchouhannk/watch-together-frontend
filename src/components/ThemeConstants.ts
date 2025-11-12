// Theme configuration for different times of day
const TIME_THEMES = {
  morning: {
    name: "morning",
    motto: "Start your day watching together, anywhere.",
    bgColor: "bg-gradient-to-b from-pink-200 via-rose-100 to-blue-200",
    skyImage: "/assets/morning1/1-sky.png",
    farClouds: {
      left: "/assets/morning1/2L-far.png",
      right: "/assets/morning1/2R-far.png",
      full: "/assets/morning1/2-far.png",
    },
    elementImage: "/assets/morning1/element.png",
    nearClouds: {
      left: "/assets/morning1/3L-near.png",
      right: "/assets/morning1/3R-near.png",
      full: "/assets/morning1/3-near.png",
    },
    textColor: "text-rose-900",
    buttonPrimary: "bg-rose-500 hover:bg-rose-600 text-white",
    buttonSecondary: "bg-rose-100/80 hover:bg-rose-200/90 text-rose-900",
  },
  afternoon: {
    name: "afternoon",
    motto: "Take a break and watch together, anywhere.",
    bgColor: "bg-sky-300",
    skyImage: "/assets/afternoon1/1-sky.png",
    farClouds: {
      left: "/assets/afternoon1/2L-far.png",
      right: "/assets/afternoon1/2R-far.png",
      full: "/assets/afternoon1/2-far.png",
    },
    elementImage: null, // Uses animated blimp instead
    nearClouds: {
      left: "/assets/afternoon1/3L-near.png",
      right: "/assets/afternoon1/3R-near.png",
      full: "/assets/afternoon1/3-near.png",
    },
    textColor: "text-sky-900",
    buttonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-sky-900",
    buttonSecondary:
      "bg-white/70 hover:bg-white/90 text-sky-700 border border-sky-300",
  },
  evening: {
    name: "evening",
    motto: "Unwind and watch together, anywhere.",
    bgColor: "bg-gradient-to-b from-purple-400 via-pink-300 to-orange-300",
    skyImage: "/assets/evening1/1-sky.png",
    farClouds: {
      left: "/assets/evening1/2L-far.png",
      right: "/assets/evening1/2R-far.png",
      full: "/assets/evening1/2-far.png",
    },
    elementImage: "/assets/evening1/element.png", // Could be flying birds, etc.
    nearClouds: {
      left: "/assets/evening1/3L-near.png",
      right: "/assets/evening1/3R-near.png",
      full: "/assets/evening1/3-near.png",
    },
    textColor: "text-pink-500",
    buttonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
    buttonSecondary: "bg-purple-100/80 hover:bg-purple-200/90 text-purple-900",
  },
  night: {
    name: "night",
    motto: "Movie nights made simple — together, anywhere.",
    bgColor: "bg-gradient-to-b from-indigo-900 to-blue-900",
    skyImage: "/assets/night1/1-sky.png",
    farClouds: {
      left: "/assets/night1/2L-far.png",
      right: "/assets/night1/2R-far.png",
      full: "/assets/night1/2-far.png",
    },
    elementImage: null, // Could be stars, moon, etc.
    nearClouds: {
      left: "/assets/night1/3L-near.png",
      right: "/assets/night1/3R-near.png",
      full: "/assets/night1/3-near.png",
    },
    textColor: "text-white",
    buttonPrimary: "bg-indigo-500 hover:bg-indigo-600 text-white",
    buttonSecondary:
      "bg-white/10 hover:bg-white/20 text-white border-2 border-white/30",
  },
};

// For testing purposes, you can set a fixed time of day here
const timeForTesting = "evening"; // Change to 'morning', 'afternoon', 'evening', 'night', null for testing

// Helper function to determine time of day based on hour
const getTimeOfDay = (hour?: number): keyof typeof TIME_THEMES => {
  // If testing with a fixed time, return that
  // if (timeForTesting) return timeForTesting as keyof typeof TIME_THEMES;

  // If hour not provided, use current hour
  const currentHour = hour ?? new Date().getHours();

  if (currentHour >= 4 && currentHour < 12) {
    return "morning";
  } else if (currentHour >= 12 && currentHour < 16) {
    return "afternoon";
  } else if (currentHour >= 16 && currentHour < 20) {
    return "evening";
  } else {
    return "night";
  }
};

export { TIME_THEMES, getTimeOfDay };
