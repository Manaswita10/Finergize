'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Users, Calendar, MapPin, TrendingUp, Wallet, Clock, Info, AlertTriangle, CreditCard, ChevronRight, Shield } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface GroupDetails {
  id: string;
  title: string;
  description?: string;
  amount: string;
  location: string;
  meetingFrequency: string;
  returns: string;
  minContribution: number;
  maxContribution?: number;
  contributionType: string;
  totalSaved: number;
  interestRate: number;
  members: string;
  loanOffered: boolean;
}

export default function JoinVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/savings');
    }
  }, [isAuthenticated, loading, router]);
  
  // Get group ID from URL params
  useEffect(() => {
    const groupId = searchParams.get('groupId');
    
    if (!groupId) {
      setError('Missing group information');
      setLoading(false);
      return;
    }
    
    // Fetch group details
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`/api/savings-groups/${groupId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch group details');
        }
        
        const data = await response.json();
        setGroupDetails(data);
        setContributionAmount(data.minContribution || 0);
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError('Failed to load group details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupDetails();
  }, [searchParams]);
  
  // Handler for contribution amount change
  const handleContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) return;
    
    // Validate against min/max contribution
    if (groupDetails) {
      if (value < groupDetails.minContribution) {
        setContributionAmount(groupDetails.minContribution);
      } else if (groupDetails.maxContribution && value > groupDetails.maxContribution) {
        setContributionAmount(groupDetails.maxContribution);
      } else {
        setContributionAmount(value);
      }
    }
  };
  
  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupDetails || !agreedToTerms) return;
    
    if (step === 1) {
      setStep(2); // Move to payment confirmation step
      return;
    }
    
    if (step === 2) {
      // Simulate payment processing
      setProcessingPayment(true);
      
      try {
        console.log('Starting payment processing simulation...');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Payment processing complete. Attempting to join group...');
        
        // Log user and group IDs for debugging
        console.log('User ID:', user?._id || user?.id || user?.userId);
        console.log('Group ID:', groupDetails.id);
        console.log('Contribution Amount:', contributionAmount);
        
        // After "payment" is processed, join the group
        try {
          const response = await fetch('/api/savings-groups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user?._id || user?.id || user?.userId,
              groupId: groupDetails.id,
              contributionAmount: contributionAmount,
            }),
          });
          
          console.log('API response status:', response.status);
          
          const data = await response.json();
          console.log('API response data:', data);
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to join group');
          }
          
          console.log('Successfully joined group, proceeding to navigation...');
          
          // Redirect to success page if everything went well
          const redirectUrl = `/savings/payment-success?groupId=${groupDetails.id}&amount=${contributionAmount}`;
          console.log('Redirecting to:', redirectUrl);
          
          // Try Next.js router first
          router.push(redirectUrl);
          
          // Fallback to window.location if router doesn't work
          setTimeout(() => {
            if (window.location.pathname !== '/savings/join-confirmation') {
              console.log('Fallback navigation with window.location');
              window.location.href = redirectUrl;
            }
          }, 500);
        } catch (apiError) {
          console.error('API error:', apiError);
          throw apiError;
        }
      } catch (error) {
        console.error('Error during payment or joining:', error);
        setError(error instanceof Error ? error.message : 'An error occurred during payment processing');
      } finally {
        setProcessingPayment(false);
      }
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-24">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !groupDetails) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-slate-800/40 rounded-2xl border border-slate-700/30 backdrop-blur-sm shadow-xl p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Error</h1>
            <p className="text-center text-red-400 mb-8">{error || 'Group details not available'}</p>
            <div className="flex justify-center">
              <Link 
                href="/savings"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-700 transition"
              >
                <ArrowLeft size={18} />
                <span>Back to Savings Groups</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-16">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.6)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>
      
      <div className="fixed inset-0 -z-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Back button */}
          <div className="mb-6">
            <Link 
              href="/savings"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
              <ArrowLeft size={16} />
              <span>Back to Savings Groups</span>
            </Link>
          </div>
          
          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-700 -z-10"></div>
              
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step >= 1 ? 'bg-blue-500/20 border-2 border-blue-500' : 'bg-slate-800 border-2 border-slate-700'
                }`}>
                  <Info size={16} />
                </div>
                <span className="text-xs font-medium">Details</span>
              </div>
              
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step >= 2 ? 'bg-blue-500/20 border-2 border-blue-500' : 'bg-slate-800 border-2 border-slate-700'
                }`}>
                  <CreditCard size={16} />
                </div>
                <span className="text-xs font-medium">Payment</span>
              </div>
              
              <div className="flex flex-col items-center text-gray-500">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-2">
                  <CheckCircle size={16} />
                </div>
                <span className="text-xs font-medium">Confirmation</span>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-slate-700/30 backdrop-blur-sm shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
              <h1 className="text-2xl font-bold">{step === 1 ? 'Join Savings Group' : 'Payment Details'}</h1>
              <p className="text-gray-400 mt-1">
                {step === 1 ? 'Review details and confirm your contribution' : 'Complete your initial contribution'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Step 1: Group details and contribution amount */}
              {step === 1 && (
                <div className="p-6">
                  {/* Group info section */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">{groupDetails.title}</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="font-medium">{groupDetails.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Frequency</p>
                          <p className="font-medium">{groupDetails.meetingFrequency}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Returns</p>
                          <p className="font-medium">{groupDetails.returns}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-pink-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Members</p>
                          <p className="font-medium">{groupDetails.members}</p>
                        </div>
                      </div>
                    </div>
                    
                    {groupDetails.description && (
                      <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <p className="text-gray-300">{groupDetails.description}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Contribution amount section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Your Contribution</h3>
                    
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-4">
                      <label className="block text-sm text-gray-300 mb-2">Contribution Amount ({formatCurrency(groupDetails.minContribution)}{groupDetails.maxContribution ? ` - ${formatCurrency(groupDetails.maxContribution)}` : ''})</label>
                      <div className="flex items-center">
                        <span className="bg-slate-700 px-3 py-2 rounded-l-lg text-gray-300">₹</span>
                        <input
                          type="number"
                          value={contributionAmount}
                          onChange={handleContributionChange}
                          className="w-full px-3 py-2 bg-slate-700 border-0 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min={groupDetails.minContribution}
                          max={groupDetails.maxContribution}
                          required
                        />
                      </div>
                      
                      <p className="text-sm text-gray-400 mt-2">
                        {groupDetails.contributionType === 'Fixed' 
                          ? `Fixed contribution of ${formatCurrency(groupDetails.minContribution)} per ${groupDetails.meetingFrequency.toLowerCase()}`
                          : `You can contribute between ${formatCurrency(groupDetails.minContribution)} and ${formatCurrency(groupDetails.maxContribution || 0)} per ${groupDetails.meetingFrequency.toLowerCase()}`
                        }
                      </p>
                    </div>
                    
                    {/* Information box */}
                    <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-800/30 flex gap-3">
                      <div className="mt-1">
                        <Info className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-300 mb-1">Important Information</h4>
                        <p className="text-sm text-gray-300">
                          Your first payment will be processed immediately. Subsequent payments will be due according to the group's {groupDetails.meetingFrequency.toLowerCase()} schedule. You'll receive reminders before each due date.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Terms and conditions */}
                  <div className="mb-8">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={() => setAgreedToTerms(!agreedToTerms)}
                        className="mt-1"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300">
                        I understand that I am committing to contribute {formatCurrency(contributionAmount)} {groupDetails.meetingFrequency.toLowerCase()} and agree to the <Link href="/terms" className="text-blue-400 hover:underline">terms and conditions</Link> of this savings group.
                      </label>
                    </div>
                  </div>
                  
                  {/* Continue button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!agreedToTerms}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed to Payment <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Payment information */}
              {step === 2 && (
                <div className="p-6">
                  {/* Payment summary */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Payment Summary</h3>
                    
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-4">
                      <div className="flex justify-between py-2 border-b border-slate-700/50">
                        <span className="text-gray-400">Group</span>
                        <span className="font-medium">{groupDetails.title}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-700/50">
                        <span className="text-gray-400">Contribution Amount</span>
                        <span className="font-medium">{formatCurrency(contributionAmount)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-700/50">
                        <span className="text-gray-400">Frequency</span>
                        <span className="font-medium">{groupDetails.meetingFrequency}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Expected Returns</span>
                        <span className="font-medium text-green-400">{groupDetails.returns}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment method selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Payment Method</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div
                        className={`p-4 rounded-xl border cursor-pointer transition ${
                          paymentMethod === 'upi' 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600'
                        }`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-blue-400">UPI</span>
                          </div>
                          <div>
                            <p className="font-medium">UPI Payment</p>
                            <p className="text-sm text-gray-400">Pay using any UPI app</p>
                          </div>
                        </div>
                      </div>
                      
                      <div
                        className={`p-4 rounded-xl border cursor-pointer transition ${
                          paymentMethod === 'card' 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">Card Payment</p>
                            <p className="text-sm text-gray-400">Credit or Debit Card</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dynamic payment form based on selected method */}
                    {paymentMethod === 'upi' && (
                      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-4">
                        <div className="mb-4">
                          <label className="block text-sm text-gray-300 mb-2">UPI ID</label>
                          <input
                            type="text"
                            placeholder="name@upi"
                            className="w-full px-3 py-2 bg-slate-700 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-blue-300">
                          <Shield className="w-4 h-4" />
                          <span>Your payment information is secure</span>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'card' && (
                      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-4">
                        <div className="mb-4">
                          <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 bg-slate-700 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm text-gray-300 mb-2">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 bg-slate-700 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-300 mb-2">CVC</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-3 py-2 bg-slate-700 border-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-blue-300">
                          <Shield className="w-4 h-4" />
                          <span>Your payment information is secure</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Security notice */}
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex gap-3">
                      <div className="mt-1">
                        <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-300 mb-1">Secure Payment</h4>
                        <p className="text-sm text-gray-300">
                          All payment information is encrypted and processed securely. Your financial data is never stored on our servers.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-slate-700 rounded-full text-white font-medium hover:bg-slate-600 transition"
                    >
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      disabled={processingPayment}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Payment <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}