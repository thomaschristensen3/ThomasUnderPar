import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const destinations = [
  {
    slug: "st-andrews",
    name: "St Andrews",
    country: "Scotland",
    continent: "Europe",
    latitude: 56.34,
    longitude: -2.8,
    heroImage: "https://picsum.photos/seed/standrews/1200/600",
    overallScore: 9.2,
    description:
      "The home of golf. St Andrews Links is the oldest golf course in the world — a spiritual pilgrimage for every serious golfer.",
    published: true,
    golf: {
      score: 10,
      description:
        "The Old Course is the birthplace of golf. Walking those fairways is a deeply moving experience. The Road Hole (17th) is one of the greatest holes in the world.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/standrews-golf/800/500", caption: "The 18th hole, Old Course" },
        { type: "image", url: "https://picsum.photos/seed/standrews-golf2/800/500", caption: "Swilcan Bridge at sunrise" },
      ],
      socialLinks: [],
    },
    restaurants: {
      score: 7,
      description:
        "Solid Scottish seafood and cozy pub meals. The Seafood Restaurant overlooking the West Sands is a highlight. Don't miss the fish and chips on the walk back from the course.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/standrews-food/800/500", caption: "Fresh Scottish seafood" },
      ],
      socialLinks: [],
    },
    hotels: {
      score: 8,
      description:
        "The Old Course Hotel is iconic — expensive, but worth it once in your life. There are also charming B&Bs throughout the town at a fraction of the price.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/standrews-hotel/800/500", caption: "Old Course Hotel" },
      ],
      socialLinks: [],
    },
    transportation: {
      score: 6,
      description:
        "Edinburgh is the main hub (1 hour drive). There's a train to Leuchars, then a short taxi. No direct flights — plan accordingly.",
      media: [],
      socialLinks: [],
    },
    weather: {
      score: 5,
      description:
        "Scotland weather is unpredictable. Pack for four seasons in one round. The links are playable year-round but summer is definitely the sweet spot.",
      media: [],
      socialLinks: [],
    },
    city: {
      score: 8,
      description:
        "St Andrews is a beautiful medieval university town. The cathedral ruins, stone streets, and the smell of the sea make it genuinely magical.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/standrews-city/800/500", caption: "The medieval town centre" },
      ],
      socialLinks: [],
    },
    friendliness: {
      score: 9,
      description:
        "Scots are wonderfully warm and will talk golf with you for hours. The caddies on the Old Course are particularly legendary.",
      media: [],
      socialLinks: [],
    },
    sights: {
      score: 8,
      description:
        "The ruined Cathedral on the cliff, the British Golf Museum, the West Sands beach (Chariots of Fire!), and the castle are all within easy walking distance.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/standrews-sights/800/500", caption: "St Andrews Cathedral ruins" },
      ],
      socialLinks: [],
    },
    extras: {
      score: 9,
      description:
        "Watching the sunrise on the 18th fairway is free and priceless. Also — book your Old Course tee time by ballot well in advance. It's a lottery but worth it.",
      media: [],
      socialLinks: [],
    },
  },
  {
    slug: "pebble-beach",
    name: "Pebble Beach",
    country: "USA",
    continent: "North America",
    latitude: 36.57,
    longitude: -121.95,
    heroImage: "https://picsum.photos/seed/pebblebeach/1200/600",
    overallScore: 9.7,
    description:
      "Arguably the most beautiful golf course in the world, draped along the cliffs of California's Monterey Peninsula.",
    published: true,
    golf: {
      score: 10,
      description:
        "Pebble Beach Golf Links is a masterpiece. The back nine hugging the coast is as dramatic as golf gets. Holes 7 and 18 are iconic in every sense.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/pebble-golf/800/500", caption: "Hole 7 — the famous par 3" },
        { type: "image", url: "https://picsum.photos/seed/pebble-golf2/800/500", caption: "Ocean views on the back nine" },
      ],
      socialLinks: [],
    },
    restaurants: {
      score: 9,
      description:
        "Roy's at Pebble Beach and the Stillwater Bar & Grill at The Lodge are world-class. The 19th Hole at Spyglass is great for a post-round burger.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/pebble-food/800/500", caption: "Dinner at Stillwater Bar & Grill" },
      ],
      socialLinks: [],
    },
    hotels: {
      score: 10,
      description:
        "The Lodge at Pebble Beach is one of the finest resort experiences in America. Every detail is perfect. If you can afford one splurge on a golf trip, make it this.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/pebble-hotel/800/500", caption: "The Lodge at Pebble Beach" },
      ],
      socialLinks: [],
    },
    transportation: {
      score: 7,
      description:
        "Fly into Monterey Regional Airport (15 min) or San Jose/San Francisco (1.5-2hrs). A rental car is recommended to explore the peninsula.",
      media: [],
      socialLinks: [],
    },
    weather: {
      score: 8,
      description:
        "Mild coastal California weather most of the year. Morning fog burns off by late morning. Bring a layer — the ocean breeze is real.",
      media: [],
      socialLinks: [],
    },
    city: {
      score: 9,
      description:
        "The Monterey Peninsula is stunningly beautiful. Carmel-by-the-Sea is one of the most charming towns in America. The 17-Mile Drive alone is worth the trip.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/pebble-city/800/500", caption: "17-Mile Drive, Lone Cypress" },
      ],
      socialLinks: [],
    },
    friendliness: {
      score: 8,
      description:
        "Staff at Pebble Beach are impeccable and incredibly professional. Locals in Carmel are laid-back and welcoming.",
      media: [],
      socialLinks: [],
    },
    sights: {
      score: 9,
      description:
        "Monterey Bay Aquarium, Point Lobos State Reserve, Cannery Row, and Carmel Beach are all unmissable. Big Sur is a 30-minute drive south.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/pebble-sights/800/500", caption: "Point Lobos State Reserve" },
      ],
      socialLinks: [],
    },
    extras: {
      score: 10,
      description:
        "Playing Spyglass Hill and Cypress Point (if you can get on) makes this the ultimate California golf trip. The sunset from the 18th green at Pebble is one for the memory bank.",
      media: [],
      socialLinks: [],
    },
  },
  {
    slug: "royal-melbourne",
    name: "Royal Melbourne",
    country: "Australia",
    continent: "Oceania",
    latitude: -37.93,
    longitude: 145.05,
    heroImage: "https://picsum.photos/seed/royalmelbourne/1200/600",
    overallScore: 8.8,
    description:
      "Australia's finest club, designed by Alister MacKenzie. Pure sandbelt golf at its absolute best.",
    published: true,
    golf: {
      score: 10,
      description:
        "The West Course is MacKenzie at his finest. The bunkering is severe and strategic — every approach requires thought. One of the top 10 courses in the world without question.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/melb-golf/800/500", caption: "MacKenzie bunkering on the West Course" },
      ],
      socialLinks: [],
    },
    restaurants: {
      score: 9,
      description:
        "Melbourne has arguably the best food scene in the Southern Hemisphere. Grossi Florentino, Attica, and Vue de Monde are bucket-list restaurants. The coffee culture is world-leading.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/melb-food/800/500", caption: "Melbourne's laneway café culture" },
      ],
      socialLinks: [],
    },
    hotels: {
      score: 8,
      description:
        "The Crown Towers and Sofitel on Collins are excellent. Boutique options in Fitzroy and South Yarra offer great value and local character.",
      media: [],
      socialLinks: [],
    },
    transportation: {
      score: 8,
      description:
        "Melbourne Airport is well-connected globally. The public tram network in the CBD is free. Taxis and Uber to Royal Melbourne Golf Club are easy and reasonable.",
      media: [],
      socialLinks: [],
    },
    weather: {
      score: 6,
      description:
        "'Four seasons in one day' is Melbourne's famous weather motto, and it's accurate. October–March is the best golf window, but always pack a rain jacket.",
      media: [],
      socialLinks: [],
    },
    city: {
      score: 9,
      description:
        "Melbourne is one of the world's great cities — arts, sport, food, and culture at every turn. The laneways, the MCG, and the bay make it endlessly interesting.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/melb-city/800/500", caption: "Melbourne CBD skyline" },
      ],
      socialLinks: [],
    },
    friendliness: {
      score: 9,
      description:
        "Australians are genuinely among the friendliest people in the world. The golf club members are passionate and eager to share their course with visitors.",
      media: [],
      socialLinks: [],
    },
    sights: {
      score: 8,
      description:
        "The Great Ocean Road is a few hours away. Within the city: the MCG, National Gallery of Victoria, Royal Botanic Gardens, and Federation Square are all excellent.",
      media: [
        { type: "image", url: "https://picsum.photos/seed/melb-sights/800/500", caption: "The Great Ocean Road" },
      ],
      socialLinks: [],
    },
    extras: {
      score: 8,
      description:
        "Play the East Course too — it's underrated. And make sure you catch any major sporting event happening during your visit. Melbourne lives for sport.",
      media: [],
      socialLinks: [],
    },
  },
];

async function main() {
  const existingCount = await prisma.destination.count();

  if (existingCount > 0) {
    console.log(
      `Database already has ${existingCount} destination(s) — skipping seed.`
    );
    return;
  }

  for (const dest of destinations) {
    await prisma.destination.create({ data: dest });
  }
  console.log(`Seeded ${destinations.length} destinations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
