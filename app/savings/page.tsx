import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Wallet, Calculator, Shield, ArrowRight, PiggyBank, TrendingUp } from 'lucide-react';

export default function SavingsPage() {
  const savingsGroups = [
    {
      icon: <PiggyBank className="w-12 h-12 text-blue-500" />,
      title: "Daily Savings Group",
      description: "Save small amounts daily with your community members",
      amount: "₹50-500 daily",
      members: "10-20 members"
    },
    {
      icon: <Users className="w-12 h-12 text-purple-500" />,
      title: "Weekly Savings Circle",
      description: "Pool money weekly for group investments and loans",
      amount: "₹500-2000 weekly",
      members: "15-30 members"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-green-500" />,
      title: "Monthly Investment Club",
      description: "Long-term savings with higher returns",
      amount: "₹1000-5000 monthly",
      members: "20-50 members"
    }
  ];

  const benefits = [
    {
      icon: <Calculator className="h-6 w-6 text-blue-400" />,
      title: "Higher Interest Rates",
      description: "Earn up to 12% annual interest on group savings"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-400" />,
      title: "Secure Savings",
      description: "Bank-grade security for all group funds"
    },
    {
      icon: <Wallet className="h-6 w-6 text-purple-400" />,
      title: "Easy Access",
      description: "Withdraw funds when needed with group consensus"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Community Savings Groups
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Join trusted savings groups in your community to save, grow, and support each other
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
              Join a Savings Group <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Savings Groups */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {savingsGroups.map((group, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700">
                <CardHeader>
                  <div className="mb-4">{group.icon}</div>
                  <CardTitle className="text-white text-2xl">{group.title}</CardTitle>
                  <CardDescription className="text-gray-400">{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Contribution:</span> {group.amount}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Group Size:</span> {group.members}
                    </p>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Benefits of Group Savings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}