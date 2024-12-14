"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  BarChart,
  AlertCircle,
  Wallet,
  Users,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function BankingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/account/check-pin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        const data = await response.json();
        setIsAuthenticated(!data.error);
        
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleOpenAccount = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/account/check-pin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!data.error) {
        router.push('/banking/setup-pin');
      } else {
        router.push('/register');
        toast({
          title: "Registration Required",
          description: "Please create an account to access banking services",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-blue-400" />,
      value: "10K+",
      description: "Growing community"
    },
    {
      icon: <Wallet className="w-6 h-6 text-purple-400" />,
      value: "₹1Cr+",
      description: "Monthly volume"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      value: "500+",
      description: "Across India"
    }
  ];

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
      features: [
        {
          text: "Biometric Login",
          href: "/banking/security/biometric"
        },
        {
          text: "Account PIN",
          href: "/banking/security/pin"
        },
        {
          text: "Phone Verification",
          href: "/banking/security/phone-verify"
        }
      ],
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
      gradient: "from-blue-500/20 via-transparent to-transparent",
      learnMore: "Learn how our blockchain keeps your money safe"
    },
    {
      icon: <Coins className="h-6 w-6 text-purple-400" />,
      title: "Smart Contracts",
      description: "Automated and secure financial agreements",
      gradient: "from-purple-500/20 via-transparent to-transparent",
      learnMore: "Discover the power of smart contracts"
    },
    {
      icon: <BarChart className="h-6 w-6 text-emerald-400" />,
      title: "AI Risk Assessment",
      description: "Advanced fraud prevention and risk monitoring",
      gradient: "from-emerald-500/20 via-transparent to-transparent",
      learnMore: "How AI protects your transactions"
    }
  ];

  const accessibilityFeatures = [
    {
      icon: <Phone className="h-6 w-6 text-pink-400" />,
      title: "Offline Banking",
      description: "Continue banking even without internet",
      gradient: "from-pink-500/20 via-transparent to-transparent",
      details: "Our offline system stores transactions securely until connectivity is restored"
    },
    {
      icon: <Headphones className="h-6 w-6 text-amber-400" />,
      title: "Voice Banking",
      description: "Complete transactions using voice commands",
      gradient: "from-amber-500/20 via-transparent to-transparent",
      details: "Supports multiple regional languages and dialects"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-indigo-400" />,
      title: "Financial Education",
      description: "Learn banking basics through interactive guides",
      gradient: "from-indigo-500/20 via-transparent to-transparent",
      details: "Personalized learning paths in your preferred language"
    }
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Grid background with reduced opacity */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.6)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Left to right gradient light effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="relative inline-block mb-8">
              <motion.h1 
                className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text relative z-10"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Smart Rural Banking
              </motion.h1>
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-xl"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Experience secure and accessible banking designed specifically for rural communities
            </motion.p>

            <div className="flex gap-6 justify-center mb-20">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleOpenAccount}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-6 text-lg rounded-full relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center">
                    {isLoading ? "Please wait..." : "Open Account"}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>

              <Dialog>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      className="border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                    >
                      Watch Demo
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="bg-gray-900/90 backdrop-blur-xl border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">How It Works</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Watch how our rural banking solution makes financial services accessible to everyone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-500" />
                    <span className="ml-2 text-gray-500">Demo video placeholder</span>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur" />
                  <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800/50">
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-blue-500/5">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-gray-400">{stat.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Core Features
            </h2>
            <p className="text-gray-400 mt-2">
              Designed for simplicity and accessibility
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="group bg-gray-900/20 border-gray-800 hover:border-gray-700 cursor-pointer">
                <CardHeader>
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${service.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-white text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {Array.isArray(service.features) && service.features.map((feature, i) => (
                      <li key={i}>
                        {typeof feature === 'string' ? (
                          <div className="text-gray-400 flex items-center">
                            <ArrowRight className="h-4 w-4 mr-2 text-blue-400" />
                            {feature}
                          </div>
                        ) : (
                          <Link 
                            href={isAuthenticated ? feature.href : "/register"}
                            className="text-gray-400 hover:text-blue-400 flex items-center transition-colors group"
                            onClick={(e) => {
                              if (!isAuthenticated) {
                                e.preventDefault();
                                toast({
                                  title: "Authentication Required",
                                  description: "Please register or login to access this feature"
                                });
                                router.push('/register');
                              } else {
                                toast({
                                  title: "Opening " + feature.text,
                                  description: "Please wait..."
                                });}
                              }}
                            >
                              <ArrowRight className="h-4 w-4 mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" />
                              {feature.text}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
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
                  <div key={index} className="flex items-start space-x-4 group cursor-pointer">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                      <p className="text-blue-400 mt-2 text-sm hover:text-blue-300 flex items-center">
                        {feature.learnMore} <ArrowRight className="ml-1 h-3 w-3" />
                      </p>
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
                  <div key={index} className="flex items-start space-x-4 group cursor-pointer">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <p className="text-blue-400 mt-2 text-sm hover:text-blue-300 flex items-center">
                            Learn more <ArrowRight className="ml-1 h-3 w-3" />
                          </p>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-800">
                          <DialogHeader>
                            <DialogTitle className="text-white">{feature.title}</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              {feature.details}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
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
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                  onClick={handleOpenAccount}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      Please wait... <span className="ml-2 animate-spin">○</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
  
        {/* FAQs Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="bg-gray-900/50 border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">What documents do I need?</h3>
                    <p className="text-gray-400 text-sm">You only need your Aadhaar card and a working phone number to get started with basic banking services.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Is offline banking available?</h3>
                    <p className="text-gray-400 text-sm">Yes, you can perform basic transactions even without internet connectivity. They'll sync when you're back online.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Are my transactions secure?</h3>
                    <p className="text-gray-400 text-sm">All transactions are secured using blockchain technology and encrypted end-to-end for maximum security.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">What languages are supported?</h3>
                    <p className="text-gray-400 text-sm">We support 10+ regional languages including Hindi, Tamil, Telugu, Kannada, and more. Voice banking is available in all supported languages.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">How do I get help?</h3>
                    <p className="text-gray-400 text-sm">24/7 support is available through voice commands, chat, or by visiting your local banking correspondent.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Are there any fees?</h3>
                    <p className="text-gray-400 text-sm">Basic banking services are free. Some premium features may have minimal charges which are clearly disclosed.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
  
        {/* Download App Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-gray-800 rounded-2xl"></div>
              <div className="relative text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Bank Anytime, Anywhere
                </h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Download our app to start your banking journey. Works offline and in multiple languages.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => window.open('https://play.google.com/store', '_blank')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Download Android App
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    onClick={() => window.open('https://www.apple.com/app-store/', '_blank')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Download iOS App
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="py-12 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold mb-4">About Us</h3>
                <p className="text-gray-400 text-sm">
                  Empowering rural communities with accessible, secure, and innovative banking solutions.
                </p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-gray-400 hover:text-white text-sm">Careers</Link>
                  </li>
                  <li>
                    <Link href="/support" className="text-gray-400 hover:text-white text-sm">Support</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
                  </li>
                  <li>
                    <Link href="/security" className="text-gray-400 hover:text-white text-sm">Security</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400 text-sm">Email: support@finergize.com</li>
                  <li className="text-gray-400 text-sm">Phone: 1800-XXX-XXXX</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
              © 2024 Finergize. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    );
  }