"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
 XAxis, YAxis, CartesianGrid, Tooltip, 
 ResponsiveContainer, PieChart, Pie, Cell, Bar, ComposedChart
} from 'recharts';
import { ArrowUpRight, PiggyBank, DollarSign, TrendingUp } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from '@/lib/types';
import { getDateRangePresets } from '@/lib/financeUtils';
import { DateRangePicker } from '@/components/DateRangePicker';

const SavingsAnalytics = () => {
 const { data: session, status } = useSession();
 const { toast } = useToast();
 const [isLoading, setIsLoading] = useState(true);
 const [transactions, setTransactions] = useState([]);
 const [monthlyData, setMonthlyData] = useState([]);
 const [totalSavings, setTotalSavings] = useState(0);
 const [depositTypes, setDepositTypes] = useState([]);
 const [monthlyChange, setMonthlyChange] = useState({ amount: 0, isPositive: true });
 const [dateRange, setDateRange] = useState<DateRange>(getDateRangePresets()[1].range);

 const COLORS = {
   deposit: '#34D399',  // Green for deposits
   send: '#F87171',     // Red for send money
   line: '#60A5FA',     // Blue for total balance
   pieChart: ['#60A5FA', '#A78BFA', '#34D399', '#818CF8']
 };

 const fetchAnalyticsData = useCallback(async () => {
   if (status !== "authenticated") return;

   try {
     const [balanceRes, txRes] = await Promise.all([
       fetch('/api/banking/balance'),
       fetch('/api/banking/transactions/recent')
     ]);

     if (!balanceRes.ok || !txRes.ok) {
       throw new Error('Failed to fetch data');
     }

     const balanceData = await balanceRes.json();
     const txData = await txRes.json();

     const txsByMonth = txData.transactions
       .filter((tx: any) => (tx.type === 'deposit' || tx.type === 'send') && tx.status === 'completed')
       .reduce((acc: any, tx: any) => {
         const date = new Date(tx.timestamp);
         const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
         
         if (!acc[monthKey]) {
           acc[monthKey] = {
             month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short' }),
             deposits: 0,
             sends: 0,
             total: 0,
             netFlow: 0
           };
         }
         
         if (tx.type === 'deposit') {
           acc[monthKey].deposits += tx.amount;
           acc[monthKey].netFlow += tx.amount;
         } else if (tx.type === 'send') {
           acc[monthKey].sends += tx.amount;
           acc[monthKey].netFlow -= tx.amount;
         }
         
         acc[monthKey].total = acc[monthKey].deposits - acc[monthKey].sends;
         return acc;
       }, {});

     const monthlyDataArray = Object.values(txsByMonth)
       .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());

     let runningTotal = 0;
     monthlyDataArray.forEach((month: any) => {
       runningTotal += month.netFlow;
       month.cumulativeTotal = runningTotal;
     });

     const depositByType = txData.transactions
       .filter((tx: any) => tx.type === 'deposit')
       .reduce((acc: any, tx: any) => {
         if (!acc[tx.with]) {
           acc[tx.with] = { name: tx.with, value: 0, percentage: 0 };
         }
         acc[tx.with].value += tx.amount;
         return acc;
       }, {});

     const totalDeposits = Object.values(depositByType).reduce((sum: any, type: any) => sum + type.value, 0);
     Object.values(depositByType).forEach((type: any) => {
       type.percentage = ((type.value / totalDeposits) * 100).toFixed(1);
     });

     setTotalSavings(balanceData.balance);
     setMonthlyChange(balanceData.monthlyChange);
     setMonthlyData(monthlyDataArray);
     setDepositTypes(Object.values(depositByType));
     setTransactions(txData.transactions);

   } catch (error) {
     console.error('Failed to fetch analytics data:', error);
     toast({
       title: "Error Loading Analytics",
       description: "Please refresh the page or try again later",
       variant: "destructive",
     });
   } finally {
     setIsLoading(false);
   }
 }, [status, toast]);

 useEffect(() => {
   fetchAnalyticsData();
   const intervalId = setInterval(fetchAnalyticsData, 30000);
   return () => clearInterval(intervalId);
 }, [fetchAnalyticsData]);

 const handleDateRangeChange = (newRange: DateRange) => {
   setDateRange(newRange);
 };

 const CustomChartTooltip = ({ active, payload, label }: any) => {
   if (active && payload && payload.length) {
     return (
       <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-lg">
         <p className="text-gray-300 font-medium mb-2">{label}</p>
         {payload.map((entry: any, index: number) => (
           <div key={index} className="flex items-center justify-between gap-4 mb-1">
             <span className="text-sm" style={{ color: entry.fill || entry.color }}>
               {entry.name === 'deposits' ? 'Deposits' : 
                entry.name === 'sends' ? 'Sent' : 
                'Total Balance'}:
             </span>
             <span className="text-white font-medium">
               ₹{Math.abs(entry.value).toLocaleString()}
             </span>
           </div>
         ))}
       </div>
     );
   }
   return null;
 };

 if (status === "loading" || isLoading) {
   return (
     <main className="min-h-screen bg-black pt-24">
       <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
       <div className="container mx-auto px-4 flex justify-center items-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
       </div>
     </main>
   );
 }

 const stats = [
   {
     title: 'Total Savings',
     value: `₹${totalSavings.toLocaleString()}`,
     icon: <PiggyBank className="w-6 h-6 text-blue-400" />,
     change: `${monthlyChange.isPositive ? '+' : '-'}${monthlyChange.amount}%`,
     gradient: 'from-blue-500/20'
   },
   {
     title: 'Average Deposit',
     value: `₹${monthlyData.length ? (monthlyData.reduce((acc: any, curr: any) => acc + curr.deposits, 0) / monthlyData.length).toLocaleString() : 0}`,
     icon: <DollarSign className="w-6 h-6 text-purple-400" />,
     change: '+5.2%',
     gradient: 'from-purple-500/20'
   },
   {
     title: 'Growth Rate',
     value: `${monthlyData.length >= 2 ? 
       (((monthlyData[monthlyData.length - 1]?.cumulativeTotal || 0) - (monthlyData[0]?.cumulativeTotal || 0)) / 
       Math.abs(monthlyData[0]?.cumulativeTotal || 1) * 100).toFixed(1) : 0}%`,
     icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
     change: '+2.1%',
     gradient: 'from-emerald-500/20'
   }
 ];

 return (
   <main className="min-h-screen bg-black p-8">
     <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
     
     <div className="flex justify-between items-center mb-8">
       <div>
         <h1 className="text-6xl font-bold text-blue-400">
           Finergize
         </h1>
         <p className="text-gray-400 mt-2 text-lg">Track and analyze your saving patterns</p>
       </div>
       <DateRangePicker date={dateRange} onSelect={handleDateRangeChange} />
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       {stats.map((stat, index) => (
         <Card key={index} className="bg-gray-900/50 border-gray-800">
           <CardContent className="p-6">
             <div className="flex items-center justify-between">
               <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient} via-transparent to-transparent`}>
                 {stat.icon}
               </div>
               <span className="flex items-center text-green-400 text-sm">
                 {stat.change}
                 <ArrowUpRight className="w-4 h-4 ml-1" />
               </span>
             </div>
             <div className="mt-4">
               <p className="text-gray-400 text-sm">{stat.title}</p>
               <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
             </div>
           </CardContent>
         </Card>
       ))}
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <Card className="bg-gray-900/50 border-gray-800">
         <CardHeader>
           <CardTitle className="text-white">Money Flow Analytics</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={monthlyData} barGap={10}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                 <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                 <YAxis 
                   stroke="#9CA3AF" 
                   tick={{ fill: '#9CA3AF' }}
                   tickFormatter={(value) => `₹${Math.abs(value).toLocaleString()}`}
                 />
                 <Tooltip content={<CustomChartTooltip />} />
                 
                 <Bar dataKey="deposits" fill={COLORS.deposit} barSize={40} />
                 <Bar dataKey="sends" fill={COLORS.send} barSize={40} />
                 <Bar 
                   dataKey="cumulativeTotal" 
                   fill={COLORS.line} 
                   barSize={40}
                 />
               </ComposedChart>
             </ResponsiveContainer>
             
             <div className="flex justify-center flex-wrap gap-6 mt-4">
               <div className="flex items-center">
                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.deposit }} />
                 <span className="text-sm text-gray-300">Deposits</span>
               </div>
               <div className="flex items-center">
                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.send }} />
                 <span className="text-sm text-gray-300">Money Sent</span>
               </div>
               <div className="flex items-center">
                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS.line }} />
                 <span className="text-sm text-gray-300">Total Balance</span>
               </div>
             </div>
           </div>
         </CardContent>
       </Card>

       <Card className="bg-gray-900/50 border-gray-800">
         <CardHeader>
           <CardTitle className="text-white">Deposit Methods</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="h-[300px] relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={depositTypes}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={90}
                   paddingAngle={4}
                   dataKey="value"
                 >
                   {depositTypes.map((entry: any, index: number) => (
                     <Cell 
                       key={`cell-${index}`} 
                       fill={COLORS.pieChart[index % COLORS.pieChart.length]}
                       stroke="#1F2937"
                       strokeWidth={2}
                     />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{
                     backgroundColor: '#1F2937',
                     border: 'none',
                     borderRadius: '0.5rem',
                     color: '#fff'
                   }}
                 />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
               <p className="text-gray-400 text-sm">Total</p>
               <p className="text-white font-bold text-xl">
                 ₹{depositTypes.reduce((sum: number, type: any) => sum + type.value, 0).toLocaleString()}
               </p>
             </div>
             <div className="flex justify-center flex-wrap gap-3 mt-8">
               {depositTypes.map((type: any, index: number) => (
                 <div 
                   key={index} 
                   className="flex items-center bg-gray-800/40 px-4 py-2 rounded-full"
                 >
                   <div 
                     className="w-2 h-2 rounded-full mr-2"
                     style={{ backgroundColor: COLORS.pieChart[index % COLORS.pieChart.length] }}
                   />
                   <span className="text-sm text-gray-300 font-medium">{type.name}</span>
                   <span className="text-sm text-gray-400 ml-2">({type.percentage}%)</span>
                 </div>
               ))}
           </div>
           </div>
         </CardContent>
       </Card>
     </div>
   </main>
 );
};

export default SavingsAnalytics;