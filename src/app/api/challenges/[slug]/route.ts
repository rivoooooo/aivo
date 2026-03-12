import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/lib/db';
import { challenges, sandboxes } from '@/server/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'en';
    
    const challenge = await db
      .select()
      .from(challenges)
      .where(eq(challenges.slug, slug))
      .then((rows) => rows[0]);

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    let sandboxData = null;
    if (challenge.sandboxId) {
      sandboxData = await db
        .select()
        .from(sandboxes)
        .where(eq(sandboxes.id, challenge.sandboxId))
        .then((rows) => rows[0]);
    }

    return NextResponse.json({
      ...challenge,
      sandboxFiles: sandboxData?.files || [],
      sandboxType: sandboxData?.type || 'html',
      importSource: sandboxData?.importSource || '',
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 });
  }
}
