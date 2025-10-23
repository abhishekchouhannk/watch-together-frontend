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
    textColor: 'text-sky-900',
    buttonPrimary: 'bg-yellow-400 hover:bg-yellow-500 text-sky-900',
    buttonSecondary: 'bg-white/70 hover:bg-white/90 text-sky-700 border border-sky-300',
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

// For testing purposes, you can set a fixed time of day here
const timeForTesting = 'afternoon'; // Change to 'morning', 'afternoon', 'evening', 'night', null for testing

// Helper function to determine time of day based on hour
const getTimeOfDay = (hour: number): keyof typeof TIME_THEMES => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return timeForTesting || 'night';
};

export { TIME_THEMES, getTimeOfDay };