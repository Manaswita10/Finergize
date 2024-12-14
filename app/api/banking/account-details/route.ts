import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from '@/lib/database/config';
import { Account } from '@/models/Accounts';
import { Types } from 'mongoose';

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Convert string ID to ObjectId
    const userId = new Types.ObjectId(session.user.id);

    // Log for debugging
    console.log('Searching for account with userId:', userId);

    const account = await Account.findOne({ userId: userId }).populate('userId', 'name');
    
    // Log the found account
    console.log('Found account:', account);

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Return the account details
    return NextResponse.json({
      name: account.name,
      walletAddress: account.walletAddress,
      userId: account.userId
    });

  } catch (error) {
    console.error('Failed to fetch account details:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}