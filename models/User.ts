import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  aadhaarNumber: string;
  accounts: {
    savings: number;
    community: number;
  };
  preferredLanguage: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  lastActive: Date;
}

const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Please enter a valid 10-digit phone number'
    }
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
  pincode: {
    type: String,
    required: [true, 'PIN code is required'],
    validate: {
      validator: function(v: string) {
        return /^[0-9]{6}$/.test(v);
      },
      message: 'Please enter a valid 6-digit PIN code'
    }
  },
  aadhaarNumber: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^[0-9]{12}$/.test(v);
      },
      message: 'Please enter a valid 12-digit Aadhaar number'
    }
  },
  accounts: {
    savings: { 
      type: Number, 
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    community: { 
      type: Number, 
      default: 0,
      min: [0, 'Balance cannot be negative']
    }
  },
  preferredLanguage: {
    type: String,
    default: 'hindi',
    enum: ['hindi', 'english', 'tamil', 'telugu', 'kannada', 'malayalam', 'marathi', 'punjabi', 'bengali']
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);