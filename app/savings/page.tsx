'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PiggyBank, Users, LogIn, LogOut, MapPin, Calendar, TrendingUp, Filter, Search, ArrowRight, Clock, Check, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAuthModal } from '@/hooks/useAuthModal';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Define proper type for a user
interface User {
  _id?: string;
  id?: string; // For compatibility with different auth systems
  userId?: string; // Another possible ID field
  name?: string;
  email?: string;
}

// Define proper type for a savings group based on the MongoDB schema
interface SavingsGroup {
  _id: string;
  id?: string;
  name: string;
  description: string;
  location: string;
  foundedDate: Date;
  meetingFrequency: 'Weekly' | 'Biweekly' | 'Monthly';
  contributionType: 'Fixed' | 'Variable';
  minContribution: number;
  maxContribution?: number;
  totalSaved: number;
  members: any[];
  interestRate: number;
  loanOffered: boolean;
  status: 'Active' | 'Inactive' | 'Completed';
}

// Define the formatted group type that will be received from the API
interface FormattedSavingsGroup {
  id: string;
  _id?: string; // For compatibility with MongoDB
  title: string;
  description?: string;
  amount: string;
  members: string;
  returns: string;
  location: string;
  foundedDate: string;
  loanOffered: boolean;
  meetingFrequency: string;
  minContribution: number;
}

