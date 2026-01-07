export const ACTIVITIES = [
  {
    id: "running",
    name: "Running",
    icon: "flash",
    pointsPerHour: 15,
    description: "Track running activities",
  },
  {
    id: "cycling",
    name: "Cycling",
    icon: "bicycle",
    pointsPerHour: 12,
    description: "Track cycling activities",
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "water",
    pointsPerHour: 18,
    description: "Track swimming activities",
  },
  {
    id: "strength",
    name: "Strength Training",
    icon: "barbell",
    pointsPerHour: 14,
    description: "Track gym/strength training",
  },
  {
    id: "sports",
    name: "Team Sports",
    icon: "basketball",
    pointsPerHour: 16,
    description: "Track team sports activities",
  },
  {
    id: "yoga",
    name: "Yoga/Pilates",
    icon: "leaf",
    pointsPerHour: 10,
    description: "Track yoga/pilates sessions",
  },
  {
    id: "hiking",
    name: "Hiking",
    icon: "mountain",
    pointsPerHour: 13,
    description: "Track hiking activities",
  },
  {
    id: "walking",
    name: "Walking",
    icon: "walk",
    pointsPerHour: 8,
    description: "Track walking activities",
  },
  {
    id: "other",
    name: "Other",
    icon: "fitness",
    pointsPerHour: 10,
    description: "Other fitness activities",
  },
];

export const getActivityById = (id) => {
  return ACTIVITIES.find((a) => a.id === id);
};

export const calculatePoints = (activityId, hours) => {
  const activity = getActivityById(activityId);
  if (!activity) return 0;
  return Math.round(activity.pointsPerHour * parseFloat(hours));
};
