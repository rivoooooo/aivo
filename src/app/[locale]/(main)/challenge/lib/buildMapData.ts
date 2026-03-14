import type { Node, Edge } from '@xyflow/react';
import type { Challenge, Category } from '@/server/lib/db/schema';
import type { ChallengeNodeData, NodeStatus, UserProgress } from './types';
import { applyDagreLayout } from './layoutWithDagre';

export function buildMapData(
  challenges: (Challenge & { categoryId: string | null })[],
  categories: Category[],
  userProgress: UserProgress[] | null
): { nodes: Node<ChallengeNodeData>[]; edges: Edge[] } {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const progressMap = new Map(
    (userProgress ?? []).map((p) => [p.challengeId, p.status])
  );

  // Build nodes
  const rawNodes: Node<ChallengeNodeData>[] = challenges.map((challenge) => ({
    id: challenge.id,
    type: 'challenge',
    position: { x: 0, y: 0 },
    draggable: false,
    selectable: true,
    data: {
      challenge,
      category: challenge.categoryId
        ? categoryMap.get(challenge.categoryId)!
        : ({} as Category),
      status: userProgress
        ? (progressMap.get(challenge.id) as NodeStatus) ?? 'available'
        : 'available',
    },
  }));

  // Build edges (connect challenges within same category by display order)
  const edges: Edge[] = [];
  categories.forEach((category) => {
    const categoryChals = challenges
      .filter((c) => c.categoryId === category.id)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    categoryChals.forEach((chal, i) => {
      if (i === 0) return;
      const prev = categoryChals[i - 1];
      const isActivated = progressMap.get(prev.id) === 'completed';

      edges.push({
        id: `${prev.id}->${chal.id}`,
        source: prev.id,
        target: chal.id,
        type: 'smoothstep',
        style: {
          stroke: isActivated ? 'var(--primary)' : 'var(--border)',
          strokeWidth: isActivated ? 1.5 : 1,
          strokeDasharray: isActivated ? undefined : '6 4',
          opacity: isActivated ? 0.8 : 0.5,
        },
        animated: false,
      });
    });
  });

  // Apply dagre layout
  const nodes = applyDagreLayout(rawNodes, edges);
  return { nodes, edges };
}
