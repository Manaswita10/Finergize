import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Investment from '@/models/Investment';
import MutualFund from '@/models/MutualFund';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Get user ID from session or param
    const userId = session.user.id;
    
    // Optional wallet address from query params
    const url = new URL(req.url);
    const walletAddress = url.searchParams.get('walletAddress');
    
    // Build query
    const query: any = { userId };
    if (walletAddress) {
      query.walletAddress = walletAddress;
    }
    
    // Fetch investments with populated fund data
    const investments = await Investment.find(query)
      .populate('fundId')
      .sort({ createdAt: -1 });
    
    // Enhance the investment data with calculated fields
    const enhancedInvestments = investments.map(investment => {
      const fund = investment.fundId;
      
      // Calculate current value using latest NAV
      const currentValue = investment.units * fund.nav;
      
      // Calculate returns
      const absoluteReturn = currentValue - investment.investmentAmount;
      const percentageReturn = ((currentValue / investment.investmentAmount) - 1) * 100;
      
      return {
        _id: investment._id,
        fundId: fund._id,
        fundName: fund.name,
        category: fund.category,
        riskLevel: fund.riskLevel,
        blockchainFundId: investment.blockchainFundId,
        investmentAmount: investment.investmentAmount,
        units: investment.units,
        navAtPurchase: investment.navAtPurchase,
        currentNav: fund.nav,
        currentValue,
        absoluteReturn,
        percentageReturn: parseFloat(percentageReturn.toFixed(2)),
        investmentType: investment.investmentType,
        sipDay: investment.sipDay,
        status: investment.status,
        active: investment.active,
        createdAt: investment.createdAt,
        transactionHash: investment.transactionHash
      };
    });
    
    return NextResponse.json({ investments: enhancedInvestments });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['fundId', 'blockchainFundId', 'investmentAmount', 'walletAddress', 'investmentType'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Get fund to calculate units
    const fund = await MutualFund.findById(body.fundId);
    if (!fund) {
      return NextResponse.json(
        { error: 'Fund not found' },
        { status: 404 }
      );
    }
    
    // Calculate units
    const units = body.investmentAmount / fund.nav;
    
    // Create new investment
    const investment = new Investment({
      userId: session.user.id,
      fundId: body.fundId,
      blockchainFundId: body.blockchainFundId,
      walletAddress: body.walletAddress,
      investmentAmount: body.investmentAmount,
      units: units.toFixed(4), // Round to 4 decimal places
      navAtPurchase: fund.nav,
      investmentType: body.investmentType,
      sipDay: body.investmentType === 'SIP' ? body.sipDay : null,
      status: body.status || 'COMPLETED',
      transactionHash: body.transactionHash || null,
      active: true
    });
    
    await investment.save();
    
    return NextResponse.json({ 
      success: true, 
      investment: {
        _id: investment._id,
        fundId: fund._id,
        fundName: fund.name,
        investmentAmount: investment.investmentAmount,
        units: investment.units,
        navAtPurchase: investment.navAtPurchase,
        investmentType: investment.investmentType,
        sipDay: investment.sipDay,
        status: investment.status,
        createdAt: investment.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    );
  }
}