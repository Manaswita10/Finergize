"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Banknote, BarChart2 } from 'lucide-react';

interface MutualFund {
  _id: string;
  name: string;
  category: string;
  riskLevel: string;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  nav: number;
  aum: number;
  expense: number;
  minInvestment: number;
}

interface Props {
  onInvestClick: (fund: MutualFund) => void;
}

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel.toLowerCase()) {
    case 'low':
      return 'bg-green-500/10 text-green-500';
    case 'moderate':
      return 'bg-yellow-500/10 text-yellow-500';
    case 'high':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'equity':
      return 'bg-blue-500/10 text-blue-500';
    case 'debt':
      return 'bg-purple-500/10 text-purple-500';
    case 'hybrid':
      return 'bg-orange-500/10 text-orange-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

const MutualFundsDisplay = ({ onInvestClick }: Props) => {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        console.log('Initiating mutual funds fetch...');
        setIsLoading(true);
        
        const response = await fetch('/api/mutual-funds');
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received funds data:', data);
        
        if (!data.funds) {
          throw new Error('No funds data received from API');
        }

        setFunds(data.funds);
        setError(null);
      } catch (error) {
        console.error('Error fetching mutual funds:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch mutual funds');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunds();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-500 mb-2">Error Loading Funds</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!funds.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <BarChart2 className="w-12 h-12 text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Mutual Funds Available</h3>
        <p className="text-gray-400">Check back later for available investment options.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {funds.map((fund) => (
        <motion.div
          key={fund._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getCategoryColor(fund.category)}>
                  {fund.category}
                </Badge>
                <Badge className={getRiskColor(fund.riskLevel)}>
                  {fund.riskLevel} Risk
                </Badge>
              </div>
              <CardTitle className="text-xl font-semibold text-gray-100">
                {fund.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">1Y Returns</p>
                  <p className="text-green-500 font-semibold text-lg">
                    {fund.oneYearReturn}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">3Y Returns</p>
                  <p className="text-green-500 font-semibold text-lg">
                    {fund.threeYearReturn}%
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">NAV</span>
                  <span className="text-gray-100">₹{fund.nav.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">AUM</span>
                  <span className="text-gray-100">₹{fund.aum}Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Expense Ratio</span>
                  <span className="text-gray-100">{fund.expense}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Min Investment</span>
                  <span className="text-gray-100">₹{fund.minInvestment}</span>
                </div>
              </div>

              <Button 
                onClick={() => onInvestClick(fund)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                <Banknote className="w-4 h-4 mr-2" />
                Invest Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default MutualFundsDisplay;