import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Get userId from the session, cookies, or query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Find the user in the database
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return the user info
    return NextResponse.json({
      name: user.name,
      phone: user.phone
    });
    
  } catch (error) {
    console.error('Error fetching user info:', error);
    
    let errorMessage = 'Failed to fetch user info';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}