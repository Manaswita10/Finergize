import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import { LoanProvider } from '@/models/LoanProvider';

export async function GET(
  req: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const providerId = await params.providerId;
    await dbConnect();
    
    const provider = await LoanProvider.findById(providerId);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error('Error fetching provider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    );
  }
}