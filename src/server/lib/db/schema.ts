import { pgTable, text, timestamp, uuid, integer, uniqueIndex, index, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon').notNull(),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  difficulty: text('difficulty').notNull(),
  language: text('language').notNull().default('en'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  slugLanguageUnique: uniqueIndex('challenges_slug_language_unique').on(table.slug, table.language),
  languageIdx: index('idx_challenges_language').on(table.language),
  slugLanguageIdx: index('idx_challenges_slug_language').on(table.slug, table.language),
}));

export interface ChallengeFile {
  filename: string;
  language: string;
  content: string;
}

export const challengeResources = pgTable('challenge_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  importSource: text('import_source'),
  initCode: json('init_code').$type<ChallengeFile[]>(),
  codeSource: json('code_source').$type<ChallengeFile[]>(),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdIdx: index('idx_challenge_resources_challenge_id').on(table.challengeId),
  typeIdx: index('idx_challenge_resources_type').on(table.type),
  challengeTypeUnique: uniqueIndex('challenge_resources_challenge_type_unique').on(table.challengeId, table.type),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  challenges: many(challenges),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  category: one(categories, {
    fields: [challenges.categoryId],
    references: [categories.id],
  }),
  resources: many(challengeResources),
}));

export const challengeResourcesRelations = relations(challengeResources, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeResources.challengeId],
    references: [challenges.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
export type ChallengeResource = typeof challengeResources.$inferSelect;
export type NewChallengeResource = typeof challengeResources.$inferInsert;
