"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Shield, ArrowLeft, Lock, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const AnimatedBackgroundGradients = () => (
  <div className="fixed inset-0 pointer-events-none">
    {/* Primary large gradient orbs */}
    <motion.div 
      className="absolute w-[1000px] h-[1000px] -top-[500px] left-1/3 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent rounded-full blur-[120px]"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute w-[1000px] h-[1000px] -bottom-[500px] right-1/3 bg-gradient-to-tr from-blue-500/20 via-cyan-500/10 to-transparent rounded-full blur-[120px]"
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.25, 0.15, 0.25]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />

    {/* Secondary floating orbs */}
    <motion.div 
      className="absolute w-[300px] h-[300px] top-[20%] right-[15%] bg-gradient-to-br from-purple-600/10 via-indigo-600/5 to-transparent rounded-full blur-[80px]"
      animate={{
        y: [-20, 20, -20],
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.3, 0.2]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute w-[250px] h-[250px] bottom-[30%] left-[10%] bg-gradient-to-tr from-blue-600/10 via-sky-600/5 to-transparent rounded-full blur-[80px]"
      animate={{
        y: [20, -20, 20],
        scale: [1.1, 1, 1.1],
        opacity: [0.3, 0.2, 0.3]
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />

    {/* Accent gradient lines */}
    <div className="absolute inset-0">
      <motion.div 
        className="absolute top-[25%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm"
        animate={{
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-[75%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm"
        animate={{
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>

    {/* Vignette effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
  </div>
);

export default function SetupPinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    checkPinStatus();
  }, []);

  const checkPinStatus = async () => {
    try {
      const response = await fetch('/api/account/check-pin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setIsExistingUser(data.hasPin);
    } catch (error) {
      console.error('Error checking PIN status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check PIN status",
        variant: "destructive",
      });
      
      if (error instanceof Error && error.message.toLowerCase().includes('unauthorized')) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isExistingUser && pin !== confirmPin) {
        toast({
          title: "Error",
          description: "PINs do not match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const endpoint = isExistingUser ? '/api/account/verify-pin' : '/api/account/setup-pin';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        if (isExistingUser) {
          setAttempts(prev => prev + 1);
          if (attempts >= 2) {
            throw new Error('Too many failed attempts. Please try again later.');
          }
        }
        throw new Error(data.error || 'Failed to process PIN');
      }

      toast({
        title: isExistingUser ? "PIN Verified" : "PIN Setup Complete",
        description: "Redirecting to dashboard...",
      });

      setTimeout(() => {
        router.push('/banking/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process PIN",
        variant: "destructive",
      });
      
      if (error instanceof Error && error.message.toLowerCase().includes('unauthorized')) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative">
        <AnimatedBackgroundGradients />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative z-10"
        >
          <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Effects */}
      <AnimatedBackgroundGradients />

      <main className="relative pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Security Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-300">Secure PIN Environment</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  End-to-End Encrypted
                </div>
              </div>
            </motion.div>

            {/* Main Card */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="space-y-1 p-6 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white absolute top-4 left-4"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
                <div className="flex justify-center mt-6">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mt-4">
                  {isExistingUser ? "Welcome Back" : "Secure Your Account"}
                </h2>
                <p className="text-center text-gray-400">
                  {isExistingUser 
                    ? "Enter your PIN to continue" 
                    : "Create a secure 4-digit PIN"}
                </p>
              </CardHeader>
              
              <CardContent className="p-6">
                <form onSubmit={handlePinSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-800">
                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="Enter PIN"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="bg-gray-900/50 border-gray-700 text-white h-12 text-lg text-center tracking-widest"
                            required
                            autoComplete="new-password"
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>

                        {!isExistingUser && (
                          <div className="relative">
                            <Input
                              type="password"
                              placeholder="Confirm PIN"
                              maxLength={4}
                              value={confirmPin}
                              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              className="bg-gray-900/50 border-gray-700 text-white h-12 text-lg text-center tracking-widest"
                              required
                              autoComplete="new-password"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                      disabled={isLoading || pin.length !== 4 || (!isExistingUser && confirmPin.length !== 4)}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </motion.div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Lock className="h-4 w-4 mr-2" />
                          {isExistingUser ? "Verify PIN" : "Set PIN"}
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  {attempts > 0 && isExistingUser && (
                  <div className="text-center mt-4">
                  <p className="text-amber-400 font-medium">
                    {`${3 - attempts} attempts remaining`}
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
        >
          <div className="flex items-start space-x-4">
            <Info className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="text-sm text-gray-400">
              Your PIN is encrypted and secured with industry-standard protection.
            </div>
          </div>
        </motion.div>

        {/* Processing Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  </motion.div>
                  <p className="text-sm text-blue-400">
                    Processing secure request...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </main>
</div>
);
}