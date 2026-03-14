import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getUserStats } from '@/server/lib/db/queries';

export async function GET() {
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

    const stats = await getUserStats(session.user.id);

    return NextResponse.json({
      totalXp: stats.totalXp,
      completedCount: stats.completedCount,
      inProgressCount: stats.inProgressCount,
      streakDays: stats.streakDays,
      progressList: stats.progressList.map((progress) => ({
        id: progress.id,
        challengeId: progress.challengeId,
        status: progress.status,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
        xpEarned: progress.xpEarned,
      })),
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
