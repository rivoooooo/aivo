import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import {
  upsertUserProgress,
  getUserProgressByChallenge,
} from '@/server/lib/db/queries';
import type { ChallengeFile } from '@/types/challenge';

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录状态
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      challengeId,
      status,
      userCode,
      xpEarned,
    }: {
      challengeId: string;
      status: 'in_progress' | 'completed';
      userCode?: ChallengeFile[];
      xpEarned?: number;
    } = body;

    if (!challengeId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: challengeId, status' },
        { status: 400 }
      );
    }

    if (!['in_progress', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "in_progress" or "completed"' },
        { status: 400 }
      );
    }

    // 获取现有进度以计算 XP
    const existingProgress = await getUserProgressByChallenge(
      session.user.id,
      challengeId
    );

    // 如果已完成，不再重复计算 XP
    const finalXpEarned =
      status === 'completed' && existingProgress?.status !== 'completed'
        ? xpEarned || 100 // 默认 100 XP
        : existingProgress?.xpEarned || 0;

    // 创建或更新进度
    const progress = await upsertUserProgress({
      userId: session.user.id,
      challengeId,
      status,
      userCode,
      xpEarned: finalXpEarned,
    });

    return NextResponse.json({
      progress: {
        id: progress.id,
        userId: progress.userId,
        challengeId: progress.challengeId,
        status: progress.status,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
        xpEarned: progress.xpEarned,
      },
      xpEarned: finalXpEarned,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
