// app/api/loan-providers/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import { LoanProvider } from '@/models/LoanProvider';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    console.log('Received type parameter:', type); // Debug log

    if (!type || type.trim() === '') {
      return NextResponse.json(
        { error: 'Loan type is required' },
        { status: 400 }
      );
    }

    const normalizedType = type.toLowerCase().trim();
    console.log('Looking for providers with type:', normalizedType); // Debug log

    const providers = await LoanProvider.find({
      supportedLoanTypes: normalizedType
    });

    console.log('Found providers:', providers.length); // Debug log

    return NextResponse.json(providers);

  } catch (error) {
    console.error('Error fetching loan providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loan providers' },
      { status: 500 }
    );
  }
}