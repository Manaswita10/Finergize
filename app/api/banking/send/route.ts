import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Account } from '@/models/Accounts';
import { Transaction } from '@/models/Transactions';
import dbConnect from '@/lib/database/config';

export async function POST(req: Request) {
  try {
    await dbConnect();
    console.log('Starting transaction process...');

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('Session found:', session.user.id);

    // Parse request body
    const body = await req.json();
    const { amount, recipientAddress, recipientName } = body;
    console.log('Transaction details:', { amount, recipientAddress, recipientName });

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!recipientAddress) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    }

    // Find and validate accounts
    const [senderAccount, recipientAccount] = await Promise.all([
      Account.findOne({ userId: session.user.id }),
      Account.findOne({ 
        walletAddress: recipientAddress,
        name: recipientName // Add name validation here
      })
    ]);

    if (!senderAccount) {
      return NextResponse.json({ error: 'Sender account not found' }, { status: 404 });
    }

    if (!recipientAccount) {
      return NextResponse.json({ 
        error: 'Recipient not found or name does not match the wallet address' 
      }, { status: 404 });
    }

    if (senderAccount.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Create transactions and update balances
    await Promise.all([
      // Create sender's transaction
      Transaction.create({
        userId: session.user.id,
        type: 'send',
        amount,
        with: recipientName,
        status: 'completed',
        timestamp: new Date()
      }),

      // Create recipient's transaction
      Transaction.create({
        userId: recipientAccount.userId,
        type: 'receive',
        amount,
        with: 'Transfer',
        status: 'completed',
        timestamp: new Date()
      }),

      // Update sender's balance
      Account.findByIdAndUpdate(
        senderAccount._id,
        { 
          $inc: { balance: -amount },
          lastUpdated: new Date()
        }
      ),

      // Update recipient's balance
      Account.findByIdAndUpdate(
        recipientAccount._id,
        { 
          $inc: { balance: amount },
          lastUpdated: new Date()
        }
      )
    ]);

    return NextResponse.json({
      success: true,
      message: "Transfer completed successfully"
    });

  } catch (error) {
    console.error('Send money failed:', error);

    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Transaction failed',
    }, { status: 500 });
  }
}