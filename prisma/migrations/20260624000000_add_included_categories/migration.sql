-- Add includedCategories column to Destination
-- Defaults to all 9 categories for backward compatibility with existing rows
ALTER TABLE "Destination" ADD COLUMN IF NOT EXISTS "includedCategories" JSONB NOT NULL DEFAULT '["golf","restaurants","hotels","transportation","weather","city","friendliness","sights","extras"]';
