import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/lib/db';
import { challenges } from '@/server/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allChallenges = await db.select().from(challenges).orderBy(desc(challenges.createdAt));
    return NextResponse.json(allChallenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, difficulty, language, sandboxId, starterCode, isPublished, categoryId } = body;

    const newChallenge = await db.insert(challenges).values({
      name,
      slug,
      description,
      difficulty,
      language: language || 'en',
      sandboxId,
      starterCode,
      isPublished: isPublished || false,
      categoryId,
    }).returning();

    return NextResponse.json(newChallenge[0], { status: 201 });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
  }
}
