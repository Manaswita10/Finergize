import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/database/config';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { phone, aadhaarNumber } = req.body;

    // Validate input
    if (!phone || !aadhaarNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and Aadhaar number'
      });
    }

    // Find user
    const user = await User.findOne({ phone, aadhaarNumber });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}