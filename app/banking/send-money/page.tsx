"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { 
  AlertCircle, Wallet, ArrowRight, User, 
  CreditCard, Banknote, ChevronRight, Lock, 
  CheckCircle, Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

interface SendMoneyData {
  recipientAddress: string;
  recipientName: string;
  amount: number;
}

// Professional verification indicator
const VerificationStatus = ({ isValid }: { isValid: boolean }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`flex items-center p-2 rounded-md ${
      isValid 
        ? 'bg-emerald-500/10 text-emerald-500' 
        : 'bg-gray-500/10 text-gray-400'
    }`}
  >
    {isValid ? (
      <CheckCircle className="h-4 w-4 mr-2" />
    ) : (
      <Info className="h-4 w-4 mr-2" />
    )}
    <span className="text-sm">
      {isValid ? 'Verified' : 'Pending Verification'}
    </span>
  </motion.div>
);

export default function SendMoneyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SendMoneyData>({
    recipientAddress: "",
    recipientName: "",
    amount: 0
  });
  const [isAddressValid, setIsAddressValid] = useState(false);

  // Handle address validation
  const validateAddress = (address: string) => {
    const walletAddressPattern = /^[A-Z]{4}\d{4}$/;
    return walletAddressPattern.test(address);
  };

  useEffect(() => {
    const storedDetails = localStorage.getItem('payAgainDetails');
    if (storedDetails) {
      try {
        const { recipientName, recipientAddress } = JSON.parse(storedDetails);
        setFormData(prev => ({
          ...prev,
          recipientName,
          recipientAddress
        }));
        setIsAddressValid(validateAddress(recipientAddress));
        localStorage.removeItem('payAgainDetails');
      } catch (error) {
        console.error('Error parsing stored recipient details:', error);
        toast({
          title: "Error",
          description: "Failed to load recipient details",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (formData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (!validateAddress(formData.recipientAddress)) {
        throw new Error('Invalid wallet address format. Should be 4 letters followed by 4 numbers (e.g., ABHI1234)');
      }

      const response = await fetch('/api/banking/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          recipientAddress: "",
          recipientName: "",
          amount: 0
        });
        
        toast({
          title: "Payment Successful!",
          description: `Successfully sent ₹${formData.amount} to ${formData.recipientName}`,
          variant: "default"
        });
        
        router.replace('/banking/dashboard');
      } else {
        throw new Error(data.error || 'Failed to send money');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Transaction failed. Please try again");
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    router.replace('/login');
    return null;
  }

  return (
    <main className="min-h-screen bg-black pt-24 pb-12 relative">
      {/* Professional gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Security Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-300">Secure Transaction Environment</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  256-bit Encryption
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Verified by FinerGise
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Transaction Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl text-white">Send Money</CardTitle>
                  <CardDescription className="mt-2">
                    Transfer funds securely to another wallet
                  </CardDescription>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-gray-400 hover:text-white flex items-center"
                  onClick={() => router.push('/banking/dashboard')}
                >
                  Back to Dashboard
                  <ChevronRight className="h-4 w-4 ml-1" />
                </motion.button>
              </div>
            </CardHeader>

            <CardContent className="mt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Section */}
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-800">
                    <h3 className="text-lg font-medium text-white mb-4">Recipient Information</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientAddress" className="text-gray-300">
                          Wallet Address
                        </Label>
                        <div className="relative">
                          <Input
                            id="recipientAddress"
                            placeholder="ABHI1234"
                            value={formData.recipientAddress}
                            onChange={(e) => {
                              setError(null);
                              const value = e.target.value.toUpperCase();
                              setFormData(prev => ({ ...prev, recipientAddress: value }));
                              setIsAddressValid(validateAddress(value));
                            }}
                            pattern="^[A-Z]{4}\d{4}$"
                            maxLength={8}
                            required
                            className="bg-gray-900/50 border-gray-700 text-white pl-10 pr-32"
                            disabled={isLoading}
                          />
                          <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <VerificationStatus isValid={isAddressValid} />
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Format: 4 letters followed by 4 numbers (e.g., ABHI1234)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipientName" className="text-gray-300">
                          Recipient Name
                        </Label>
                        <div className="relative">
                          <Input
                            id="recipientName"
                            placeholder="Enter recipient's full name"
                            value={formData.recipientName}
                            onChange={(e) => {
                              setError(null);
                              setFormData(prev => ({ ...prev, recipientName: e.target.value }));
                            }}
                            required
                            className="bg-gray-900/50 border-gray-700 text-white pl-10"
                            disabled={isLoading}
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount Section */}
                  <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-800">
                    <h3 className="text-lg font-medium text-white mb-4">Transaction Amount</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-300">
                        Amount (₹)
                      </Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          min="1"
                          step="1"
                          placeholder="Enter amount"
                          value={formData.amount || ''}
                          onChange={(e) => {
                            setError(null);
                            setFormData(prev => ({ 
                              ...prev, 
                              amount: Math.max(0, parseInt(e.target.value) || 0) 
                            }));
                          }}
                          required
                          className="bg-gray-900/50 border-gray-700 text-white pl-10"
                          disabled={isLoading}
                        />
                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                    disabled={isLoading || !isAddressValid}
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
                        Processing Secure Transfer...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Secure Transfer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* Transaction Security Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-4 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
          >
            <div className="flex items-start space-x-4">
              <Info className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="mb-2">
                  All transactions are secured with end-to-end encryption and monitored 24/7 for your safety.
                </p>
                <p>
                  Transaction limits and additional security measures may apply based on your account status.
                </p>
              </div>
            </div>
          </motion.div>

       {/* Activity Indicator */}
       <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-8 right-8"
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
                      Processing secure transaction...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction Success Modal */}
          <AnimatePresence>
            {formData.amount > 0 && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-8 left-8"
              >
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </motion.div>
                    <div>
                      <p className="text-sm text-emerald-400">
                        Amount: ₹{formData.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-emerald-500/70">
                        Ready for secure transfer
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Verification Badge */}
          <div className="fixed top-8 right-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-2 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
            >
              <Lock className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-400">End-to-End Encrypted</span>
            </motion.div>
          </div>

          {/* Help Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors"
            onClick={() => toast({
              title: "Need Help?",
              description: "Our support team is available 24/7",
            })}
          >
            <AlertCircle className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </main>
  );
}