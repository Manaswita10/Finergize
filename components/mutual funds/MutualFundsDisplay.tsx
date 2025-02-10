// components/mutual-funds/MutualFundsDisplay.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronDown,
  Shield,
  PieChart,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Wallet
} from 'lucide-react';
import { Fund, BlockchainFund } from '@/types/mutualFund';
import BlockchainService from '@/services/blockchain';
import { toast } from '@/components/ui/use-toast';

// Define the correct fund IDs mapping
const BLOCKCHAIN_FUND_IDS = {
  'Large Cap Growth Fund': 'LARGE_CAP_001',
  'Mid Cap Opportunities': 'MID_CAP_002',
  'Debt Fund Direct': 'DEBT_003',
  'Balanced Advantage Fund': 'BAL_ADV_004',
  'Small Cap Discovery Fund': 'SMALL_CAP_005',
  'Government Securities Fund': 'GOVT_SEC_006',
  'Dynamic Asset Allocation Fund': 'DYN_ASSET_007'
};

interface MutualFundsDisplayProps {
  onInvestClick: (fund: Fund) => void;
}

const MutualFundsDisplay: React.FC<MutualFundsDisplayProps> = ({ onInvestClick }) => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [blockchainFunds, setBlockchainFunds] = useState<BlockchainFund[]>([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('returns');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setLoading(true);
        
        // Fetch blockchain funds first
        const bcFunds = await BlockchainService.getAllFunds();
        console.log('Blockchain funds:', bcFunds);
        setBlockchainFunds(bcFunds);

        // Then fetch regular funds
        const response = await fetch('/api/mutual-funds');
        if (!response.ok) {
          throw new Error('Failed to fetch funds');
        }
        const data = await response.json();
        
        // Map blockchain IDs to funds
        const mappedFunds = data.funds.map((fund: Fund) => ({
          ...fund,
          blockchainFundId: BLOCKCHAIN_FUND_IDS[fund.name] || null
        }));
        
        setFunds(mappedFunds);
        setError(null);
      } catch (err) {
        console.error('Error fetching funds:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch funds');
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
    checkWalletConnection();
  }, []);
  const checkWalletConnection = async () => {
    const isConnected = await BlockchainService.isWalletConnected();
    if (isConnected) {
      const address = await BlockchainService.getConnectedAddress();
      setWalletAddress(address);
    }
  };

  const connectWallet = async () => {
    try {
      const address = await BlockchainService.connectWallet();
      setWalletAddress(address);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleInvestClick = async (fund: Fund) => {
    try {
      if (!walletAddress) {
        await connectWallet();
        return;
      }

      // Check if fund has a blockchain ID
      if (!fund.blockchainFundId) {
        toast({
          title: "Investment Failed",
          description: "This fund is not available on the blockchain",
          variant: "destructive",
        });
        return;
      }

      // Verify fund status before proceeding
      const fundStatus = await BlockchainService.checkFundStatus(fund.blockchainFundId);
      console.log('Fund status:', fundStatus);

      if (!fundStatus.isActive) {
        toast({
          title: "Investment Failed",
          description: "This fund is currently not active",
          variant: "destructive",
        });
        return;
      }

      onInvestClick({
        ...fund,
        blockchainFundId: fund.blockchainFundId
      });
    } catch (error) {
      console.error('Investment error:', error);
      toast({
        title: "Investment Failed",
        description: error instanceof Error ? error.message : "Failed to process investment",
        variant: "destructive",
      });
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-400 bg-gradient-to-r from-green-500/10 to-green-400/5';
      case 'Moderate':
        return 'text-yellow-400 bg-gradient-to-r from-yellow-500/10 to-yellow-400/5';
      case 'High':
        return 'text-red-400 bg-gradient-to-r from-red-500/10 to-red-400/5';
      default:
        return 'text-gray-400 bg-gradient-to-r from-gray-500/10 to-gray-400/5';
    }
  };
  const FilterSection = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 backdrop-blur-sm bg-slate-900/30 p-6 rounded-2xl border border-gray-800/50"
    >
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-grow max-w-md group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-hover:text-blue-400" />
          <input
            type="text"
            placeholder="Search funds..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {['All', 'Equity', 'Debt', 'Hybrid'].map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? 'default' : 'outline'}
              onClick={() => setFilterCategory(category)}
              className={`relative overflow-hidden border-gray-700 px-6 transition-all duration-300 ${
                filterCategory === category 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                  : 'text-gray-400 hover:text-white hover:border-blue-500/50'
              }`}
            >
              {category}
              {filterCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-slate-800/50 border border-gray-700 text-white px-6 py-3 pr-10 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="returns">Sort by Returns</option>
            <option value="risk">Sort by Risk</option>
            <option value="name">Sort by Name</option>
            <option value="nav">Sort by NAV</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
  const FundCard = ({ fund }: { fund: Fund }) => {
    const blockchainFund = blockchainFunds.find(bf => bf.fundId === fund.blockchainFundId);
    const isAvailableOnChain = !!blockchainFund && blockchainFund.active;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onHoverStart={() => setHoveredCard(fund._id)}
        onHoverEnd={() => setHoveredCard(null)}
        className="w-full"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-gray-700 hover:border-blue-500/50 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardContent className="relative p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <motion.h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  {fund.name}
                  {isAvailableOnChain && (
                    <Wallet className="w-4 h-4 text-blue-400" title="Available on blockchain" />
                  )}
                  {hoveredCard === fund._id && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </motion.span>
                  )}
                </motion.h3>
                <p className="text-sm text-gray-400">{fund.category}</p>
              </div>
              <motion.div 
                className={`px-4 py-2 rounded-xl ${getRiskColor(fund.riskLevel)} backdrop-blur-sm`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {fund.riskLevel} Risk
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-800/30 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  1Y Returns
                </p>
                <p className={`text-lg font-semibold flex items-center gap-1 ${
                  fund.oneYearReturn >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {fund.oneYearReturn >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {fund.oneYearReturn}%
                </p>
              </div>
              <div className="bg-slate-800/30 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-gray-400 mb-1">NAV</p>
                <p className="text-lg font-semibold text-white">₹{fund.nav}</p>
              </div>
              <div className="bg-slate-800/30 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-gray-400 mb-1">Min Investment</p>
                <p className="text-lg font-semibold text-white">₹{fund.minInvestment}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-800/30 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-gray-400 mb-1">3Y Returns</p>
                <p className={`text-lg font-semibold flex items-center gap-1 ${
                  fund.threeYearReturn >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {fund.threeYearReturn >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {fund.threeYearReturn}%
                </p>
              </div>
              <div className="bg-slate-800/30 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-gray-400 mb-1">5Y Returns</p>
                <p className={`text-lg font-semibold flex items-center gap-1 ${
                  fund.fiveYearReturn >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {fund.fiveYearReturn >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {fund.fiveYearReturn}%
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-sm text-gray-400 bg-slate-800/30 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <Shield className="w-4 h-4 mr-2 text-blue-400" />
                  AUM: ₹{fund.aum}Cr
                </div>
                <div className="flex items-center text-sm text-gray-400 bg-slate-800/30 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <PieChart className="w-4 h-4 mr-2 text-purple-400" />
                  Expense: {fund.expense}%
                </div>
              </div>
              <Button
                onClick={() => handleInvestClick(fund)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {walletAddress ? 'Invest Now' : 'Connect Wallet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-red-500/10 rounded-2xl backdrop-blur-sm border border-red-500/20"
        >
          <p className="text-red-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Retry
          </Button>
        </motion.div>
      );
    }
  
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FilterSection />
        
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {funds
              .filter(fund => 
                (filterCategory === 'All' || fund.category === filterCategory) &&
                fund.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .sort((a, b) => {
                switch (sortBy) {
                  case 'returns':
                    return b.oneYearReturn - a.oneYearReturn;
                  case 'risk':
                    return ['Low', 'Moderate', 'High'].indexOf(a.riskLevel) -
                           ['Low', 'Moderate', 'High'].indexOf(b.riskLevel);
                  case 'name':
                    return a.name.localeCompare(b.name);
                  case 'nav':
                    return b.nav - a.nav;
                  default:
                    return 0;
                }
              })
              .map(fund => (
                <FundCard key={fund._id} fund={fund} />
              ))
            }
          </AnimatePresence>
        </div>
  
        {funds.filter(fund => 
          (filterCategory === 'All' || fund.category === filterCategory) &&
          fund.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 bg-slate-800/30 rounded-2xl backdrop-blur-sm border border-gray-700"
          >
            <div className="flex flex-col items-center gap-4">
              <Search className="w-12 h-12 text-gray-400" />
              <h3 className="text-xl font-semibold text-white">No Mutual Funds Found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };
  
  export default MutualFundsDisplay;