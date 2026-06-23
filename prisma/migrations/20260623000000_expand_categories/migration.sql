-- Add premium fields to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "premiumSince" TIMESTAMP(3);

-- Add new location fields to Destination
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "continent" TEXT NOT NULL DEFAULT 'Unknown';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Add per-category JSON columns
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "golf" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "restaurants" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "hotels" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "transportation" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "weather" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "city" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "friendliness" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "sights" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "extras" JSONB NOT NULL DEFAULT '{"score":0,"description":"","media":[],"socialLinks":[]}';

-- Drop old columns no longer in the schema
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "galleryImages";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "golfScore";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "foodScore";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "hotelScore";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "body";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "twitterEmbed";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "instagramEmbed";
