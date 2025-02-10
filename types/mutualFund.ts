// types/mutualFund.ts

export interface BlockchainFund {
    fundId: string;
    name: string;
    nav: string;  // in Wei
    aum: string;  // in Wei
    active: boolean;
  }
  
  export interface Fund {
    _id: string;
    name: string;
    category: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
    oneYearReturn: number;
    threeYearReturn: number;
    fiveYearReturn: number;
    nav: number;
    aum: number;
    expense: number;
    minInvestment: number;
    blockchainFundId?: string;  // Reference to blockchain fund
  }