import type { Challenge, Category, UserProgress as SchemaUserProgress } from '@/server/lib/db/schema';

export type NodeStatus = 'available' | 'in_progress' | 'completed';

export type ChallengeNodeData = Record<string, unknown> & {
  challenge: Challenge & { categoryId: string | null };
  category: Category;
  status: NodeStatus;
};

// 使用 schema 中的 UserProgress 类型
export type UserProgress = SchemaUserProgress;

export type FilterState = {
  category: string;
  difficulty: string;
  search: string;
};
