import React from 'react';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Activity
} from 'lucide-react';

interface PortfolioAnalyticsProps {
  showExtendedAnalytics?: boolean;
}

const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({ showExtendedAnalytics = false }) => {
  // Sample data - replace with actual data from your backend
  const portfolioData = {
    totalValue: 250000,
    totalInvestment: 200000,
    returns: 25,
    monthlyReturns: [
      { month: 'Jan', value: 210000 },
      { month: 'Feb', value: 215000 },
      { month: 'Mar', value: 225000 },
      { month: 'Apr', value: 230000 },
      { month: 'May', value: 240000 },
      { month: 'Jun', value: 250000 },
    ],
    allocation: [
      { name: 'Equity Large Cap', value: 40, color: '#3B82F6' },
      { name: 'Equity Mid Cap', value: 30, color: '#6366F1' },
      { name: 'Debt', value: 20, color: '#8B5CF6' },
      { name: 'Cash', value: 10, color: '#A855F7' },
    ],
    topPerformers: [
      { name: 'Large Cap Growth Fund', returns: 18.5, investment: 75000 },
      { name: 'Mid Cap Opportunities', returns: 22.3, investment: 50000 },
      { name: 'Flexi Cap Fund', returns: 16.8, investment: 45000 },
    ]
  };

  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[
        {
          icon: <Wallet className="w-6 h-6 text-blue-400" />,
          title: "Current Value",
          value: `₹${portfolioData.totalValue.toLocaleString()}`,
          change: "+25%",
          trend: "up"
        },
        {
          icon: <DollarSign className="w-6 h-6 text-purple-400" />,
          title: "Total Investment",
          value: `₹${portfolioData.totalInvestment.toLocaleString()}`,
          change: "Cost Basis",
          trend: "neutral"
        },
        {
          icon: <Activity className="w-6 h-6 text-green-400" />,
          title: "Total Returns",
          value: `₹${(portfolioData.totalValue - portfolioData.totalInvestment).toLocaleString()}`,
          change: `+${portfolioData.returns}%`,
          trend: "up"
        },
        {
          icon: <Calendar className="w-6 h-6 text-yellow-400" />,
          title: "Active SIPs",
          value: "5",
          change: "₹25,000/month",
          trend: "neutral"
        }
      ].map((stat, index) => (
        <Card 
          key={index}
          className="bg-slate-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-slate-700/50">
                {stat.icon}
              </div>
              {stat.trend === "up" ? (
                <div className="flex items-center text-green-400 text-sm">
                  {stat.change}
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
              ) : stat.trend === "down" ? (
                <div className="flex items-center text-red-400 text-sm">
                  {stat.change}
                  <ArrowDownRight className="w-4 h-4 ml-1" />
                </div>
              ) : (
                <div className="text-sm text-gray-400">{stat.change}</div>
              )}
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const PerformanceChart = () => (
    <Card className="bg-slate-800/50 border-gray-700 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Portfolio Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={portfolioData.monthlyReturns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const AssetAllocation = () => (
    <Card className="bg-slate-800/50 border-gray-700 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-blue-400" />
          Asset Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData.allocation}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioData.allocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const TopPerformers = () => (
    <Card className="bg-slate-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Top Performing Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {portfolioData.topPerformers.map((fund, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
              <div>
                <h4 className="font-medium text-white mb-1">{fund.name}</h4>
                <p className="text-sm text-gray-400">₹{fund.investment.toLocaleString()} invested</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-semibold">+{fund.returns}%</p>
                <p className="text-sm text-gray-400">Returns</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PerformanceChart />
        <AssetAllocation />
      </div>

      {showExtendedAnalytics && (
        <div className="mt-8">
          <TopPerformers />
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioAnalytics;