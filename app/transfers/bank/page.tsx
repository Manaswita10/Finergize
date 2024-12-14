// app/transfers/bank/page.tsx
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
import { ArrowRight, BadgeIndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";

const bankTransferSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  confirmAccountNumber: z.string().min(1, "Please confirm account number"),
  ifscCode: z.string().min(11, "Valid IFSC code is required").max(11),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  amount: z.string().min(1, "Amount is required"),
  transferMode: z.enum(["IMPS", "NEFT", "RTGS"], {
    required_error: "Please select transfer mode",
  }),
  note: z.string().optional(),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

export default function BankTransferPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: {
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      amount: "",
      transferMode: "IMPS",
      note: "",
    },
  });

  const handleTransfer = async (data: z.infer<typeof bankTransferSchema>) => {
    setIsSubmitting(true);
    try {
      console.log("Bank transfer initiated:", data);
      router.push("/transfer-success");
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const transferModes = [
    {
      value: "IMPS",
      label: "IMPS",
      description: "Instant transfer (24x7)",
      limit: "₹2,00,000 per transaction",
    },
    {
      value: "NEFT",
      label: "NEFT",
      description: "Batch processing",
      limit: "No limit",
    },
    {
      value: "RTGS",
      label: "RTGS",
      description: "Real-time transfer",
      limit: "Min ₹2,00,000",
    },
  ];

  return (
    <main className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
      
      <div className="container mx-auto px-4 py-24">
        <Card className="max-w-2xl mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <BadgeIndianRupee className="h-8 w-8 text-purple-500" />
              Bank Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleTransfer)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Account Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="Enter account number"
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
                  name="confirmAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm Account Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="Confirm account number"
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
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">IFSC Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter IFSC code"
                          className="bg-gray-800 border-gray-700 text-white uppercase"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Example: HDFC0001234
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Account Holder Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter account holder name"
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
                  name="transferMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Transfer Mode</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {transferModes.map((mode) => (
                            <div
                              key={mode.value}
                              className={`cursor-pointer p-4 rounded-lg border ${
                                field.value === mode.value
                                  ? "border-purple-500 bg-purple-500/10"
                                  : "border-gray-700 bg-gray-800/50"
                              }`}
                              onClick={() => field.onChange(mode.value)}
                            >
                              <div className="font-medium text-white">{mode.label}</div>
                              <div className="text-sm text-gray-400">{mode.description}</div>
                              <div className="text-xs text-gray-500 mt-1">{mode.limit}</div>
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
                        {field.value && `₹${Number(field.value).toLocaleString('en-IN')}`}
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
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                  >
                    Transfer Money
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link href="/secure-transfer" className="w-full">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
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