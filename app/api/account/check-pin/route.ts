import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession();
    console.log('Session:', session);
    
    if (!session?.user?.email) {  // email field contains phone number
      return NextResponse.json({ 
        error: 'Not authenticated',
        hasPin: false 
      });
    }

    await dbConnect();
    // Find user by phone number instead of email
    const user = await User.findOne({ phone: session.user.email });
    
    if (!user) {
      console.log('No user found for phone:', session.user.email);
      return NextResponse.json({ 
        error: 'User not found',
        hasPin: false 
      });
    }

    console.log('User found:', user);  // Debug log
    const hasPin = user.security?.pin?.enabled || false;

    return NextResponse.json({ 
      hasPin,
      isAuthenticated: true 
    });

  } catch (error) {
    console.error('Check PIN Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      hasPin: false 
    });
  }
}