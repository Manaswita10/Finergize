// app/api/users/check-pin/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkUserHasPin } from '@/lib/auth';

export async function GET() {
  try {
    const userId = cookies().get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const hasPin = await checkUserHasPin(userId);
    
    if (!hasPin) {
      return NextResponse.json({ error: 'No PIN set' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}