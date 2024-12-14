import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Account } from '@/models/Accounts';
import { Transaction } from '@/models/Transactions';
import dbConnect from '@/lib/database/config';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await Account.findOne({ userId: session.user.id });
    
    if (!account) {
      return NextResponse.json({ 
        balance: 0,
        monthlyChange: {
          amount: 0,
          isPositive: true
        }
      });
    }

    // Calculate monthly change
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyTransactions = await Transaction.find({
      userId: session.user.id,
      timestamp: { $gte: startOfMonth }
    });

    const monthlyChange = monthlyTransactions.reduce((acc, tx) => {
      return tx.type === 'deposit' || tx.type === 'receive' 
        ? acc + tx.amount 
        : acc - tx.amount;
    }, 0);

    return NextResponse.json({
      balance: account.balance,
      monthlyChange: {
        amount: Math.abs(monthlyChange),
        isPositive: monthlyChange >= 0
      }
    });

  } catch (error) {
    console.error('Balance check failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}