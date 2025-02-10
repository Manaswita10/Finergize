// src/components/transactions/TransactionHistory.tsx
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Filter,
  Search,
  Calendar,
  Wallet,
  RefreshCw
} from 'lucide-react';
import BlockchainService from '@/services/blockchain';
import { toast } from '@/components/ui/use-toast';
import { BigNumber } from 'ethers';

// Interface for raw blockchain investment data
interface BlockchainInvestment {
  investmentId: string | BigNumber;
  fundId: string;
  amount: string | BigNumber;
  timestamp: number | BigNumber | Date;
  investmentType: string;
  sipDay: number | BigNumber;
  active: boolean;
  units?: string | BigNumber;
}

// Interface for formatted transaction data
interface Transaction {
  id: string;
  type: 'LUMPSUM' | 'SIP';
  fundId: string;
  fundName: string;
  amount: string;
  timestamp: Date;
  status: 'COMPLETED';
  active: boolean;
  sipDay?: number;
  units?: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('1M');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkWalletConnection();

    // Add wallet listeners
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', checkWalletConnection);
      window.ethereum.on('chainChanged', () => window.location.reload());

      return () => {
        window.ethereum.removeListener('accountsChanged', checkWalletConnection);
        window.ethereum.removeListener('chainChanged', () => {});
      };
    }
  }, []);

  const checkWalletConnection = async () => {
    try {
      const address = await BlockchainService.getConnectedAddress();
      console.log('Current wallet address:', address);
      setWalletAddress(address);
      
      if (address) {
        await loadTransactions();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      setConnecting(true);
      const address = await BlockchainService.connectWallet();
      setWalletAddress(address);
      toast({
        title: "Success",
        description: "Wallet connected successfully",
      });
      await loadTransactions();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      const address = await BlockchainService.getConnectedAddress();
      if (!address) {
        throw new Error('Please connect your wallet first');
      }

      // Get user's investments from blockchain
      const investments = await BlockchainService.getUserInvestments(address);
      console.log('Raw investments:', investments);
      
      // Get all funds to map fund IDs to names
      const funds = await BlockchainService.getAllFunds();
      const fundMap = new Map(funds.map(fund => [fund.fundId, fund.name]));

      // Transform blockchain data to match our transaction interface
      const formattedTransactions: Transaction[] = investments
        .filter((inv): inv is BlockchainInvestment => !!inv)
        .map(inv => {
          // Convert BigNumber values to strings/numbers
          const amount = typeof inv.amount === 'string' 
            ? inv.amount 
            : inv.amount?.toString() || '0';

          const timestamp = typeof inv.timestamp === 'number'
            ? new Date(inv.timestamp * 1000)
            : inv.timestamp instanceof Date
              ? inv.timestamp
              : new Date(inv.timestamp.toNumber() * 1000);

          const sipDay = typeof inv.sipDay === 'number'
            ? inv.sipDay
            : inv.sipDay?.toNumber();

          const units = inv.units
            ? typeof inv.units === 'string'
              ? inv.units
              : inv.units.toString()
            : undefined;

          return {
            id: inv.investmentId?.toString() || 'unknown',
            type: (inv.investmentType === 'LUMPSUM' || inv.investmentType === 'SIP')
              ? inv.investmentType
              : 'LUMPSUM',
            fundId: inv.fundId?.toString() || 'unknown',
            fundName: fundMap.get(inv.fundId?.toString() || '') || 'Unknown Fund',
            amount,
            timestamp,
            status: 'COMPLETED',
            active: !!inv.active,
            sipDay,
            units
          };
        });

      console.log('Formatted transactions:', formattedTransactions);
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      // Type filter
      if (filterType !== 'all' && transaction.type.toLowerCase() !== filterType.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery && !transaction.fundName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Date range filter
      const txDate = transaction.timestamp;
      const now = new Date();
      const monthsAgo = new Date();

      switch (dateRange) {
        case '1M':
          monthsAgo.setMonth(now.getMonth() - 1);
          break;
        case '3M':
          monthsAgo.setMonth(now.getMonth() - 3);
          break;
        case '6M':
          monthsAgo.setMonth(now.getMonth() - 6);
          break;
        case '1Y':
          monthsAgo.setFullYear(now.getFullYear() - 1);
          break;
        default:
          return true;
      }

      return txDate >= monthsAgo;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LUMPSUM':
        return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'SIP':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const FilterBar = () => (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        {['all', 'lumpsum', 'sip'].map((type) => (
          <Button
            key={type}
            variant={filterType === type ? 'default' : 'outline'}
            onClick={() => setFilterType(type)}
            className={`border-gray-700 ${
              filterType === type ? 'bg-blue-500' : 'text-gray-400'
            }`}
          >
            {type.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        {['1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
          <Button
            key={range}
            variant={dateRange === range ? 'default' : 'outline'}
            onClick={() => setDateRange(range)}
            className={`border-gray-700 ${
              dateRange === range ? 'bg-blue-500' : 'text-gray-400'
            }`}
          >
            {range}
          </Button>
        ))}
      </div>
    </div>
  );

  if (!walletAddress) {
    return (
      <Card className="bg-slate-800/50 border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
          <Button 
            onClick={handleConnectWallet}
            disabled={connecting}
            className="flex items-center gap-2"
          >
            {connecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Connect Wallet to View Transactions
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-gray-700"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-700"
              onClick={() => {
                const headers = ['Date', 'Fund', 'Type', 'Amount', 'Status', 'SIP Day'];
                const csvData = getFilteredTransactions().map(tx => [
                  tx.timestamp.toLocaleDateString(),
                  tx.fundName,
                  tx.type,
                  parseFloat(tx.amount).toLocaleString(),
                  tx.active ? 'ACTIVE' : 'INACTIVE',
                  tx.sipDay || '-'
                ]);
                
                const csvContent = [headers, ...csvData]
                  .map(row => row.join(','))
                  .join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.csv';
                a.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <FilterBar />
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredTransactions().length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No transactions found
                </div>
              ) : (
                getFilteredTransactions().map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-slate-600/50">
                          {getTypeIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{transaction.fundName}</h4>
                          <p className="text-sm text-gray-400">
                            {transaction.timestamp.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          ₹{parseFloat(transaction.amount).toLocaleString()}
                        </p>
                        {transaction.units && (
                          <p className="text-sm text-gray-400">
                            {parseFloat(transaction.units).toFixed(3)} units
                          </p>
                        )}
                        {transaction.type === 'SIP' && transaction.sipDay && (
                          <p className="text-sm text-gray-400">
                            SIP Day: {transaction.sipDay}
                          </p>
                        )}
                      </div>
                      <div className={`text-sm ${transaction.active ? 'text-green-400' : 'text-gray-400'}`}>
                        {transaction.active ? 'ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionHistory;