'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Users, Calendar, MapPin, TrendingUp, Wallet, Clock, Gift, Share2 } from 'lucide-react';
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

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/savings');
    }
  }, [isAuthenticated, loading, router]);
  
  // Get parameters from URL
  useEffect(() => {
    const groupId = searchParams.get('groupId');
    const amount = searchParams.get('amount');
    
    if (!groupId || !amount) {
      setError('Missing information');
      setLoading(false);
      return;
    }

    setContributionAmount(Number(amount));
    
    // Fetch group details
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`/api/savings-groups/${groupId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch group details');
        }
        
        const data = await response.json();
        setGroupDetails(data);
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError('Failed to load group details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupDetails();
  }, [searchParams]);
  
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

  // Calculate next payment date based on frequency
  const getNextPaymentDate = (frequency: string) => {
    const now = new Date();
    let nextDate = new Date();
    
    switch (frequency.toLowerCase()) {
      case 'weekly':
        nextDate.setDate(now.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(now.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(now.getMonth() + 1);
        break;
      default:
        nextDate.setMonth(now.getMonth() + 1);
    }
    
    return formatDate(nextDate.toISOString());
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
          
          {/* Success Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-slate-700/30 backdrop-blur-sm shadow-xl overflow-hidden mb-8"
          >
            <div className="p-8 text-center">
              <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-400" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
              <p className="text-gray-300 mb-4">
                You have successfully joined the <span className="text-blue-400 font-medium">{groupDetails.title}</span> savings group.
              </p>
              <div className="inline-block bg-slate-800/70 px-6 py-3 rounded-full border border-slate-700/50 mb-6">
                <span className="text-gray-400 mr-2">Contribution Amount:</span>
                <span className="text-green-400 font-bold">{formatCurrency(contributionAmount)}</span>
              </div>
              
              <div className="bg-blue-900/20 rounded-xl border border-blue-800/30 p-4 text-left mb-6">
                <h3 className="font-medium text-blue-300 flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5" /> Next Payment Information
                </h3>
                <p className="text-gray-300 mb-2">
                  Your next payment of {formatCurrency(contributionAmount)} is due on <span className="text-white font-medium">{getNextPaymentDate(groupDetails.meetingFrequency)}</span>.
                </p>
                <p className="text-gray-300">
                  You'll receive a reminder before the due date.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Link 
                  href="/savings/dashboard"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium inline-flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition"
                >
                  Go to My Savings Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Group Details Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-slate-700/30 backdrop-blur-sm shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
              <h2 className="text-xl font-bold">Group Details</h2>
            </div>
            
            <div className="p-6">
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
              
              {/* Actions section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <button className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition rounded-xl flex items-center justify-center gap-2 text-gray-300">
                  <Gift className="w-5 h-5 text-purple-400" />
                  <span>Invite Friends</span>
                </button>
                
                <button className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition rounded-xl flex items-center justify-center gap-2 text-gray-300">
                  <Share2 className="w-5 h-5 text-blue-400" />
                  <span>Share Group</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}