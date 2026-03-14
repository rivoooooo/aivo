'use client';

import { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { buildMapData } from './lib/buildMapData';
import { ChallengeNode } from './nodes/ChallengeNode';
import { ChallengeDetailCard } from './components/ChallengeDetailCard';
import { AchievementBanner } from './components/AchievementBanner';
import { ProgressPanel } from './components/ProgressPanel';
import { MapControls } from './components/MapControls';
import { FilterToolbar } from './components/FilterToolbar';
import type { Challenge, Category, User } from '@/server/lib/db/schema';
import type { UserProgress, FilterState, ChallengeNodeData } from './lib/types';

const nodeTypes = { challenge: ChallengeNode };

interface Props {
  categories: Category[];
  challenges: (Challenge & { categoryId: string | null })[];
  user: User | null;
  userProgress: UserProgress[] | null;
}

export default function ChallengesMap(props: Props) {
  return (
    <ReactFlowProvider>
      <ChallengesMapInner {...props} />
    </ReactFlowProvider>
  );
}

function ChallengesMapInner({
  categories,
  challenges,
  user,
  userProgress,
}: Props) {
  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow();

  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    difficulty: 'all',
    search: '',
  });

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [selectedNodeRect, setSelectedNodeRect] = useState<DOMRect | null>(
    null
  );
  const [achievement, setAchievement] = useState<{
    name: string;
    xp: number;
  } | null>(null);

  const { nodes: rawNodes, edges } = useMemo(
    () => buildMapData(challenges, categories, userProgress),
    [challenges, categories, userProgress]
  );

  const nodes = useMemo(() => {
    return rawNodes.map((node) => {
      const data = node.data as ChallengeNodeData;
      const { challenge } = data;
      const matchCat =
        filter.category === 'all' || challenge.categoryId === filter.category;
      const matchDiff =
        filter.difficulty === 'all' ||
        challenge.difficulty === filter.difficulty;
      const matchSrch =
        !filter.search ||
        challenge.name.toLowerCase().includes(filter.search.toLowerCase());

      const visible = matchCat && matchDiff && matchSrch;

      return {
        ...node,
        style: {
          opacity: visible ? 1 : 0.12,
          transition: 'opacity 150ms',
        },
      };
    });
  }, [rawNodes, filter]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const nodeData = node.data as ChallengeNodeData;
      const el = document.querySelector(`[data-id="${node.id}"]`);
      if (el) {
        setSelectedNodeRect(el.getBoundingClientRect());
      }
      setSelectedChallenge(nodeData.challenge as Challenge);
    },
    []
  );

  const handlePaneClick = useCallback(() => {
    setSelectedChallenge(null);
    setSelectedNodeRect(null);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: 'calc(100vh - 200px)',
        position: 'relative',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <FilterToolbar
        categories={categories}
        filter={filter}
        onChange={setFilter}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        panOnScroll={false}
        minZoom={0.3}
        maxZoom={2.0}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="var(--border)"
          style={{ opacity: 0.4 }}
        />
      </ReactFlow>

      <ChallengeDetailCard
        challenge={selectedChallenge}
        originRect={selectedNodeRect}
        user={user}
        onClose={() => {
          setSelectedChallenge(null);
          setSelectedNodeRect(null);
        }}
      />

      <AchievementBanner
        achievement={achievement}
        onDismiss={() => setAchievement(null)}
      />

      {user && userProgress && (
        <ProgressPanel
          challenges={challenges}
          userProgress={userProgress}
        />
      )}

      <MapControls
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onReset={() => setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 })}
        onFitView={() => fitView({ duration: 400, padding: 0.15 })}
      />
    </div>
  );
}
