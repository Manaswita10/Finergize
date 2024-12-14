"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Lock, User, Wallet, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { useSession } from "next-auth/react";

interface UserProfile {
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  preferredLanguage: string;
  walletAddress: string;
  balance: number;
  securityScore?: number;
  lastLogin?: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(true);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch profile data');

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaVerify = async (token: string | null) => {
    if (!token) return;

    try {
      const response = await fetch('/api/auth/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) throw new Error('Captcha verification failed');

      setIsVerified(true);
      setShowCaptcha(false);
      await fetchProfileData();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Shield className="h-8 w-8 text-purple-500" />
        </motion.div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  if (showCaptcha) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-black"></div>
        
        <div className="container max-w-md mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white text-center">Verify Your Identity</CardTitle>
              <CardDescription className="text-center">
                Please complete the verification to view your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                theme="dark"
                onChange={handleCaptchaVerify}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-black"></div>
      
      <div className="container max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-white">Profile Information</CardTitle>
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <CardDescription>
                Your secure account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileData && (
                <>
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-500" />
                      Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoCard label="Name" value={profileData.name} />
                      <InfoCard label="Phone" value={profileData.phone} icon={<Phone className="h-4 w-4" />} />
                      <InfoCard label="Language" value={profileData.preferredLanguage} />
                      <InfoCard label="Last Login" value={profileData.lastLogin?.toString() || 'N/A'} />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-500" />
                      Address Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoCard label="Village" value={profileData.village} />
                      <InfoCard label="District" value={profileData.district} />
                      <InfoCard label="State" value={profileData.state} />
                      <InfoCard label="PIN Code" value={profileData.pincode} />
                    </div>
                  </div>

                  {/* Wallet Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-purple-500" />
                      Wallet Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoCard 
                        label="Wallet Address" 
                        value={profileData.walletAddress}
                        className="font-mono"
                      />
                      <InfoCard 
                        label="Balance" 
                        value={`₹${profileData.balance.toLocaleString()}`}
                        className="text-green-500"
                      />
                    </div>
                  </div>

                  {/* Security Score */}
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-purple-500" />
                        <span className="text-white">Security Score</span>
                      </div>
                      <span className="text-green-500 font-semibold">
                        {profileData.securityScore || 85}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

const InfoCard = ({ label, value, icon, className = "" }: { 
  label: string; 
  value: string; 
  icon?: JSX.Element;
  className?: string;
}) => (
  <div className="p-3 bg-gray-800/50 rounded-lg space-y-1">
    <p className="text-sm text-gray-400">{label}</p>
    <p className={`text-white flex items-center gap-2 ${className}`}>
      {icon}
      {value}
    </p>
  </div>
);