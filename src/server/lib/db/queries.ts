import { db } from '../db/index';
import { categories, challenges, challengeResources } from '../db/schema';
import { eq, asc, and } from 'drizzle-orm';

export interface CategoryWithChallenges {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  displayOrder: number;
  challenges: {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    difficulty: string;
    language: string;
  }[];
}

export async function getCategoriesWithChallenges(language: string = 'en'): Promise<CategoryWithChallenges[]> {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder));

  const result: CategoryWithChallenges[] = [];

  for (const category of allCategories) {
    const categoryChallenges = await db
      .select({
        id: challenges.id,
        name: challenges.name,
        description: challenges.description,
        slug: challenges.slug,
        difficulty: challenges.difficulty,
        language: challenges.language,
      })
      .from(challenges)
      .where(and(
        eq(challenges.categoryId, category.id),
        eq(challenges.language, language)
      ));

    result.push({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      displayOrder: category.displayOrder ?? 0,
      challenges: categoryChallenges,
    });
  }

  return result;
}

export async function getChallengeBySlug(slug: string, language: string = 'en') {
  const challenge = await db.query.challenges.findFirst({
    where: and(
      eq(challenges.slug, slug),
      eq(challenges.language, language)
    ),
  });

  if (!challenge) return null;

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, challenge.categoryId),
  });

  return {
    ...challenge,
    category,
  };
}

export async function getChallengeWithResources(slug: string, language: string = 'en', type?: string) {
  const challenge = await getChallengeBySlug(slug, language);
  if (!challenge) return null;

  const resources = await db
    .select()
    .from(challengeResources)
    .where(type 
      ? and(
          eq(challengeResources.challengeId, challenge.id),
          eq(challengeResources.type, type)
        )
      : eq(challengeResources.challengeId, challenge.id)
    );

  return {
    ...challenge,
    resources,
  };
}

export async function getChallengeResourcesByType(challengeId: string, type: string) {
  return db
    .select()
    .from(challengeResources)
    .where(and(
      eq(challengeResources.challengeId, challengeId),
      eq(challengeResources.type, type)
    ));
}

export async function getAllChallengeResources(challengeId: string) {
  return db
    .select()
    .from(challengeResources)
    .where(eq(challengeResources.challengeId, challengeId));
}

export async function getChallengesByLanguage(language: string) {
  return db
    .select()
    .from(challenges)
    .where(eq(challenges.language, language));
}

export async function getAvailableLanguages() {
  const result = await db
    .selectDistinct({ language: challenges.language })
    .from(challenges);
  return result.map(r => r.language);
}

export async function getAvailableTypes() {
  const result = await db
    .selectDistinct({ type: challengeResources.type })
    .from(challengeResources);
  return result.map(r => r.type);
}
