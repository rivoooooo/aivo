// 从 schema 推导的基础类型
import type { categories, challenges, challengeResources, userProgress } from '@/server/lib/db/schema';

export type Category = typeof categories.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type ChallengeResource = typeof challengeResources.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;

// ChallengeFile（统一定义，消除重复）
export interface ChallengeFile {
  filename: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'vue';
  content: string;
}

// 组合类型（供页面使用）
export interface ChallengeWithResources extends Challenge {
  resources: ChallengeResource[];
  category: Category;
}

// 地图节点类型（供技能地图组件使用）
export interface ChallengeMapNode {
  id: string;
  slug: string;
  name: string;
  difficulty: string;
  categoryId: string;
  xpReward: number;
  status: 'available' | 'in_progress' | 'completed'; // 登录后才有真实值
}

// 地图数据类型
export interface MapCategory extends Category {
  challenges: ChallengeMapNode[];
}

// 难度等级配置（替代硬编码）
export const difficultyColors: Record<string, string> = {
  EASY: 'var(--success)',
  MEDIUM: 'var(--warning)',
  HARD: 'var(--chart-3)',
  EXPERT: 'var(--error)',
};

export const difficultyLabels: Record<string, { zh: string; en: string }> = {
  EASY: { zh: '简单', en: 'Easy' },
  MEDIUM: { zh: '中等', en: 'Medium' },
  HARD: { zh: '困难', en: 'Hard' },
  EXPERT: { zh: '专家', en: 'Expert' },
};

// 类型标签配置（替代硬编码）
export const typeLabels: Record<string, { zh: string; en: string }> = {
  html: { zh: 'HTML', en: 'HTML' },
  css: { zh: 'CSS', en: 'CSS' },
  javascript: { zh: 'JavaScript', en: 'JavaScript' },
  typescript: { zh: 'TypeScript', en: 'TypeScript' },
  react: { zh: 'React', en: 'React' },
  vue: { zh: 'Vue', en: 'Vue' },
};

// 语言映射
export const localeToLanguage = (locale: string): string => {
  const map: Record<string, string> = {
    zh: 'zh',
    'zh-CN': 'zh',
    en: 'en',
    ja: 'ja',
  };
  return map[locale] || 'en';
};
