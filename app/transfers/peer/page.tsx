// app/transfers/peer/page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";
import { REACT_LOADABLE_MANIFEST } from "next/dist/shared/lib/constants";

const transferSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),
  amount: z.string().min(1, "Amount is required"),
  note: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

// Mock data for recent contacts
const recentContacts = [
  { id: "1", name: "Rahul Sharma", accountId: "fin123" },
  { id: "2", name: "Priya Patel", accountId: "fin456" },
  { id: "3", name: "Amit Kumar", accountId: "fin789" },
];

export default function PeerTransferPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientId: "",
      amount: "",
      note: "",
    },
  });

  const handleTransfer = async (data: TransferFormData) => {
    try {
      console.log("Transfer initiated:", data);
      router.push("/transfer-success");
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  const filteredContacts = recentContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
      
      <div className="container mx-auto px-4 py-24">
        <Card className="max-w-2xl mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <Users className="h-8 w-8 text-blue-500" />
              Peer to Peer Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search Recipients */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search recipients..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Recent Contacts */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition"
                      onClick={() => form.setValue('recipientId', contact.accountId)}
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400">{contact.name[0]}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-gray-400 text-sm">{contact.accountId}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Transfer Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleTransfer)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="recipientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Recipient ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter recipient's Finergise ID"
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
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                  >
                    Send Money
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link href="/secure-transfer" className="w-full">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
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