// models/Transaction.ts
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['send', 'receive', 'deposit', 'withdraw'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  with: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  txHash: {
    type: String,
    default: null
  },
  error: {
    type: String,
    default: null
  }
});

// Add indexes for better query performance
transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ txHash: 1 }, { sparse: true });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);