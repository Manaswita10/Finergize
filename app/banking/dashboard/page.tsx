"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Languages,
  Phone, Volume2, ChevronRight, AlertCircle, Fingerprint,
  Brain, Send, Download, Upload, History, Shield, Banknote
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import html2canvas from 'html2canvas';
import TransactionReceipt from '@/components/TransactionReceipt';
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Main gradient background */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-gray-900 to-black"></div>
    
    {/* Animated gradient orbs */}
    <motion.div
      className="absolute w-[1000px] h-[1000px] -left-[400px] -top-[400px] rounded-full bg-blue-500/10 blur-[120px]"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute w-[1000px] h-[1000px] -right-[400px] -bottom-[400px] rounded-full bg-purple-500/10 blur-[120px]"
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.2, 0.1, 0.2],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    {/* Subtle grid overlay */}
    <div className="absolute inset-0 bg-grid-white/[0.02]" />
    
    {/* Additional decorative elements */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-1/4 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </div>
  </div>
);

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw';
  amount: number;
  with: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
  recipientAddress?: string;
  senderAddress?: string;
  description?: string;
  fee?: number;
}

interface QuickAction {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}
const TransactionDetails = ({ transaction, onDownload }: { 
  transaction: Transaction;
  onDownload: () => void;
}) => {
  const router = useRouter();

  const handlePayAgain = () => {
    if (transaction.type === 'send') {
      localStorage.setItem('payAgainDetails', JSON.stringify({
        recipientName: transaction.with,
        recipientAddress: transaction.recipientAddress
      }));
      
      router.push('/banking/send-money');
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-gray-400">Type</p>
          <p className="text-white font-medium capitalize">{transaction.type}</p>
        </div>
        <div className="p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-gray-400">Amount</p>
          <p className={`font-medium ${
            transaction.type === 'receive' ? 'text-green-500' : 
            transaction.type === 'send' ? 'text-blue-500' : 'text-purple-500'
          }`}>
            {transaction.type === 'receive' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-gray-400">Status</p>
          <p className={`${
            transaction.status === 'completed' ? 'text-green-500' :
            transaction.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </p>
        </div>
        <div className="p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-gray-400">Date & Time</p>
          <p className="text-white">
            {new Date(transaction.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="col-span-2 p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-gray-400">
            {transaction.type === 'send' ? 'Recipient Name' : 'Sender Name'}
          </p>
          <p className="text-white">{transaction.with}</p>
        </div>
        <div className="col-span-2 p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
          <p className="text-sm text-gray-400">Wallet Address</p>
          <p className="text-white font-mono text-sm break-all">
            {transaction.type === 'send' ? transaction.recipientAddress : transaction.senderAddress}
          </p>
        </div>
        {transaction.description && (
          <div className="col-span-2 p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-gray-400">Description</p>
            <p className="text-white">{transaction.description}</p>
          </div>
        )}
        {transaction.fee !== undefined && (
          <div className="col-span-2 p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-gray-400">Transaction Fee</p>
            <p className="text-white">₹{transaction.fee}</p>
          </div>
        )}
        {transaction.txHash && (
          <div className="col-span-2 p-3 bg-gray-800/30 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-gray-400">Transaction Hash</p>
            <a 
              href={`https://mumbai.polygonscan.com/tx/${transaction.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-mono text-sm break-all"
            >
              {transaction.txHash}
            </a>
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        {transaction.type === 'send' && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handlePayAgain}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Send className="h-4 w-4 mr-2" />
              Pay Again
            </Button>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onDownload}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<string>("0");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [securityScore] = useState(85);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyChange, setMonthlyChange] = useState({ amount: 0, isPositive: true });
  const [pendingTxCount, setPendingTxCount] = useState(0);
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      const [balanceRes, txRes] = await Promise.all([
        fetch('/api/banking/balance', { cache: 'no-store' }),
        fetch('/api/banking/transactions/recent', { cache: 'no-store' })
      ]);

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        setBalance(balanceData.balance.toString());
        setMonthlyChange({
          amount: balanceData.monthlyChange.amount,
          isPositive: balanceData.monthlyChange.isPositive
        });
      } else {
        throw new Error('Failed to fetch balance');
      }

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions);
        setPendingTxCount(txData.pendingCount || 0);
      } else {
        throw new Error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: "Error Loading Data",
        description: "Please refresh the page or try again later",
        
      });
    } finally {
      setIsLoading(false);
    }
  }, [status, toast]);

  const handleDownloadReceipt = async (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    await new Promise(resolve => setTimeout(resolve, 100));

    const receiptElement = receiptRef.current;
    if (!receiptElement) {
      toast({
        title: "Error",
        description: "Could not generate receipt. Please try again.",
        
      });
      return;
    }

    try {
      const canvas = await html2canvas(receiptElement, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        windowWidth: 600,
        windowHeight: 800,
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector('[data-receipt]');
          if (element) {
            (element as HTMLElement).style.visibility = 'visible';
          }
        }
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, 'image/png', 1.0);
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finergise-receipt-${transaction.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Receipt downloaded successfully"
      });
    } catch (error) {
      console.error('Receipt generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  const navigateWithToast = async (path: string, title: string, description: string) => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this feature",
       
      });
      router.push('/login');
      return;
    }
    
    toast({ title, description });
    router.push(path);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchDashboardData();
    toast({
      title: "Dashboard Updated",
      description: "Latest data has been loaded",
    });
  };
  const quickActions: QuickAction[] = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Deposit Money",
      description: "Add funds to wallet",
      color: "text-emerald-500",
      onClick: () => navigateWithToast(
        '/banking/deposit',
        "Deposit Money",
        "Opening deposit form..."
      )
    },
    {
      icon: <Send className="h-6 w-6" />,
      title: "Send Money",
      description: "Transfer to anyone",
      color: "text-blue-500",
      onClick: () => navigateWithToast(
        '/banking/send-money',
        "Send Money",
        "Opening send money form..."
      )
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Receive",
      description: "Get paid easily",
      color: "text-green-500",
      onClick: () => navigateWithToast(
        '/banking/receive',
        "Receive Money",
        "Opening receive money options..."
      )
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "History",
      description: "View transactions",
      color: "text-orange-500",
      onClick: () => navigateWithToast(
        '/banking/history',
        "Transaction History",
        "Loading your transaction history..."
      )
    }
  ];

  const securityFeatures = [
    {
      icon: <Fingerprint className="h-6 w-6" />,
      title: "Biometric Security",
      status: "Enabled",
      color: "text-green-500"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Verification",
      status: "Verified",
      color: "text-green-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Transaction PIN",
      status: "Set",
      color: "text-green-500"
    }
  ];

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              borderColor: ["#3b82f6", "#8b5cf6", "#3b82f6"]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "linear" 
            }}
            className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full"
          />
          <motion.p
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white text-lg font-medium"
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black relative">
        <AnimatedBackground />
        <div className="container mx-auto px-4 h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h2 className="text-white text-3xl font-bold">Welcome to FinerGise</h2>
            <p className="text-gray-400 text-lg">Please log in to access your dashboard</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-6 text-lg"
              >
                Login to Continue
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black relative">
      {/* Enhanced Background */}
      <AnimatedBackground />

      <main className="relative pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hidden receipt generator */}
          <div className="fixed top-0 left-0" style={{ opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
            <div ref={receiptRef}>
              {selectedTransaction && (
                <TransactionReceipt transaction={selectedTransaction} />
              )}
            </div>
          </div>

          {/* Top Bar with Language and Voice Controls */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <Languages className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी</SelectItem>
                  <SelectItem value="tamil">தமிழ்</SelectItem>
                  <SelectItem value="telugu">తెలుగు</SelectItem>
                  <SelectItem value="kannada">ಕನ್ನಡ</SelectItem>
                </SelectContent>
              </Select>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className={`border-gray-800 ${isVoiceEnabled ? 'bg-blue-500/20' : 'bg-gray-900/50'} hover:bg-gray-800/50 transition-all`}
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-all"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <motion.svg
                    className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                    />
                  </motion.svg>
                </Button>
              </motion.div>

              <Dialog>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-all"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Need Help?
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="bg-gray-900/95 border-gray-800 backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle className="text-white">AI Assistant</DialogTitle>
                    <DialogDescription>
                      How can I help you with your banking today?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-purple-500" />
                    <p className="text-gray-400">Ask me anything about your account...</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Main Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md mb-8 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" />
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-white">Available Balance</CardTitle>
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="text-blue-500"
                  >
                    <Wallet className="h-6 w-6" />
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-baseline space-x-2"
                >
                  <span className="text-4xl font-bold text-white">₹{Number(balance).toLocaleString()}</span>
                  <span className="text-gray-400">INR</span>
                </motion.div>
                <div className="mt-4 flex items-center space-x-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`flex items-center ${monthlyChange.isPositive ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {monthlyChange.isPositive ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {monthlyChange.isPositive ? '+' : '-'}₹{monthlyChange.amount.toLocaleString()} this month
                    </span>
                  </motion.div>
                  <div className="h-4 w-px bg-gray-800"></div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center text-gray-400"
                  >
                    <Banknote className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pendingTxCount} pending transactions</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="bg-gray-900/40 border-gray-800/50 hover:bg-gray-900/60 backdrop-blur-md transition-all cursor-pointer overflow-hidden"
                  onClick={action.onClick}
                >
                  <CardContent className="p-6">
                    <div className={`rounded-xl w-12 h-12 flex items-center justify-center bg-gray-800/50 ${action.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      {action.icon}
                    </div>
                    <h3 className="text-white font-semibold mt-4">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Security Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-green-500/5" />
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Security Status</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <motion.span 
                      className="text-green-500 font-semibold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {securityScore}% Secure
                    </motion.span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show" 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {securityFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm border border-gray-800/50 hover:bg-gray-800/40 transition-all"
                    >
                      <div className={`${feature.color}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{feature.title}</p>
                        <p className={`text-sm ${feature.color}`}>{feature.status}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gray-900/40 border-gray-800/50 backdrop-blur-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="border-gray-800 hover:bg-gray-800/50"
                      onClick={() => router.push('/banking/history')}
                    >
                      View All <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {transactions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-gray-400 py-8"
                    >
                      No transactions yet
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-3"
                    >
                      {transactions.map((tx, index) => (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all backdrop-blur-sm border border-gray-800/50"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-xl ${
                              tx.type === 'receive' ? 'bg-green-500/20' : 
                              tx.type === 'send' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                            }`}>
                              {tx.type === 'receive' ? (
                                <ArrowDownLeft className="h-5 w-5 text-green-500" />
                              ) : tx.type === 'send' ? (
                                <ArrowUpRight className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Download className="h-5 w-5 text-purple-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{tx.with}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className={`font-medium ${
                                tx.type === 'receive' ? 'text-green-500' : 
                                tx.type === 'send' ? 'text-blue-500' : 'text-purple-500'
                              }`}>
                                {tx.type === 'receive' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                              </p>
                              <p className={`text-sm ${
                                tx.status === 'completed' ? 'text-green-500/70' :
                                tx.status === 'pending' ? 'text-yellow-500/70' :
                                'text-red-500/70'
                              }`}>
                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                              </p>
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-gray-700 hover:bg-gray-800/50 transition-all"
                                  >
                                    View Details
                                  </Button>
                                </motion.div>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-900/95 border-gray-800 backdrop-blur-lg">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Transaction Details</DialogTitle>
                                </DialogHeader>
                                <TransactionDetails 
                                  transaction={tx}
                                  onDownload={() => handleDownloadReceipt(tx)}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Voice Assistant Hint */}
          <AnimatePresence>
            {isVoiceEnabled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 right-8"
              >
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Volume2 className="h-5 w-5 text-blue-400" />
                    </motion.div>
                    <p className="text-sm text-blue-400">
                      Voice assistant active. Try saying &quot;Send money&quot; or &quot;Check balance&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
