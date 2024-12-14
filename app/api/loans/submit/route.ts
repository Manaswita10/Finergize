// app/api/loans/submit/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database/config';
import { LoanApplication } from '@/models/LoanApplication';
import { Account } from '@/models/Accounts';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const data = await req.json();
    const {
      loanType,
      personalInfo,
      documentInfo,
      contactInfo
    } = data;

    // Validate required fields
    if (!loanType || !personalInfo || !documentInfo || !contactInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find account by name
    const account = await Account.findOne({ 
      name: personalInfo.fullName.toUpperCase() // Since names in your schema are in uppercase
    });

    if (!account) {
      return NextResponse.json(
        { error: 'No account found with this name. Please ensure you enter your name exactly as per your account.' },
        { status: 404 }
      );
    }

    // If account exists, check if it has a userId
    if (!account.userId) {
      return NextResponse.json(
        { error: 'Account exists but is not properly configured. Please contact support.' },
        { status: 400 }
      );
    }

    // Create new loan application
    const newLoanApplication = new LoanApplication({
      accountId: account._id,
      loanType,
      personalInfo: {
        fullName: personalInfo.fullName,
        age: personalInfo.age,
        gender: personalInfo.gender
      },
      documentInfo: {
        idType: documentInfo.idType,
        idNumber: documentInfo.idNumber
      },
      contactInfo: {
        email: contactInfo.email,
        phoneNumber: contactInfo.phoneNumber
      }
    });

    await newLoanApplication.save();

    return NextResponse.json({
      message: 'Loan application submitted successfully',
      applicationId: newLoanApplication._id
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting loan application:', error);
    return NextResponse.json(
      { error: 'Failed to submit loan application' },
      { status: 500 }
    );
  }
}