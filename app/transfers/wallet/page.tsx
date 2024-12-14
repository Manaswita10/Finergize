// app/transfers/wallet/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";

const walletTransferSchema = z.object({
  walletType: z.enum(["paytm", "phonepe", "gpay", "amazonpay"], {
    required_error: "Please select wallet type",
  }),
  mobileNumber: z.string().min(10, "Valid mobile number required").max(10),
  amount: z.string().min(1, "Amount is required"),
  note: z.string().optional(),
});

const walletTypes = [
  {
    value: "paytm",
    label: "Paytm",
    icon: "🔵",
    description: "Transfer to Paytm wallet",
  },
  {
    value: "phonepe",
    label: "PhonePe",
    icon: "🟣",
    description: "Transfer to PhonePe wallet",
  },
  {
    value: "gpay",
    label: "Google Pay",
    icon: "🔷",
    description: "Transfer to Google Pay",
  },
  {
    value: "amazonpay",
    label: "Amazon Pay",
    icon: "🟡",
    description: "Transfer to Amazon Pay",
  },
];

export default function WalletTransferPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(walletTransferSchema),
    defaultValues: {
      walletType: undefined,
      mobileNumber: "",
      amount: "",
      note: "",
    },
  });

  const handleTransfer = async (data: z.infer<typeof walletTransferSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Wallet transfer initiated:", data);
      router.push("/transfer-success");
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
      
      <div className="container mx-auto px-4 py-24">
        <Card className="max-w-2xl mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <Wallet className="h-8 w-8 text-emerald-500" />
              Wallet Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleTransfer)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="walletType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Select Wallet</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {walletTypes.map((wallet) => (
                            <div
                              key={wallet.value}
                              className={`cursor-pointer p-4 rounded-lg border ${
                                field.value === wallet.value
                                  ? "border-emerald-500 bg-emerald-500/10"
                                  : "border-gray-700 bg-gray-800/50"
                              }`}
                              onClick={() => field.onChange(wallet.value)}
                            >
                              <div className="flex items-center gap-2">
                                <span>{wallet.icon}</span>
                                <div className="font-medium text-white">{wallet.label}</div>
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                {wallet.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Mobile Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="Enter mobile number"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Enter amount"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Maximum limit: ₹50,000 per transfer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Note (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Add a note"
                          className="bg-gray-800 border-gray-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90"
                  >
                    Transfer to Wallet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link href="/secure-transfer" className="w-full">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}