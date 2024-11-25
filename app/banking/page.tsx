import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Fingerprint, 
  Languages, 
  Phone, 
  ShieldCheck, 
  Coins, 
  BookOpen,
  Headphones,
  ArrowRight,
  Brain,
  BarChart
} from 'lucide-react';
//import Link from "next/link";

export default function BankingPage() {
  const mainServices = [
    {
      icon: <Languages className="w-12 h-12 text-blue-500/80" />,
      title: "Multi-Language Banking",
      description: "Access banking in your local language with voice assistance",
      features: ["10+ Regional Languages", "Voice Commands", "Audio Instructions"],
      gradient: "from-blue-500/20 via-transparent to-transparent"
    },
    {
      icon: <Fingerprint className="w-12 h-12 text-purple-500/80" />,
      title: "Easy Authentication",
      description: "Secure access through fingerprint and face recognition",
      features: ["Biometric Login", "Offline Authentication", "Simple KYC"],
      gradient: "from-purple-500/20 via-transparent to-transparent"
    },
    {
      icon: <Brain className="w-12 h-12 text-emerald-500/80" />,
      title: "AI-Powered Assistance",
      description: "Smart financial guidance and automated support",
      features: ["24/7 Voice Support", "Personalized Advice", "Fraud Detection"],
      gradient: "from-emerald-500/20 via-transparent to-transparent"
    }
  ];

  const securityFeatures = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
      title: "Blockchain Security",
      description: "Transparent and tamper-proof transaction records",
      gradient: "from-blue-500/20 via-transparent to-transparent"
    },
    {
      icon: <Coins className="h-6 w-6 text-purple-400" />,
      title: "Smart Contracts",
      description: "Automated and secure financial agreements",
      gradient: "from-purple-500/20 via-transparent to-transparent"
    },
    {
      icon: <BarChart className="h-6 w-6 text-emerald-400" />,
      title: "AI Risk Assessment",
      description: "Advanced fraud prevention and risk monitoring",
      gradient: "from-emerald-500/20 via-transparent to-transparent"
    }
  ];

  const accessibilityFeatures = [
    {
      icon: <Phone className="h-6 w-6 text-pink-400" />,
      title: "Offline Banking",
      description: "Continue banking even without internet",
      gradient: "from-pink-500/20 via-transparent to-transparent"
    },
    {
      icon: <Headphones className="h-6 w-6 text-amber-400" />,
      title: "Voice Banking",
      description: "Complete transactions using voice commands",
      gradient: "from-amber-500/20 via-transparent to-transparent"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-indigo-400" />,
      title: "Financial Education",
      description: "Learn banking basics through interactive guides",
      gradient: "from-indigo-500/20 via-transparent to-transparent"
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
              Smart Rural Banking
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Experience secure and accessible banking designed specifically for rural communities
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                Open Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="group bg-gray-900/50 border-gray-800 hover:border-gray-700">
                <CardHeader>
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${service.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-white text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, i) => (
                      <li key={i} className="text-gray-400 flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2 text-blue-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Learn More
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
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Blockchain Security</h2>
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

      {/* Accessibility Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Rural Accessibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {accessibilityFeatures.map((feature, index) => (
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

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-gray-800 rounded-2xl"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Start Banking?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of rural community members already benefiting from our smart banking solutions.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                Open Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}