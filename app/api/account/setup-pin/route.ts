import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';
import { setPin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {  // email field contains phone number
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { pin } = await req.json();
    if (!pin || pin.length !== 4) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 400 });
    }

    await dbConnect();
    // Find user by phone number instead of email
    const user = await User.findOne({ phone: session.user.email });
    
    if (!user) {
      console.log('No user found for phone:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Set PIN using your auth function
    await setPin(user._id.toString(), pin);

    return NextResponse.json({ message: 'PIN set successfully' });
  } catch (error) {
    console.error('Error in setup-pin:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}