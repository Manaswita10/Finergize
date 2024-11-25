import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Wallet, Users, Lock, Fingerprint, AlertCircle, CheckCircle2, BadgeIndianRupee } from 'lucide-react';
//import Link from "next/link";

export default function SecureTransferPage() {
  const transferTypes = [
    {
      icon: <Users className="w-12 h-12 text-blue-500/80" />,
      title: "Peer to Peer Transfer",
      description: "Send money directly to other Finergise users",
      limit: "Up to ₹1,00,000 per day",
      fee: "No transfer fee",
      gradient: "from-blue-500/20 via-transparent to-transparent"
    },
    {
      icon: <BadgeIndianRupee className="w-12 h-12 text-purple-500/80" />,
      title: "Bank Transfer",
      description: "Transfer to any bank account via UPI/IMPS",
      limit: "Up to ₹2,00,000 per day",
      fee: "Free for basic transfers",
      gradient: "from-purple-500/20 via-transparent to-transparent"
    },
    {
      icon: <Wallet className="w-12 h-12 text-emerald-500/80" />,
      title: "Wallet Transfer",
      description: "Send to popular mobile wallets instantly",
      limit: "Up to ₹50,000 per transfer",
      fee: "No additional charges",
      gradient: "from-emerald-500/20 via-transparent to-transparent"
    }
  ];

  const securityFeatures = [
    {
      icon: <Lock className="h-6 w-6 text-blue-400" />,
      title: "End-to-End Encryption",
      description: "Your transactions are fully encrypted and secure",
      gradient: "from-blue-500/20 via-transparent to-transparent"
    },
    {
      icon: <Fingerprint className="h-6 w-6 text-purple-400" />,
      title: "Biometric Authentication",
      description: "Extra security with fingerprint/face verification",
      gradient: "from-purple-500/20 via-transparent to-transparent"
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-pink-400" />,
      title: "Fraud Detection",
      description: "AI-powered system to prevent unauthorized transfers",
      gradient: "from-pink-500/20 via-transparent to-transparent"
    }
  ];

  const transferSteps = [
    {
      icon: <Users className="h-6 w-6 text-indigo-400" />,
      title: "Select Recipient",
      description: "Choose from contacts or enter account details",
      gradient: "from-indigo-500/20 via-transparent to-transparent"
    },
    {
      icon: <BadgeIndianRupee className="h-6 w-6 text-green-400" />,
      title: "Enter Amount",
      description: "Specify the transfer amount and note",
      gradient: "from-green-500/20 via-transparent to-transparent"
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-orange-400" />,
      title: "Verify & Send",
      description: "Confirm details and authenticate the transfer",
      gradient: "from-orange-500/20 via-transparent to-transparent"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text leading-[1.3] py-2">
              Secure Money Transfers
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Send money securely and instantly to anyone, anywhere
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
              Start Transfer <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Transfer Types */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transferTypes.map((type, index) => (
              <Card key={index} className="group bg-gray-900/50 border-gray-800 hover:border-gray-700">
                <CardHeader>
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${type.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {type.icon}
                  </div>
                  <CardTitle className="text-white text-2xl">{type.title}</CardTitle>
                  <CardDescription className="text-gray-400">{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Limit:</span> {type.limit}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Fee:</span> {type.fee}
                    </p>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Transfer Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Bank-Grade Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {transferSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${step.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-gray-800 rounded-2xl"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Send Money?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Experience fast and secure money transfers with just a few clicks.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                Start Transfer Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}