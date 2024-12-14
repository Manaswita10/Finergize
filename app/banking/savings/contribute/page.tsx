"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContributePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");

  const suggestedAmounts = [500, 1000, 2000, 5000];

  return (
    <main className="min-h-screen bg-black pt-24">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Make Contribution</h1>
            <p className="text-gray-400">Contribute to your savings group</p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Contribution Details</CardTitle>
              <CardDescription>Weekly Savings Circle (WSC-2024-001)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-800/50 border-gray-700"
                  placeholder="Enter amount"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {suggestedAmounts.map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    className="border-gray-700 hover:bg-gray-800"
                    onClick={() => setAmount(amt.toString())}
                  >
                    ₹{amt}
                  </Button>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-blue-400">Weekly Contribution</p>
                    <p className="text-xs text-gray-400">
                      Your regular contribution amount is ₹1,000. Contributing more will increase your share in the group savings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                  disabled={!amount}
                  onClick={() => router.push('/banking/savings/payment')}
                >
                  Continue to Pay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}