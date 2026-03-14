import { NextRequest, NextResponse } from 'next/server';
import { getDailyChallenge } from '@/server/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'en';

    const challenge = await getDailyChallenge(lang);

    if (!challenge) {
      return NextResponse.json(
        { error: 'No daily challenge available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      challenge: {
        id: challenge.id,
        slug: challenge.slug,
        name: challenge.name,
        description: challenge.description,
        difficulty: challenge.difficulty,
        language: challenge.language,
        categoryId: challenge.categoryId,
        xpReward: challenge.xpReward,
        estimatedTime: challenge.estimatedTime,
        isDaily: challenge.isDaily,
        tags: challenge.tags,
        isPublished: challenge.isPublished,
        displayOrder: challenge.displayOrder,
        createdAt: challenge.createdAt,
      },
      resources: challenge.resources.map((resource) => ({
        id: resource.id,
        challengeId: resource.challengeId,
        type: resource.type,
        name: resource.name,
        importSource: resource.importSource,
        initCode: resource.initCode,
        codeSource: resource.codeSource,
        testCases: resource.testCases,
        displayOrder: resource.displayOrder,
      })),
      category: challenge.category,
    });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily challenge' },
      { status: 500 }
    );
  }
}
