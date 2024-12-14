"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  BellRing, 
  Sparkles, 
  ArrowRight, 
  Percent,
  PieChart as PieChartIcon,
  Wallet,
  Shield,
  Activity
} from 'lucide-react';
import { useSpring, animated } from 'react-spring';

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/10 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );
};

const AnimatedNumber = ({ value }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return <animated.span>{number.to(n => n.toFixed(0))}</animated.span>;
};

const GlowingBorder = ({ children }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-30 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
    <div className="relative">{children}</div>
  </div>
);

export default function TrackerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const paymentData = [
    { month: 'Jan', paid: 12000, scheduled: 15000 },
    { month: 'Feb', paid: 14000, scheduled: 15000 },
    { month: 'Mar', paid: 15000, scheduled: 15000 },
    { month: 'Apr', paid: 13000, scheduled: 15000 },
    { month: 'May', paid: 0, scheduled: 15000 },
    { month: 'Jun', paid: 0, scheduled: 15000 }
  ];

  const loanBreakdown = [
    { name: 'Principal Paid', value: 45, color: '#60A5FA' },
    { name: 'Interest Paid', value: 15, color: '#C084FC' },
    { name: 'Remaining', value: 40, color: '#6B7280' }
  ];

  const metrics = [
    {
      title: "Total Loan Amount",
      value: 150000,
      icon: <Wallet className="w-6 h-6" />,
      color: "from-blue-600 to-cyan-400",
      progress: 60
    },
    {
      title: "Credit Score",
      value: 720,
      icon: <Shield className="w-6 h-6" />,
      color: "from-green-500 to-emerald-400",
      maxValue: 850
    },
    {
      title: "Risk Level",
      value: 35,
      icon: <Activity className="w-6 h-6" />,
      color: "from-purple-600 to-pink-400",
      suffix: "%"
    },
    {
      title: "Payment Streak",
      value: 6,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "from-amber-500 to-orange-400",
      suffix: " months"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-transparent via-purple-500/10 to-transparent"></div>
        <div className="absolute h-[600px] w-[600px] left-1/4 top-1/4 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute h-[400px] w-[400px] right-1/4 bottom-1/4 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <ParticleBackground />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header with Animated Gradient */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
          <Card className="relative backdrop-blur-lg bg-black/40 border-white/10 overflow-hidden">
            <CardHeader className="p-8">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-gradient-x">
                    Loan Analytics Dashboard
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Your financial journey, visualized beautifully
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border-green-500/30 px-6 py-3 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2 inline-block animate-pulse" />
                  Premium Account
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Animated Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <GlowingBorder key={index}>
              <Card 
                className={`bg-black/40 backdrop-blur-lg border-white/10 transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden ${
                  activeCard === index ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setActiveCard(index)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} p-2.5 flex items-center justify-center mb-4`}>
                    {metric.icon}
                  </div>
                  <CardTitle className="text-white text-xl flex items-center justify-between">
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">
                      <AnimatedNumber value={metric.value} />
                      {metric.suffix}
                    </span>
                  </div>
                  {metric.progress && (
                    <Progress 
                      value={metric.progress} 
                      className="mt-4 h-2 bg-gray-700/50"
                    />
                  )}
                  {metric.maxValue && (
                    <div className="text-sm text-gray-400 mt-2">
                      of {metric.maxValue} maximum
                    </div>
                  )}
                </CardContent>
              </Card>
            </GlowingBorder>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlowingBorder>
            <Card className="bg-black/40 backdrop-blur-lg border-white/10 h-[400px]">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                  Payment Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={paymentData}>
                    <defs>
                      <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C084FC" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#C084FC" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="paid"
                      stroke="#60A5FA"
                      strokeWidth={3}
                      fill="url(#colorPaid)"
                      dot={{ stroke: '#60A5FA', strokeWidth: 2, r: 6, fill: '#000' }}
                      activeDot={{ r: 8, stroke: '#60A5FA', strokeWidth: 2, fill: '#60A5FA' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="scheduled"
                      stroke="#C084FC"
                      strokeWidth={3}
                      fill="url(#colorScheduled)"
                      dot={{ stroke: '#C084FC', strokeWidth: 2, r: 6, fill: '#000' }}
                      activeDot={{ r: 8, stroke: '#C084FC', strokeWidth: 2, fill: '#C084FC' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </GlowingBorder>

          <GlowingBorder>
            <Card className="bg-black/40 backdrop-blur-lg border-white/10 h-[400px]">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center gap-3">
                  <PieChartIcon className="w-6 h-6 text-purple-400" />
                  Loan Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      {loanBreakdown.map((entry, index) => (
                        <linearGradient key={index} id={`colorPie${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.7}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={loanBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {loanBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={`url(#colorPie${index})`}
                          className="hover:opacity-80 transition-opacity duration-300"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </GlowingBorder>
        </div>

        {/* Enhanced Payment Schedule */}
        <GlowingBorder>
          <Card className="bg-black/40 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-3">
                <Calendar className="w-6 h-6 text-pink-400" />
                Upcoming Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {[
                  { date: "Apr 15, 2024", amount: 15000, status: "upcoming", probability: "high" },
                  { date: "May 15, 2024", amount: 15000, status: "upcoming", probability: "medium" },
                  { date: "Jun 15, 2024", amount: 15000, status: "upcoming", probability: "low" }
                ].map((payment, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                    <div className="relative flex items-center justify-between p-6 rounded-xl bg-black/40 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                          <Calendar className="text-blue-400 w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-lg">{payment.date}</p>
                          <p className="text-sm text-gray-400">Scheduled payment</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-400">Due amount</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`px-4 py-2 text-sm ${
                            payment.probability === 'high' 
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : payment.probability === 'medium'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </GlowingBorder>

        {/* Enhanced Action Buttons */}
        <div className="flex justify-center gap-6 pt-8">
          <Button 
            className="group relative px-8 py-6 rounded-xl text-lg font-medium"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"></div>
            <div className="relative flex items-center gap-3 text-white">
              <BellRing className="w-5 h-5" />
              <span>Set Payment Reminders</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Button>

          <Button 
            variant="outline"
            className="group relative px-8 py-6 rounded-xl text-lg font-medium border-white/10 hover:border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl"></div>
            <div className="relative flex items-center gap-3 text-white">
              <Shield className="w-5 h-5" />
              <span>View Loan Details</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Button>
        </div>

        {/* Footer with Extra Information */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>All amounts are in Indian Rupees (₹)</p>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes gradient-xy {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }

        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
          background-size: 400% 400%;
        }
      `}</style>
    </div>
  );
}