export default function CommunitySavingsPage() {
  // States for data, UI, and filters
  const [groups, setGroups] = useState<FormattedSavingsGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<FormattedSavingsGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    meetingFrequency: 'All',
    loanOffered: 'All',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const { user, isAuthenticated, logout } = useUser();
  const { openModal, AuthModalComponent } = useAuthModal();
  const router = useRouter();

  // Use a ref to keep track of the fetchData function
  const fetchDataRef = useRef<() => Promise<void>>();
  
  // Function that actually fetches the data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/savings-groups');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Ensure IDs are properly set by mapping _id to id if needed
      const processedData = Array.isArray(data) ? data.map(group => ({
        ...group,
        // Ensure each group has an id property (some might use _id from MongoDB)
        id: group.id || group._id
      })) : [];
      
      setGroups(processedData);
      setFilteredGroups(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching savings groups:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);
  
  // Update the ref whenever fetchData changes
  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to handle joining a group
  const handleJoinGroup = useCallback((groupId: string, contributionAmount: number) => {
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    
    // In a real implementation, you would make an API call here
    const joinGroup = async () => {
      try {
        // Debug user object to see what properties are available
        console.log('Current user object:', user);
        
        // Check for user ID in multiple possible locations
        const userId = user?._id || user?.id || user?.userId;
        
        if (!userId) {
          throw new Error('User ID not found - Please reload the page or sign in again');
        }
        
        console.log('Using User ID:', userId);
        console.log('Group ID:', groupId);
        
        const response = await fetch('/api/savings-groups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            groupId: groupId,
            contributionAmount: contributionAmount, // Use the provided amount
          }),
        });
        
        // Log full request details for debugging
        console.log('Request details:', {
          userId: userId,
          groupId: groupId,
          contributionAmount: contributionAmount
        });
        
        // Log response for debugging
        console.log('Join group response status:', response.status);
        
        const data = await response.json();
        console.log('Join group response data:', data);
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to join group');
        }
        
        // If successful, redirect to the confirmation page
        router.push(`/savings/join-confirmation?groupId=${groupId}&amount=${contributionAmount}`);
        
      } catch (err) {
        console.error('Error joining group:', err);
        
        // Show more detailed error message
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        alert(`Failed to join the group: ${errorMessage}`);
      }
    };
    
    joinGroup();
  }, [isAuthenticated, openModal, user, router]);

  // Apply filters when they change
  useEffect(() => {
    let result = [...groups];
    
    // Apply meeting frequency filter
    if (filters.meetingFrequency !== 'All') {
      result = result.filter(group => group.meetingFrequency === filters.meetingFrequency);
    }
    
    // Apply loan offered filter
    if (filters.loanOffered !== 'All') {
      const wantsLoans = filters.loanOffered === 'Yes';
      result = result.filter(group => group.loanOffered === wantsLoans);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        group => 
          group.title.toLowerCase().includes(searchTerm) ||
          (group.description && group.description.toLowerCase().includes(searchTerm)) ||
          group.location.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredGroups(result);
  }, [filters, groups]);

  // Handler for filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Create loading placeholder array with stable keys
  const loadingPlaceholders = Array.from({ length: 6 }).map((_, i) => `loading-${i}`);

  // Format date nicely
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Background grid with reduced opacity */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.6)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Gradient background elements */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [5, 0, 5],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main content - Adjusted with more top padding to account for navbar */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Hero Section with modern gradient text */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 relative"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 text-transparent bg-clip-text">
              Join a Savings Group Today
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8"
          >
            Build wealth together with trusted community savings groups offering higher returns than traditional banks
          </motion.p>
          
          {/* User authentication area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-3 bg-slate-800/70 px-6 py-3 rounded-full border border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <Users size={16} className="text-blue-300" />
                </div>
                <span className="text-gray-300">
                  Hello, {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="ml-3 px-4 py-2 rounded-full bg-slate-700/70 text-white flex items-center text-sm hover:bg-slate-600/70 transition group"
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openModal('login')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 text-sm hover:from-blue-700 hover:to-purple-700 transition shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 mx-auto"
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium">Sign In to Join Groups</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 rounded-full hover:bg-slate-700/50 transition border border-slate-700/30 shadow-md shadow-blue-900/10"
          >
            <Filter size={18} className="text-blue-400" />
            <span className="font-medium">Filter Groups</span>
          </button>
          
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-slate-800/50 p-8 rounded-2xl border border-slate-700/30 backdrop-blur-sm shadow-xl shadow-blue-900/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-sm font-medium mb-3 text-blue-400 flex items-center gap-2">
                    <Clock size={16} /> Meeting Frequency
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Weekly', 'Biweekly', 'Monthly'].map(option => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('meetingFrequency', option)}
                        className={`px-4 py-2 rounded-full transition-all ${
                          filters.meetingFrequency === option
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-900/20'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3 text-blue-400 flex items-center gap-2">
                    <TrendingUp size={16} /> Loans Offered
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Yes', 'No'].map(option => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('loanOffered', option)}
                        className={`px-4 py-2 rounded-full transition-all ${
                          filters.loanOffered === option
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-900/20'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3 text-blue-400 flex items-center gap-2">
                    <Search size={16} /> Search Groups
                  </h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, description or location..."
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full px-5 py-3 pl-11 text-sm bg-slate-700/70 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-600/30"
                    />
                    <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingPlaceholders.map((id) => (
              <div 
                key={id}
                className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/30 rounded-2xl overflow-hidden animate-pulse shadow-xl shadow-blue-900/5 backdrop-blur-sm"
              >
                <div className="h-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40"></div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 rounded-xl bg-slate-700/50"></div>
                    <div className="h-8 w-24 rounded-full bg-slate-700/50"></div>
                  </div>
                  
                  <div className="h-8 w-3/4 bg-slate-700/50 rounded-lg mb-3"></div>
                  <div className="h-4 w-full bg-slate-700/50 rounded-md mb-2"></div>
                  <div className="h-4 w-2/3 bg-slate-700/50 rounded-md mb-6"></div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-700/50"></div>
                        <div className="h-4 w-24 bg-slate-700/50 rounded-md"></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="h-4 w-20 bg-slate-700/50 rounded-md"></div>
                    <div className="h-10 w-32 rounded-full bg-slate-700/50"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-8 bg-gradient-to-br from-red-900/20 to-red-800/10 rounded-2xl mx-4 border border-red-800/30 backdrop-blur-sm shadow-xl"
          >
            <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={40} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-red-300 mb-4">Unable to Load Savings Groups</h3>
            <p className="text-red-200/70 mb-8 max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => fetchData()} 
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-full hover:from-red-700 hover:to-red-800 transition shadow-lg shadow-red-900/20"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredGroups.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/30 backdrop-blur-sm shadow-xl"
          >
            <div className="bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <PiggyBank className="w-10 h-10 text-blue-300" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No savings groups found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">No groups match your current filter criteria</p>
            <button 
              onClick={() => setFilters({ meetingFrequency: 'All', loanOffered: 'All', search: '' })}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition shadow-lg shadow-purple-900/20"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Groups grid */}
        {!loading && !error && filteredGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ translateY: -5 }}
                className="group h-full"
              >
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/30 hover:border-slate-600/50 rounded-2xl overflow-hidden transition-all duration-300 h-full shadow-xl shadow-blue-900/5 backdrop-blur-sm">
                  <div className="h-1 bg-gradient-to-r from-blue-500/70 via-purple-500/70 to-pink-500/50"></div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-5">
                      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3.5 rounded-xl text-blue-300">
                        <Users className="w-7 h-7" />
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 font-medium">
                        {group.meetingFrequency}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-2xl text-white mb-2.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                      {group.title}
                    </h3>
                    
                    {group.description && (
                      <p className="text-gray-400 mb-6 line-clamp-2">{group.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-gray-300">{group.location}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-gray-300">
                          {group.foundedDate ? formatDate(group.foundedDate) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-pink-400" />
                        </div>
                        <span className="text-green-400 font-medium">{group.returns}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-gray-300">{group.members}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="bg-slate-800/60 text-gray-300 px-4 py-2 rounded-lg flex items-center gap-2">
                        <span>{group.amount}</span>
                        {group.loanOffered ? (
                          <div className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check size={10} />
                            <span>Loans</span>
                          </div>
                        ) : (
                          <div className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <X size={10} />
                            <span>No Loans</span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleJoinGroup(group.id, group.minContribution || 1000)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 font-medium"
                      >
                        Join Group
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Auth Modal Component */}
      <AuthModalComponent />
    </div>
  );
}