"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, Calendar, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JoinSavingsGroupPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState("");

  const groupTypes = [
    {
      id: "daily",
      name: "Daily Savings Group",
      contribution: "₹50-500 daily",
      members: "10-20 members",
      duration: "3-6 months"
    },
    {
      id: "weekly",
      name: "Weekly Savings Circle",
      contribution: "₹500-2000 weekly",
      members: "15-30 members",
      duration: "6-12 months"
    },
    {
      id: "monthly",
      name: "Monthly Investment Club",
      contribution: "₹1000-5000 monthly",
      members: "20-50 members",
      duration: "12-24 months"
    }
  ];

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
            <h1 className="text-2xl font-bold text-white">Join Savings Group</h1>
            <p className="text-gray-400">Select a group type and contribute to your savings</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="group-type">Select Group Type</Label>
                <Select onValueChange={setSelectedGroup}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700">
                    <SelectValue placeholder="Choose a savings group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupTypes.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedGroup && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-5 w-5 text-blue-400" />
                      <p className="text-sm text-gray-400">
                        {groupTypes.find(g => g.id === selectedGroup)?.contribution}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <p className="text-sm text-gray-400">
                        {groupTypes.find(g => g.id === selectedGroup)?.members}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-400" />
                      <p className="text-sm text-gray-400">
                        {groupTypes.find(g => g.id === selectedGroup)?.duration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contribution">Your Contribution Amount</Label>
                    <Input
                      id="contribution"
                      type="number"
                      placeholder="Enter amount"
                      className="bg-gray-800/50 border-gray-700"
                    />
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                    onClick={() => router.push('/banking/savings/group-details')}
                  >
                    Continue to Join
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}