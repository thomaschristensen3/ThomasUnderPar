export type MediaType = "image" | "video";
export type SocialPlatform = "instagram" | "twitter" | "youtube" | "facebook" | "tiktok" | "other";

export interface MediaItem {
  type: MediaType;
  url: string;
  caption?: string;
}

export interface SocialLink {
  platform: SocialPlatform | string;
  url: string;
}

export interface CategoryData {
  score: number;
  description: string;
  media: MediaItem[];
  socialLinks: SocialLink[];
}

export const CATEGORY_KEYS = [
  "golf",
  "restaurants",
  "hotels",
  "transportation",
  "weather",
  "city",
  "friendliness",
  "sights",
  "extras",
] as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; icon: string; description: string }
> = {
  golf: {
    label: "Golf Courses",
    icon: "⛳",
    description: "The courses, layout, conditions, and overall golf experience.",
  },
  restaurants: {
    label: "Restaurants",
    icon: "🍽️",
    description: "Dining quality, variety, and standout meals.",
  },
  hotels: {
    label: "Hotels",
    icon: "🏨",
    description: "Accommodation quality, amenities, and value.",
  },
  transportation: {
    label: "Transportation",
    icon: "✈️",
    description: "Getting there and getting around.",
  },
  weather: {
    label: "Weather",
    icon: "☀️",
    description: "Climate, conditions, and best times to visit.",
  },
  city: {
    label: "The City",
    icon: "🏙️",
    description: "Atmosphere, culture, and what makes the place special.",
  },
  friendliness: {
    label: "Friendliness",
    icon: "🤝",
    description: "How welcoming and helpful the locals are.",
  },
  sights: {
    label: "Sights to See",
    icon: "🎭",
    description: "Must-see attractions and things to do beyond golf.",
  },
  extras: {
    label: "Hidden Gems & Extras",
    icon: "⭐",
    description: "Anything else that made the trip unforgettable.",
  },
};

export function emptyCategory(): CategoryData {
  return { score: 5, description: "", media: [], socialLinks: [] };
}
