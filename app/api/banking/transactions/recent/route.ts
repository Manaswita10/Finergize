import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Transaction } from '@/models/Transactions';
import dbConnect from '@/lib/database/config';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await Transaction.find({ 
      userId: session.user.id 
    })
    .sort({ timestamp: -1 })
    .limit(5);

    const pendingCount = await Transaction.countDocuments({
      userId: session.user.id,
      status: 'pending'
    });

    return NextResponse.json({
      transactions,
      pendingCount
    });

  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}