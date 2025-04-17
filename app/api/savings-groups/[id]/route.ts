// app/api/savings-groups/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/database/config';

// Get a single savings group by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Get SavingsGroup model
    const SavingsGroup = mongoose.models.SavingsGroup || 
      mongoose.model('SavingsGroup', require('@/app/api/savings-groups/route').SavingsGroupSchema);
    
    // Find the group by ID
    const group = await SavingsGroup.findById(id);
    
    if (!group) {
      return NextResponse.json(
        { error: 'Savings group not found' },
        { status: 404 }
      );
    }
    
    // Format the group data for the frontend
    const meetingFrequencyMap: Record<string, string> = {
      'Weekly': 'Weekly',
      'Biweekly': 'Biweekly',
      'Monthly': 'Monthly'
    };

    const frequencyDisplay = meetingFrequencyMap[group.meetingFrequency] || 'Custom';
    
    // Calculate contribution display
    let amount: string;
    if (group.contributionType === 'Fixed') {
      amount = `₹${group.minContribution} ${frequencyDisplay.toLowerCase()}`;
    } else {
      amount = `₹${group.minContribution}-${group.maxContribution} ${frequencyDisplay.toLowerCase()}`;
    }
    
    const formattedGroup = {
      id: group._id.toString(),
      title: group.name,
      description: group.description,
      amount: amount,
      members: `${group.members.length} members`,
      returns: `${group.interestRate}% p.a.`,
      location: group.location,
      foundedDate: group.foundedDate,
      loanOffered: group.loanOffered,
      meetingFrequency: group.meetingFrequency,
      minContribution: group.minContribution,
      maxContribution: group.maxContribution,
      contributionType: group.contributionType,
      totalSaved: group.totalSaved,
      interestRate: group.interestRate
    };
    
    return NextResponse.json(formattedGroup);
  } catch (error) {
    console.error('Error fetching savings group:', error);
    return NextResponse.json(
      { error: 'Failed to fetch savings group' },
      { status: 500 }
    );
  }
}