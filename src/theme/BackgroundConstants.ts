// Theme configuration for different times of day

function makeClouds(time: string, layer: string) {
  const basePath = `/assets/${time}/${layer}/`;
  return {
    left: `${basePath}left.png`,
    right: `${basePath}right.png`,
    full: `${basePath}full.png`,
  };
}


const TIME_THEMES = {
  morning: {
    name: "morning",
    motto: "Start your day watching together, anywhere.",
    bgColor: "bg-gradient-to-b from-pink-200 via-rose-100 to-blue-200",
    skyImage: "/assets/morning/sky.png",
    elementImage: "/assets/morning/element.png",
    farClouds: makeClouds("morning", "farLayer"),
    nearClouds: makeClouds("morning", "nearLayer"),
    textColor: "text-rose-900",
    buttonPrimary: "bg-rose-500 hover:bg-rose-600 text-white",
    buttonSecondary: "bg-rose-100/80 hover:bg-rose-200/90 text-rose-900",
  },
  afternoon: {
    name: "afternoon",
    motto: "Take a break and watch together, anywhere.",
    bgColor: "bg-sky-300",
    skyImage: "/assets/afternoon/sky.png",
    elementImage: null, // Uses animated blimp instead
    farClouds: makeClouds("afternoon", "farLayer"),
    nearClouds: makeClouds("afternoon", "nearLayer"),
    textColor: "text-sky-900",
    buttonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-sky-900",
    buttonSecondary:
      "bg-white/70 hover:bg-white/90 text-sky-700 border border-sky-300",
  },
  evening: {
    name: "evening",
    motto: "Unwind and watch together, anywhere.",
    bgColor: "bg-gradient-to-b from-purple-400 via-pink-300 to-orange-300",
    skyImage: "/assets/evening/sky.png",
    elementImage: "/assets/evening/element.png", // Could be flying birds, etc.
    farClouds: makeClouds("evening", "farLayer"),
    nearClouds: makeClouds("evening", "nearLayer"),
    textColor: "text-pink-500",
    buttonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
    buttonSecondary: "bg-purple-100/80 hover:bg-purple-200/90 text-purple-900",
  },
  night: {
    name: "night",
    motto: "Movie nights made simple — together, anywhere.",
    bgColor: "bg-gradient-to-b from-indigo-900 to-blue-900",
    skyImage: "/assets/night/sky.png",
    elementImage: null, // Could be stars, moon, etc.
    farClouds: makeClouds("night", "farLayer"),
    nearClouds: makeClouds("night", "nearLayer"),
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
