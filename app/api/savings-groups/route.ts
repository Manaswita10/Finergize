// app/api/savings-groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Document, Schema, Model } from 'mongoose';
import dbConnect from '@/lib/database/config';

// Define interfaces for TypeScript
interface IMember extends Document {
  userId: mongoose.Types.ObjectId;
  joinDate: Date;
  contributionAmount: number;
  totalContributed: number;
  isAdmin: boolean;
  status: 'Active' | 'Inactive' | 'Paused';
}

interface IContribution extends Document {
  date: Date;
  totalAmount: number;
  membersContributed: number;
  notes?: string;
}

interface ISavingsGroup extends Document {
  name: string;
  description?: string;
  location: string;
  foundedDate: Date;
  meetingFrequency: 'Weekly' | 'Biweekly' | 'Monthly';
  contributionType: 'Fixed' | 'Variable';
  minContribution: number;
  maxContribution?: number;
  totalSaved: number;
  members: IMember[];
  contributionHistory: IContribution[];
  interestRate: number;
  loanOffered: boolean;
  status: 'Active' | 'Inactive' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

// Define the Member Schema
const MemberSchema = new Schema<IMember>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  contributionAmount: {
    type: Number,
    required: true,
  },
  totalContributed: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Paused'],
    default: 'Active'
  }
});

// Define the Contribution Schema
const ContributionSchema = new Schema<IContribution>({
  date: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  membersContributed: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  }
});

// Define the SavingsGroup Schema
const SavingsGroupSchema = new Schema<ISavingsGroup>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  foundedDate: {
    type: Date,
    required: true,
  },
  meetingFrequency: {
    type: String,
    enum: ['Weekly', 'Biweekly', 'Monthly'],
    required: true,
  },
  contributionType: {
    type: String,
    enum: ['Fixed', 'Variable'],
    required: true,
  },
  minContribution: {
    type: Number,
    required: true,
  },
  maxContribution: {
    type: Number,
  },
  totalSaved: {
    type: Number,
    default: 0,
  },
  members: [MemberSchema],
  contributionHistory: [ContributionSchema],
  interestRate: {
    type: Number,
    default: 0,
  },
  loanOffered: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Completed'],
    default: 'Active',
  }
}, {
  timestamps: true,
});

// Define interface for frontend response
interface FormattedSavingsGroup {
  id: string;
  position: string;
  icon: string;
  title: string;
  description?: string;
  amount: string;
  members: string;
  returns: string;
  color: string;
  location: string;
  foundedDate: Date;
  loanOffered: boolean;
  meetingFrequency: string;
}

// Define a user schema for mock users (simplified version)
const UserSchema = new Schema({
  name: String,
  email: String,
  password: String
});

// GET handler to fetch all savings groups
export async function GET(): Promise<NextResponse> {
  try {
    await dbConnect();
    
    // Use Mongoose model (or create it if it doesn't exist)
    const SavingsGroup: Model<ISavingsGroup> = mongoose.models.SavingsGroup as Model<ISavingsGroup> || 
      mongoose.model<ISavingsGroup>('SavingsGroup', SavingsGroupSchema);
    
    // Get all savings groups
    const savingsGroups = await SavingsGroup.find({
      status: 'Active'
    }).select('-__v');
    
    // Transform the data to match the frontend format
    const formattedGroups: FormattedSavingsGroup[] = savingsGroups.map((group) => {
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
      
      return {
        id: group._id.toString(),
        position: "", // Will be assigned by frontend
        icon: "", // Will be assigned by frontend
        title: group.name,
        description: group.description,
        amount: amount,
        members: `${group.members.length} members`,
        returns: `${group.interestRate}% p.a.`,
        color: "", // Will be assigned by frontend
        location: group.location,
        foundedDate: group.foundedDate,
        loanOffered: group.loanOffered,
        meetingFrequency: group.meetingFrequency
      };
    });
    
    return NextResponse.json(formattedGroups);
  } catch (error) {
    console.error('Error fetching savings groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch savings groups' },
      { status: 500 }
    );
  }
}

// Interface for the request body
interface JoinGroupRequest {
  userId: string;
  groupId: string;
  contributionAmount: number;
}

// POST handler to join a savings group
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as JoinGroupRequest;
    const { userId, groupId, contributionAmount } = body;
    
    if (!userId || !groupId || !contributionAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Get models
    const SavingsGroup: Model<ISavingsGroup> = mongoose.models.SavingsGroup as Model<ISavingsGroup> || 
      mongoose.model<ISavingsGroup>('SavingsGroup', SavingsGroupSchema);
    
    // -------------------- MODIFIED PART --------------------
    // Skip actual user validation since we're working without real user auth
    // Instead, we'll create a temporary ObjectId from the userId string
    let objectId;
    try {
      // Try to use the userId as an ObjectId directly if it's in the right format
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      // If userId is not a valid ObjectId, create a new one
      // This ensures we always have a valid ObjectId
      console.log('Creating new ObjectId as userId is not valid:', userId);
      objectId = new mongoose.Types.ObjectId();
    }
    // -------------------- END MODIFIED PART --------------------
    
    // Check if group exists
    const group = await SavingsGroup.findById(groupId);
    if (!group) {
      return NextResponse.json(
        { error: 'Savings group not found' },
        { status: 404 }
      );
    }
    
    // Check if contribution amount is valid
    if (contributionAmount < group.minContribution || 
        (group.maxContribution && contributionAmount > group.maxContribution)) {
      return NextResponse.json(
        { error: `Contribution must be between ₹${group.minContribution} and ₹${group.maxContribution}` },
        { status: 400 }
      );
    }
    
    // Check if user is already a member
    const isAlreadyMember = group.members.some(member => 
      member.userId.toString() === objectId.toString()
    );
    
    if (isAlreadyMember) {
      return NextResponse.json(
        { error: 'User is already a member of this group' },
        { status: 400 }
      );
    }
    
    // Add user to group
    group.members.push({
      userId: objectId,
      contributionAmount,
      totalContributed: 0,
      isAdmin: false,
      status: 'Active'
    });
    
    await group.save();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully joined savings group'
    });
  } catch (error) {
    console.error('Error joining savings group:', error);
    return NextResponse.json(
      { error: 'Failed to join savings group' },
      { status: 500 }
    );
  }
}