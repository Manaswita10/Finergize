import mongoose, { Schema, Document } from 'mongoose';

export interface ISavingsGroup extends Document {
  name: string;
  village: string;
  district: string;
  state: string;
  members: mongoose.Types.ObjectId[];
  admin: mongoose.Types.ObjectId;
  totalSavings: number;
  monthlyContribution: number;
  meetingDay: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const SavingsGroupSchema = new Schema<ISavingsGroup>({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    unique: true
  },
  village: {
    type: String,
    required: [true, 'Village name is required']
  },
  district: {
    type: String,
    required: [true, 'District name is required']
  },
  state: {
    type: String,
    required: [true, 'State name is required']
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Group admin is required']
  },
  totalSavings: {
    type: Number,
    default: 0,
    min: [0, 'Total savings cannot be negative']
  },
  monthlyContribution: {
    type: Number,
    required: [true, 'Monthly contribution amount is required'],
    min: [1, 'Monthly contribution must be greater than 0']
  },
  meetingDay: {
    type: String,
    required: [true, 'Meeting day is required'],
    enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.SavingsGroup || mongoose.model<ISavingsGroup>('SavingsGroup', SavingsGroupSchema);