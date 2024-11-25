import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/database/config';
import User, { IUser } from '@/models/User';

type ResponseData = {
  success: boolean;
  message: string;
  user?: IUser;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    await dbConnect();

    const userData = req.body;
    
    // Basic validation
    if (!userData.name || !userData.phone || !userData.aadhaarNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new user
    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}