import { db } from '../db/index';
import {
  categories,
  challenges,
  challengeResources,
  challengeDependencies,
  userProgress,
  type User,
  type Category,
  type Challenge,
  type ChallengeResource,
  type UserProgress,
} from '../db/schema';
import { eq, asc, and, like, or, sql, inArray, isNull, desc } from 'drizzle-orm';
import type {
  ChallengeWithResources,
  ChallengeMapNode,
  MapCategory,
  ChallengeFile,
} from '@/types/challenge';

export interface CategoryWithChallenges {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  displayOrder: number;
  color: string | null;
  mapX: number | null;
  mapY: number | null;
  challenges: {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    difficulty: string;
    language: string;
    xpReward: number;
    estimatedTime: number | null;
    isDaily: boolean | null;
    tags: string[] | null;
  }[];
}

export interface ChallengesListParams {
  language?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ChallengesListResult {
  data: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    difficulty: string;
    language: string;
    categoryId: string | null;
    xpReward: number;
    estimatedTime: number | null;
    isDaily: boolean | null;
    tags: string[] | null;
    category?: {
      id: string;
      name: string;
      icon: string;
    };
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ========== 分类相关查询 ==========

export async function getAllCategories(): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder));
}

export async function getCategoriesWithChallenges(
  language: string = 'en'
): Promise<CategoryWithChallenges[]> {
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
        xpReward: challenges.xpReward,
        estimatedTime: challenges.estimatedTime,
        isDaily: challenges.isDaily,
        tags: challenges.tags,
      })
      .from(challenges)
      .where(
        and(
          eq(challenges.categoryId, category.id),
          eq(challenges.language, language)
        )
      );

    result.push({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      displayOrder: category.displayOrder ?? 0,
      color: category.color,
      mapX: category.mapX,
      mapY: category.mapY,
      challenges: categoryChallenges,
    });
  }

  return result;
}

// ========== 挑战相关查询 ==========

export async function getChallengeBySlug(
  slug: string,
  language: string = 'en'
): Promise<ChallengeWithResources | null> {
  const challenge = await db.query.challenges.findFirst({
    where: and(
      eq(challenges.slug, slug),
      eq(challenges.language, language)
    ),
  });

  if (!challenge) return null;

  const [category, resources] = await Promise.all([
    challenge.categoryId
      ? db.query.categories.findFirst({
          where: eq(categories.id, challenge.categoryId),
        })
      : Promise.resolve(null),
    db
      .select()
      .from(challengeResources)
      .where(eq(challengeResources.challengeId, challenge.id)),
  ]);

  return {
    ...challenge,
    category: category!,
    resources,
  };
}

export async function getChallengeWithResources(
  slug: string,
  language: string = 'en',
  type?: string
): Promise<ChallengeWithResources | null> {
  const challenge = await db.query.challenges.findFirst({
    where: and(
      eq(challenges.slug, slug),
      eq(challenges.language, language)
    ),
  });

  if (!challenge) return null;

  const [category, resources] = await Promise.all([
    challenge.categoryId
      ? db.query.categories.findFirst({
          where: eq(categories.id, challenge.categoryId),
        })
      : Promise.resolve(null),
    type
      ? db
          .select()
          .from(challengeResources)
          .where(
            and(
              eq(challengeResources.challengeId, challenge.id),
              eq(challengeResources.type, type)
            )
          )
      : db
          .select()
          .from(challengeResources)
          .where(eq(challengeResources.challengeId, challenge.id)),
  ]);

  return {
    ...challenge,
    category: category!,
    resources,
  };
}

