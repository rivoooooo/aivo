# AI-Era 架构重设计方案

基于现状报告，为 AI-Era 设计一套"完全数据驱动"的挑战系统架构。

## 核心目标

1. 所有挑战内容存在数据库里，代码里不出现任何题目内容
2. 新增/修改/删除题目只需要操作数据库，不需要改代码
3. 挑战系统支持多种类型（HTML / CSS / JS / React / Vue / TypeScript）
4. 架构清晰，前端开发者能轻松上手维护

---

## 新版数据库 Schema

```typescript
// src/server/lib/db/schema.ts

import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  integer, 
  uniqueIndex, 
  index, 
  json, 
  boolean,
  varchar,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============ Enums ============
export const difficultyEnum = pgEnum('difficulty', ['EASY', 'MEDIUM', 'HARD', 'EXPERT']);
export const challengeStatusEnum = pgEnum('challenge_status', ['available', 'in_progress', 'completed', 'locked']);
export const attemptStatusEnum = pgEnum('attempt_status', ['started', 'submitted', 'passed', 'failed']);

// ============ Better Auth Tables (保留) ============
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

// ============ 分类系统 ============
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }).notNull(),
  color: varchar('color', { length: 7 }).default('#33ff00'),
  displayOrder: integer('display_order').default(0),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============ 挑战核心表 ============
export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  
  // 标识
  slug: varchar('slug', { length: 100 }).notNull(),
  language: varchar('language', { length: 10 }).notNull().default('en'),
  
  // 基本信息
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  shortDescription: varchar('short_description', { length: 500 }),
  
  // 难度与奖励
  difficulty: difficultyEnum('difficulty').notNull(),
  xpReward: integer('xp_reward').notNull().default(100),
  estimatedTime: integer('estimated_time'),
  
  // 状态
  isPublished: boolean('is_published').default(false).notNull(),
  displayOrder: integer('display_order').default(0),
  
  // 元数据
  prerequisites: json('prerequisites').$type<string[]>(),
  tags: json('tags').$type<string[]>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugLanguageUnique: uniqueIndex('challenges_slug_language_unique').on(table.slug, table.language),
  categoryIdx: index('idx_challenges_category').on(table.categoryId),
  difficultyIdx: index('idx_challenges_difficulty').on(table.difficulty),
  publishedIdx: index('idx_challenges_published').on(table.isPublished),
}));

// ============ 挑战资源表 ============
export const challengeFiles = pgTable('challenge_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  filename: varchar('filename', { length: 255 }).notNull(),
  language: varchar('language', { length: 50 }).notNull(),
  starterCode: text('starter_code').notNull(),
  solutionCode: text('solution_code'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdx: index('idx_challenge_files_challenge').on(table.challengeId),
  challengeFileUnique: uniqueIndex('challenge_files_challenge_filename_unique').on(table.challengeId, table.filename),
}));

// ============ 依赖引入配置 ============
export const challengeImports = pgTable('challenge_imports', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  packageName: varchar('package_name', { length: 100 }).notNull(),
  version: varchar('version', { length: 50 }).default('latest'),
  cdnUrl: text('cdn_url').notNull(),
  importType: varchar('import_type', { length: 20 }).default('esm'),
  globalName: varchar('global_name', { length: 50 }),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdx: index('idx_challenge_imports_challenge').on(table.challengeId),
}));

// ============ 测试用例表 ============
export const challengeTests = pgTable('challenge_tests', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  testType: varchar('test_type', { length: 50 }).notNull(),
  testConfig: json('test_config').notNull(),
  isRequired: boolean('is_required').default(true).notNull(),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdx: index('idx_challenge_tests_challenge').on(table.challengeId),
}));

// ============ 提示系统 ============
export const challengeHints = pgTable('challenge_hints', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  xpCost: integer('xp_cost').default(0),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdx: index('idx_challenge_hints_challenge').on(table.challengeId),
}));

// ============ 挑战依赖关系 ============
export const challengeDependencies = pgTable('challenge_dependencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  dependsOnId: uuid('depends_on_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  challengeIdx: index('idx_challenge_dependencies_challenge').on(table.challengeId),
  dependsOnIdx: index('idx_challenge_dependencies_depends_on').on(table.dependsOnId),
  uniqueDependency: uniqueIndex('challenge_dependencies_unique').on(table.challengeId, table.dependsOnId),
}));

// ============ 用户进度系统 ============
export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  status: challengeStatusEnum('status').notNull().default('available'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  lastAttemptAt: timestamp('last_attempt_at'),
  attemptsCount: integer('attempts_count').default(0),
  hintsUsed: integer('hints_used').default(0),
  xpEarned: integer('xp_earned').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('idx_user_progress_user').on(table.userId),
  challengeIdx: index('idx_user_progress_challenge').on(table.challengeId),
  userChallengeUnique: uniqueIndex('user_progress_unique').on(table.userId, table.challengeId),
  statusIdx: index('idx_user_progress_status').on(table.status),
}));

// ============ 用户尝试记录 ============
export const challengeAttempts = pgTable('challenge_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  challengeId: uuid('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  submittedFiles: json('submitted_files').$type<{filename: string, content: string}[]>().notNull(),
  status: attemptStatusEnum('status').notNull(),
  testResults: json('test_results').$type<{
    testId: string;
    passed: boolean;
    message?: string;
  }[]>(),
  startedAt: timestamp('started_at').notNull(),
  submittedAt: timestamp('submitted_at'),
  timeSpent: integer('time_spent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('idx_challenge_attempts_user').on(table.userId),
  challengeIdx: index('idx_challenge_attempts_challenge').on(table.challengeId),
  statusIdx: index('idx_challenge_attempts_status').on(table.status),
}));

// ============ 管理员表 ============
export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ Relations ============
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  admin: many(admins),
  progress: many(userProgress),
  attempts: many(challengeAttempts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  challenges: many(challenges),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  category: one(categories, {
    fields: [challenges.categoryId],
    references: [categories.id],
  }),
  files: many(challengeFiles),
  imports: many(challengeImports),
  tests: many(challengeTests),
  hints: many(challengeHints),
  dependencies: many(challengeDependencies),
  progress: many(userProgress),
  attempts: many(challengeAttempts),
}));

// ============ Type Exports ============
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
export type ChallengeFile = typeof challengeFiles.$inferSelect;
export type NewChallengeFile = typeof challengeFiles.$inferInsert;
export type ChallengeImport = typeof challengeImports.$inferSelect;
export type NewChallengeImport = typeof challengeImports.$inferInsert;
export type ChallengeTest = typeof challengeTests.$inferSelect;
export type NewChallengeTest = typeof challengeTests.$inferInsert;
export type ChallengeHint = typeof challengeHints.$inferSelect;
export type NewChallengeHint = typeof challengeHints.$inferInsert;
export type ChallengeDependency = typeof challengeDependencies.$inferSelect;
export type NewChallengeDependency = typeof challengeDependencies.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
export type ChallengeAttempt = typeof challengeAttempts.$inferSelect;
export type NewChallengeAttempt = typeof challengeAttempts.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
```

