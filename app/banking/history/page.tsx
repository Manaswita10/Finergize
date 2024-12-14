"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Search,
  FileDown,
  Sparkles,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRightLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw';
  amount: number;
  with: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
}

export default function TransactionHistoryPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      setIsRefreshing(true);
      const response = await fetch('/api/banking/transactions/recent', {
        cache: 'no-store'
      });
      
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      setTransactions(data.transactions);
      setFilteredTransactions(data.transactions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [status, toast]);

  useEffect(() => {
    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 30000);
    return () => clearInterval(intervalId);
  }, [fetchTransactions]);

  useEffect(() => {
    let filtered = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.with.toLowerCase().includes(searchLower) ||
        tx.amount.toString().includes(searchLower)
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.type === filter);
    }

    if (timeframe !== 'all') {
      const now = new Date();
      const timeframeDate = new Date();
      
      switch (timeframe) {
        case 'week':
          timeframeDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          timeframeDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          timeframeDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(tx => 
        new Date(tx.timestamp) >= timeframeDate
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filter, timeframe, transactions]);

  const stats = {
    received: filteredTransactions
      .filter(tx => tx.type === 'receive' || tx.type === 'deposit')
      .reduce((sum, tx) => sum + tx.amount, 0),
    sent: filteredTransactions
      .filter(tx => tx.type === 'send')
      .reduce((sum, tx) => sum + tx.amount, 0),
    total: 0
  };
  stats.total = stats.received - stats.sent;

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
        </div>
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <ArrowRightLeft className="h-12 w-12 text-violet-500" />
        </motion.div>
      </div>
    );
  }

  if (!session) {
    router.replace('/login');
    return null;
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute w-96 h-96 -top-48 -left-48 bg-violet-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10 transition-colors"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold text-white">Transaction History</h1>
                <Sparkles className="h-5 w-5 text-violet-400" />
              </div>
              <p className="text-gray-400 mt-1">Track your financial activities</p>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline"
              className="bg-white/5 border-violet-500/20 hover:bg-white/10 transition-all duration-300"
              onClick={() => {/* Handle export */}}
            >
              <FileDown className="mr-2 h-4 w-4 text-violet-400" />
              Export Data
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Received",
              amount: stats.received,
              icon: <TrendingUp className="h-5 w-5" />,
              color: "emerald"
            },
            {
              title: "Total Sent",
              amount: stats.sent,
              icon: <TrendingDown className="h-5 w-5" />,
              color: "blue"
            },
            {
              title: "Net Flow",
              amount: stats.total,
              icon: <ArrowRightLeft className="h-5 w-5" />,
              color: stats.total >= 0 ? "emerald" : "rose"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/60 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                      <div className={`text-${stat.color}-500`}>{stat.icon}</div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`text-${stat.color}-500 text-2xl font-bold`}
                    >
                      ₹{Math.abs(stat.amount).toLocaleString()}
                    </motion.div>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-gray-400">{stat.title}</p>
                    <div className={`text-${stat.color}-500/70 text-sm`}>
                      {stat.amount >= 0 ? '+' : '-'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex gap-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="send">Sent</SelectItem>
                    <SelectItem value="receive">Received</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/10"
                  onClick={fetchTransactions}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>Recent Transactions</span>
              {isRefreshing && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4 text-violet-400" />
                </motion.div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="popLayout">
              {filteredTransactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-400 py-8"
                >
                  No transactions found
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {filteredTransactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05}}
                      className={`
                        flex items-center justify-between p-4 rounded-lg 
                        bg-gray-800/20 hover:bg-gray-800/40 
                        border border-gray-800/50 hover:border-gray-700/50
                        transition-all duration-300 cursor-pointer
                        backdrop-blur-sm
                      `}
                      onClick={() => router.push(`/banking/history/${tx.id}`)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          p-3 rounded-xl
                          ${tx.type === 'receive' ? 'bg-emerald-500/20 ring-1 ring-emerald-500/30' : 
                            tx.type === 'send' ? 'bg-blue-500/20 ring-1 ring-blue-500/30' : 
                            'bg-violet-500/20 ring-1 ring-violet-500/30'}
                        `}>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {tx.type === 'receive' ? (
                              <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
                            ) : tx.type === 'send' ? (
                              <ArrowUpRight className="h-5 w-5 text-blue-500" />
                            ) : (
                              <Download className="h-5 w-5 text-violet-500" />
                            )}
                          </motion.div>
                        </div>
                        <div>
                          <p className="text-white font-medium flex items-center gap-2">
                            {tx.type === 'deposit' ? `${tx.with} Deposit` : tx.with}
                            {tx.status === 'pending' && (
                              <motion.span
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500"
                              >
                                Pending
                              </motion.span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-400">
                              {new Date(tx.timestamp).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {tx.txHash && (
                              <p className="text-xs text-gray-500 font-mono">
                                {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <motion.p 
                          className={`text-lg font-medium ${
                            tx.type === 'receive' || tx.type === 'deposit' 
                              ? 'text-emerald-500' 
                              : 'text-rose-500'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          {tx.type === 'receive' || tx.type === 'deposit' ? '+' : '-'}
                          ₹{tx.amount.toLocaleString()}
                        </motion.p>
                        <p className={`text-sm ${
                          tx.status === 'completed' ? 'text-emerald-500/70' :
                          tx.status === 'pending' ? 'text-yellow-500/70' :
                          'text-rose-500/70'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 space-y-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg"
              onClick={() => router.push('/banking/send')}
            >
              <ArrowUpRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        {/* Auto-refresh Indicator */}
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-8"
            >
              <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                  </motion.div>
                  <p className="text-sm text-violet-400">
                    Syncing latest transactions...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}