export async function getChallengesList(
  params: ChallengesListParams
): Promise<ChallengesListResult> {
  const {
    language = 'en',
    category,
    difficulty,
    page = 1,
    limit = 10,
    search,
  } = params;

  const conditions: any[] = [eq(challenges.language, language)];

  if (category) {
    const categoryResult = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, category))
      .limit(1);

    if (categoryResult.length > 0) {
      conditions.push(eq(challenges.categoryId, categoryResult[0].id));
    }
  }

  if (difficulty) {
    conditions.push(eq(challenges.difficulty, difficulty));
  }

  if (search) {
    conditions.push(
      or(
        like(challenges.name, `%${search}%`),
        like(challenges.description, `%${search}%`)
      )
    );
  }

  const whereCondition =
    conditions.length > 1 ? and(...conditions) : conditions[0];

  const offset = (page - 1) * limit;

  const baseQuery = db
    .select({
      id: challenges.id,
      name: challenges.name,
      slug: challenges.slug,
      description: challenges.description,
      difficulty: challenges.difficulty,
      language: challenges.language,
      categoryId: challenges.categoryId,
      xpReward: challenges.xpReward,
      estimatedTime: challenges.estimatedTime,
      isDaily: challenges.isDaily,
      tags: challenges.tags,
    })
    .from(challenges)
    .$dynamic();

  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(challenges)
    .$dynamic();

  const [data, countResult] = await Promise.all([
    whereCondition
      ? baseQuery
          .where(whereCondition)
          .orderBy(asc(challenges.createdAt))
          .limit(limit)
          .offset(offset)
      : baseQuery
          .orderBy(asc(challenges.createdAt))
          .limit(limit)
          .offset(offset),
    whereCondition ? countQuery.where(whereCondition) : countQuery,
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  const dataWithCategory = await Promise.all(
    data.map(async (item) => {
      const categoryResult = item.categoryId
        ? await db
            .select({
              id: categories.id,
              name: categories.name,
              icon: categories.icon,
            })
            .from(categories)
            .where(eq(categories.id, item.categoryId))
            .limit(1)
        : [];

      return {
        ...item,
        category: categoryResult[0] || null,
      };
    })
  );

  return {
    data: dataWithCategory,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getChallengeResourcesByChallengeSlug(
  slug: string,
  language: string = 'en'
): Promise<ChallengeResource[]> {
  const challenge = await db.query.challenges.findFirst({
    where: and(
      eq(challenges.slug, slug),
      eq(challenges.language, language)
    ),
  });

  if (!challenge) return [];

  return db
    .select()
    .from(challengeResources)
    .where(eq(challengeResources.challengeId, challenge.id));
}

export async function getChallengeResourcesByType(
  challengeId: string,
  type: string
): Promise<ChallengeResource[]> {
  return db
    .select()
    .from(challengeResources)
    .where(
      and(
        eq(challengeResources.challengeId, challengeId),
        eq(challengeResources.type, type)
      )
    );
}

export async function getAllChallengeResources(
  challengeId: string
): Promise<ChallengeResource[]> {
  return db
    .select()
    .from(challengeResources)
    .where(eq(challengeResources.challengeId, challengeId));
}

export async function getChallengesByLanguage(
  language: string
): Promise<Challenge[]> {
  return db
    .select()
    .from(challenges)
    .where(eq(challenges.language, language));
}

export async function getAvailableLanguages(): Promise<string[]> {
  const result = await db
    .selectDistinct({ language: challenges.language })
    .from(challenges);
  return result.map((r) => r.language);
}

export async function getAvailableTypes(): Promise<string[]> {
  const result = await db
    .selectDistinct({ type: challengeResources.type })
    .from(challengeResources);
  return result.map((r) => r.type);
}

export async function getAvailableDifficulties(): Promise<string[]> {
  const result = await db
    .selectDistinct({ difficulty: challenges.difficulty })
    .from(challenges);
  return result.map((r) => r.difficulty);
}

// ========== 技能地图相关查询 ==========

export async function getAllChallengesForMap(
  userId?: string
): Promise<MapCategory[]> {
  // 获取所有分类
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder));

  // 获取所有已发布挑战
  const allChallenges = await db
    .select({
      id: challenges.id,
      slug: challenges.slug,
      name: challenges.name,
      difficulty: challenges.difficulty,
      categoryId: challenges.categoryId,
      xpReward: challenges.xpReward,
      language: challenges.language,
    })
    .from(challenges)
    .where(eq(challenges.isPublished, true));

  // 如果提供了 userId，获取用户进度
  let userProgressMap: Map<string, string> = new Map();
  if (userId) {
    const progress = await db
      .select({
        challengeId: userProgress.challengeId,
        status: userProgress.status,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    userProgressMap = new Map(
      progress.map((p) => [p.challengeId, p.status])
    );
  }

  // 构建 MapCategory 数组
  const mapCategories: MapCategory[] = allCategories.map((category) => {
    const categoryChallenges = allChallenges
      .filter((c) => c.categoryId === category.id)
      .map((challenge): ChallengeMapNode => {
        const progressStatus = userProgressMap.get(challenge.id);
        return {
          id: challenge.id,
          slug: challenge.slug,
          name: challenge.name,
          difficulty: challenge.difficulty,
          categoryId: challenge.categoryId!,
          xpReward: challenge.xpReward,
          status: (progressStatus as 'available' | 'in_progress' | 'completed') || 'available',
        };
      });

    return {
      ...category,
      challenges: categoryChallenges,
    };
  });

  return mapCategories;
}

// ========== 每日挑战查询 ==========

export async function getDailyChallenge(
  language: string = 'en'
): Promise<ChallengeWithResources | null> {
  // 从 isDaily=true 的挑战中随机选择一个
  const dailyChallenges = await db
    .select()
    .from(challenges)
    .where(
      and(eq(challenges.isDaily, true), eq(challenges.language, language))
    );

  if (dailyChallenges.length === 0) return null;

  // 随机选择一个
  const randomIndex = Math.floor(Math.random() * dailyChallenges.length);
  const challenge = dailyChallenges[randomIndex];

  const [category, resources] = await Promise.all([
    challenge.categoryId
      ? db.query.categories.findFirst({
          where: eq(categories.id, challenge.categoryId),
        })
      : Promise.resolve(null),
    db
      .select()
      .from(challengeResources)
      .where(eq(challengeResources.challengeId, challenge.id)),
  ]);

  return {
    ...challenge,
    category: category!,
    resources,
  };
}

// ========== 用户进度相关查询 ==========

export async function getUserProgress(
  userId: string
): Promise<UserProgress[]> {
  return db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .orderBy(desc(userProgress.updatedAt));
}

export async function getUserProgressByChallenge(
  userId: string,
  challengeId: string
): Promise<UserProgress | null> {
  const result = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.challengeId, challengeId)
      )
    )
    .limit(1);

  return result[0] || null;
}

