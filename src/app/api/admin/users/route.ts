import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/lib/db';
import { users as usersTable } from '@/server/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allUsers = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
