export interface Transaction {
    id: string;
    type: 'deposit' | 'send' | 'receive' | 'withdraw';
    amount: number;
    timestamp: string;
    with: string;
    status: 'completed' | 'pending' | 'failed';
  }
  
  export interface SavingsGoal {
    id: string;
    name: string;
    target: number;
    current: number;
    deadline: string;
    createdAt: string;
  }
  
  export interface DateRange {
    from: Date;
    to: Date;
  }