export interface UpsertUserProgressData {
  userId: string;
  challengeId: string;
  status: 'in_progress' | 'completed';
  userCode?: ChallengeFile[];
  xpEarned?: number;
}

export async function upsertUserProgress(
  data: UpsertUserProgressData
): Promise<UserProgress> {
  const { userId, challengeId, status, userCode, xpEarned } = data;

  // 检查是否已存在记录
  const existing = await getUserProgressByChallenge(userId, challengeId);

  if (existing) {
    // 更新现有记录
    const updateData: Partial<typeof userProgress.$inferInsert> = {
      status,
      updatedAt: new Date(),
    };

    if (userCode !== undefined) {
      updateData.userCode = userCode;
    }

    if (xpEarned !== undefined) {
      updateData.xpEarned = xpEarned;
    }

    if (status === 'completed' && !existing.completedAt) {
      updateData.completedAt = new Date();
    }

    const result = await db
      .update(userProgress)
      .set(updateData)
      .where(eq(userProgress.id, existing.id))
      .returning();

    return result[0];
  } else {
    // 创建新记录
    const result = await db
      .insert(userProgress)
      .values({
        userId,
        challengeId,
        status,
        userCode: userCode || [],
        xpEarned: xpEarned || 0,
        startedAt: new Date(),
        completedAt: status === 'completed' ? new Date() : null,
      })
      .returning();

    return result[0];
  }
}

export interface UserStats {
  totalXp: number;
  completedCount: number;
  inProgressCount: number;
  streakDays: number;
  progressList: UserProgress[];
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const progressList = await getUserProgress(userId);

  const completedCount = progressList.filter(
    (p) => p.status === 'completed'
  ).length;
  const inProgressCount = progressList.filter(
    (p) => p.status === 'in_progress'
  ).length;
  const totalXp = progressList.reduce((sum, p) => sum + (p.xpEarned || 0), 0);

  // 计算连续天数（简化实现，实际可能需要更复杂的逻辑）
  const streakDays = calculateStreakDays(progressList);

