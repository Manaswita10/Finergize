// app/api/account/verify-pin/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { verifyPin } from '@/lib/auth';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) { // email field contains phone number
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pin } = await req.json();
    if (!pin || pin.length !== 4) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 400 });
    }

    await dbConnect();
    
    // Find user by phone number
    const user = await User.findOne({ phone: session.user.email });
    
    if (!user) {
      console.log('No user found for phone:', session.user.email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify PIN using your auth function
    try {
      const isValid = await verifyPin(user._id.toString(), pin);
      
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
      }

      return NextResponse.json({ 
        message: 'PIN verified successfully',
        verified: true
      });
      
    } catch (error) {
      console.error('PIN verification error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'PIN verification failed' 
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Error in verify-pin:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}