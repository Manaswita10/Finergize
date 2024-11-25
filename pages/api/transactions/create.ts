import type { NextApiResponse } from 'next';
import dbConnect from '@/lib/database/config';
import { withAuth, AuthenticatedRequest } from '@/middlewares/authMiddleware';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import mongoose from 'mongoose';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { type, amount, accountType, recipientId, description } = req.body;
    const userId = req.userId;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate sufficient balance for withdrawals and transfers
      if ((type === 'withdrawal' || type === 'transfer') && 
          user.accounts[accountType] < amount) {
        throw new Error('Insufficient balance');
      }

      // Create transaction record
      const transaction = await Transaction.create([{
        userId,
        type,
        amount,
        accountType,
        description,
        recipientId: type === 'transfer' ? recipientId : undefined,
        status: 'completed'
      }], { session });

      // Update balances
      switch (type) {
        case 'deposit':
          user.accounts[accountType] += amount;
          break;
        case 'withdrawal':
          user.accounts[accountType] -= amount;
          break;
        case 'transfer':
          user.accounts[accountType] -= amount;
          const recipient = await User.findById(recipientId).session(session);
          if (!recipient) {
            throw new Error('Recipient not found');
          }
          recipient.accounts[accountType] += amount;
          await recipient.save();
          break;
      }

      await user.save();
      await session.commitTransaction();

      res.status(201).json({
        success: true,
        message: 'Transaction completed successfully',
        transaction: transaction[0],
        newBalance: user.accounts[accountType]
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Transaction failed'
    });
  }
}

export default withAuth(handler);