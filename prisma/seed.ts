import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const destinations = [
  {
    slug: "st-andrews",
    name: "St Andrews",
    country: "Scotland",
    heroImage: "https://picsum.photos/seed/standrews/1200/600",
    galleryImages: [
      "https://picsum.photos/seed/standrews1/800/600",
      "https://picsum.photos/seed/standrews2/800/600",
      "https://picsum.photos/seed/standrews3/800/600",
    ],
    golfScore: 10,
    foodScore: 7,
    hotelScore: 8,
    overallScore: 8.5,
    description:
      "The home of golf. St Andrews Links is the oldest golf course in the world, a spiritual pilgrimage for every golfer.",
    body: "St Andrews is a small coastal town in Fife, Scotland, widely regarded as the birthplace of golf. The Old Course, dating back to the 15th century, has hosted The Open Championship more times than any other venue. Beyond the golf, the town offers a charming medieval streetscape, excellent seafood, and the ruined cathedral on the cliff edge.",
    published: true,
  },
  {
    slug: "pebble-beach",
    name: "Pebble Beach",
    country: "USA",
    heroImage: "https://picsum.photos/seed/pebblebeach/1200/600",
    galleryImages: [
      "https://picsum.photos/seed/pebble1/800/600",
      "https://picsum.photos/seed/pebble2/800/600",
      "https://picsum.photos/seed/pebble3/800/600",
    ],
    golfScore: 10,
    foodScore: 9,
    hotelScore: 10,
    overallScore: 9.7,
    description:
      "Arguably the most beautiful golf course in the world, draped along the cliffs of California's Monterey Peninsula.",
    body: "Pebble Beach Golf Links sits on 17-Mile Drive along the rugged Monterey coastline in California. Opened in 1919, it has hosted six US Opens and is consistently ranked the number one public golf course in the United States. The Lodge at Pebble Beach is world-class, and the surrounding restaurants — including Roy's and Stillwater Bar & Grill — make the full trip genuinely outstanding.",
    published: true,
  },
  {
    slug: "royal-melbourne",
    name: "Royal Melbourne",
    country: "Australia",
    heroImage: "https://picsum.photos/seed/royalmelbourne/1200/600",
    galleryImages: [
      "https://picsum.photos/seed/melbourne1/800/600",
      "https://picsum.photos/seed/melbourne2/800/600",
      "https://picsum.photos/seed/melbourne3/800/600",
    ],
    golfScore: 9,
    foodScore: 8,
    hotelScore: 7,
    overallScore: 8.0,
    description:
      "Australia's finest club, designed by Alister MacKenzie. Pure sandbelt golf at its absolute best.",
    body: "Royal Melbourne Golf Club, founded in 1891, is home to two of Australia's most celebrated courses — the West Course and the East Course, both designed in the sandbelt tradition. Alister MacKenzie's West Course is ranked among the top 10 courses in the world. Melbourne itself is one of the world's great food cities, and the club's proximity to the CBD makes this one of the most well-rounded golf trips you can plan in the southern hemisphere.",
    published: true,
  },
];

async function main() {
  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {},
      create: dest,
    });
  }
  console.log("Seeded 3 destinations.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
