-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "galleryImages" TEXT NOT NULL DEFAULT '[]',
    "golfScore" INTEGER NOT NULL,
    "foodScore" INTEGER NOT NULL,
    "hotelScore" INTEGER NOT NULL,
    "overallScore" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "twitterEmbed" TEXT,
    "instagramEmbed" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");
