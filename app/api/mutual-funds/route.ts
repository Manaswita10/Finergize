import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import MutualFund from '@/models/MutualFund';

export async function GET() {
  try {
    console.log('API Route: Starting connection...');
    const conn = await dbConnect();
    console.log('API Route: Connection established');
    
    const mutualFunds = await MutualFund.find({}).lean();
    console.log(`API Route: Found ${mutualFunds.length} funds`);
    
    return NextResponse.json({ funds: mutualFunds }, { status: 200 });
  } catch (error) {
    console.error('API Route Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch mutual funds', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('POST Route: Starting connection...');
    await dbConnect();
    console.log('POST Route: Connection established');

    const data = await req.json();
    console.log('POST Route: Received data:', data);

    const newFund = await MutualFund.create(data);
    console.log('POST Route: Created new fund:', newFund._id);

    return NextResponse.json({ fund: newFund }, { status: 201 });
  } catch (error) {
    console.error('POST Route Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    return NextResponse.json(
      { error: 'Failed to create mutual fund', details: error.message },
      { status: 500 }
    );
  }
}