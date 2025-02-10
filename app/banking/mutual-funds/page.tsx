import React, { useState } from 'react';
import MutualFundsDisplay from '@/components/mutual funds/MutualFundsDisplay';
import InvestmentModal from '@/components/mutual funds/InvestmentModal';
import TransactionHistory from '@/components/mutual funds/TransactionHistory';
import PortfolioAnalytics from '@/components/mutual funds/PortfolioAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChartBarIcon, TrendingUpIcon, ClockIcon, WalletIcon, Sparkles } from 'lucide-react';

const MutualFundsPage = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const handleInvestClick = (fund) => {
    setSelectedFund(fund);
    setShowInvestModal(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#111827] to-[#0A0A0A] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.3)_1px,transparent_1px)] bg-[size:64px_64px] transform -skew-y-6"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-conic from-purple-500/10 via-blue-500/10 to-purple-500/10"
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 relative"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-block mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-semibold">Smart Investment Platform</span>
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
              Mutual Fund Investments
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Grow your wealth with AI-powered recommendations and expert insights
          </motion.p>

          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Main Navigation Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="backdrop-blur-sm bg-slate-900/30 p-8 rounded-2xl border border-gray-800/50 shadow-2xl"
        >
          <Tabs
            defaultValue="explore"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 gap-4 p-1 mb-8 bg-slate-800/50 rounded-xl">
              {[
                { value: 'explore', icon: ChartBarIcon, label: 'Explore Funds' },
                { value: 'portfolio', icon: WalletIcon, label: 'My Portfolio' },
                { value: 'analytics', icon: TrendingUpIcon, label: 'Analytics' },
                { value: 'transactions', icon: ClockIcon, label: 'Transactions' }
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="relative flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {activeTab === value && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative">
              <TabsContent value="explore">
                <MutualFundsDisplay onInvestClick={handleInvestClick} />
              </TabsContent>

              <TabsContent value="portfolio">
                <PortfolioAnalytics />
              </TabsContent>

              <TabsContent value="analytics">
                <PortfolioAnalytics showExtendedAnalytics />
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionHistory />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>

        {/* Investment Modal */}
        {showInvestModal && (
          <InvestmentModal 
            fund={selectedFund}
            isOpen={showInvestModal}
            onClose={() => setShowInvestModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MutualFundsPage;