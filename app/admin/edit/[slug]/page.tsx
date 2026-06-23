export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";
import { CATEGORY_KEYS, type CategoryData, getIncludedCategories, type CategoryKey } from "@/types/destination";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  return { title: `Edit ${params.slug} — ThomasUnderPar` };
}

export default async function EditPage({ params }: Props) {
  const dest = await prisma.destination.findUnique({ where: { slug: params.slug } });
  if (!dest) notFound();

  const categories = Object.fromEntries(
    CATEGORY_KEYS.map((k) => [k, dest[k] as unknown as CategoryData])
  ) as Record<(typeof CATEGORY_KEYS)[number], CategoryData>;

  const includedCategories = getIncludedCategories(dest.includedCategories) as CategoryKey[];

  return (
    <EditForm
      slug={dest.slug}
      initial={{
        name: dest.name,
        country: dest.country,
        continent: dest.continent,
        latitude: String(dest.latitude),
        longitude: String(dest.longitude),
        heroImage: dest.heroImage,
        overallScore: String(dest.overallScore),
        description: dest.description,
        published: dest.published,
      }}
      initialCategories={categories}
      initialIncludedCategories={includedCategories}
    />
  );
}
