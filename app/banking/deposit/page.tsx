"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Wallet, CreditCard, Building, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GlowingBackground = () => (
  <div className="fixed inset-0 -z-10">
    {/* Dark gradient base */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0D0118] to-black">
      {/* Animated glow effects */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -100, 0],
          y: [0, -50, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/30 rounded-full filter blur-3xl"
      />
      
      {/* Additional static glow for depth */}
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-800/20 rounded-full filter blur-3xl" />
    </div>
    
    {/* Subtle grid overlay */}
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        maskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5), transparent 70%)'
      }}
    />
  </div>
);

interface DepositData {
  amount: number;
  method: string;
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export default function DepositPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [depositData, setDepositData] = useState<DepositData>({
    amount: 0,
    method: 'upi'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/banking/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depositData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `₹${depositData.amount} added to your wallet`
        });
        router.push('/banking/dashboard');
      } else {
        throw new Error(data.error || 'Deposit failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodIcon = (method: string) => {
    const iconClasses = "w-5 h-5 text-blue-400";
    switch (method) {
      case 'upi':
        return <Wallet className={iconClasses} />;
      case 'card':
        return <CreditCard className={iconClasses} />;
      case 'netbanking':
        return <Building className={iconClasses} />;
      default:
        return <Wallet className={iconClasses} />;
    }
  };

  const renderPaymentFields = () => {
    const inputClasses = "h-12 bg-black/40 border-blue-700/30 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all duration-300";
    
    switch (depositData.method) {
      case 'upi':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl border border-blue-700/30 p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-black opacity-50"></div>
            <div className="relative space-y-4">
              <Label className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                UPI ID
              </Label>
              <Input
                placeholder="name@bank"
                value={depositData.upiId || ''}
                onChange={(e) => setDepositData({ ...depositData, upiId: e.target.value })}
                required
                className={inputClasses}
              />
            </div>
          </motion.div>
        );

      case 'card':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl border border-blue-700/30 p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-black opacity-50"></div>
            <div className="relative space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Card Number
                </Label>
                <Input
                  placeholder="0000 0000 0000 0000"
                  value={depositData.cardNumber || ''}
                  onChange={(e) => setDepositData({ ...depositData, cardNumber: e.target.value })}
                  required
                  className={inputClasses}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Expiry
                  </Label>
                  <Input
                    placeholder="MM/YY"
                    value={depositData.cardExpiry || ''}
                    onChange={(e) => setDepositData({ ...depositData, cardExpiry: e.target.value })}
                    required
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    CVV
                  </Label>
                  <Input
                    type="password"
                    placeholder="•••"
                    value={depositData.cardCvv || ''}
                    onChange={(e) => setDepositData({ ...depositData, cardCvv: e.target.value })}
                    required
                    className={inputClasses}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'netbanking':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl border border-blue-700/30 p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-black opacity-50"></div>
            <div className="relative space-y-6">
              {['bankName', 'accountNumber', 'ifscCode'].map((field) => (
                <div key={field} className="space-y-4">
                  <Label className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    {field === 'bankName' ? 'Bank Name' : 
                     field === 'accountNumber' ? 'Account Number' : 'IFSC Code'}
                  </Label>
                  <Input
                    placeholder={`Enter ${field === 'bankName' ? 'bank name' : 
                                 field === 'accountNumber' ? 'account number' : 'IFSC code'}`}
                    value={depositData[field as keyof DepositData] || ''}
                    onChange={(e) => setDepositData({ ...depositData, [field]: e.target.value })}
                    required
                    className={inputClasses}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0118] pt-24 relative overflow-hidden">
      <GlowingBackground />
      
      <div className="container max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-200 bg-clip-text text-transparent mb-2">
            Deposit Funds
          </h1>
          <p className="text-blue-300/80">Quick and secure deposits to your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border border-blue-900/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
            
            <CardHeader>
              <Alert className="bg-blue-500/5 border-blue-400/20 backdrop-blur">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <AlertTitle className="font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Secure Transaction
                </AlertTitle>
                <AlertDescription className="text-blue-100/80">
                  Your payment information is protected with industry-standard encryption.
                </AlertDescription>
              </Alert>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-xl border border-blue-700/30 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-black opacity-50"></div>
                  <div className="relative">
                    <Label className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      Amount
                    </Label>
                    <div className="mt-4 relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <span className="text-blue-400">₹</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="0"
                        value={depositData.amount || ''}
                        onChange={(e) => setDepositData({ ...depositData, amount: parseInt(e.target.value) })}
                        min={1}
                        required
                        className="pl-8 h-16 text-3xl font-light bg-black/40 border-blue-700/30 text-white placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all duration-300"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-xl border border-blue-700/30 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-blue-900/20 opacity-50"></div>
                  <div className="relative space-y-4">
                    <Label className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      Payment Method
                    </Label>
                    <Select
                      value={depositData.method}
                      onValueChange={(value) => setDepositData({ ...depositData, method: value })}
                    >
                      <SelectTrigger className="h-12 bg-black/40 border-blue-700/30 text-white focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-blue-700/30">
                        {[
                          { value: 'upi', label: 'UPI Payment' },
                          { value: 'card', label: 'Card Payment' },
                          { value: 'netbanking', label: 'Net Banking' }
                        ].map((method) => (
                          <SelectItem
                            key={method.value}
                            value={method.value}
                            className="text-white hover:bg-gray-800"
                          >
                            <div className="flex items-center space-x-2">
                              {getMethodIcon(method.value)}
                              <span>{method.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {renderPaymentFields()}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:opacity-90 transition-all duration-300"
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center justify-center space-x-2"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <span>Processing</span>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ◌
                        </motion.span>
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Complete Deposit
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="space-y-4 p-6 rounded-xl border border-blue-700/30 bg-gradient-to-b from-blue-900/10 to-black">
                {[
                  'Bank-grade security protocols',
                  'Instant deposit confirmation',
                  '24/7 transaction support'
                ].map((text, index) => (
                  <p key={index} className="text-sm text-blue-100/80 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></span>
                    <span>{text}</span>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}