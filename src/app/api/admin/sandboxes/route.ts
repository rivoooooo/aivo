import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/lib/db';
import { challengeResources } from '@/server/lib/db/schema';
import { eq } from 'drizzle-orm';

// 注意：sandboxes 表已被废弃，现在使用 challengeResources 表
// 这个路由保留用于向后兼容，但操作的是 challengeResources

export async function GET() {
  try {
    // 返回所有 challengeResources 作为 "sandbox" 配置
    const allResources = await db.select().from(challengeResources).orderBy(challengeResources.createdAt);
    return NextResponse.json(allResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challengeId, name, type, importSource, initCode, codeSource, testCases, displayOrder } = body;

    if (!challengeId) {
      return NextResponse.json({ error: 'challengeId is required' }, { status: 400 });
    }

    const newResource = await db.insert(challengeResources).values({
      challengeId,
      name,
      type,
      importSource,
      initCode: initCode || [],
      codeSource: codeSource || [],
      testCases,
      displayOrder: displayOrder || 0,
    }).returning();

    return NextResponse.json(newResource[0], { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
