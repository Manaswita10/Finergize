"use client";
import React, { useState } from 'react';
import MutualFundsDisplay from '@/components/mutual funds/MutualFundsDisplay';
import InvestmentModal from '@/components/mutual funds/InvestmentModal';
import TransactionHistory from '@/components/mutual funds/TransactionHistory';
import PortfolioAnalytics from '@/components/mutual funds/PortfolioAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ChartBarIcon, TrendingUpIcon, ClockIcon, WalletIcon } from 'lucide-react';

const MutualFundsPage = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const handleInvestClick = (fund) => {
    setSelectedFund(fund);
    setShowInvestModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.6)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="container mx-auto relative z-10">
        {/* Header Section with increased padding */}
        <div className="pt-40 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Mutual Fund Investments
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Grow your wealth with AI-powered recommendations and expert insights
            </p>
          </motion.div>

          {/* Main Navigation Tabs */}
          <Tabs
            defaultValue="explore"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-16"
          >
            <TabsList className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
              <TabsTrigger 
                value="explore"
                className="flex items-center gap-2 py-4 data-[state=active]:bg-blue-500 transition-all duration-200"
              >
                <ChartBarIcon className="w-5 h-5" />
                Explore Funds
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio"
                className="flex items-center gap-2 py-4 data-[state=active]:bg-blue-500 transition-all duration-200"
              >
                <WalletIcon className="w-5 h-5" />
                My Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="flex items-center gap-2 py-4 data-[state=active]:bg-blue-500 transition-all duration-200"
              >
                <TrendingUpIcon className="w-5 h-5" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="flex items-center gap-2 py-4 data-[state=active]:bg-blue-500 transition-all duration-200"
              >
                <ClockIcon className="w-5 h-5" />
                Transactions
              </TabsTrigger>
            </TabsList>

            <div className="mt-12">
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
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <InvestmentModal 
          fund={selectedFund}
          isOpen={showInvestModal}
          onClose={() => setShowInvestModal(false)}
        />
      )}
    </div>
  );
};

export default MutualFundsPage;