// app/api/banking/deposit/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Account } from '@/models/Accounts';
import { Transaction } from '@/models/Transactions';
import { ethers } from 'ethers';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, method } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create a new Ethereum wallet for the user if they don't have one
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const wallet = ethers.Wallet.createRandom().connect(provider);

    // Find or create account
    let account = await Account.findOne({ userId: session.user.id });
    
    if (!account) {
      account = await Account.create({
        userId: session.user.id,
        balance: amount,
        walletAddress: wallet.address,
        createdAt: new Date()
      });
    } else {
      account = await Account.findOneAndUpdate(
        { userId: session.user.id },
        { $inc: { balance: amount } },
        { new: true }
      );
    }

    // Create transaction record
    const transaction = await Transaction.create({
      userId: session.user.id,
      type: 'deposit',
      amount,
      with: `${method.toUpperCase()} Deposit`,
      status: 'completed',
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      balance: account.balance,
      walletAddress: account.walletAddress,
      transaction
    });

  } catch (error) {
    console.error('Deposit failed:', error);
    return NextResponse.json(
      { error: 'Failed to process deposit' },
      { status: 500 }
    );
  }
}