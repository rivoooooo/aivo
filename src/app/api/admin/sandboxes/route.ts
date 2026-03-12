import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/lib/db';
import { sandboxes } from '@/server/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allSandboxes = await db.select().from(sandboxes).orderBy(sandboxes.createdAt);
    return NextResponse.json(allSandboxes);
  } catch (error) {
    console.error('Error fetching sandboxes:', error);
    return NextResponse.json({ error: 'Failed to fetch sandboxes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, type, importSource, files } = body;

    const newSandbox = await db.insert(sandboxes).values({
      name,
      slug,
      description,
      type,
      importSource,
      files: files || [],
    }).returning();

    return NextResponse.json(newSandbox[0], { status: 201 });
  } catch (error) {
    console.error('Error creating sandbox:', error);
    return NextResponse.json({ error: 'Failed to create sandbox' }, { status: 500 });
  }
}
