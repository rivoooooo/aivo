import { pgTable, text, timestamp, uuid, integer, uniqueIndex, index, json, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Better Auth 相关表 - 完全不动
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at'),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
  userIdIdx: index('idx_sessions_user_id').on(table.userId),
}));

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
}, (table) => ({
  userIdIdx: index('idx_accounts_user_id').on(table.userId),
  providerIdIdx: index('idx_accounts_provider_id').on(table.providerId, table.accountId),
}));

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
}, (table) => ({
  identifierIdx: index('idx_verifications_identifier').on(table.identifier),
}));

// categories 表（扩展）- 添加技能地图相关字段
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon').notNull(),
  displayOrder: integer('display_order').default(0),
  // 新增字段：技能地图相关
  color: text('color'), // 分类主题色（用于地图上区域颜色）
  mapX: integer('map_x'), // 在技能地图上的大致 X 坐标
  mapY: integer('map_y'), // 在技能地图上的大致 Y 坐标
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// challenges 表（扩展）- 删除 sandboxId，添加新字段
export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  // 删除 sandboxId 字段（已合并到 challengeResources）
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  difficulty: text('difficulty').notNull(),
  language: text('language').notNull().default('en'),
  displayOrder: integer('display_order').default(0),
  starterCode: json('starter_code').$type<ChallengeFile[]>(),
  isPublished: boolean('is_published').default(false).notNull(),
  // 新增字段
  xpReward: integer('xp_reward').notNull().default(100), // 完成挑战获得的 XP
  estimatedTime: integer('estimated_time'), // 预计完成分钟数
  isDaily: boolean('is_daily').default(false), // 是否可作为每日任务
  tags: text('tags').array(), // 标签数组（PostgreSQL 原生数组）
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  slugLanguageUnique: uniqueIndex('challenges_slug_language_unique').on(table.slug, table.language),
  languageIdx: index('idx_challenges_language').on(table.language),
  slugLanguageIdx: index('idx_challenges_slug_language').on(table.slug, table.language),
  isDailyIdx: index('idx_challenges_is_daily').on(table.isDaily), // 每日挑战查询索引
}));

// ChallengeFile 类型定义（统一在此定义）
export interface ChallengeFile {
  filename: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'vue';
  content: string;
}

// challengeResources 表（重构，替代原 sandboxes）
// 合并 sandboxes 和 challengeResources 的功能
export const challengeResources = pgTable('challenge_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'html' | 'react' | 'vue' | 'css' | 'javascript' | 'typescript'
  importSource: text('import_source'),
  initCode: json('init_code').$type<ChallengeFile[]>(), // 初始代码模板
  codeSource: json('code_source').$type<ChallengeFile[]>(), // 参考答案
  displayOrder: integer('display_order').default(0),
  // 新增字段
  name: text('name'), // 资源名称（如 "HTML + CSS 沙箱"）
  testCases: json('test_cases').$type<{ type: 'manual' | 'auto'; cases: unknown[] }>(), // 测试用例
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdIdx: index('idx_challenge_resources_challenge_id').on(table.challengeId),
  typeIdx: index('idx_challenge_resources_type').on(table.type),
  challengeTypeUnique: uniqueIndex('challenge_resources_challenge_type_unique').on(table.challengeId, table.type),
}));

// challengeDependencies 表 - 保留不变
export const challengeDependencies = pgTable('challenge_dependencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  dependsOn: uuid('depends_on').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdIdx: index('idx_challenge_dependencies_challenge_id').on(table.challengeId),
  dependsOnIdx: index('idx_challenge_dependencies_depends_on').on(table.dependsOn),
  challengeDependsUnique: uniqueIndex('challenge_dependencies_challenge_depends_unique').on(table.challengeId, table.dependsOn),
}));

// admins 表 - 保留不变
export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// user_progress 表（新建）- 用户进度追踪
export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  status: text('status').notNull(), // 'in_progress' | 'completed'
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  xpEarned: integer('xp_earned').default(0),
  userCode: json('user_code').$type<ChallengeFile[]>(), // 用户最后保存的代码
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('idx_user_progress_user_id').on(table.userId),
  challengeIdIdx: index('idx_user_progress_challenge_id').on(table.challengeId),
  userChallengeUnique: uniqueIndex('user_progress_user_challenge_unique').on(table.userId, table.challengeId),
  statusIdx: index('idx_user_progress_status').on(table.status),
}));

// ========== Relations 定义 ==========

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  admin: many(admins),
  progress: many(userProgress),
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
  dependencies: many(challengeDependencies),
  progress: many(userProgress),
}));

export const challengeResourcesRelations = relations(challengeResources, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeResources.challengeId],
    references: [challenges.id],
  }),
}));

export const challengeDependenciesRelations = relations(challengeDependencies, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeDependencies.challengeId],
    references: [challenges.id],
  }),
  dependsOnChallenge: one(challenges, {
    fields: [challengeDependencies.dependsOn],
    references: [challenges.id],
    relationName: 'depends_on_challenge',
  }),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(users, {
    fields: [admins.userId],
    references: [users.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  challenge: one(challenges, {
    fields: [userProgress.challengeId],
    references: [challenges.id],
  }),
}));

// ========== 类型导出 ==========

// 基础表类型
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;

export type ChallengeResource = typeof challengeResources.$inferSelect;
export type NewChallengeResource = typeof challengeResources.$inferInsert;

export type ChallengeDependency = typeof challengeDependencies.$inferSelect;
export type NewChallengeDependency = typeof challengeDependencies.$inferInsert;

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

// 新增 user_progress 类型
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;

// Better Auth 相关类型
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
