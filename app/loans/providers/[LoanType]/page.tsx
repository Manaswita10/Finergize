'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, IndianRupee, Clock, Percent, FileText, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";

interface InterestRate {
  durationInYears: number;
  rate: number;
}

interface Taxes {
  processingFee: number;
  documentationCharges: number;
  GST: number;
}

interface LoanProvider {
  _id: string;
  name: string;
  image: string;
  interestRates: InterestRate[];
  taxes: Taxes;
  termsAndConditions: string[];
  minimumLoanAmount: number;
  maximumLoanAmount: number;
  supportedLoanTypes: string[];
  processingTime: string;
}

export default function LoanProvidersPage() {
  const router = useRouter();
  const params = useParams();
  const loanType = params.LoanType as string;
  const [providers, setProviders] = useState<LoanProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loanTitles = {
    business: "Business Loan Providers",
    agriculture: "Agriculture Loan Providers",
    education: "Education Loan Providers"
  };

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(`/api/loan-providers?type=${loanType}`);
        if (!response.ok) throw new Error('Failed to fetch providers');
        const data = await response.json();
        setProviders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [loanType]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-blue-400">Loading providers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black relative pb-20">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
      
      <div className="container mx-auto px-4 pt-8">
        <Link href={`/loans/${loanType}`} className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Application
        </Link>

        <h1 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          {loanTitles[loanType] || "Loan Providers"}
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider._id} className="bg-gray-900/50 border-gray-800 overflow-hidden">
            <CardHeader className="pb-4">
 <div className="flex items-center justify-center mb-4 p-4">
   <img
     src={provider.image}
     alt={`${provider.name} logo`}
     className="w-auto max-w-[200px] max-h-[100px] object-contain" 
   />
 </div>
 <CardTitle className="text-xl text-center text-white">{provider.name}</CardTitle>
</CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-400">Min Amount</div>
                    <div className="text-white font-medium">{formatAmount(provider.minimumLoanAmount)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">Max Amount</div>
                    <div className="text-white font-medium">{formatAmount(provider.maximumLoanAmount)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-gray-400 text-sm flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Interest Rates
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 space-y-1">
                    {provider.interestRates.map((rate, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-300">
                        <span>{rate.durationInYears} Year{rate.durationInYears > 1 ? 's' : ''}</span>
                        <span>{rate.rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-gray-400 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Fees & Charges
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Processing Fee</span>
                      <span>{provider.taxes.processingFee}%</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Documentation</span>
                      <span>{formatAmount(provider.taxes.documentationCharges)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>GST</span>
                      <span>{provider.taxes.GST}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="w-4 h-4" />
                  Processing Time: {provider.processingTime}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Terms & Conditions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Terms & Conditions</DialogTitle>
                      <DialogDescription>
                        Please review the following terms carefully
                      </DialogDescription>
                    </DialogHeader>
                    <ul className="list-disc pl-4 space-y-2 text-sm text-gray-300">
                      {provider.termsAndConditions.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </DialogContent>
                </Dialog>

                <Button 
  onClick={() => router.push(`/loans/apply/${provider._id}`)}
  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
>
  Apply Now
</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {providers.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No loan providers found for {loanType} loans.
          </div>
        )}
      </div>
    </main>
  );
}