import mongoose from 'mongoose';

const InvestmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // For faster querying by user
  },
  walletAddress: {
    type: String,
    required: true,
    index: true // For blockchain wallet address
  },
  fundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MutualFund',
    required: true
  },
  blockchainFundId: {
    type: String,
    required: true
  },
  investmentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  units: {
    type: Number,
    required: true,
    min: 0
  },
  navAtPurchase: {
    type: Number,
    required: true,
    min: 0
  },
  investmentType: {
    type: String,
    required: true,
    enum: ['LUMPSUM', 'SIP']
  },
  sipDay: {
    type: Number,
    min: 1,
    max: 31,
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  transactionHash: {
    type: String,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  redemptionAmount: {
    type: Number,
    default: 0
  },
  redemptionDate: {
    type: Date,
    default: null
  },
  redemptionStatus: {
    type: String,
    enum: [null, 'PENDING', 'COMPLETED', 'FAILED'],
    default: null
  }
}, {
  timestamps: true
});

// Add a virtual field for current value calculation
InvestmentSchema.virtual('currentValue').get(function() {
  return this.units * this.navAtPurchase; // In a real app, you'd use current NAV
});

// Method to calculate returns
InvestmentSchema.methods.calculateReturns = function(currentNav) {
  const investedValue = this.investmentAmount;
  const currentValue = this.units * currentNav;
  const absoluteReturn = currentValue - investedValue;
  const percentageReturn = (absoluteReturn / investedValue) * 100;
  
  return {
    absoluteReturn,
    percentageReturn
  };
};

// Add compound index for user + fund combination
InvestmentSchema.index({ userId: 1, fundId: 1 });

export default mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);