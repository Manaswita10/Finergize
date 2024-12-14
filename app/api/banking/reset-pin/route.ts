import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resetPin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const userId = cookies().get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tempPin = await resetPin(userId);
    
    return NextResponse.json({ tempPin });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