  return {
    totalXp,
    completedCount,
    inProgressCount,
    streakDays,
    progressList,
  };
}

function calculateStreakDays(progressList: UserProgress[]): number {
  if (progressList.length === 0) return 0;

  // 获取所有完成日期
  const completedDates = progressList
    .filter((p) => p.status === 'completed' && p.completedAt)
    .map((p) => new Date(p.completedAt!).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index) // 去重
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (completedDates.length === 0) return 0;

  // 计算连续天数
  let streak = 1;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // 如果今天没有完成，检查昨天
  if (completedDates[0] !== today && completedDates[0] !== yesterday) {
    return 0;
  }

  for (let i = 0; i < completedDates.length - 1; i++) {
    const current = new Date(completedDates[i]);
    const next = new Date(completedDates[i + 1]);
    const diffDays = (current.getTime() - next.getTime()) / (1000 * 3600 * 24);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ========== 依赖关系查询 ==========

export interface ChallengeDependencyWithDetails {
  id: string;
  challengeId: string;
  dependsOn: string;
  dependsOnChallenge?: {
    id: string;
    name: string;
    slug: string;
    difficulty: string;
  };
}

export async function getChallengeDependencies(
  challengeId: string
): Promise<ChallengeDependencyWithDetails[]> {
  const dependencies = await db
    .select()
    .from(challengeDependencies)
    .where(eq(challengeDependencies.challengeId, challengeId));

  const dependenciesWithDetails = await Promise.all(
    dependencies.map(async (dep) => {
      const dependsOnChallenge = await db
        .select({
          id: challenges.id,
          name: challenges.name,
          slug: challenges.slug,
          difficulty: challenges.difficulty,
        })
        .from(challenges)
        .where(eq(challenges.id, dep.dependsOn))
        .limit(1);

      return {
        ...dep,
        dependsOnChallenge: dependsOnChallenge[0] || null,
      };
    })
  );

  return dependenciesWithDetails;
}

export async function getChallengeDependents(
  challengeId: string
): Promise<ChallengeDependencyWithDetails[]> {
  const dependents = await db
    .select()
    .from(challengeDependencies)
    .where(eq(challengeDependencies.dependsOn, challengeId));

  const dependentsWithDetails = await Promise.all(
    dependents.map(async (dep) => {
      const challenge = await db
        .select({
          id: challenges.id,
          name: challenges.name,
          slug: challenges.slug,
          difficulty: challenges.difficulty,
        })
        .from(challenges)
        .where(eq(challenges.id, dep.challengeId))
        .limit(1);

      return {
        ...dep,
        dependsOnChallenge: challenge[0] || null,
      };
    })
  );

  return dependentsWithDetails;
}

export interface ChallengeDependencyGraph {
  challengeId: string;
  challengeName: string;
  challengeSlug: string;
  dependsOn: string[];
  dependents: string[];
}

export async function getAllChallengeDependencies(): Promise<
  ChallengeDependencyGraph[]
> {
  const allChallenges = await db
    .select({
      id: challenges.id,
      name: challenges.name,
      slug: challenges.slug,
    })
    .from(challenges);

  const allDependencies = await db.select().from(challengeDependencies);

  const graphMap = new Map<string, ChallengeDependencyGraph>();

  for (const challenge of allChallenges) {
    graphMap.set(challenge.id, {
      challengeId: challenge.id,
      challengeName: challenge.name,
      challengeSlug: challenge.slug,
      dependsOn: [],
      dependents: [],
    });
  }

  for (const dep of allDependencies) {
    const challengeGraph = graphMap.get(dep.challengeId);
    const dependsOnGraph = graphMap.get(dep.dependsOn);

    if (challengeGraph) {
      challengeGraph.dependsOn.push(dep.dependsOn);
    }
    if (dependsOnGraph) {
      dependsOnGraph.dependents.push(dep.challengeId);
    }
  }

  return Array.from(graphMap.values());
}

// ========== 用户相关查询 ==========

export async function getCurrentUser(): Promise<User | null> {
  // Note: This is a placeholder implementation.
  // In a real implementation, you would get the current user from the session.
  // For now, return null to indicate not logged in.
  return null;
}
