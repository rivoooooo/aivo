import type { Challenge, Category } from '@/server/lib/db/schema';

export type NodeStatus = 'available' | 'in_progress' | 'completed';

export type ChallengeNodeData = Record<string, unknown> & {
  challenge: Challenge & { categoryId: string | null };
  category: Category;
  status: NodeStatus;
};

export type UserProgress = {
  challengeId: string;
  status: NodeStatus;
  completedAt?: Date | null;
};

export type FilterState = {
  category: string;
  difficulty: string;
  search: string;
};
