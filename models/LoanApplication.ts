import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  // Link to user's account
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },

  // Loan Type Information
  loanType: {
    type: String,
    enum: ['business', 'agriculture', 'education'],
    required: true
  },

  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    }
  },

  // Document Information
  documentInfo: {
    idType: {
      type: String,
      enum: ['aadhaar', 'pan'],
      required: true
    },
    idNumber: {
      type: String,
      required: true
    }
  },

  // Contact Information
  contactInfo: {
    email: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    }
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under-review'],
    default: 'pending'
  },

  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp on every save
loanApplicationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Add indexes for better query performance
loanApplicationSchema.index({ accountId: 1 });
loanApplicationSchema.index({ 'personalInfo.fullName': 1 });
loanApplicationSchema.index({ status: 1 });
loanApplicationSchema.index({ appliedAt: 1 });

// Clear existing model if it exists
if (mongoose.models.LoanApplication) {
  delete mongoose.models.LoanApplication;
}

export const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);