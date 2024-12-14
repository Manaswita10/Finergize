// models/LoanProvider.ts
import mongoose from 'mongoose';

const interestRateSchema = new mongoose.Schema({
  durationInYears: Number,
  rate: Number,
});

const loanProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    required: true
  },
  interestRates: [interestRateSchema],
  taxes: {
    processingFee: {
      type: Number,
      required: true
    },
    documentationCharges: {
      type: Number,
      default: 0
    },
    GST: {
      type: Number,
      required: true
    }
  },
  termsAndConditions: [String],
  minimumLoanAmount: {
    type: Number,
    required: true
  },
  maximumLoanAmount: {
    type: Number,
    required: true
  },
  supportedLoanTypes: [{
    type: String,
    enum: ['business', 'agriculture', 'education']
  }],
  processingTime: {
    type: String,
    required: true
  }
});

if (mongoose.models.LoanProvider) {
  delete mongoose.models.LoanProvider;
}

export const LoanProvider = mongoose.model('LoanProvider', loanProviderSchema);