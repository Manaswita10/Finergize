"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Send,
  Users,
  History,
  Wallet,
  ArrowLeft,
  Scan,
  Volume2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SendMoneyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sendMethod, setSendMethod] = useState<'phone' | 'qr'>('phone');
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    note: '',
    saveContact: false
  });

  const recentContacts = [
    { name: "Ramesh Kumar", phone: "9876543210", lastSent: "₹500" },
    { name: "Local Store", phone: "9876543211", lastSent: "₹200" },
    { name: "Village Group", phone: "9876543212", lastSent: "₹1,000" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Money Sent Successfully",
        description: `₹${formData.amount} sent to ${formData.recipient}`,
      });
      
      router.push('/banking/dashboard');
    } catch (error) {
      toast({
        title: "Failed to send money",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-24">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
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
            <h1 className="text-2xl font-bold text-white">Send Money</h1>
            <p className="text-gray-400">Transfer money securely</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Send Form */}
          <div className="md:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5 text-blue-400" />
                  Transfer Details
                </CardTitle>
                <CardDescription>
                  Enter recipient details and amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Send Method Toggle */}
                  <div className="flex space-x-4 mb-6">
                    <Button
                      type="button"
                      variant={sendMethod === 'phone' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setSendMethod('phone')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Send to Phone
                    </Button>
                    <Button
                      type="button"
                      variant={sendMethod === 'qr' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setSendMethod('qr')}
                    >
                      <Scan className="mr-2 h-4 w-4" />
                      Scan QR
                    </Button>
                  </div>

                  {sendMethod === 'phone' ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="recipient">Recipient Phone Number</Label>
                        <Input
                          id="recipient"
                          placeholder="Enter 10-digit phone number"
                          value={formData.recipient}
                          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                          className="bg-gray-800/50 border-gray-700"
                          pattern="[0-9]{10}"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                          id="amount"
                          placeholder="Enter amount"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="bg-gray-800/50 border-gray-700"
                          type="number"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Input
                          id="note"
                          placeholder="Add a note"
                          value={formData.note}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                          className="bg-gray-800/50 border-gray-700"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          "Processing..."
                        ) : (
                          <>
                            Send Money <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Scan className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">
                        Point your camera at a QR code to send money
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Contacts and Quick Actions */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-purple-400" />
                  Recent Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContacts.map((contact, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                      onClick={() => setFormData({ ...formData, recipient: contact.phone })}
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-gray-400 text-sm">{contact.phone}</p>
                      </div>
                      <div className="text-gray-400 text-sm">{contact.lastSent}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-blue-400 mr-2" />
                      <div>
                        <p className="text-white">Available Balance</p>
                        <p className="text-2xl font-bold text-white">₹5,000</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/banking/history')}>
                      <History className="h-4 w-4 mr-1" />
                      History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="fixed bottom-8 right-8">
              <Button 
                variant="outline" 
                className="bg-gray-900/90 border-blue-500/50"
                onClick={() => toast({ title: "Voice Assistant", description: "Say 'Send money to' followed by the name or number" })}
              >
                <Volume2 className="h-4 w-4 mr-2 text-blue-400" />
                Voice Commands
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}