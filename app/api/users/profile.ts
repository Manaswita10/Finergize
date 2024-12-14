// pages/api/users/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';
import { Account } from '@/models/Accounts';
import { decrypt } from '@/lib/encryption';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();

    // Fetch user data
    const user = await User.findOne({ phone: session.user.phone }).select('-security.pin.value -aadhaarNumber');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch account data
    const account = await Account.findOne({ userId: user._id });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Calculate security score
    const securityScore = calculateSecurityScore(user);

    // Combine and return the data
    const profileData = {
      name: user.name,
      phone: user.phone,
      village: user.village,
      district: user.district,
      state: user.state,
      pincode: user.pincode,
      preferredLanguage: user.preferredLanguage,
      walletAddress: account.walletAddress,
      balance: account.balance,
      securityScore,
      lastLogin: user.security.lastSuccessfulLogin
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
}

function calculateSecurityScore(user: any): number {
  let score = 0;
  
  // Base score for having an account
  score += 20;
  
  // Phone verification
  if (user.security.phoneVerified) score += 20;
  
  // PIN setup
  if (user.security.pin.enabled) score += 20;
  
  // Biometric setup
  if (user.security.biometric.enabled) score += 20;
  
  // Recent successful login
  if (user.security.lastSuccessfulLogin) {
    const daysSinceLogin = (Date.now() - new Date(user.security.lastSuccessfulLogin).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLogin < 30) score += 20;
  }
  
  return score;
}