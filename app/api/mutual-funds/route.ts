import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import MutualFund from '@/models/MutualFund';

export async function GET() {
  try {
    await dbConnect();
    const mutualFunds = await MutualFund.find({});
    return NextResponse.json({ funds: mutualFunds }, { status: 200 });
  } catch (error) {
    console.error('Error fetching mutual funds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mutual funds' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const newFund = await MutualFund.create(data);
    return NextResponse.json({ fund: newFund }, { status: 201 });
  } catch (error) {
    console.error('Error creating mutual fund:', error);
    return NextResponse.json(
      { error: 'Failed to create mutual fund' },
      { status: 500 }
    );
  }
}