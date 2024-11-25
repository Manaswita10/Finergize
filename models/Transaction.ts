import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  accountType: 'savings' | 'community';
  description: string;
  recipientId?: mongoose.Types.ObjectId;
  status: 'pending' | 'completed' | 'failed';
  blockchainHash?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  accountType: {
    type: String,
    enum: ['savings', 'community'],
    required: [true, 'Account type is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function(this: ITransaction) {
      return this.type === 'transfer';
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  blockchainHash: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);