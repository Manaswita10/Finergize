import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Wallet, Building, ShieldCheck, Send, LineChart, Clock } from 'lucide-react';

export default function BankingPage() {
  const services = [
    {
      icon: <Wallet className="w-12 h-12 text-blue-500" />,
      title: "Digital Savings Account",
      description: "Open and manage your savings account digitally with zero balance requirements",
      buttonText: "Open Account"
    },
    {
      icon: <Send className="w-12 h-12 text-purple-500" />,
      title: "Money Transfers",
      description: "Send and receive money instantly to any bank account or mobile wallet",
      buttonText: "Transfer Now"
    },
    {
      icon: <LineChart className="w-12 h-12 text-green-500" />,
      title: "Fixed Deposits",
      description: "Earn higher interest rates with flexible deposit terms",
      buttonText: "Start Saving"
    }
  ];

  const features = [
    {
      icon: <Building className="h-6 w-6 text-blue-400" />,
      title: "Physical Banking Centers",
      description: "Visit our local centers for assistance and cash services"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-400" />,
      title: "Secure Transactions",
      description: "Bank-grade security for all your transactions"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-400" />,
      title: "24/7 Access",
      description: "Access your account anytime, anywhere"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Digital Banking Services
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Experience seamless banking with our comprehensive digital services designed for rural communities
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700">
                <CardHeader>
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-white text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    {service.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Additional Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}