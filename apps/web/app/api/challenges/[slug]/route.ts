import { NextRequest, NextResponse } from 'next/server';
import { getChallengeWithResources } from '@/server/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'en';

    const challenge = await getChallengeWithResources(slug, lang);

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // 返回新的格式：challenge + resources
    // resource 中的 initCode 已经是 ChallengeFile[] 格式，不需要前端转换
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
        initCode: resource.initCode, // 已经是 ChallengeFile[] 格式
        codeSource: resource.codeSource,
        testCases: resource.testCases,
        displayOrder: resource.displayOrder,
      })),
      category: challenge.category,
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    );
  }
}
