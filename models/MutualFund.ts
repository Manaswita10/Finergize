import mongoose from 'mongoose';

const MutualFundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Equity', 'Debt', 'Hybrid'],
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Moderate', 'High'],
  },
  oneYearReturn: {
    type: Number,
    required: true,
  },
  threeYearReturn: {
    type: Number,
    required: true,
  },
  fiveYearReturn: {
    type: Number,
    required: true,
  },
  nav: {
    type: Number,
    required: true,
  },
  aum: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
  minInvestment: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.MutualFund || mongoose.model('MutualFund', MutualFundSchema);