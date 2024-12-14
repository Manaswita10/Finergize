"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Copy, CheckCheck, AlertCircle, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const GridBackground = () => (
  <div className="absolute inset-0 -z-5 opacity-20">
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <pattern
          id="grid"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 10 0 L 0 0 0 10"
            fill="none"
            stroke="rgba(128, 90, 213, 0.2)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

interface AccountDetails {
  name: string;
  walletAddress: string;
}

export default function ReceivePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch('/api/banking/account-details');
          if (!response.ok) throw new Error('Failed to fetch account details');
          const data = await response.json();
          setAccountDetails(data);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch account details",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAccountDetails();
  }, [status, toast]);

  const handleCopy = async () => {
    if (accountDetails?.walletAddress) {
      try {
        await navigator.clipboard.writeText(accountDetails.walletAddress);
        setCopied(true);
        toast({
          title: "Success",
          description: "Wallet address copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to copy wallet address",
          variant: "destructive",
        });
      }
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <main className="min-h-screen bg-black pt-24">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500"></div>
            <div className="text-blue-300">Loading your wallet details...</div>
          </div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }

  return (
    <main className="min-h-screen bg-black pt-24 relative">
      {/* Base gradient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      
      {/* Grid overlay */}
      <GridBackground />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-700 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/40 border border-purple-900/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600"></div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-200 bg-clip-text text-transparent">
                Receive Money
              </CardTitle>
              <CardDescription className="text-blue-300/80">
                Share your secure wallet address to receive funds instantly
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <Alert className="bg-purple-500/5 border-purple-400/20 backdrop-blur">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <AlertTitle className="font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Security Notice
                </AlertTitle>
                <AlertDescription className="text-blue-100/80">
                  Your wallet is protected by advanced encryption. Only share your address with trusted contacts.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                <div className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-black rounded-xl opacity-50"></div>
                  <div className="relative flex items-center justify-between p-6 rounded-xl border border-blue-700/30 transition-all duration-300 hover:border-blue-500/50">
                    <div className="flex-1">
                      <p className="text-sm text-blue-300/80">Your Wallet Address</p>
                      <p className="text-lg text-blue-100 font-mono mt-1 break-all">
                        {accountDetails?.walletAddress}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopy}
                      className="shrink-0 ml-4 bg-blue-500/10 border-blue-500/50 hover:bg-blue-500/20 transition-all duration-300"
                    >
                      {copied ? (
                        <CheckCheck className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-blue-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-blue-900/20 rounded-xl opacity-50"></div>
                  <div className="relative flex items-center justify-between p-6 rounded-xl border border-blue-700/30">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/30">
                        <Shield className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                          Wallet Owner
                        </p>
                        <p className="text-blue-100/80">{accountDetails?.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6 rounded-xl border border-blue-700/30 bg-gradient-to-b from-blue-900/10 to-black">
                {[
                  'End-to-end encrypted transactions',
                  'Zero-fee instant transfers',
                  '24/7 secure transaction monitoring'
                ].map((text, index) => (
                  <p key={index} className="text-sm text-blue-100/80 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></span>
                    <span>{text}</span>
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}