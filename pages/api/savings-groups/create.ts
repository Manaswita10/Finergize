import type { NextApiResponse } from 'next';
import dbConnect from '@/lib/database/config';
import { withAuth, AuthenticatedRequest } from '@/middlewares/authMiddleware';
import SavingsGroup from '@/models/SavingsGroup';
import User from '@/models/User';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const {
      name,
      village,
      district,
      state,
      monthlyContribution,
      meetingDay
    } = req.body;

    const userId = req.userId;

    // Verify user exists and is eligible
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.kycStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'KYC verification required to create savings group'
      });
    }

    // Create savings group
    const savingsGroup = await SavingsGroup.create({
      name,
      village,
      district,
      state,
      admin: userId,
      members: [userId],
      monthlyContribution,
      meetingDay,
      totalSavings: 0
    });

    res.status(201).json({
      success: true,
      message: 'Savings group created successfully',
      group: savingsGroup
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create savings group'
    });
  }
}

export default withAuth(handler);