---

## 迁移执行顺序

### 阶段 1: 数据库迁移（零停机）

```bash
# Step 1: 备份现有数据
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Step 2: 创建新表（使用 drizzle-kit push）
bun run db:push

# 验证标志：新表在数据库中可见
# \dt 应显示新表列表
```

### 阶段 2: 数据迁移

```bash
# Step 3: 运行数据迁移脚本
bun run scripts/migrate-challenges.ts

# 验证标志：
# - 新 challenges 表有数据
# - 新 challenge_files 表有数据
# - 记录数与旧表一致
```

### 阶段 3: 代码迁移

| 步骤 | 操作 | 影响文件 | 验证标志 |
|------|------|----------|----------|
| 3.1 | 更新 schema.ts | `src/server/lib/db/schema.ts` | TypeScript 编译通过 |
| 3.2 | 更新 queries.ts | `src/server/lib/db/queries.ts` | 所有查询函数返回正确类型 |
| 3.3 | 添加类型定义 | `src/types/challenge.ts` | 类型导出完整 |
| 3.4 | 更新 API 路由 | `src/app/api/challenges/**` | API 返回新格式 |
| 3.5 | 更新前端 hooks | `src/lib/hooks/useChallenge.ts` | hooks 使用新类型 |
| 3.6 | 更新页面组件 | `src/app/[locale]/(main)/challenge/**` | 页面渲染正常 |

### 阶段 4: 功能实现

| 步骤 | 功能 | 实现内容 |
|------|------|----------|
| 4.1 | 用户进度系统 | 实现 `userProgress` 表操作 |
| 4.2 | 尝试记录系统 | 实现 `challengeAttempts` 表操作 |
| 4.3 | 测试运行器 | 实现 `test-runner.ts` |
| 4.4 | 提交 API | 实现 `/api/challenges/[slug]/submit` |
| 4.5 | 提示系统 | 实现 `HintPanel` 组件 |

### 阶段 5: 清理

```bash
# Step 5: 删除旧表（确认无误后）
# - sandboxes
# - challengeResources（旧）

# Step 6: 更新 seed.ts
# 使用新的数据结构
```

### 验证清单

- [ ] 数据库迁移成功，新表结构正确
- [ ] 数据迁移完整，无数据丢失
- [ ] 挑战列表页正常显示
- [ ] 挑战详情页正常显示
- [ ] Playground 能加载初始代码
- [ ] 代码编辑和预览正常工作
- [ ] 提交功能正常
- [ ] 测试用例能正确评判
- [ ] 用户进度能正确保存
- [ ] 提示系统正常工作

---

## 架构优势总结

1. **完全数据驱动** - 所有挑战内容在数据库，无需改代码即可添加新挑战
2. **清晰的职责分离** - Server Component 获取数据，Client Component 处理交互
3. **类型安全** - 完整的 TypeScript 类型定义
4. **可扩展的测试系统** - 支持多种测试类型（DOM、控制台、函数、视觉）
5. **完善的用户进度** - 追踪学习进度、尝试历史、XP 系统
6. **解耦的渲染逻辑** - 独立的 `renderPreview` 函数，易于扩展新类型
7. **提示系统** - 支持分层提示，消耗 XP 查看
